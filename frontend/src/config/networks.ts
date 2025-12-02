import { Chain } from 'wagmi/chains';

export const QIE_TESTNET_ID = 1983; // QIE Testnet chainId (provided by user)
export const SEPOLIA_ID = 11155111;

const VITE_QIE_RPC = (import.meta.env.VITE_QIE_RPC_URL as string) || (import.meta.env.REACT_APP_QIE_RPC_URL as string) || 'https://rpc1testnet.qie.digital/';

export const qieTestnet = {
    id: QIE_TESTNET_ID,
    name: 'QIE Testnet',

    nativeCurrency: {
        decimals: 18,
        name: 'QIE',
        symbol: 'QIE',
    },
    rpcUrls: {
        default: { http: [VITE_QIE_RPC] },
        public: { http: [VITE_QIE_RPC] },
    },
    blockExplorers: {
        default: { name: 'QIE Explorer', url: 'https://testnet.qie.digital/' }, // Official explorer provided by user
    },
    testnet: true,
} as const satisfies Chain;

export const NETWORKS = {
    [QIE_TESTNET_ID]: qieTestnet,
    [SEPOLIA_ID]: {
        id: SEPOLIA_ID,
        name: 'Sepolia',
        nativeCurrency: {
            decimals: 18,
            name: 'Sepolia Ether',
            symbol: 'SEP',
        },
        rpcUrls: {
            default: { http: [(import.meta.env.VITE_SEPOLIA_RPC_URL as string) || (import.meta.env.REACT_APP_SEPOLIA_RPC_URL as string) || 'https://rpc.sepolia.org'] },
            public: { http: [(import.meta.env.VITE_SEPOLIA_RPC_URL as string) || (import.meta.env.REACT_APP_SEPOLIA_RPC_URL as string) || 'https://rpc.sepolia.org'] },
        },
        blockExplorers: {
            default: { name: 'Etherscan', url: 'https://sepolia.etherscan.io' },
        },
        testnet: true,
    } as const satisfies Chain,
};

export const getNetwork = (chainId: number) => {
    return NETWORKS[chainId as keyof typeof NETWORKS];
};

export const getBackendChainName = (chainId: number): string => {
    if (chainId === QIE_TESTNET_ID) return 'qie';
    if (chainId === SEPOLIA_ID) return 'sepolia';
    return 'unknown';
};
