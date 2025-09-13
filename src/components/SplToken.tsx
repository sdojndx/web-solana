import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import React from "react";
import style from './index.module.scss';
import bs58 from 'bs58';
import { Input, Button, Form, InputNumber } from "antd";

const SplToken = () => {
  const [getMintTokenRes, setGetMintTokenRes] = React.useState<string>("");

  const getMintToken = async (values: any, error?: (err: any) => void) => {
    try {
      const secretKey = Uint8Array.from(bs58.decode(values.secretKey).toString().split(",").map((s: string) => parseInt(s.trim())));
      const fromWallet = Keypair.fromSecretKey(secretKey);
      const connection = new Connection("https://api.devnet.solana.com", "confirmed");

      // Create new mint
      const mint = await createMint(
        connection,
        fromWallet,              // payer
        new PublicKey(fromWallet.publicKey),    // mint authority
        null,                    // freeze authority (optional)
        9                        // decimals
      );
      setGetMintTokenRes("Mint Address:" + mint.toBase58());

      // Get the token account of the fromWallet address, and if it does not exist, create it
      const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet,               // payer
        mint,                     // mint
        fromWallet.publicKey      // owner
      );
      setGetMintTokenRes("From Token Account:" + fromTokenAccount.address.toBase58());

      // Minting some new token to the "fromTokenAccount" account we just created
      const signature = await mintTo(
        connection,
        fromWallet,               // payer
        mint,                     // mint
        fromTokenAccount.address, // destination
        fromWallet,               // authority
        values.splNumber * 1e9    // amount (in smallest unit, so this is 1 token with 9 decimals)
      );
      setGetMintTokenRes("Minting Signature:" + signature + "\n Minting successful. Mint Address: " + mint.toBase58());
    } catch (err) {
      setGetMintTokenRes("Error creating mint or token account:" + err);
      if (error) {
        error(err);
      }
    }
  }
  return (
    <>
      <Form
        name="createPlsToken"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ 
          remember: true,
          secretKey: `4pNH5si9pJXVRC2tTQirhEtsCpvDd9HhTDnixbvH21XRsmJhi5wX6jAVFQoXUeHMoa7cHNRA6qp1x1LX3XTasLQG`
      }}
        onFinish={getMintToken}
        autoComplete="off"
      >
        <Form.Item
          label="Secret Key"
          name="secretKey"
          validateFirst
          rules={[{ required: true, message: 'Please input secretKey' }]}
        >
          <Input.TextArea maxLength={150} rows={2}/>
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
        <Input.TextArea readOnly rows={6} value={getMintTokenRes} />
      </div>
    </>
  );
}

export default SplToken;