import * as React from 'react';

// ---- Custom DOM typings for Battery API ---- //
interface BatteryManager extends EventTarget {
    charging: boolean;
    chargingTime: number;
    dischargingTime: number;
    level: number;

    onchargingchange: ((this: BatteryManager, ev: Event) => any) | null;
    onchargingtimechange: ((this: BatteryManager, ev: Event) => any) | null;
    ondischargingtimechange: ((this: BatteryManager, ev: Event) => any) | null;
    onlevelchange: ((this: BatteryManager, ev: Event) => any) | null;

    addEventListener(
        type:
            | 'chargingchange'
            | 'chargingtimechange'
            | 'dischargingtimechange'
            | 'levelchange',
        listener: (this: BatteryManager, ev: Event) => any,
        options?: boolean | AddEventListenerOptions
    ): void;

    removeEventListener(
        type:
            | 'chargingchange'
            | 'chargingtimechange'
            | 'dischargingtimechange'
            | 'levelchange',
        listener: (this: BatteryManager, ev: Event) => any,
        options?: boolean | EventListenerOptions
    ): void;
}

// Extend Navigator to declare `getBattery`
interface Navigator {
    getBattery?: () => Promise<BatteryManager>;
}

// ---- Hook state typing ---- //
type BatteryState = {
    supported: boolean;
    loading: boolean;
    level: number | null;
    charging: boolean | null;
    chargingTime: number | null;
    dischargingTime: number | null;
};

// ---- Hook implementation ---- //
export function useBattery(): BatteryState {
    const [state, setState] = React.useState<BatteryState>({
        supported: true,
        loading: true,
        level: null,
        charging: null,
        chargingTime: null,
        dischargingTime: null,
    });

    let nav = navigator as Navigator;
    React.useEffect(() => {
        if (!nav.getBattery) {
            setState((s) => ({
                ...s,
                supported: false,
                loading: false,
            }));
            return;
        }

        let battery: BatteryManager | null = null;

        const handleChange = () => {
            if (!battery) return;
            setState({
                supported: true,
                loading: false,
                level: battery.level,
                charging: battery.charging,
                chargingTime: battery.chargingTime,
                dischargingTime: battery.dischargingTime,
            });
        };

        nav.getBattery().then((b) => {
            battery = b;
            handleChange();

            b.addEventListener('levelchange', handleChange);
            b.addEventListener('chargingchange', handleChange);
            b.addEventListener('chargingtimechange', handleChange);
            b.addEventListener('dischargingtimechange', handleChange);
        });

        return () => {
            if (battery) {
                battery.removeEventListener('levelchange', handleChange);
                battery.removeEventListener('chargingchange', handleChange);
                battery.removeEventListener('chargingtimechange', handleChange);
                battery.removeEventListener(
                    'dischargingtimechange',
                    handleChange
                );
            }
        };
    }, []);

    return state;
}
