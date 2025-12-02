import { ethers } from 'ethers';
import config from '../config';

export enum NetworkType {
    QIE = 'qie',
    SEPOLIA = 'sepolia'
}

export interface NetworkConfig {
    name: string;
    rpcUrl: string;
    chainId: number;
    symbol: string;
}

class ProviderService {
    private providers: Map<NetworkType, ethers.JsonRpcProvider> = new Map();
    private wallets: Map<NetworkType, ethers.Wallet> = new Map();

    constructor() {
        this.initializeProviders();
    }

    private initializeProviders() {
        // Initialize QIE Provider
        if (config.qieRpcUrl) {
            try {
                const provider = new ethers.JsonRpcProvider(config.qieRpcUrl);
                this.providers.set(NetworkType.QIE, provider);

                if (config.backendPrivateKey) {
                    const wallet = new ethers.Wallet(config.backendPrivateKey, provider);
                    this.wallets.set(NetworkType.QIE, wallet);
                }
            } catch (error) {
                console.error('Failed to initialize QIE provider:', error);
            }
        }

        // Initialize Sepolia Provider
        if (config.sepoliaRpcUrl) {
            try {
                const provider = new ethers.JsonRpcProvider(config.sepoliaRpcUrl);
                this.providers.set(NetworkType.SEPOLIA, provider);

                if (config.backendPrivateKey) {
                    const wallet = new ethers.Wallet(config.backendPrivateKey, provider);
                    this.wallets.set(NetworkType.SEPOLIA, wallet);
                }
            } catch (error) {
                console.error('Failed to initialize Sepolia provider:', error);
            }
        }
    }

    public getProvider(network: NetworkType): ethers.JsonRpcProvider {
        const provider = this.providers.get(network);
        if (!provider) {
            throw new Error(`Provider not configured for network: ${network}`);
        }
        return provider;
    }

    public getWallet(network: NetworkType): ethers.Wallet {
        const wallet = this.wallets.get(network);
        if (!wallet) {
            throw new Error(`Wallet not configured for network: ${network}`);
        }
        return wallet;
    }

    public isNetworkConfigured(network: NetworkType): boolean {
        return this.providers.has(network);
    }

    public getAvailableNetworks(): NetworkType[] {
        return Array.from(this.providers.keys());
    }
}

export default new ProviderService();
