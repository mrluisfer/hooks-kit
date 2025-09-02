import * as React from 'react';

export function legacyCopyToClipboard(text: string) {
    try {
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = text;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextArea);
        return { error: false };
    } catch (error) {
        return { error: true };
    }
}

export function useCopyToClipboard() {
    const [state, setState] = React.useState<string | null>(null);
    const [isCopied, setIsCopied] = React.useState(false);

    const copyToClipboard = React.useCallback((value: string) => {
        const handleCopy = async () => {
            try {
                if (navigator?.clipboard?.writeText) {
                    await navigator.clipboard.writeText(value);
                    setState(value);
                    setIsCopied(true);
                } else {
                    throw new Error('writeText not supported');
                }
            } catch (_e) {
                const { error } = legacyCopyToClipboard(value);
                setState(value);
                setIsCopied(!error);
            }
        };

        handleCopy();
    }, []);

    return [state, copyToClipboard, isCopied, setIsCopied] as const;
}
