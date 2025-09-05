'use strict';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import './main.css';
import { useCopyToClipboard } from '../src/index.js';

const AppLogo = (props) => (
    <svg
        viewBox="0 0 192 192"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="google_idx__w-8"
        width="1em"
        height="1em"
        aria-hidden="true"
        focusable="false"
        {...props}
    >
        <rect x={28} y={156} width={88} height={24} rx={12} fill="#8964e8" />
        <rect x={104} y={120} width={36} height={24} rx={12} fill="#17b877" />
        <rect x={56} y={120} width={36} height={24} rx={12} fill="#17b877" />
        <rect x={84} y={84} width={52} height={24} rx={12} fill="#ffa23e" />
        <rect x={148} y={84} width={24} height={24} rx={12} fill="#ffa23e" />
        <rect x={56} y={48} width={88} height={24} rx={12} fill="#25a6e9" />
        <rect x={64} y={12} width={52} height={24} rx={12} fill="#8964e8" />
        <rect x={28} y={12} width={24} height={24} rx={12} fill="#8964e8" />
    </svg>
);

const GitHubLogo = (props) => (
    <svg
        width="1em"
        height="1em"
        viewBox="0 0 1024 1024"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
        {...props}
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
            transform="scale(64)"
            fill="#fff"
        />
    </svg>
);

function HighlightedText({ children, as = 'div', className = '' }) {
    const Component = as || 'span';
    return (
        <Component
            className={`text-zinc-300 hover:text-zinc-50 transition-colors ${className}`}
        >
            {children}
        </Component>
    );
}

function Container({ children, className = '' }) {
    return (
        <div
            className={`mx-auto w-full max-w-5xl xl:max-w-7xl px-4 ${className}`}
        >
            {children}
        </div>
    );
}

function Header() {
    return (
        <header className="fixed inset-x-0 top-0 z-50 bg-zinc-950/80 backdrop-blur border-b border-zinc-800">
            <Container>
                <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                        <AppLogo className="size-10" />
                        <h1 className="text-xl leading-tight group relative font-semibold tracking-tight">
                            <span className="text-blue-400 absolute text-[10px] -top-2 left-0">
                                React
                            </span>
                            <span className="bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                                Hooks Kit
                            </span>
                        </h1>
                    </div>
                    <div>
                        <a
                            href="https://github.com/mrluisfer/hooks-kit"
                            rel="noopener noreferrer"
                            target="_blank"
                            aria-label="Open Hooks Kit on GitHub"
                            className="inline-flex items-center justify-center rounded-md p-2 outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 hover:scale-105 transition"
                        >
                            <GitHubLogo className="size-7" />
                        </a>
                    </div>
                </div>
            </Container>
        </header>
    );
}

function NpmCommand() {
    const [value, copyToClipboard, isCopied, setIsCopied] =
        useCopyToClipboard();

    React.useEffect(() => {
        if (isCopied) {
            const timer = setTimeout(() => setIsCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [isCopied, setIsCopied]);

    const command = 'npm i hooks-kit';

    return (
        <section className="w-full max-w-lg my-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 px-4 sm:px-6 py-4 bg-zinc-800/80 rounded-xl ring-1 ring-zinc-700/50">
                <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl font-mono text-blue-400 select-none">
                        {'>'}
                    </span>
                    <p className="font-mono text-lg sm:text-xl md:text-2xl truncate">
                        <code className="whitespace-pre">{command}</code>
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => copyToClipboard(command)}
                    className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md transition
            shadow-md hover:shadow-lg select-none outline-none
            focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-800
            ${
                isCopied
                    ? 'bg-green-500 hover:bg-green-600 focus-visible:ring-green-400'
                    : 'bg-blue-500 hover:bg-blue-600 active:scale-95 focus-visible:ring-blue-400'
            } text-white`}
                    aria-live="polite"
                    aria-label={
                        isCopied
                            ? 'Command copied to clipboard'
                            : 'Copy install command'
                    }
                >
                    <span aria-hidden="true">
                        {isCopied ? '✅ Copied!' : '📋 Copy'}
                    </span>
                    <span className="sr-only">
                        {isCopied
                            ? 'Command copied to clipboard'
                            : 'Copy command to clipboard'}
                    </span>
                </button>
            </div>
        </section>
    );
}

function App() {
    return (
        <div className="bg-neutral-950 min-h-svh text-zinc-300 antialiased">
            <div className="border-[0.9rem] md:border-[1.25rem] border-zinc-900 min-h-svh">
                <Header />
                <main className="pt-20">
                    {' '}
                    <Container>
                        <div className="flex flex-col items-center text-center">
                            <HighlightedText
                                as="p"
                                className="max-w-2xl text-balance font-bold tracking-tight
                           text-[clamp(1.25rem,3vw,2rem)]"
                            >
                                <span className="text-blue-400">Hooks</span> let
                                you use different{' '}
                                <span className="text-blue-400">React</span>{' '}
                                features to enhance your components.
                            </HighlightedText>

                            <p className="pt-5 opacity-70 hover:opacity-100 transition text-sm sm:text-base">
                                You can either use the built-in Hooks or combine
                                them to build your own.
                            </p>

                            <NpmCommand />

                            <HighlightedText
                                as="p"
                                className="max-w-lg text-center text-xs sm:text-sm opacity-50 hover:opacity-90 transition"
                            >
                                This library provides a set of custom React
                                hooks designed to simplify common tasks and
                                enhance your development experience.
                            </HighlightedText>
                        </div>
                    </Container>
                </main>
            </div>
        </div>
    );
}

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
