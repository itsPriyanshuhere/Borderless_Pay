# Backend API

REST API for the Crypto Payroll System.

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment template
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

See `.env.example` for all required variables.

## API Routes

### Authentication
- `POST /api/auth/login` - Wallet-based login

### Employees
- `POST /api/employees` - Add employee
- `GET /api/employees/:address` - Get employee
- `DELETE /api/employees/:address` - Remove employee

### Payroll
- `POST /api/payroll/fund` - Fund contract
- `GET /api/payroll/balance` - Get balance
- `POST /api/payroll/execute` - Batch payment
- `POST /api/payroll/execute/:address` - Single payment

### Oracle
- `GET /api/oracle/price/:symbol` - Get price
- `GET /api/oracle/prices` - Get all prices
- `POST /api/oracle/add` - Add oracle

## Architecture

- **Config**: Environment and validation
- **Services**: Blockchain interaction, scheduling
- **Routes**: API endpoints
- **Middleware**: Authentication, error handling

## ABI Files

After compiling contracts, copy the ABI:
```bash
cp ../artifacts/contracts/Payroll.sol/Payroll.json src/services/abis/
```
