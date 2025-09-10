import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';

const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

export const getTokenInfo = async (tokenAddress: string) => {
  try {
    const tokenPublicKey = new PublicKey(tokenAddress);
    const token = new Token(connection, tokenPublicKey, TOKEN_PROGRAM_ID, null);
    const tokenInfo = await token.getMintInfo();
    return tokenInfo;
  } catch (error) {
    console.error('Error fetching token info:', error);
    throw error;
  }
};

export const transferSOL = async (from: PublicKey, to: PublicKey, amount: number, signers: any[]) => {
  try {
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: from,
        toPubkey: to,
        lamports: amount,
      })
    );

    const signature = await connection.sendTransaction(transaction, signers);
    await connection.confirmTransaction(signature);
    return signature;
  } catch (error) {
    console.error('Error transferring SOL:', error);
    throw error;
  }
};

export const transferSPLToken = async (from: PublicKey, to: PublicKey, amount: number, tokenAddress: string, signers: any[]) => {
  try {
    const tokenPublicKey = new PublicKey(tokenAddress);
    const token = new Token(connection, tokenPublicKey, TOKEN_PROGRAM_ID, null);

    const transaction = await token.transfer(from, to, signers[0], [], amount);
    await connection.confirmTransaction(transaction);
    return transaction;
  } catch (error) {
    console.error('Error transferring SPL token:', error);
    throw error;
  }
};