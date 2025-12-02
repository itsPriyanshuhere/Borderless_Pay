import { http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { qieTestnet } from './networks';

const WC_PROJECT_ID = (import.meta.env.VITE_WALLETCONNECT_PROJECT_ID as string) || (import.meta.env.REACT_APP_WALLETCONNECT_PROJECT_ID as string) || 'YOUR_PROJECT_ID';

export const config = getDefaultConfig({
    appName: 'Crypto Payroll System',
    projectId: WC_PROJECT_ID, // Get from WalletConnect Cloud and set in .env.local as VITE_WALLETCONNECT_PROJECT_ID
    chains: [mainnet, sepolia, qieTestnet],
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
        [qieTestnet.id]: http(),
    },
});

// Backend API base URL (Vite exposes VITE_* env vars on import.meta.env)
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.REACT_APP_API_URL || 'http://localhost:3001';

// Expose rpc urls for other modules if needed
export const VITE_QIE_RPC_URL = import.meta.env.VITE_QIE_RPC_URL || import.meta.env.REACT_APP_QIE_RPC_URL || 'https://rpc1testnet.qie.digital/';
export const VITE_SEPOLIA_RPC_URL = import.meta.env.VITE_SEPOLIA_RPC_URL || import.meta.env.REACT_APP_SEPOLIA_RPC_URL || 'https://eth-sepolia.g.alchemy.com/v2/';
