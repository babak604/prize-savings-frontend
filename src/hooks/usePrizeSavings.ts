import { useMemo, useState, useEffect, useCallback } from 'react';
import { useConnection, useAnchorWallet } from '@solana/wallet-adapter-react';
import { AnchorProvider, Program, BN, Idl } from '@coral-xyz/anchor';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import idl from '../idl/prize_savings.json';

const PROGRAM_ID = new PublicKey('11111111111111111111111111111111'); 

export interface GlobalStats {
  tvl: number;
  prizePool: number;
}

export function usePrizeSavings() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  
  const [loading, setLoading] = useState(false);
  const [userBalance, setUserBalance] = useState<number>(0);
  const [balanceLoading, setBalanceLoading] = useState(false);
  
  const [globalStats, setGlobalStats] = useState<GlobalStats>({ tvl: 0, prizePool: 0 });
  const [statsLoading, setStatsLoading] = useState(false);

  const program = useMemo(() => {
    if (!wallet) return null;
    const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
    return new Program(idl as Idl, PROGRAM_ID, provider);
  }, [connection, wallet]);

  // Fetch Global Vault Statistics
  const fetchGlobalStats = useCallback(async () => {
    try {
      setStatsLoading(true);

      const [vaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('vault')],
        PROGRAM_ID
      );

      if (program) {
        // Fetch vault account struct via Anchor IDL
        const vaultAccount: any = await program.account.vault.fetch(vaultPda);
        const totalDepositsLamports = vaultAccount?.totalDeposits ? vaultAccount.totalDeposits.toNumber() : 0;
        const prizePoolLamports = vaultAccount?.prizePool ? vaultAccount.prizePool.toNumber() : 0;

        setGlobalStats({
          tvl: totalDepositsLamports / 1_000_000_000,
          prizePool: prizePoolLamports / 1_000_000_000,
        });
      } else {
        // Fallback read-only RPC balance fetch when wallet is not connected
        const lamports = await connection.getBalance(vaultPda);
        setGlobalStats({
          tvl: lamports / 1_000_000_000,
          prizePool: 0, // Default until wallet/anchor is connected
        });
      }
    } catch (err) {
      console.warn('Vault account not initialized or failed to fetch stats:', err);
      setGlobalStats({ tvl: 0, prizePool: 0 });
    } finally {
      setStatsLoading(false);
    }
  }, [connection, program]);

  // Fetch User Deposit Account Balance
  const fetchUserBalance = useCallback(async () => {
    if (!program || !wallet) {
      setUserBalance(0);
      return;
    }

    try {
      setBalanceLoading(true);
      const [userDepositPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('deposit'), wallet.publicKey.toBuffer()],
        program.programId
      );

      const accountData: any = await program.account.userDeposit.fetch(userDepositPda);
      const balanceInSol = accountData?.amount ? accountData.amount.toNumber() / 1_000_000_000 : 0;
      setUserBalance(balanceInSol);
    } catch (err) {
      setUserBalance(0);
    } finally {
      setBalanceLoading(false);
    }
  }, [program, wallet]);

  useEffect(() => {
    fetchGlobalStats();
    fetchUserBalance();
  }, [fetchGlobalStats, fetchUserBalance]);

  // Deposit Action
  const deposit = async (amountInSol: number) => {
    if (!program || !wallet) {
      throw new Error('Wallet not connected or program not initialized');
    }

    setLoading(true);
    try {
      const lamports = new BN(amountInSol * 1_000_000_000);

      const [vaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('vault')],
        program.programId
      );

      const [userDepositPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('deposit'), wallet.publicKey.toBuffer()],
        program.programId
      );

      const tx = await program.methods
        .deposit(lamports)
        .accounts({
          vault: vaultPda,
          userDeposit: userDepositPda,
          user: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      // Refresh balances & global stats after deposit
      await Promise.all([fetchUserBalance(), fetchGlobalStats()]);
      return tx;
    } catch (err) {
      console.error('Deposit failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Withdraw Action
  const withdraw = async (amountInSol: number) => {
    if (!program || !wallet) {
      throw new Error('Wallet not connected or program not initialized');
    }

    setLoading(true);
    try {
      const lamports = new BN(amountInSol * 1_000_000_000);

      const [vaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('vault')],
        program.programId
      );

      const [userDepositPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('deposit'), wallet.publicKey.toBuffer()],
        program.programId
      );

      const tx = await program.methods
        .withdraw(lamports)
        .accounts({
          vault: vaultPda,
          userDeposit: userDepositPda,
          user: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      // Refresh balances & global stats after withdrawal
      await Promise.all([fetchUserBalance(), fetchGlobalStats()]);
      return tx;
    } catch (err) {
      console.error('Withdraw failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    program,
    deposit,
    withdraw,
    fetchUserBalance,
    fetchGlobalStats,
    userBalance,
    globalStats,
    loading,
    balanceLoading,
    statsLoading,
    isConnected: !!wallet,
  };
}