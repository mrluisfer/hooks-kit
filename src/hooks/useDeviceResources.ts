import * as React from 'react';

type UseDeviceResourcesOptions = {
    sampleIntervalMs?: number;
    observeLongTasks?: boolean;
    longTasksBuffer?: number;
};

type DeviceResources = {
    // Optional probes (may be unavailable in some browsers):
    deviceMemoryGB?: number | undefined;
    hardwareConcurrency?: number | undefined;
    effectiveType?: string | undefined;
    saveData?: boolean | undefined;
    rtt?: number | undefined;
    downlinkMbps?: number | undefined;

    jsHeapSizeLimit?: number | undefined; // bytes
    totalJSHeapSize?: number | undefined; // bytes
    usedJSHeapSize?: number | undefined; // bytes
    uaMemoryMB?: number | undefined; // MB

    // Required fields:
    longTasksCount: number;
    lastUpdated: number;
    isLowEndDevice: boolean;
    lowEndReasons: string[];
};

/** Lightly typed Network Information API */
interface NetworkInformationLike {
    effectiveType?: string;
    saveData?: boolean;
    rtt?: number;
    downlink?: number;
    addEventListener?: (type: 'change', listener: () => void) => void;
    removeEventListener?: (type: 'change', listener: () => void) => void;
}

/** Lightly typed Performance memory */
interface PerformanceMemoryLike {
    jsHeapSizeLimit: number;
    totalJSHeapSize: number;
    usedJSHeapSize: number;
}

interface NavigatorWithDeviceMemory extends Navigator {
    deviceMemory?: number;
}

function getNavigator(): NavigatorWithDeviceMemory | undefined {
    return typeof navigator !== 'undefined'
        ? (navigator as NavigatorWithDeviceMemory)
        : undefined;
}

function getConnection(): NetworkInformationLike | undefined {
    const nav = getNavigator() as Navigator & {
        connection?: NetworkInformationLike;
    };
    return nav?.connection;
}

function readConnection() {
    const conn = getConnection();
    return {
        effectiveType: conn?.effectiveType,
        saveData: Boolean(conn?.saveData),
        rtt: typeof conn?.rtt === 'number' ? conn.rtt : undefined,
        downlinkMbps:
            typeof conn?.downlink === 'number' ? conn.downlink : undefined,
    };
}

async function readUAMemoryMB(): Promise<number | undefined> {
    // https://developer.mozilla.org/en-US/docs/Web/API/Performance/measureUserAgentSpecificMemory
    const perf = performance as Performance & {
        measureUserAgentSpecificMemory?: () => Promise<{ bytes: number }>;
    };
    if (typeof perf.measureUserAgentSpecificMemory === 'function') {
        try {
            const { bytes } = await perf.measureUserAgentSpecificMemory();
            return Number.isFinite(bytes)
                ? Math.round(bytes / (1024 * 1024))
                : undefined;
        } catch {
            // no-op: not supported or rejected
        }
    }
    return undefined;
}

function readPerformanceMemory(): Partial<PerformanceMemoryLike> {
    // https://developer.mozilla.org/en-US/docs/Web/API/Performance/memory (Chromium)
    const perfAny = performance as Performance & {
        memory?: PerformanceMemoryLike;
    };
    const mem = perfAny.memory;
    if (!mem) return {};
    const { jsHeapSizeLimit, totalJSHeapSize, usedJSHeapSize } = mem;
    return { jsHeapSizeLimit, totalJSHeapSize, usedJSHeapSize };
}

function getLowEndHeuristics(input: {
    deviceMemoryGB?: number | undefined;
    hardwareConcurrency?: number | undefined;
    effectiveType?: string | undefined;
    saveData?: boolean | undefined;
    uaMemoryMB?: number | undefined;
    jsHeapSizeLimit?: number | undefined;
    longTasksCount?: number | undefined;
}) {
    const reasons: string[] = [];
    let score = 0;

    if (typeof input.deviceMemoryGB === 'number') {
        if (input.deviceMemoryGB <= 2) {
            score += 2;
            reasons.push('deviceMemory ≤ 2GB');
        } else if (input.deviceMemoryGB <= 4) {
            score += 1;
            reasons.push('deviceMemory ≤ 4GB');
        }
    }

    if (typeof input.hardwareConcurrency === 'number') {
        if (input.hardwareConcurrency <= 2) {
            score += 2;
            reasons.push('CPU ≤ 2 cores');
        } else if (input.hardwareConcurrency <= 4) {
            score += 1;
            reasons.push('CPU ≤ 4 cores');
        }
    }

    if (input.effectiveType && /^(2g|3g)$/i.test(input.effectiveType)) {
        score += 1;
        reasons.push(`effectiveType ${input.effectiveType}`);
    }
    if (input.saveData) {
        score += 1;
        reasons.push('Save-Data enabled');
    }

    if (typeof input.uaMemoryMB === 'number' && input.uaMemoryMB < 1500) {
        score += 1;
        reasons.push('UA memory < 1.5GB');
    }

    if (
        typeof input.jsHeapSizeLimit === 'number' &&
        input.jsHeapSizeLimit < 512 * 1024 * 1024
    ) {
        score += 1;
        reasons.push('JS heap limit < 512MB');
    }

    if ((input.longTasksCount ?? 0) >= 5) {
        score += 1;
        reasons.push('Multiple long tasks observed');
    }

    return { isLowEndDevice: score >= 2, reasons };
}

