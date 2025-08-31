import * as React from 'react';

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue =
    | JsonPrimitive
    | JsonValue[]
    | { [k: string]: JsonValue };

export type LocalStorageSetter<T> = (
    v: T | ((prev: T) => T) | null | undefined
) => void;

export const isClient = typeof window !== 'undefined';

function safeParse<T>(raw: string | null): T | null {
    if (raw == null) return null;
    try {
        return JSON.parse(raw) as T;
    } catch {
        return null;
    }
}

function safeStringify(value: unknown): string {
    try {
        return JSON.stringify(value);
    } catch {
        return String(value);
    }
}

function dispatchStorageEvent(key: string, newValue: string | null) {
    if (!isClient) return;
    window.dispatchEvent(
        new StorageEvent('storage', {
            key,
            newValue,
            oldValue: null,
            storageArea: window.localStorage,
            url: window.location?.href,
        })
    );
}

function setLocalStorageItem<T>(key: string, value: T): void {
    if (!isClient) return;
    const stringified = safeStringify(value);
    window.localStorage.setItem(key, stringified);
    dispatchStorageEvent(key, stringified);
}

function removeLocalStorageItem(key: string): void {
    if (!isClient) return;
    window.localStorage.removeItem(key);
    dispatchStorageEvent(key, null);
}

function getLocalStorageItemRaw(key: string): string | null {
    if (!isClient) return null;
    return window.localStorage.getItem(key);
}

function getLocalStorageServerSnapshot(): string | null {
    // throw new Error('useLocalStorage is a client-only hook');
    return null;
}

export function useLocalStorage<T extends JsonValue>(
    key: string,
    initialValue: T
): [T, LocalStorageSetter<T>] {
    const subscribe = React.useCallback(
        (onStoreChange: () => void) => {
            if (!isClient) return () => {};

            const handler = (e: StorageEvent) => {
                if (
                    e.storageArea === window.localStorage &&
                    (e.key === key || e.key === null)
                ) {
                    onStoreChange();
                }
            };

            window.addEventListener('storage', handler);
            return () => window.removeEventListener('storage', handler);
        },
        [key]
    );

    const getSnapshot = React.useCallback(
        () => getLocalStorageItemRaw(key),
        [key]
    );

    const store = React.useSyncExternalStore(
        subscribe,
        getSnapshot,
        getLocalStorageServerSnapshot
    );

    const setState: LocalStorageSetter<T> = React.useCallback(
        (v) => {
            try {
                const prev = safeParse<T>(store) ?? initialValue;

                const nextState =
                    typeof v === 'function' ? (v as (p: T) => T)(prev) : v;

                if (nextState === undefined || nextState === null) {
                    removeLocalStorageItem(key);
                } else {
                    setLocalStorageItem<T>(key, nextState);
                }
            } catch (e) {
                console.warn('[useLocalStorage] setState error:', e);
            }
        },
        [key, store, initialValue]
    );

    React.useEffect(() => {
        if (!isClient) return;
        if (
            getLocalStorageItemRaw(key) === null &&
            typeof initialValue !== 'undefined'
        ) {
            setLocalStorageItem<T>(key, initialValue);
        }
    }, [key, initialValue]);

    const value: T = React.useMemo(() => {
        const parsed = safeParse<T>(store);
        return (parsed ?? initialValue) as T;
    }, [store, initialValue]);

    return [value, setState];
}
