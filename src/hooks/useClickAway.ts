import * as React from 'react';

export function useClickAway<T extends HTMLElement>(
    cb: (event: MouseEvent | TouchEvent) => void
): React.RefObject<T | null> {
    const ref = React.useRef<T | null>(null);
    const refCb = React.useRef(cb);

    React.useLayoutEffect(() => {
        refCb.current = cb;
    }, [cb]);

    React.useEffect(() => {
        const handler = (e: MouseEvent | TouchEvent) => {
            const element = ref.current;
            // Ensure target is a Node before checking `.contains`
            if (
                element &&
                e.target instanceof Node &&
                !element.contains(e.target)
            ) {
                refCb.current(e);
            }
        };

        document.addEventListener('mousedown', handler);
        document.addEventListener('touchstart', handler);

        return () => {
            document.removeEventListener('mousedown', handler);
            document.removeEventListener('touchstart', handler);
        };
    }, []);

    return ref;
}
