import { useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../config/wagmi';

interface CreateInvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    employeeWallet: string;
}

const CreateInvoiceModal = ({ isOpen, onClose, onSuccess, employeeWallet }: CreateInvoiceModalProps) => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.post(`${BACKEND_URL}/api/invoices`, {
                employeeWallet,
                amount,
                description
            });
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to create invoice');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="glass-card modal-content">
                <h3>Create New Invoice</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Amount (QIE)</label>
                        <input
                            type="number"
                            step="0.0001"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            placeholder="0.00"
                        />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            placeholder="Services rendered..."
                            rows={3}
                        />
                    </div>
                    {error && <p className="error-text">{error}</p>}
                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Invoice'}
                        </button>
                    </div>
                </form>
            </div>
            <style>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    backdrop-filter: blur(5px);
                }
                .modal-content {
                    width: 100%;
                    max-width: 500px;
                    padding: 2rem;
                }
                .form-group {
                    margin-bottom: 1.5rem;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    color: var(--text-secondary);
                }
                .form-group input, .form-group textarea {
                    width: 100%;
                    padding: 0.75rem;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    color: white;
                    font-size: 1rem;
                }
                .form-group input:focus, .form-group textarea:focus {
                    outline: none;
                    border-color: var(--neon-blue);
                }
                .modal-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                    margin-top: 2rem;
                }
                .btn-secondary {
                    background: transparent;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: white;
                    padding: 0.75rem 1.5rem;
                    border-radius: 8px;
                    cursor: pointer;
                }
                .error-text {
                    color: #ff3232;
                    font-size: 0.9rem;
                    margin-top: 0.5rem;
                }
            `}</style>
        </div>
    );
};

export default CreateInvoiceModal;
