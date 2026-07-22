import React from 'react';
import ReactDOM from 'react-dom/client';
import Page from '../app/page';
import '../app/globals.css';

// Force global Buffer availability before any Solana SDK loads
if (typeof window !== 'undefined') {
  window.Buffer = window.Buffer || Buffer;
  window.global = window.global || window;
  window.process = window.process || { env: {} };
}

console.log("🚀 mor.money main.tsx loaded successfully");

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Page />
  </React.StrictMode>
);