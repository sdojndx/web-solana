import { Connection, PublicKey, clusterApiUrl, Transaction, SystemProgram } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
const network = WalletAdapterNetwork.Devnet;
const endpoint = clusterApiUrl(network);
const connection = new Connection(endpoint, 'confirmed');

export const transferSOL = async (
  sender: PublicKey,
  recipient: string,
  amount: number
) => {
  try {
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: sender,
        toPubkey: new PublicKey(recipient),
        lamports: amount * 1e9, // Convert SOL to lamports
      })
    );

    const signature = await connection.sendTransaction(transaction, [sender]);
    await connection.confirmTransaction(signature, 'confirmed');
    return signature;
  } catch (error) {
    throw new Error(`Transaction failed: ${error.message}`);
  }
};
