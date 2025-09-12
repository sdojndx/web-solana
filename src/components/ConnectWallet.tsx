import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { BaseWalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Button, Divider, Input } from "antd";
import style from './index.module.scss';
import { useState } from "react";
import { Keypair } from "@solana/web3.js";
import bs58 from 'bs58';

export const ConnectWallet = () => {
  const walletInfo = useWallet();
  const { connection } = useConnection();
  const { connected, connecting, publicKey, sendTransaction } = walletInfo;
  const [account, setAccount] = useState<string>("");

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

    <Divider style={{ borderColor: '#7cb305' }}>Initiate a Transaction</Divider>
  </>;
}