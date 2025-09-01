import * as React from 'react';

export type Breakpoints = {
    tablet: number;
    desktop: number;
};

export type DeviceState = {
    width: number;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
};

// Default breakpoints: tweak as you like
const DEFAULT_BPS: Breakpoints = { tablet: 700, desktop: 1200 };

const getDeviceState = (width: number, bps: Breakpoints): DeviceState => {
    const isMobile = width < bps.tablet;
    const isTablet = width >= bps.tablet && width < bps.desktop;
    const isDesktop = width >= bps.desktop;
    return { width, isMobile, isTablet, isDesktop };
};

const isEqualState = (a: DeviceState, b: DeviceState) =>
    a.width === b.width &&
    a.isMobile === b.isMobile &&
    a.isTablet === b.isTablet &&
    a.isDesktop === b.isDesktop;

// SSR-safe layout effect
const useIsomorphicLayoutEffect =
    typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

/* ---------------------------------- */
/* 1) rAF throttled version (no deps) */
/* ---------------------------------- */
export function useDevice(breakpoints: Breakpoints = DEFAULT_BPS): DeviceState {
    const getInitial = React.useCallback(() => {
        const w =
            typeof window !== 'undefined'
                ? window.innerWidth
                : breakpoints.desktop;
        return getDeviceState(w, breakpoints);
    }, [breakpoints]);

    const [state, setState] = React.useState<DeviceState>(getInitial);

    useIsomorphicLayoutEffect(() => {
        if (typeof window === 'undefined') return;

        let frame = 0;

        const update = () => {
            const next = getDeviceState(window.innerWidth, breakpoints);
            setState((prev) => (isEqualState(prev, next) ? prev : next));
        };

        const onResize = () => {
            if (frame) cancelAnimationFrame(frame);
            frame = requestAnimationFrame(update);
        };

        // Initial read
        update();

        window.addEventListener('resize', onResize, { passive: true });
        return () => {
            if (frame) cancelAnimationFrame(frame);
            window.removeEventListener('resize', onResize);
        };
    }, [breakpoints]);

    return state;
}

/* ------------------------------------- */
/* 2) Debounced version (tiny inline fn) */
/* ------------------------------------- */
function debounce<T extends (...args: any[]) => void>(fn: T, delay = 100) {
    let t: number | undefined;
    return (...args: Parameters<T>) => {
        if (t) window.clearTimeout(t);
        t = window.setTimeout(() => fn(...args), delay);
    };
}

export function useDeviceDebounced(
    breakpoints: Breakpoints = DEFAULT_BPS,
    delay = 100
): DeviceState {
    const getInitial = React.useCallback(() => {
        const w =
            typeof window !== 'undefined'
                ? window.innerWidth
                : breakpoints.desktop;
        return getDeviceState(w, breakpoints);
    }, [breakpoints]);

    const [state, setState] = React.useState<DeviceState>(getInitial);

    useIsomorphicLayoutEffect(() => {
        if (typeof window === 'undefined') return;

        const update = () => {
            const next = getDeviceState(window.innerWidth, breakpoints);
            setState((prev) => (isEqualState(prev, next) ? prev : next));
        };

        const onResize = debounce(update, delay);

        // Initial read
        update();

        window.addEventListener('resize', onResize, { passive: true });
        return () => {
            window.removeEventListener('resize', onResize);
        };
    }, [breakpoints, delay]);

    return state;
}
