import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './main.css';

function App() {
    return (
        <div className="bg-neutral-900 min-h-svh border-[1.5rem] border-brown-800"></div>
    );
}

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>
);
