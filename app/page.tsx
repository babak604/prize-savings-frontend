import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { usePrizeSavings } from '../src/hooks/usePrizeSavings';

export default function Page() {
  const { publicKey, connected } = useWallet();
  const { 
    deposit, 
    withdraw, 
    userBalance, 
    globalStats, 
    loading, 
    balanceLoading, 
    statsLoading 
  } = usePrizeSavings();

  const [depositAmount, setDepositAmount] = useState('');
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAction = async () => {
    setErrorMsg(null);
    setTxSignature(null);

    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      setErrorMsg('Please enter a valid amount.');
      return;
    }

    if (activeTab === 'withdraw' && amount > userBalance) {
      setErrorMsg(`Insufficient balance. You currently have ${userBalance.toFixed(4)} SOL deposited.`);
      return;
    }

    try {
      if (activeTab === 'deposit') {
        const tx = await deposit(amount);
        setTxSignature(tx);
        setDepositAmount('');
      } else {
        const tx = await withdraw(amount);
        setTxSignature(tx);
        setDepositAmount('');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Transaction failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
              M
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-blue-400 bg-clip-text text-transparent">
              mor.money
            </span>
          </div>

          <div className="flex items-center gap-4">
            <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-500 !rounded-xl !font-semibold !h-10 !px-4 !transition-all" />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-10">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Solana Devnet Live
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">
            Prize Savings Protocol on <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Solana</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Deposit your assets into yield-generating vaults. Retain 100% of your principal while competing for recurring prize distributions.
          </p>
        </div>

        {/* Dynamic Protocol Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm">
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Total Value Locked</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {statsLoading ? '...' : `${globalStats.tvl.toFixed(2)} SOL`}
            </div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm">
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Current Prize Pool</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
              {statsLoading ? '...' : `${globalStats.prizePool.toFixed(2)} SOL`}
            </div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm">
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Estimated APY</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-400">8.45%</div>
          </div>
        </div>

        {/* Vault Interface */}
        <div className="max-w-xl mx-auto w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          
          {/* User Position Banner */}
          {connected && (
            <div className="mb-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400 font-medium">Your Active Vault Deposit</div>
                <div className="text-xl font-extrabold text-white">
                  {balanceLoading ? 'Loading...' : `${userBalance.toFixed(4)} SOL`}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Earning Yield
                </span>
              </div>
            </div>
          )}

          {/* Deposit / Withdraw Tabs */}
          <div className="flex bg-slate-950 p-1 rounded-2xl mb-6 border border-slate-800/60">
            <button
              onClick={() => { setActiveTab('deposit'); setErrorMsg(null); setTxSignature(null); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'deposit'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Deposit
            </button>
            <button
              onClick={() => { setActiveTab('withdraw'); setErrorMsg(null); setTxSignature(null); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'withdraw'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Withdraw
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-xs font-medium text-slate-400">
              <span>Amount ({activeTab === 'deposit' ? 'To Deposit' : 'To Withdraw'})</span>
              {activeTab === 'withdraw' && connected && (
                <button 
                  onClick={() => setDepositAmount(userBalance.toString())}
                  className="text-blue-400 hover:underline cursor-pointer"
                >
                  Max: {userBalance.toFixed(4)} SOL
                </button>
              )}
            </div>

            <div className="relative">
              <input
                type="number"
                placeholder="0.00"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                disabled={loading}
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-2xl py-3.5 px-4 text-xl font-bold text-white placeholder-slate-600 outline-none transition-all disabled:opacity-50"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="text-xs font-bold bg-slate-800 px-2.5 py-1 rounded-lg text-slate-300">
                  SOL
                </span>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
                {errorMsg}
              </div>
            )}

            {txSignature && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs break-all">
                Transaction Successful!{' '}
                <a
                  href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-bold"
                >
                  View on Explorer
                </a>
              </div>
            )}

            {connected ? (
              <button 
                onClick={handleAction}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 active:scale-[0.99] disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-600/25 transition-all text-base mt-2 flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing Transaction...
                  </>
                ) : (
                  activeTab === 'deposit' ? 'Confirm Deposit' : 'Confirm Withdrawal'
                )}
              </button>
            ) : (
              <div className="text-center p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3">
                <p className="text-xs text-slate-400">Connect your Solana wallet to interact with the vault</p>
                <div className="flex justify-center">
                  <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-500 !rounded-xl !font-semibold !h-10 !px-4" />
                </div>
              </div>
            )}
          </div>
        </div>

      </main>

      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} mor.money — Decentralized Prize Savings Protocol
      </footer>
    </div>
  );
}