import React, { useState, useEffect } from 'react';
import { Connection, clusterApiUrl } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  WalletProvider,
  ConnectionProvider,
  useWallet,
} from '@solana/wallet-adapter-react';
import {
  PhantomWalletAdapter,
  CoinbaseWalletAdapter,
  TrustWalletAdapter,
  LedgerWalletAdapter,
} from '@solana/wallet-adapter-wallets';

const WalletConnector = () => {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = clusterApiUrl(network);
  const wallets = [
    new PhantomWalletAdapter(),
    new CoinbaseWalletAdapter(),
    new TrustWalletAdapter(),
    new LedgerWalletAdapter(),
  ];

  const [connected, setConnected] = useState(false);
  const { wallet, connect, disconnect } = useWallet();

  useEffect(() => {
    if (wallet && wallet.connected) {
      setConnected(true);
    } else {
      setConnected(false);
    }
  }, [wallet]);

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Disconnection failed:', error);
    }
  };

  return (
    <div>
      <h2>Wallet Connector</h2>
      {connected ? (
        <div>
          <p>Connected to: {wallet?.adapter.name}</p>
          <button onClick={handleDisconnect}>Disconnect</button>
        </div>
      ) : (
        <div>
          <p>No wallet connected</p>
          {wallets.map((wallet) => (
            <button key={wallet.name} onClick={handleConnect}>
              Connect {wallet.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const WalletConnectorWrapper = () => (
  <ConnectionProvider endpoint={clusterApiUrl('devnet')}>
    <WalletProvider wallets={wallets} autoConnect>
      <WalletConnector />
    </WalletProvider>
  </ConnectionProvider>
);

export default WalletConnectorWrapper;