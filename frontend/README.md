# Frontend Dashboard

Modern React dashboard for the Crypto Payroll System.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Create `.env` file:
```env
VITE_BACKEND_URL=http://localhost:3001
```

## Pages

- **Dashboard** - Overview, stats, token prices
- **Employees** - Add/remove employees
- **Payroll** - Fund contract, execute payments
- **History** - Payment history (coming soon)

## Wallet Connection

Uses RainbowKit for wallet connection. Supports MetaMask, WalletConnect, and other popular wallets.

## Wagmi Configuration

Update `src/config/wagmi.ts` with your:
- WalletConnect Project ID
- Supported chains
- RPC providers

## Styling

Premium dark theme with:
- Custom CSS variables
- Glassmorphism effects
- Smooth animations
- Full responsiveness

Edit `src/index.css` to customize the theme.

## Building for Production

```bash
npm run build
```

Deploy the `dist/` folder to your hosting service.
