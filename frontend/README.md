# Frontend Dashboard

Modern React dashboard for the Crypto Payroll System with clean UI and Web3 wallet integration.

## Quick Start

```bash
# Install dependencies
npm install

# Configure environment
echo "VITE_BACKEND_URL=http://localhost:3001" > .env

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

### Dashboard
- Overview statistics (balance, employee count)
- Network information
- Quick access to key features

### Employees
- View all registered employees
- Add new employees with wallet address and salary
- Remove employees
- Clean table layout with employee details

### Run Payroll
- Fund contract with native tokens
- Pay individual employee
- Execute batch payment to all employees
- Balance validation before payment execution
- Real-time feedback on insufficient funds

### History
- Complete transaction history
- Filter by type (All/Payouts/Funding)
- Clickable transaction hashes linking to blockchain explorer
- Transaction statistics (total payments, volume, last payment)
- Clean tabular design

### Direct Transfer
- Send native tokens to any address
- Simple and fast transfer interface

## Wallet Connection

Uses RainbowKit for seamless wallet connection:
- MetaMask
- WalletConnect
- Coinbase Wallet
- Rainbow Wallet
- And more...

## Configuration

### Wagmi Setup
Located in `src/config/wagmi.ts`:
- QIE Testnet configuration
- WalletConnect Project ID
- RPC providers

Update the configuration:
```typescript
export const config = getDefaultConfig({
  appName: 'Crypto Payroll',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID',
  chains: [qieTestnet],
  // ...
});
```

## Styling

Clean, professional design featuring:
- Dark theme with glassmorphism effects
- Smooth animations and transitions
- Fully responsive layout
- Custom CSS variables for easy theming
- Modern typography

### Theme Customization
Edit `src/index.css` to customize:
```css
:root {
  --bg-primary: #0a0a0f;
  --bg-secondary: #12121a;
  --text-primary: #ffffff;
  --neon-blue: #2d6aff;
  --neon-green: #0aff60;
  /* ... */
}
```

## Components

```
src/
├── components/
│   ├── Sidebar.tsx          # Navigation sidebar
│   └── TransferForm.tsx     # Direct transfer component
├── pages/
│   ├── Dashboard.tsx        # Main dashboard
│   ├── Employees.tsx        # Employee management
│   ├── Payroll.tsx          # Payroll execution
│   ├── History.tsx          # Transaction history
│   └── Landing.tsx          # Landing page
├── config/
│   └── wagmi.ts             # Web3 configuration
└── hooks/
    └── useWallet.ts         # Wallet connection hook
```

## Features

- Real-time balance updates
- Transaction confirmation feedback
- Error handling with user-friendly messages
- Loading states for all async operations
- Responsive design for mobile and desktop
- Clean, professional UI without clutter

## Building for Production

```bash
# Create optimized build
npm run build

# Preview build locally
npm run preview
```

Deploy the `dist/` folder to your hosting service (Vercel, Netlify, etc.)

## Development Tools

```bash
# Start dev server with hot reload
npm run dev

# Lint code
npm run lint

# Type check
tsc --noEmit
```

## Tech Stack

- React 18 + TypeScript
- Vite (build tool)
- Wagmi (Web3 hooks)
- RainbowKit (wallet connection)
- TanStack Query (data fetching)
- Axios (HTTP client)
- Vanilla CSS (styling)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers with Web3 wallet support
