import React from 'react';

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-6">
      {/* Header */}
      <header className="flex justify-between items-center max-w-5xl mx-auto w-full py-4">
        <div className="flex items-center gap-3">
          {/* Replaced Next.js <Image /> with standard <img> tag */}
          <img 
            src="/favicon.ico" 
            alt="mor.money logo" 
            className="w-8 h-8 rounded-full"
            onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
          />
          <span className="text-xl font-bold tracking-wide text-blue-400">mor.money</span>
        </div>

        <button className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-lg transition-colors">
          Connect Wallet
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center text-center max-w-3xl mx-auto my-12">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
          Prize Savings Protocol on <span className="text-blue-500">Solana</span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl mb-8 max-w-xl">
          Deposit assets, earn yield, and participate in non-loss prize distributions automatically.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all">
            Enter Vault
          </button>
          <button className="border border-slate-700 hover:border-slate-500 text-slate-300 font-semibold px-6 py-3 rounded-xl transition-all">
            View Stats
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-slate-600 text-sm py-4">
        &copy; {new Date().getFullYear()} mor.money — Decentralized Prize Savings
      </footer>
    </div>
  );
}