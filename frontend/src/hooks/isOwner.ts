import { useAccount } from 'wagmi';
import { OWNER_ADDRESS } from '../config/wagmi';

export function useIsOwner() {
    const { address } = useAccount();
    const isOwner = address && OWNER_ADDRESS && address.toLowerCase() === OWNER_ADDRESS.toLowerCase();
    return isOwner;
}