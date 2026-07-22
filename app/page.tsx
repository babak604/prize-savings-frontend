import React from 'react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black text-black dark:text-white">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center py-20 px-8 bg-white dark:bg-black sm:items-start">
        {/* Replaced Next.js <Image /> with standard <img> */}
        <img
          className="dark:invert mb-8"
          src="/next.svg"
          alt="Logo"
          width={100}
          height={20}
          onError={(e) => {
            // Hide missing logo fallback gracefully
            (e.currentTarget as HTMLElement).style.display = 'none';
          }}
        />

        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-black dark:text-zinc-50">
            Welcome to <span className="text-blue-500">mor.money</span>
          </h1>
          <p className="max-w-md text-lg text-zinc-600 dark:text-zinc-400">
            Your Solana dApp frontend is now mounted and rendering cleanly with Vite!
          </p>
        </div>
      </main>
    </div>
  );
}