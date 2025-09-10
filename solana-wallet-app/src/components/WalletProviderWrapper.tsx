import React from'react';
import { WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
    PhantomWalletAdapter,
    SolflareWalletAdapter,
    SlopeWalletAdapter,
    TorusWalletAdapter
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

// 定义钱包适配器列表
const walletAdapters = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    new SlopeWalletAdapter(),
    new TorusWalletAdapter()
];

// 封装的钱包提供者组件
export const WalletProviderWrapper = ({ children }) => {
    const endpoint = clusterApiUrl('devnet');

    return (
        <WalletProvider
            autoConnect={true}
            wallets={walletAdapters}
        >
            <WalletModalProvider>
                {children}
            </WalletModalProvider>
        </WalletProvider>
    );
};