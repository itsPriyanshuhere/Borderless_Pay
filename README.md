# 💼 Crypto Payroll System

A fully on-chain, automated cryptocurrency payroll system built for the QIE Blockchain Hackathon. Pay employees in any supported cryptocurrency using real-time oracle price feeds and automated DEX swaps.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Solidity](https://img.shields.io/badge/Solidity-^0.8.25-363636.svg)
![Node](https://img.shields.io/badge/Node-20+-339933.svg)
![React](https://img.shields.io/badge/React-18-61DAFB.svg)

## ✨ Features

- **Multi-Chain Support**: QIE Testnet (Primary) and ETH Sepolia (Testing)
- **Multi-Token Support**: Pay employees in BTC, ETH, SOL, XRP, QIE, XAUt, BNB
- **Real-Time Pricing**: Powered by QIE Oracle Network (Chainlink-compatible)
- **Automated Swaps**: DEX integration for seamless token conversion
- **Batch Payments**: Pay all employees in a single transaction
- **Wallet Authentication**: Secure Web3 wallet-based login
- **Scheduled Payroll**: Automated monthly/bi-weekly payroll execution
- **Modern UI**: Premium dark theme with glassmorphism and animations

## 🏗️ Architecture

### Smart Contracts (Solidity)
- `Payroll.sol` - Main payroll contract with employee management and payment logic
- `ISwapRouter.sol` - Uniswap V3 DEX integration interface
- `IERC20.sol` - Standard ERC20 token interface

### Backend (Node.js + TypeScript)
- Express REST API for payroll operations
- Ethers.js v6 for blockchain interaction
- JWT + wallet signature authentication
- Cron-based automated scheduling
- Real-time event listening

### Frontend (React + TypeScript)
- Vite for fast development and builds
- Wagmi + RainbowKit for wallet connection
- TanStack Query for data fetching
- Premium dark theme with modern aesthetics
- Fully responsive design

## 📦 Project Structure

```
webWallet/
├── contracts/              # Smart contracts
│   ├── Payroll.sol
│   ├── ISwapRouter.sol
│   └── IERC20.sol
├── backend/                # Backend API
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.ts
│   └── package.json
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── config/
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
├── scripts/                # Deployment scripts
├── test/                   # Contract tests
└── hardhat.config.ts       # Hardhat configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn
- MetaMask or compatible Web3 wallet

### 1. Install Dependencies

**Root (Hardhat):**
```bash
npm install
```

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Configure Environment Variables

**Root `.env`:**
```env
RPC_URL=https://your-rpc-endpoint
CHAIN_ID=1
PRIVATE_KEY=your_private_key
DEX_ROUTER_ADDRESS=0x...
FALLBACK_TOKEN_ADDRESS=0x...
```

**Backend `.env`:**
```env
PORT=3001
NODE_ENV=development
# RPC URLs
QIE_RPC_URL=https://rpc1testnet.qie.digital/
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your-api-key
# Private Key for Backend Signing
BACKEND_PRIVATE_KEY=your_private_key_here
# Legacy/Contract Config
CONTRACT_ADDRESS=0x...
PRIVATE_KEY=your_private_key
JWT_SECRET=your_secret
```

**Frontend `.env`:**
```env
VITE_BACKEND_URL=http://localhost:3001
```

### 3. Compile & Deploy Contracts

```bash
# Compile contracts
npm run compile

# Run tests
npm test

# Deploy to network
npm run deploy:testnet
```

### 4. Start Backend

```bash
cd backend
npm run dev
```

The API will be available at `http://localhost:3001`

### 5. Start Frontend

```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:3000`

## 📖 Usage

### Adding an Employee

1. Connect your wallet (employer account)
2. Navigate to **Employees** page
3. Fill in:
   - Employee wallet address
   - Preferred token address
   - Token symbol (BTC, ETH, etc.)
   - Monthly salary in USD
4. Click "Add Employee"

### Funding Payroll

1. Go to **Payroll** page
2. Enter USDT amount to fund
3. Approve transaction in wallet
4. Contract receives fallback tokens for swaps

### Executing Payroll

**Single Employee:**
- Enter employee address
- Click "Pay Employee"

**Batch Payment:**
- Click "Execute Payroll"
- All registered employees get paid in one transaction

## 🔧 API Endpoints

```
POST   /api/auth/login          - Wallet authentication
GET    /api/auth/network        - Network info

POST   /api/employees           - Add employee
GET    /api/employees/:address  - Get employee details
DELETE /api/employees/:address  - Remove employee

POST   /api/payroll/fund        - Fund contract
GET    /api/payroll/balance     - Get balance
POST   /api/payroll/execute     - Batch payment
POST   /api/payroll/execute/:address - Pay single employee

GET    /api/oracle/price/:symbol - Get token price
GET    /api/oracle/prices       - Get all prices
POST   /api/oracle/add          - Add oracle feed
```

## 🧪 Testing

### Smart Contracts
```bash
npm test
npm run test:coverage
npm run test:gas
```

### Backend
```bash
cd backend
npm test
```

## 🔐 Security

- Employer-only access control
- JWT + wallet signature authentication
- Input validation on all endpoints
- Safe ERC20 token handling
- Oracle price verification
- DEX slippage protection (2%)

## 🎯 Hackathon Requirements

- ✅ Uses QIE Oracle Network for price feeds
- ✅ Original project with live demo
- ✅ Open source (MIT License)
- ✅ Fully on-chain logic
- ✅ Real-world use case (payroll automation)

## 🛣️ Roadmap

- [ ] Multi-signature support for larger organizations
- [ ] Email notifications for payment confirmations
- [ ] CSV import for bulk employee addition
- [ ] Historical analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Multi-chain deployment

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please open an issue or PR.

## 📧 Contact

For questions or support regarding this hackathon project, please open an issue.

---

**Built for QIE Blockchain Hackathon** 🏆
