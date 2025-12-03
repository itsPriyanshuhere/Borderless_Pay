import { useState, useEffect } from 'react';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import axios from 'axios';
import { BACKEND_URL, OWNER_ADDRESS } from '../config/wagmi';
import InvoiceList from '../components/Invoices/InvoiceList';
import CreateInvoiceModal from '../components/Invoices/CreateInvoiceModal';

interface Invoice {
    id: string;
    employeeWallet: string;
    amount: string;
    description: string;
    status: 'pending' | 'paid' | 'rejected';
    createdAt: number;
    paidAt?: number;
    txHash?: string;
}

const Invoices = () => {
    const { address } = useAccount();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'my' | 'all'>('my');

    // For paying invoices
    const { sendTransaction, data: hash } = useSendTransaction();
    const { isSuccess: isTxSuccess } = useWaitForTransactionReceipt({
        hash: hash,
    });
    const [payingInvoiceId, setPayingInvoiceId] = useState<string | null>(null);

    // Check if user is employer
    const isEmployer = address && OWNER_ADDRESS && address.toLowerCase() === OWNER_ADDRESS.toLowerCase();

    useEffect(() => {
        if (address) {
            fetchInvoices();
        }
    }, [address, activeTab]);

    useEffect(() => {
        if (isTxSuccess && payingInvoiceId && hash) {
            updateInvoiceStatus(payingInvoiceId, 'paid', hash);
            setPayingInvoiceId(null);
        }
    }, [isTxSuccess, hash]);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const params: any = {};
            if (activeTab === 'my') {
                params.wallet = address;
            }

            const res = await axios.get(`${BACKEND_URL}/api/invoices`, { params });
            if (res.data?.success) {
                setInvoices(res.data.invoices);
            }
        } catch (error) {
            console.error('Failed to fetch invoices:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePay = async (invoice: Invoice) => {
        try {
            setPayingInvoiceId(invoice.id);
            sendTransaction({
                to: invoice.employeeWallet as `0x${string}`,
                value: parseEther(invoice.amount)
            });
        } catch (error) {
            console.error('Payment failed:', error);
            setPayingInvoiceId(null);
        }
    };

    const updateInvoiceStatus = async (id: string, status: string, txHash: string) => {
        try {
            await axios.put(`${BACKEND_URL}/api/invoices/${id}/status`, {
                status,
                txHash
            });
            fetchInvoices();
        } catch (error) {
            console.error('Failed to update invoice status:', error);
        }
    };

    return (
        <div className="invoices-page">
            <div className="page-header">
                <div className="header-content">
                    <div>
                        <h2>Invoices</h2>
                        <p className="text-muted">Manage and pay service invoices</p>
                    </div>
                    <button
                        className="btn-primary"
                        onClick={() => setIsModalOpen(true)}
                    >
                        + New Invoice
                    </button>
                </div>

                <div className="tabs">
                    <button
                        className={`tab-btn ${activeTab === 'my' ? 'active' : ''}`}
                        onClick={() => setActiveTab('my')}
                    >
                        My Invoices
                    </button>
                    {isEmployer && (
                        <button
                            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveTab('all')}
                        >
                            All Invoices
                        </button>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="loading">Loading invoices...</div>
            ) : (
                <InvoiceList
                    invoices={invoices}
                    isEmployer={isEmployer && activeTab === 'all'}
                    onPay={handlePay}
                />
            )}

            <CreateInvoiceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchInvoices}
                employeeWallet={address || ''}
            />

            <style>{`
                .invoices-page {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }
                .header-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }
                .tabs {
                    display: flex;
                    gap: 1rem;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                    padding-bottom: 1rem;
                }
                .tab-btn {
                    background: transparent;
                    border: none;
                    color: var(--text-muted);
                    font-size: 1rem;
                    cursor: pointer;
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    transition: all 0.3s ease;
                }
                .tab-btn:hover {
                    color: white;
                    background: rgba(255,255,255,0.05);
                }
                .tab-btn.active {
                    color: var(--neon-blue);
                    background: rgba(45, 106, 255, 0.1);
                }
                .loading {
                    text-align: center;
                    padding: 4rem;
                    color: var(--text-muted);
                }
            `}</style>
        </div>
    );
};

export default Invoices;
