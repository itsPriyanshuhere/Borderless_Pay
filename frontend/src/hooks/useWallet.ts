import { useAccount, useDisconnect, useSwitchChain } from 'wagmi';
import { useEffect, useState } from 'react';
import { getNetwork } from '../config/networks';

export function useWallet() {
    const { address, isConnected, chainId, status } = useAccount();
    const { disconnect } = useDisconnect();
    const { switchChain } = useSwitchChain();
    const [networkName, setNetworkName] = useState<string>('');

    useEffect(() => {
        if (chainId) {
            const network = getNetwork(chainId);
            setNetworkName(network?.name || 'Unknown Network');
        } else {
            setNetworkName('');
        }
    }, [chainId]);

    return {
        address,
        isConnected,
        chainId,
        status,
        networkName,
        disconnect,
        switchChain,
    };
}
