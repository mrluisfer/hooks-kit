import * as React from 'react';

export function legacyCopyToClipboard(text: string) {
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = text;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextArea);
}

export function useCopyToClipboard() {
    const [state, setState] = React.useState<string | null>(null);

    const copyToClipboard = React.useCallback((value: string) => {
        const handleCopy = async () => {
            try {
                if (navigator?.clipboard?.writeText) {
                    await navigator.clipboard.writeText(value);
                    setState(value);
                } else {
                    throw new Error('writeText not supported');
                }
            } catch (_e) {
                legacyCopyToClipboard(value);
                setState(value);
            }
        };

        handleCopy();
    }, []);

    return [state, copyToClipboard];
}
