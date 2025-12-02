import providerService, { NetworkType } from './provider.service';
import config from '../config';

// Mock config
jest.mock('../config', () => ({
    qieRpcUrl: 'https://mock-qie-rpc.com',
    sepoliaRpcUrl: 'https://mock-sepolia-rpc.com',
    backendPrivateKey: '0x0123456789012345678901234567890123456789012345678901234567890123',
    nodeEnv: 'test'
}));

describe('ProviderService', () => {
    it('should initialize providers for configured networks', () => {
        expect(providerService.isNetworkConfigured(NetworkType.QIE)).toBe(true);
        expect(providerService.isNetworkConfigured(NetworkType.SEPOLIA)).toBe(true);
    });

    it('should return available networks', () => {
        const networks = providerService.getAvailableNetworks();
        expect(networks).toContain(NetworkType.QIE);
        expect(networks).toContain(NetworkType.SEPOLIA);
    });

    it('should get provider for QIE', () => {
        const provider = providerService.getProvider(NetworkType.QIE);
        expect(provider).toBeDefined();
    });

    it('should get wallet for QIE', () => {
        const wallet = providerService.getWallet(NetworkType.QIE);
        expect(wallet).toBeDefined();
        // Check if wallet is connected to provider (implicitly by checking if provider is set)
        expect(wallet.provider).toBeDefined();
    });

    it('should throw error for unconfigured network', () => {
        // @ts-ignore - Testing invalid input
        expect(() => providerService.getProvider('invalid_network')).toThrow();
    });
});
