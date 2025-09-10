# Solana Wallet App

This project is a React application that allows users to connect multiple wallets and transfer SOL and SPL tokens on the Solana Devnet. It provides a user-friendly interface for managing wallet connections and executing token transfers while handling exceptions gracefully.

## Features

- **Multiple Wallet Connections**: Supports connecting to various wallets including Phantom, OKX Wallet, Coinbase Wallet, MetaMask, and Trust Wallet.
- **Token Transfers**: Allows users to transfer SOL and SPL tokens with ease.
- **Exception Handling**: Provides informative error messages for common issues such as insufficient balance and transaction rejections.

## Project Structure

```
solana-wallet-app
├── src
│   ├── pages
│   │   └── Home.tsx
│   ├── components
│   │   ├── WalletConnector.tsx
│   │   ├── TokenTransfer.tsx
│   │   └── ExceptionHandler.tsx
│   ├── utils
│   │   ├── solana.ts
│   │   └── tokens.ts
│   ├── App.tsx
│   └── index.tsx
├── public
│   └── index.html
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd solana-wallet-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

## Usage

- Navigate to the home page to connect your wallet.
- Use the token transfer component to send SOL or SPL tokens to other addresses.
- Monitor the transaction results and handle any exceptions that may arise.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.