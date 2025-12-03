

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

interface InvoiceListProps {
    invoices: Invoice[];
    isEmployer: boolean;
    onPay?: (invoice: Invoice) => void;
}

const InvoiceList = ({ invoices, isEmployer, onPay }: InvoiceListProps) => {
    return (
        <div className="glass-card">
            <h3>Invoices</h3>
            <div className="table-responsive">
                <table className="glass-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.length === 0 ? (
                            <tr>
                                <td colSpan={isEmployer ? 5 : 4} className="text-center">
                                    No invoices found
                                </td>
                            </tr>
                        ) : (
                            invoices.map((invoice) => (
                                <tr key={invoice.id}>
                                    <td>{new Date(invoice.createdAt).toLocaleDateString()}</td>
                                    <td>{invoice.description}</td>
                                    <td>{invoice.amount} QIE</td>
                                    <td>
                                        <span className={`status-badge ${invoice.status}`}>
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td>
                                        {isEmployer ? (
                                            <>
                                                {invoice.status === 'pending' && (
                                                    <button
                                                        className="btn-primary btn-sm"
                                                        onClick={() => onPay?.(invoice)}
                                                    >
                                                        Pay
                                                    </button>
                                                )}
                                                {invoice.status === 'paid' && (
                                                    <a
                                                        href={`https://testnet.qie.digital/tx/${invoice.txHash}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue"
                                                    >
                                                        View Tx
                                                    </a>
                                                )}
                                            </>
                                        ) : (
                                            invoice.status === 'paid' ? (
                                                <a
                                                    href={`https://testnet.qie.digital/tx/${invoice.txHash}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue"
                                                >
                                                    View Tx
                                                </a>
                                            ) : (
                                                <span className="text-muted">-</span>
                                            )
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <style>{`
                .table-responsive {
                    overflow-x: auto;
                }
                .glass-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 1rem;
                }
                .glass-table th, .glass-table td {
                    padding: 1rem;
                    text-align: left;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                }
                .glass-table th {
                    color: var(--text-muted);
                    font-weight: 500;
                }
                .status-badge {
                    padding: 0.25rem 0.75rem;
                    border-radius: 12px;
                    font-size: 0.85rem;
                    text-transform: capitalize;
                }
                .status-badge.pending {
                    background: rgba(255, 165, 0, 0.1);
                    color: orange;
                }
                .status-badge.paid {
                    background: rgba(10, 255, 96, 0.1);
                    color: var(--neon-green);
                }
                .status-badge.rejected {
                    background: rgba(255, 50, 50, 0.1);
                    color: #ff3232;
                }
                .btn-sm {
                    padding: 0.25rem 0.75rem;
                    font-size: 0.85rem;
                }
                .text-blue {
                    color: var(--neon-blue);
                    text-decoration: none;
                }
                .text-center {
                    text-align: center;
                    color: var(--text-muted);
                    padding: 2rem;
                }
            `}</style>
        </div>
    );
};

export default InvoiceList;
