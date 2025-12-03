import { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../config/wagmi';

interface Transaction {
    hash: string;
    type: 'fund' | 'payout' | 'batch';
    amount?: string;
    to?: string;
    timestamp: number;
    status: 'success' | 'failed' | 'pending';
}

function History() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'payout' | 'fund'>('all');

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${BACKEND_URL}/api/history`);
            if (res.data?.success) {
                setTransactions(res.data.transactions || []);
            }
        } catch (error) {
            console.error('Failed to fetch history:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTransactions = transactions.filter(tx =>
        filter === 'all' || tx.type === filter
    );

    const totalPayouts = transactions.filter(t => t.type === 'payout').length;
    const totalVolume = transactions.reduce((acc, tx) => acc + parseFloat(tx.amount || '0'), 0);
    const lastPayment = transactions.length > 0 ? new Date(transactions[0].timestamp * 1000).toLocaleDateString() : 'Never';

    return (
        <div className="history-page">
            <div className="page-header">
                <h2>Payment History</h2>
                <p className="text-muted">Track all payroll transactions and funding events</p>
            </div>

            <div className="history-grid">
                {/* Stats Overview */}
                <div className="history-stats">
                    <div className="glass-card stat-item">
                        <span className="label">Total Payments</span>
                        <span className="value">{totalPayouts}</span>
                    </div>
                    <div className="glass-card stat-item">
                        <span className="label">Total Volume</span>
                        <span className="value">{totalVolume.toFixed(4)} QIE</span>
                    </div>
                    <div className="glass-card stat-item">
                        <span className="label">Last Payment</span>
                        <span className="value text-muted">{lastPayment}</span>
                    </div>
                </div>

                {/* Transaction Table */}
                <div className="glass-card table-section">
                    <div className="section-header">
                        <h3>Recent Transactions</h3>
                        <div className="filters">
                            <button
                                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                                onClick={() => setFilter('all')}
                            >All</button>
                            <button
                                className={`filter-btn ${filter === 'payout' ? 'active' : ''}`}
                                onClick={() => setFilter('payout')}
                            >Payouts</button>
                            <button
                                className={`filter-btn ${filter === 'fund' ? 'active' : ''}`}
                                onClick={() => setFilter('fund')}
                            >Funding</button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="empty-state">
                            <p>Loading history...</p>
                        </div>
                    ) : filteredTransactions.length === 0 ? (
                        <div className="empty-state">
                            <h3>No History Yet</h3>
                            <p>Transactions will appear here once you start using the payroll system.</p>
                        </div>
                    ) : (
                        <table className="glass-table">
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Hash</th>
                                    <th>Amount</th>
                                    <th>To</th>
                                    <th>Time</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.map((tx) => (
                                    <tr key={tx.hash}>
                                        <td>
                                            <span className={`type-badge ${tx.type}`}>
                                                {tx.type === 'fund' ? 'Fund' : 'Payout'}
                                            </span>
                                        </td>
                                        <td>
                                            <a
                                                href={`https://testnet.qie.digital/tx/${tx.hash}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hash-link"
                                            >
                                                {tx.hash.slice(0, 8)}...{tx.hash.slice(-6)}
                                            </a>
                                        </td>
                                        <td>{parseFloat(tx.amount || '0').toFixed(4)} QIE</td>
                                        <td>
                                            {tx.to === 'Contract' ? 'Contract' :
                                                `${tx.to?.slice(0, 6)}...${tx.to?.slice(-4)}`}
                                        </td>
                                        <td>{new Date(tx.timestamp * 1000).toLocaleString()}</td>
                                        <td>
                                            <span className={`status-badge ${tx.status}`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <style>{`
                .history-page {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }

                .history-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }

                .history-stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1.5rem;
                }

                .stat-item {
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    align-items: center;
                    text-align: center;
                }

                .stat-item .label {
                    color: var(--text-muted);
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .stat-item .value {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: white;
                }

                .table-section {
                    padding: 2rem;
                    min-height: 400px;
                }

                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }

                .filters {
                    display: flex;
                    gap: 0.5rem;
                    background: rgba(255, 255, 255, 0.05);
                    padding: 0.25rem;
                    border-radius: 8px;
                }

                .filter-btn {
                    background: transparent;
                    border: none;
                    color: var(--text-muted);
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 0.9rem;
                    transition: all 0.3s ease;
                }

                .filter-btn:hover {
                    color: white;
                }

                .filter-btn.active {
                    background: rgba(45, 106, 255, 0.2);
                    color: var(--neon-blue);
                }

                .empty-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 4rem 0;
                    color: var(--text-muted);
                    text-align: center;
                }

                .empty-state h3 {
                    color: white;
                    margin-bottom: 0.5rem;
                    font-size: 1.2rem;
                }

                .empty-state p {
                    font-size: 0.95rem;
                }

                .glass-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .glass-table thead {
                    border-bottom: 1px solid var(--border-glass);
                }

                .glass-table th {
                    padding: 1rem;
                    text-align: left;
                    font-weight: 600;
                    color: var(--text-secondary);
                    font-size: 0.85rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .glass-table td {
                    padding: 1rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                    color: var(--text-primary);
                }

                .glass-table tbody tr {
                    transition: background 0.2s ease;
                }

                .glass-table tbody tr:hover {
                    background: rgba(255, 255, 255, 0.02);
                }

                .type-badge {
                    display: inline-block;
                    padding: 0.25rem 0.75rem;
                    border-radius: 12px;
                    font-size: 0.85rem;
                    font-weight: 500;
                }

                .type-badge.fund {
                    background: rgba(10, 255, 96, 0.1);
                    color: var(--neon-green);
                    border: 1px solid var(--neon-green);
                }

                .type-badge.payout {
                    background: rgba(45, 106, 255, 0.1);
                    color: var(--neon-blue);
                    border: 1px solid var(--neon-blue);
                }

                .hash-link {
                    color: var(--neon-cyan);
                    text-decoration: none;
                    font-family: 'Courier New', monospace;
                    transition: all 0.3s ease;
                }

                .hash-link:hover {
                    text-decoration: underline;
                    color: white;
                }

                .status-badge {
                    display: inline-block;
                    padding: 0.25rem 0.75rem;
                    border-radius: 12px;
                    font-size: 0.85rem;
                    text-transform: capitalize;
                }

                .status-badge.success {
                    background: rgba(10, 255, 96, 0.1);
                    color: var(--neon-green);
                }

                .status-badge.pending {
                    background: rgba(255, 165, 0, 0.1);
                    color: orange;
                }

                .status-badge.failed {
                    background: rgba(255, 50, 50, 0.1);
                    color: #ff3232;
                }

                @media (max-width: 768px) {
                    .section-header {
                        flex-direction: column;
                        gap: 1rem;
                        align-items: flex-start;
                    }
                    
                    .filters {
                        width: 100%;
                        overflow-x: auto;
                    }
                }
            `}</style>
        </div>
    );
}

export default History;
