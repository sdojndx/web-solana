import React, { useState } from'react';
import {
    Connection,
    Keypair,
    PublicKey,
    Transaction,
    sendAndConfirmTransaction,
} from '@solana/web3.js';
import {
    createTransferInstruction,
    getAccount,
    TOKEN_PROGRAM_ID,
} from '@solana/spl - token';

const TokenTransfer = () => {
    const [sourceAccount, setSourceAccount] = useState('');
    const [destinationAccount, setDestinationAccount] = useState('');
    const [amount, setAmount] = useState('');
    const [decimals, setDecimals] = useState('');
    const [walletPrivateKey, setWalletPrivateKey] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleTransfer = async () => {
        try {
            if (!sourceAccount ||!destinationAccount ||!amount ||!decimals ||!walletPrivateKey) {
                throw new Error('All fields are required');
            }

            const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
            const wallet = Keypair.fromSecretKey(new Uint8Array(JSON.parse(walletPrivateKey)));

            const sourceTokenAccount = new PublicKey(sourceAccount);
            const destinationTokenAccount = new PublicKey(destinationAccount);

            // 获取源Token账户信息
            const sourceAccountInfo = await getAccount(
                connection,
                sourceTokenAccount,
                'confirmed'
            );
            // 获取目标Token账户信息
            const destinationAccountInfo = await getAccount(
                connection,
                destinationTokenAccount,
                'confirmed'
            );

            // 检查源账户余额是否足够
            if (sourceAccountInfo.amount < parseFloat(amount) * 10 ** parseFloat(decimals)) {
                throw new Error('Insufficient funds');
            }

            // 创建转移指令
            const transferInstruction = createTransferInstruction(
                sourceTokenAccount,
                destinationTokenAccount,
                wallet.publicKey,
                parseFloat(amount) * 10 ** parseFloat(decimals),
                [],
                TOKEN_PROGRAM_ID
            );

            // 创建交易
            const transaction = new Transaction().add(transferInstruction);

            // 发送并确认交易
            const signature = await sendAndConfirmTransaction(
                connection,
                transaction,
                [wallet]
            );
            setSuccess(`Transaction successful. Signature: ${signature}`);
            setError('');
        } catch (error) {
            setError(error.message);
            setSuccess('');
        }
    };

    return (
        <div>
            <h1>Token Transfer</h1>
            <label>
                Source Account:
                <input
                    type="text"
                    value={sourceAccount}
                    onChange={(e) => setSourceAccount(e.target.value)}
                />
            </label>
            <br />
            <label>
                Destination Account:
                <input
                    type="text"
                    value={destinationAccount}
                    onChange={(e) => setDestinationAccount(e.target.value)}
                />
            </label>
            <br />
            <label>
                Amount:
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
            </label>
            <br />
            <label>
                Decimals:
                <input
                    type="number"
                    value={decimals}
                    onChange={(e) => setDecimals(e.target.value)}
                />
            </label>
            <br />
            <label>
                Wallet Private Key:
                <input
                    type="text"
                    value={walletPrivateKey}
                    onChange={(e) => setWalletPrivateKey(e.target.value)}
                />
            </label>
            <br />
            <button onClick={handleTransfer}>Transfer Token</button>
            {error && <p style={{ color:'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
    );
};

export default TokenTransfer;