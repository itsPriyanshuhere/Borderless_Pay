import dotenv from 'dotenv';
dotenv.config();

interface Config {
    port: number;
    nodeEnv: string;
    rpcUrl?: string; // Deprecated
    qieRpcUrl: string;
    sepoliaRpcUrl: string;
    backendPrivateKey: string;
    chainId: number;
    contractAddress: string;
    privateKey: string; // Deprecated in favor of backendPrivateKey for backend operations, kept for backward compat if needed
    jwtSecret: string;
    jwtExpiresIn: string;
    cronSchedule: string;
    allowedOrigins: string[];
}

const config: Config = {
    port: parseInt(process.env.PORT || '3001', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    rpcUrl: process.env.RPC_URL || '', // Deprecated
    qieRpcUrl: process.env.QIE_RPC_URL || '',
    sepoliaRpcUrl: process.env.SEPOLIA_RPC_URL || '',
    backendPrivateKey: process.env.BACKEND_PRIVATE_KEY || process.env.PRIVATE_KEY || '',
    chainId: parseInt(process.env.CHAIN_ID || '1', 10),
    contractAddress: process.env.CONTRACT_ADDRESS || '',
    privateKey: process.env.PRIVATE_KEY || '',
    jwtSecret: process.env.JWT_SECRET || 'default-secret-change-in-production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
    cronSchedule: process.env.CRON_SCHEDULE || '0 0 1 * *', // Monthly by default
    allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(','),
};

// Validate required config
if (config.nodeEnv === 'production') {
    if (!config.qieRpcUrl && !config.sepoliaRpcUrl) {
        throw new Error('At least one RPC URL (QIE_RPC_URL or SEPOLIA_RPC_URL) is required in production');
    }
    if (!config.backendPrivateKey) {
        throw new Error('BACKEND_PRIVATE_KEY is required in production');
    }
    if (!config.contractAddress) {
        throw new Error('CONTRACT_ADDRESS is required in production');
    }
}

export default config;
