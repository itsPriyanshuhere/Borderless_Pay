import { useState } from 'react';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { getNetwork } from '../config/networks';

export function TransferForm() {
    const { isConnected, chainId } = useAccount();
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const { sendTransaction, data: hash, isPending, error } = useSendTransaction();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isConnected || !chainId || !recipient || !amount) return;

        try {
            sendTransaction({
                to: recipient as `0x${string}`,
                value: parseEther(amount),
            });
        } catch (err) {
            console.error('Transaction error:', err);
        }
    };

    // Reset form on success
    if (isSuccess && recipient) {
        setTimeout(() => {
            setRecipient('');
            setAmount('');
        }, 2000);
    }

    if (!isConnected) return null;

    const network = getNetwork(chainId || 0);
    const symbol = network?.nativeCurrency.symbol || 'ETH';

    return (
        <div className="transfer-form-wrapper">
            <form onSubmit={handleSubmit} className="transfer-form">
                <div className="form-row">
                    <div className="form-group">
                        <label>Recipient Address</label>
                        <input
                            type="text"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            placeholder="0x..."
                            required
                            className="glass-input"
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
                            className="glass-input"
                        />
                    </div>
                </div>

                {hash && (
                    <div className="status-message success">
                        Transaction Hash: {hash.slice(0, 10)}...{hash.slice(-8)}
                    </div>
                )}

                {isConfirming && (
                    <div className="status-message">
                        Waiting for confirmation...
                    </div>
                )}

                {isSuccess && (
                    <div className="status-message success">
                        Transaction confirmed!
                    </div>
                )}

                {error && (
                    <div className="status-message error">
                        Error: {error.message}
                    </div>
                )}

                <button type="submit" disabled={isPending || isConfirming} className="btn-primary full-width">
                    {isPending || isConfirming ? 'Sending...' : `Send ${symbol}`}
                </button>
            </form>

            <style>{`
                .transfer-form-wrapper {
                    width: 100%;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 1.5rem;
                    margin-bottom: 1.5rem;
                }



                .full-width {
                    width: 100%;
                    padding: 1rem;
                    font-size: 1.1rem;
                }

                @media (max-width: 768px) {
                    .form-row {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
}
