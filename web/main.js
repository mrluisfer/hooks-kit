'use strict';
import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import './main.css';
import { useCopyToClipboard } from '../src/index.js';
const AppLogo = (props) =>
    _jsxs('svg', {
        viewBox: '0 0 192 192',
        fill: 'none',
        xmlns: 'http://www.w3.org/2000/svg',
        className: 'google_idx__w-8',
        width: '1em',
        height: '1em',
        ...props,
        children: [
            _jsx('rect', {
                x: 28,
                y: 156,
                width: 88,
                height: 24,
                rx: 12,
                fill: '#8964e8',
            }),
            _jsx('rect', {
                x: 104,
                y: 120,
                width: 36,
                height: 24,
                rx: 12,
                fill: '#17b877',
            }),
            _jsx('rect', {
                x: 56,
                y: 120,
                width: 36,
                height: 24,
                rx: 12,
                fill: '#17b877',
            }),
            _jsx('rect', {
                x: 84,
                y: 84,
                width: 52,
                height: 24,
                rx: 12,
                fill: '#ffa23e',
            }),
            _jsx('rect', {
                x: 148,
                y: 84,
                width: 24,
                height: 24,
                rx: 12,
                fill: '#ffa23e',
            }),
            _jsx('rect', {
                x: 56,
                y: 48,
                width: 88,
                height: 24,
                rx: 12,
                fill: '#25a6e9',
            }),
            _jsx('rect', {
                x: 64,
                y: 12,
                width: 52,
                height: 24,
                rx: 12,
                fill: '#8964e8',
            }),
            _jsx('rect', {
                x: 28,
                y: 12,
                width: 24,
                height: 24,
                rx: 12,
                fill: '#8964e8',
            }),
        ],
    });
const GitHubLogo = (props) =>
    _jsx('svg', {
        width: '1em',
        height: '1em',
        viewBox: '0 0 1024 1024',
        fill: 'none',
        xmlns: 'http://www.w3.org/2000/svg',
        ...props,
        children: _jsx('path', {
            fillRule: 'evenodd',
            clipRule: 'evenodd',
            d: 'M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z',
            transform: 'scale(64)',
            fill: '#ffff',
        }),
    });
function HighlightedText({ children, as = 'div', className = '' }) {
    const Component = as || 'span';
    return _jsx(Component, {
        className: `text-zinc-300 hover:text-zinc-50 transition-colors ${className}`,
        children: children,
    });
}
function Container({ children, className = '' }) {
    return _jsx('div', {
        className: `max-w-5xl xl:max-w-7xl container mx-auto ${className}`,
        children: children,
    });
}
function Header() {
    return _jsx('header', {
        className:
            'fixed inset-x-0 top-0 bg-zinc-950 border-b-2 border-b-zinc-800',
        children: _jsx(Container, {
            children: _jsxs('div', {
                className: 'flex items-center justify-between',
                children: [
                    _jsxs('div', {
                        className: 'flex items-center justify-start gap-2 py-3',
                        children: [
                            _jsx(AppLogo, { className: 'size-12' }),
                            _jsxs('h1', {
                                className: 'text-xl group relative',
                                children: [
                                    _jsx('span', {
                                        className:
                                            'text-blue-400 absolute text-xs -top-2',
                                        children: 'React',
                                    }),
                                    'Hooks Kit',
                                ],
                            }),
                        ],
                    }),
                    _jsx('div', {
                        children: _jsx('a', {
                            href: 'https://github.com/mrluisfer/hooks-kit',
                            rel: 'noopener noreferrer',
                            target: '_blank',
                            children: _jsx(GitHubLogo, { className: 'size-8' }),
                        }),
                    }),
                ],
            }),
        }),
    });
}
function NpmCommand() {
    const [value, copyToClipboard, isCopied, setIsCopied] =
        useCopyToClipboard();
    React.useEffect(() => {
        if (isCopied) {
            const timer = setTimeout(() => {
                setIsCopied(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isCopied, setIsCopied]);
    return _jsxs('section', {
        className:
            'flex items-center justify-between w-2/4 px-6 bg-zinc-800 py-4 rounded-xl mt-6',
        children: [
            _jsxs('div', {
                className: 'flex items-center justify-start gap-3',
                children: [
                    _jsx('span', {
                        className: 'text-2xl font-mono text-blue-400',
                        children: '>',
                    }),
                    _jsx('p', {
                        className: 'font-mono text-3xl',
                        children: 'npm i hooks-kit',
                    }),
                ],
            }),
            _jsx('button', {
                type: 'button',
                className: `inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all shadow-md hover:shadow-lg cursor-pointer select-none
                ${isCopied ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600 active:scale-95'} text-white`,
                onClick: () => copyToClipboard('npm i hooks-kit'),
                children: isCopied ? '✅ Copied!' : '📋 Copy',
            }),
        ],
    });
}
function App() {
    return _jsxs('div', {
        className:
            'bg-neutral-950 min-h-svh border-[1.5rem] border-zinc-900 antialiased text-zinc-300 px-4 pt-8',
        children: [
            _jsx(Header, {}),
            _jsx(Container, {
                className: 'pt-12',
                children: _jsxs('div', {
                    className: 'flex items-center flex-col justify-center',
                    children: [
                        _jsxs(HighlightedText, {
                            as: 'p',
                            className:
                                'max-w-lg text-3xl text-center font-bold',
                            children: [
                                _jsx('span', {
                                    className: 'text-blue-400',
                                    children: 'Hooks',
                                }),
                                ' let you use different React features from your components.',
                            ],
                        }),
                        _jsx('span', {
                            className:
                                'pt-2 opacity-50 text-zinc-200 hover:text-white hover:opacity-100 transition',
                            children:
                                'You can either use the built-in Hooks or combine them to build your own.',
                        }),
                        _jsx(NpmCommand, {}),
                    ],
                }),
            }),
        ],
    });
}
createRoot(document.getElementById('root')).render(
    _jsx(React.StrictMode, { children: _jsx(App, {}) })
);
//# sourceMappingURL=main.js.map
