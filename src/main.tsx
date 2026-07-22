// Node Polyfills for Solana Web3 SDK
import { Buffer } from 'buffer';
import process from 'process';

if (typeof window !== 'undefined') {
  (window as any).Buffer = (window as any).Buffer || Buffer;
  (window as any).global = (window as any).global || window;
  (window as any).process = (window as any).process || process;
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import Page from '../app/page';
import { SolanaWalletProvider } from './providers/WalletProvider';
import './index.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <SolanaWalletProvider>
        <Page />
      </SolanaWalletProvider>
    </React.StrictMode>
  );
}