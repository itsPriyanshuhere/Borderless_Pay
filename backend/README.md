# Backend API

REST API for the Crypto Payroll System. Handles blockchain interactions, employee management, and transaction processing.

## Quick Start

```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev

# Build for production
npm run build

# Run production server
npm start
```

## Environment Variables

Required variables in `.env`:

```env
PORT=3001
NODE_ENV=development

# QIE Testnet RPC
QIE_RPC_URL=https://rpc1testnet.qie.digital/

# Deployer private key (has access to contract)
BACKEND_PRIVATE_KEY=your_private_key_here

# Deployed contract address
CONTRACT_ADDRESS=0x_your_contract_address
```

## API Routes

### Employees
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Add employee
- `DELETE /api/employees/:address` - Remove employee

### Payroll
- `POST /api/payroll/fund` - Fund contract with native tokens
- `GET /api/payroll/balance` - Get contract balance
- `POST /api/payroll/execute` - Execute batch payment to all employees
- `POST /api/payroll/execute/:address` - Pay single employee

### Transfers
- `POST /api/transfer/native` - Direct native token transfer

### History
- `GET /api/history` - Get transaction history (funding and payments)

### Authentication
- `POST /api/auth/login` - Wallet-based login
- `GET /api/auth/network` - Get network information

## Architecture

```
src/
├── config/              # Environment configuration
├── controllers/         # Request handlers
├── middleware/          # Authentication & validation
├── routes/              # API route definitions
│   ├── auth.routes.ts
│   ├── employee.routes.ts
│   ├── payroll.routes.ts
│   ├── transfer.routes.ts
│   └── history.routes.ts
├── services/            # Business logic
│   ├── blockchain.service.ts   # Contract interaction
│   ├── provider.service.ts     # RPC provider management
│   └── abis/                   # Contract ABIs
└── server.ts            # Express server setup
```

## Key Services

### BlockchainService
Handles all smart contract interactions:
- Employee management (add/remove)
- Payment execution (single/batch)
- Contract funding
- Balance checking
- Event querying for transaction history

### ProviderService
Manages RPC connections to QIE testnet.

## ABI Files

After compiling contracts, copy the ABI:
```bash
cp ../artifacts/contracts/SimplePayroll.sol/SimplePayroll.json src/services/abis/
```

## Development

```bash
# Run in development mode with hot reload
npm run dev

# Lint code
npm run lint

# Format code
npm run format
```

## Production

```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

## Error Handling

All endpoints return consistent error responses:
```json
{
  "error": "Error message",
  "details": "Additional context (development only)"
}
```

## CORS Configuration

CORS is enabled for the frontend origin. Update `allowedOrigins` in config if needed.
