import { Button, Form, Input, InputNumber } from "antd";
import style from './index.module.scss';
import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import { createTransferInstruction, getAssociatedTokenAddress, getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

export default function TransferSplToken() {

  const [transferInfo, setTransferInfo] = useState<string>("");
  const walletInfo = useWallet();
  const { connected, connecting, publicKey, sendTransaction } = walletInfo;
    const { connection } = useConnection();
  
  const transferSpl = async (values: any) => {
    if (!connected || !publicKey) {
      alert("Please connect wallet first");
      return;
    }
    if (!values.toPublicKey || values.toPublicKey.length !== 44) {
      alert("Please input valid to publicKey");
      return;
    }
    if (!values.mintAddress || values.mintAddress.length !== 44) {
      alert("Please input valid mintAddress");
      return;
    }
    if (!values.splNumber || values.splNumber <= 0) {
      alert("Please input valid splNumber");
      return;
    }
    try {
      const mint = new PublicKey(values.mintAddress);
      const recipient = new PublicKey(values.toPublicKey);
      const amount = values.splNumber * 1e9; // adjust decimals as needed

      // 获取发送方和接收方的 SPL 代币账户地址
      const senderTokenAccount = await getAssociatedTokenAddress(
        mint,
        publicKey
      );
      const recipientTokenAccount = await getAssociatedTokenAddress(
        mint,
        recipient
      );

      // 检查接收方 token account 是否存在
      const recipientAccountInfo = await connection.getAccountInfo(recipientTokenAccount);

      const transaction = new Transaction();
      // 如果接收方 token account 不存在，则添加创建指令
      if (!recipientAccountInfo) {
        const { createAssociatedTokenAccountInstruction } = await import("@solana/spl-token");
        transaction.add(
          createAssociatedTokenAccountInstruction(
            publicKey, // payer
            recipientTokenAccount,
            recipient,
            mint
          )
        );
      }

      // 添加转账指令
      transaction.add(
        createTransferInstruction(
          senderTokenAccount,
          recipientTokenAccount,
          publicKey,
          amount
        )
      );

      setTransferInfo("Sending transfer transaction...");
      const signature = await sendTransaction(transaction, connection);
      const res = await connection.confirmTransaction(signature, "confirmed");
      setTransferInfo(`Transfer successful! Signature:  ${signature}, \nResponse: ${JSON.stringify(res, null, 2)}`);
    } catch (error) {
      setTransferInfo(`Transfer failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
    return (
    <>
      <Form
        name="transferPlsToken"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ 
          remember: true,
          toPublicKey: 'FnR7tPsptwPG7X2GTh6LFTuMktyTMQVzTPUgunBBoQwY',
          mintAddress: 'HhR3eye8k2PYbEMwdJMSxMY4gSyUV5T2EobaYscP5ELg',
      }}
        onFinish={transferSpl}
        autoComplete="off"
      >
        <Form.Item
          label="To Public Key"
          name="toPublicKey"
          validateFirst
          rules={[{ required: true, message: 'Please input publicKey!' }]}
        >
          <Input.TextArea maxLength={50} rows={2}/>
        </Form.Item>

        <Form.Item
          label="Mint Address"
          name="mintAddress"
          validateFirst
          rules={[{ required: true, message: 'Please input mintAddress!' }]}
        >
          <Input.TextArea maxLength={50} rows={2}/>
        </Form.Item>
        <Form.Item
          label="SPL Number"
          name="splNumber"
          validateFirst
          rules={[{ required: true, message: 'Please input splNumber' }]}
        >
          <InputNumber maxLength={10} step="0.01"/>
        </Form.Item>
        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>

      <div className={style.detail}>
        <Input.TextArea readOnly rows={6} value={transferInfo} />
      </div>
    </>
  );
}