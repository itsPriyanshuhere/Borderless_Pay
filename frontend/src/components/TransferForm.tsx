import { useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import { getNetwork, getBackendChainName } from '../config/networks';
import axios from 'axios';
import { BACKEND_URL } from '../config/wagmi';

export function TransferForm() {
    const { isConnected, chainId, address } = useWallet();
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isConnected || !chainId) return;

        setLoading(true);
        setStatus({ type: null, message: '' });

        try {
            const chainName = getBackendChainName(chainId);

            // Get auth token (assuming stored in localStorage or similar, or skip if public endpoint for demo)
            // For this demo we'll use the backend endpoint which uses its own private key
            // In a real app, user would sign with their wallet

            const response = await axios.post(`${BACKEND_URL}/api/transfer/native`, {
                to: recipient,
                amount,
                chain: chainName
            });

            if (response.data.success) {
                setStatus({
                    type: 'success',
                    message: `Transfer successful! Hash: ${response.data.txHash}`
                });
                setRecipient('');
                setAmount('');
            }
        } catch (error: any) {
            setStatus({
                type: 'error',
                message: error.response?.data?.error || 'Transfer failed'
            });
        } finally {
            setLoading(false);
        }
    };

    if (!isConnected) return null;

    const network = getNetwork(chainId || 0);
    const symbol = network?.nativeCurrency.symbol || 'ETH';

    return (
        <div className="transfer-form-container">
            <h3>Send {symbol}</h3>
            <form onSubmit={handleSubmit} className="transfer-form">
                <div className="form-group">
                    <label>Recipient Address</label>
                    <input
                        type="text"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder="0x..."
                        required
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label>Amount ({symbol})</label>
                    <input
                        type="number"
                        step="0.000001"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.0"
                        required
                        className="form-input"
                    />
                </div>

                {status.message && (
                    <div className={`status-message ${status.type}`}>
                        {status.message}
                    </div>
                )}

                <button type="submit" disabled={loading} className="submit-btn">
                    {loading ? 'Sending...' : 'Send'}
                </button>
            </form>
        </div>
    );
}
