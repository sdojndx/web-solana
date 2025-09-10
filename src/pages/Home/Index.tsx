import React, { useState, useEffect } from 'react';
import WalletConnector from '../../components/WalletConnector';
import TokenTransfer from '../../components/TokenTransfer';
import ExceptionHandler from '../../components/ExceptionHandler';
import { connectWallet, getWalletAddress } from '../../utils/solana';

const Home = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWalletAddress = async () => {
      try {
        const address = await getWalletAddress();
        setWalletAddress(address);
      } catch (err) {
        setError('Failed to fetch wallet address');
      }
    };

    fetchWalletAddress();
  }, []);

  const handleConnect = async () => {
    try {
      const address = await connectWallet();
      setWalletAddress(address);
    } catch (err) {
      setError('Failed to connect wallet');
    }
  };

  return (
    <div className="home-container">
      <h1>Solana Wallet App</h1>
      <WalletConnector onConnect={handleConnect} />
      {walletAddress && <p>Connected Wallet: {walletAddress}</p>}
      {error && <ExceptionHandler message={error} />}
      <TokenTransfer walletAddress={walletAddress} />
    </div>
  );
};

export default Home;