import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { BaseWalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Button, Divider, Form, Input, InputNumber } from "antd";
import style from './index.module.scss';
import { useState } from "react";
import { Keypair, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import bs58 from 'bs58';
import SplToken from "./SplToken";
import TransferSplToken from "./TransferSplToken";

export const ConnectWallet = () => {
  const walletInfo = useWallet();
  const { connection } = useConnection();
  const { connected, connecting, publicKey, sendTransaction } = walletInfo;
  const [account, setAccount] = useState<string>("");
  const [transferRes, setTransferRes] = useState<string>("");

  const createAccount = async () => {
    const newAccount = Keypair.generate();
    setAccount(
      JSON.stringify({
        publicKey: newAccount.publicKey.toBase58(),
        secretKeyBase58: bs58.encode(newAccount.secretKey), // for Phantom, Backpack, etc.
        secretKeyArray: Array.from(newAccount.secretKey) // for Sollet, Solflare, etc.  
      }, null, 2)
    )
  }

  const submitTransfer = async (values: any) => {
    if (!connected || !publicKey) {
      alert("Please connect wallet first");
      return;
    }
    if (!values.account || values.account.length !== 44) {
      alert("Please input valid to account address");
      return;
    }
    if (!values.sol || values.sol <= 0) {
      alert("Please input valid pol number");
      return;
    }
    try {
      const toPubkey = values.account;
      const lamports = values.sol * 1e9; // 1 SOL = 10^9 lamports

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: toPubkey,
          lamports: lamports,
        })
      );
      const signature = await sendTransaction(transaction, connection);
      setTransferRes("send Transfer");
      const res = await connection.confirmTransaction(signature, "confirmed");
      setTransferRes("Transfer successful: " + JSON.stringify(res, null, 2));
    } catch (error) {
      console.error("Transfer failed", error);
      setTransferRes("Transfer failed: " + (error instanceof Error ? error.message : String(error)));
    }
  }

  const jsonString = JSON.stringify({
    connected, connecting, publicKey
  }, null, 2);
  return <>  
    <Divider style={{ borderColor: '#7cb305' }}>Create Accounts</Divider>
    <div>
      <Button type="primary" htmlType="submit" onClick={createAccount}>
        Create Account
      </Button>
      <div className={style.detail}>
        <Input.TextArea readOnly rows={6} value={account} />
      </div>
    </div>

    <Divider style={{ borderColor: '#7cb305' }}>Connect Wallet</Divider>
    <BaseWalletMultiButton
      labels={{
        connecting: "Connecting...",
        "has-wallet": "Wallet Connected",
        "no-wallet": "Connect Wallet",
        "copy-address": "Copy Address",
        copied: "Copied!",
        "change-wallet": "Change Wallet",
        disconnect: "Disconnect"
      }}
    />
    <div className={style.detail}>
      <Input.TextArea readOnly rows={6} value={jsonString} />
    </div>

    <Divider style={{ borderColor: '#7cb305' }}>transfer SOL</Divider>

    <Form
      name="transaction"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ 
        remember: true,
        account: 'FnR7tPsptwPG7X2GTh6LFTuMktyTMQVzTPUgunBBoQwY',
        sol: 0.01
      }}
      onFinish={submitTransfer}
      autoComplete="off"
    >
      <Form.Item
        label="To Account"
        name="account"
        validateFirst
        rules={[{ required: true, message: 'Please input to account address!' }]}
      >
        <Input.TextArea maxLength={50} rows={2}/>
      </Form.Item>

      <Form.Item
        label="SOL"
        name="sol"
        validateFirst
        rules={[{ required: true, message: 'Please input sol nunber' }]}
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
      <Input.TextArea readOnly rows={6} value={transferRes} />
    </div>

    <Divider style={{ borderColor: '#7cb305' }}>create Spl token</Divider>
    
    <SplToken/>

    <Divider style={{ borderColor: '#7cb305' }}>transfer Spl token</Divider>
    
    <TransferSplToken/>

  </>;
}