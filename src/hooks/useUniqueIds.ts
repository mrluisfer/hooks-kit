import * as React from 'react';

/**
 * Generates a stable list of unique ids for a given count.
 * Ensures hooks are always called in a consistent order.
 */
export const useUniqueIds = (count: number): string[] => {
    const baseId = React.useId();

    // Derive `count` unique ids from that base
    return React.useMemo(() => {
        return Array.from({ length: count }, (_, i) => `${baseId}-${i}`);
    }, [baseId, count]);
};
