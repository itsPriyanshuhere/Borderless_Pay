# Crypto Payroll System

A fully on-chain, automated cryptocurrency payroll system built for the QIE Blockchain. Pay employees in native tokens using smart contracts with real-time transaction history and employee management.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Solidity](https://img.shields.io/badge/Solidity-^0.8.25-363636.svg)
![Node](https://img.shields.io/badge/Node-20+-339933.svg)
![React](https://img.shields.io/badge/React-18-61DAFB.svg)

## Features

- **Native Token Payments**: Pay employees directly in QIE or ETH
- **Employee Management**: Add, remove, and track employee information
- **Batch Payments**: Pay all employees in a single transaction with gas optimization
- **Balance Checking**: Automatic validation of contract funds before payroll execution
- **Transaction History**: Complete record of all funding and payment transactions
- **Wallet Authentication**: Secure Web3 wallet-based access
- **Modern UI**: Clean, professional interface with glassmorphism design
- **Fully Responsive**: Works seamlessly on desktop and mobile devices

## Architecture

### Smart Contracts (Solidity)
- `SimplePayroll.sol` - Main payroll contract with employee management and native token payment logic

### Backend (Node.js + TypeScript)
- Express REST API for payroll operations
- Ethers.js v6 for blockchain interaction
- Event querying for transaction history
- Real-time contract interaction

### Frontend (React + TypeScript)
- Vite for fast development and builds
- Wagmi + RainbowKit for wallet connection
- TanStack Query for data fetching
- Modern dark theme with clean aesthetics
- Fully responsive design

## Project Structure

```
webWallet/
├── contracts/              # Smart contracts
│   └── SimplePayroll.sol
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
└── hardhat.config.ts       # Hardhat configuration
```

## Getting Started

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

**Backend `.env`:**
```env
PORT=3001
NODE_ENV=development
QIE_RPC_URL=https://rpc1testnet.qie.digital/
BACKEND_PRIVATE_KEY=your_deployer_private_key
CONTRACT_ADDRESS=0x_your_deployed_contract_address
```

**Frontend `.env`:**
```env
VITE_BACKEND_URL=http://localhost:3001
```

### 3. Compile & Deploy Contracts

```bash
# Compile contracts
npx hardhat compile

# Deploy to QIE testnet
npx hardhat run scripts/deploySimple.ts --network qie_testnet
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

The app will be available at `http://localhost:5173`

## Usage

### Adding an Employee

1. Connect your wallet (employer account)
2. Navigate to **Employees** page
3. Fill in:
   - Employee wallet address
   - Monthly salary (in native tokens)
4. Click "Add Employee"

### Funding Payroll

1. Go to **Run Payroll** page
2. Enter amount to fund (in native tokens)
3. Approve transaction in wallet
4. Contract receives funds for employee payments

### Executing Payroll

**Single Employee:**
- Enter employee address
- Click "Pay Employee"

**Batch Payment:**
- Click "Execute All Payments"
- All registered employees get paid in one transaction
- Balance check ensures sufficient funds before execution

### Viewing History

1. Navigate to **History** page
2. View all transactions (funding and payments)
3. Filter by type (All/Payouts/Funding)
4. Click transaction hashes to view on blockchain explorer

## API Endpoints

```
GET    /api/employees           - Get all employees
POST   /api/employees           - Add employee
DELETE /api/employees/:address  - Remove employee

POST   /api/payroll/fund        - Fund contract
GET    /api/payroll/balance     - Get contract balance
POST   /api/payroll/execute     - Execute batch payment
POST   /api/payroll/execute/:address - Pay single employee

GET    /api/history             - Get transaction history

POST   /api/transfer/native     - Direct native token transfer
```

## Smart Contract Functions

**Employee Management:**
- `addEmployee(address _wallet, uint256 _salary)` - Add new employee
- `removeEmployee(address _wallet)` - Remove employee
- `getEmployee(address _wallet)` - Get employee details
- `getAllEmployees()` - Get all employee addresses

**Payroll Execution:**
- `payEmployee(address _employeeAddress)` - Pay single employee
- `payAllEmployees()` - Pay all employees in one transaction

**Utility:**
- `getBalance()` - Check contract balance
- `emergencyWithdraw()` - Employer emergency withdrawal
- `receive()` - Accept native token deposits

## Security

- Employer-only access control via `onlyEmployer` modifier
- Input validation on all contract functions
- Balance verification before payments
- Safe native token transfer with error handling
- Transaction receipts for all operations

## Technology Stack

**Blockchain:**
- Solidity ^0.8.25
- Hardhat development environment
- Ethers.js v6

**Backend:**
- Node.js + TypeScript
- Express.js
- Axios for HTTP requests

**Frontend:**
- React 18 + TypeScript
- Vite build tool
- Wagmi for Web3 integration
- RainbowKit for wallet connection
- TanStack Query for state management

## License

MIT License - see LICENSE file for details

## Contributing

Contributions are welcome! Please open an issue or PR.

## Contact

For questions or support, please open an issue on GitHub.

---

**Built for QIE Blockchain**
