import * as React from 'react';

const getServerSnapshot = () => {
    throw Error('useMediaQuery is a client-only hook');
};
export function useMediaQuery(query: string) {
    const subscribe = React.useCallback(
        (callback: (ev: MediaQueryListEvent) => void) => {
            const matchMedia = window.matchMedia(query);

            matchMedia.addEventListener('change', callback);
            return () => {
                matchMedia.removeEventListener('change', callback);
            };
        },
        [query]
    );

    const getSnapshot = () => {
        return window.matchMedia(query).matches;
    };

    return React.useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot
    );
}
