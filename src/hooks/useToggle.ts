import * as React from 'react';

export type ToggleValue = boolean | string | number | undefined;
export function useToggle(initialValue: ToggleValue) {
    const [on, setOn] = React.useState(() => {
        if (typeof initialValue === 'boolean') {
            return initialValue;
        }
        return Boolean(initialValue);
    });

    const handleToggle = React.useCallback((value: ToggleValue) => {
        if (typeof value === 'boolean') {
            return setOn(value);
        }
        return setOn((v) => !v);
    }, []);

    return [on, setOn, handleToggle] as const;
}
