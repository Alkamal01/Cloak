import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

export interface CloakIdentity {
  id: string;
  displayName: string;
  npub: string;
  publicKey: string;
  createdAt: string;
  establishedMonths: number;
  relationship: 'Unknown' | 'Known';
}

interface WalletContextValue {
  wallet: CloakIdentity | null;
  isReady: boolean;
  createWallet: (displayName: string) => Promise<CloakIdentity>;
}

const IDENTITY_KEY = 'cloak.identity';
const WalletContext = createContext<WalletContextValue | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<CloakIdentity | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync(IDENTITY_KEY)
      .then((stored) => {
        if (stored) setWallet(JSON.parse(stored) as CloakIdentity);
      })
      .finally(() => setIsReady(true));
  }, []);

  const createWallet = useCallback(async (displayName: string) => {
    const secret = await Crypto.getRandomBytesAsync(32);
    const seed = Array.from(secret).map((byte) => byte.toString(16).padStart(2, '0')).join('');
    const publicKey = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, seed);
    const identity: CloakIdentity = {
      id: `cloak_${publicKey.slice(0, 16)}`,
      displayName: displayName.trim() || 'Alice',
      npub: `npub1${publicKey.slice(0, 32)}`,
      publicKey,
      createdAt: new Date().toISOString(),
      establishedMonths: 0,
      relationship: 'Known',
    };
    await SecureStore.setItemAsync(IDENTITY_KEY, JSON.stringify(identity));
    setWallet(identity);
    return identity;
  }, []);

  const value = useMemo(() => ({ wallet, isReady, createWallet }), [wallet, isReady, createWallet]);
  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within a WalletProvider');
  return ctx;
}
