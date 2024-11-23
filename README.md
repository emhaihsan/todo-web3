# Todo List DApp

A decentralized Todo List application built with Ethereum Smart Contract and React. This application allows users to create, view, and delete tasks that are permanently stored on the Ethereum blockchain.

## 🌟 Features

- MetaMask wallet integration
- Decentralized task management
- Sepolia Testnet support
- Real-time updates after each transaction

## 🛠 Tech Stack

- **Frontend**: React.js, Material-UI
- **Smart Contract**: Solidity
- **Blockchain**: Ethereum (Sepolia Testnet)
- **Development Tools**: Hardhat, Ethers.js
- **Wallet**: MetaMask

## 📦 Prerequisites

- Node.js v14+
- MetaMask wallet
- Sepolia testnet ETH

## 🚀 Installation & Setup

1. Clone repository

```bash
git clone https://github.com/emhaihsan/todo-web3.git
cd todo-web3
```

2. Install dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
```

3. Setup environment variables

```bash
# In root folder
cp .env.example .env
# Fill in your private key and RPC URL
```

4. Deploy smart contract

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

5. Update contract address

- Copy the deployed contract address
- Update `TaskContractAddress` in `client/src/config.js`

6. Run the application

```bash
cd client
npm start
```

## 🔧 Smart Contract

The main `TaskContract.sol` has the following functions:

- `addTask`: Add a new task
- `deleteTask`: Delete an existing task
- `getMyTasks`: Retrieve all user tasks

## 💻 Usage

1. Open the application in your browser
2. Connect your MetaMask wallet
3. Ensure you're connected to Sepolia Testnet
4. Start adding and deleting tasks

## 🧪 Testing

```bash
# Run contract tests
npx hardhat test
```

## ⚠️ Disclaimer

This application uses the Sepolia testnet. Do not use on Ethereum mainnet.