export function useDeviceResources(
    opts: UseDeviceResourcesOptions = {}
): DeviceResources {
    const {
        sampleIntervalMs = 30_000,
        observeLongTasks = true,
        longTasksBuffer = 50,
    } = opts;

    const [state, setState] = React.useState<DeviceResources>(() => {
        // initial snapshot (SSR-safe: everything optional)
        const nav = getNavigator();
        const deviceMemoryGB =
            typeof nav?.deviceMemory === 'number'
                ? (nav.deviceMemory as number)
                : undefined;
        const hardwareConcurrency =
            typeof nav?.hardwareConcurrency === 'number'
                ? nav.hardwareConcurrency
                : undefined;

        const { effectiveType, saveData, rtt, downlinkMbps } = readConnection();
        const perf = readPerformanceMemory();

        const heuristics = getLowEndHeuristics({
            deviceMemoryGB,
            hardwareConcurrency,
            effectiveType,
            saveData,
            jsHeapSizeLimit: perf.jsHeapSizeLimit,
            longTasksCount: 0,
        });

        return {
            deviceMemoryGB,
            hardwareConcurrency,
            effectiveType: effectiveType ?? '',
            saveData,
            rtt,
            downlinkMbps,
            jsHeapSizeLimit: perf.jsHeapSizeLimit,
            totalJSHeapSize: perf.totalJSHeapSize,
            usedJSHeapSize: perf.usedJSHeapSize,
            uaMemoryMB: undefined,
            longTasksCount: 0,
            lastUpdated: Date.now(),
            isLowEndDevice: heuristics.isLowEndDevice,
            lowEndReasons: heuristics.reasons,
        };
    });

    const longTasksRef = React.useRef<number>(0);

    // React to connection changes
    React.useEffect(() => {
        const conn = getConnection();
        if (!conn?.addEventListener) return;

        const onConnChange = () => {
            const { effectiveType, saveData, rtt, downlinkMbps } =
                readConnection();
            setState((prev) => {
                const heur = getLowEndHeuristics({
                    deviceMemoryGB: prev.deviceMemoryGB,
                    hardwareConcurrency: prev.hardwareConcurrency,
                    effectiveType,
                    saveData,
                    uaMemoryMB: prev.uaMemoryMB,
                    jsHeapSizeLimit: prev.jsHeapSizeLimit,
                    longTasksCount: longTasksRef.current,
                });
                const next: DeviceResources = {
                    ...prev,
                    effectiveType: effectiveType ?? prev.effectiveType ?? '',
                    saveData,
                    rtt,
                    downlinkMbps,
                    isLowEndDevice: heur.isLowEndDevice,
                    lowEndReasons: heur.reasons,
                    lastUpdated: Date.now(),
                };
                return next;
            });
        };

        conn.addEventListener?.('change', onConnChange);
        return () => conn.removeEventListener?.('change', onConnChange);
    }, []);

    // Long tasks observer
    React.useEffect(() => {
        if (!observeLongTasks || typeof PerformanceObserver === 'undefined')
            return;
        let observer: PerformanceObserver | null = null;

        try {
            observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                if (!entries.length) return;

                longTasksRef.current = Math.min(
                    longTasksRef.current + entries.length,
                    longTasksBuffer
                );

                setState((prev) => {
                    const heur = getLowEndHeuristics({
                        deviceMemoryGB: prev.deviceMemoryGB,
                        hardwareConcurrency: prev.hardwareConcurrency,
                        effectiveType: prev.effectiveType,
                        saveData: prev.saveData,
                        uaMemoryMB: prev.uaMemoryMB,
                        jsHeapSizeLimit: prev.jsHeapSizeLimit,
                        longTasksCount: longTasksRef.current,
                    });
                    const next: DeviceResources = {
                        ...prev,
                        longTasksCount: longTasksRef.current,
                        isLowEndDevice: heur.isLowEndDevice,
                        lowEndReasons: heur.reasons,
                        lastUpdated: Date.now(),
                    };
                    return next;
                });
            });
            observer.observe({ entryTypes: ['longtask'] });
        } catch {
            // ignore if not supported
        }

        return () => observer?.disconnect();
    }, [observeLongTasks, longTasksBuffer]);

    // Periodic sampling (UA memory + performance memory)
    React.useEffect(() => {
        let timer: number | null = null;
        let active = true;

        const sample = async () => {
            if (!active) return;

            const uaMemoryMB = await readUAMemoryMB();
            const perf = readPerformanceMemory();

            setState((prev) => {
                const heur = getLowEndHeuristics({
                    deviceMemoryGB: prev.deviceMemoryGB,
                    hardwareConcurrency: prev.hardwareConcurrency,
                    effectiveType: prev.effectiveType,
                    saveData: prev.saveData,
                    uaMemoryMB: uaMemoryMB ?? prev.uaMemoryMB,
                    jsHeapSizeLimit:
                        perf.jsHeapSizeLimit ?? prev.jsHeapSizeLimit,
                    longTasksCount: longTasksRef.current,
                });

                const next: DeviceResources | undefined = {
                    ...prev,
                    uaMemoryMB: uaMemoryMB ?? prev.uaMemoryMB,
                    jsHeapSizeLimit:
                        perf.jsHeapSizeLimit ?? prev.jsHeapSizeLimit,
                    totalJSHeapSize:
                        perf.totalJSHeapSize ?? prev.totalJSHeapSize,
                    usedJSHeapSize: perf.usedJSHeapSize ?? prev.usedJSHeapSize,
                    isLowEndDevice: heur.isLowEndDevice,
                    lowEndReasons: heur.reasons,
                    lastUpdated: Date.now(),
                };
                return next;
            });
        };

        void sample();

        if (sampleIntervalMs > 0) {
            timer = window.setInterval(sample, sampleIntervalMs);
        }

        return () => {
            active = false;
            if (timer) window.clearInterval(timer);
        };
    }, [sampleIntervalMs]);

    // Stable reference for consumers
    return React.useMemo(() => state, [state]);
}
