import { useState, useEffect } from 'react';

interface Transaction {
    hash: string;
    type: 'fund' | 'payout' | 'batch';
    amount?: string;
    to?: string;
    timestamp: number;
    status: 'success' | 'failed' | 'pending';
}

function History() {
    const [transactions] = useState<Transaction[]>([]);

    useEffect(() => {
        // Mock data for now, replace with actual API call when ready
        // fetchHistory();
    }, []);

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
                        <span className="value">0</span>
                    </div>
                    <div className="glass-card stat-item">
                        <span className="label">Total Volume</span>
                        <span className="value">$0.00</span>
                    </div>
                    <div className="glass-card stat-item">
                        <span className="label">Last Payment</span>
                        <span className="value text-muted">Never</span>
                    </div>
                </div>

                {/* Transaction Table */}
                <div className="glass-card table-section">
                    <div className="section-header">
                        <h3>Recent Transactions</h3>
                        <div className="filters">
                            <button className="filter-btn active">All</button>
                            <button className="filter-btn">Payouts</button>
                            <button className="filter-btn">Funding</button>
                        </div>
                    </div>

                    {transactions.length === 0 ? (
                        <div className="empty-state">
                            <div className="icon">📜</div>
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
                                {/* Map transactions here */}
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

                .empty-state .icon {
                    font-size: 4rem;
                    margin-bottom: 1rem;
                    opacity: 0.5;
                }

                .empty-state h3 {
                    color: white;
                    margin-bottom: 0.5rem;
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
