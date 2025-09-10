import {
    Connection,
    PublicKey,
    Keypair,
    Transaction,
    sendAndConfirmTransaction,
    SystemProgram
} from "@solana/web3.js";
import  {
    createTransferInstruction,
    getAccount,
    TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// 封装的Token转移函数
async function TokenTransfer(
    connection: Connection,
    wallet: Keypair,
    sourceTokenAccount: PublicKey,
    destinationTokenAccount: PublicKey,
    amount: number,
    decimals: number
) {
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
    if (sourceAccountInfo.amount < amount * 10 ** decimals) {
        throw new Error('Insufficient funds');
    }

    // 创建转移指令
    const transferInstruction = createTransferInstruction(
        sourceTokenAccount,
        destinationTokenAccount,
        wallet.publicKey,
        amount * 10 ** decimals,
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
    return signature;
}


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

// 封装transferSPLToken函数
export async function transferSPLToken(
    connection: Connection,
    wallet: Keypair,
    sourceTokenAccount: PublicKey,
    destinationTokenAccount: PublicKey,
    amount: number,
    decimals: number
): Promise<string> {
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
    if (sourceAccountInfo.amount < amount * 10 ** decimals) {
        throw new Error('Insufficient funds');
    }

    // 创建转移指令
    const transferInstruction = createTransferInstruction(
        sourceTokenAccount,
        destinationTokenAccount,
        wallet.publicKey,
        amount * 10 ** decimals,
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
    return signature;
}
