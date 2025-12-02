function History() {
    return (
        <div className="history-page">
            <h2>Payment History</h2>

            <div className="history-card">
                <div className="history-header">
                    <h3>Recent Transactions</h3>
                </div>

                <div className="history-table">
                    <p className="info">
                        Transaction history will appear here once payroll payments are executed.
                        <br />
                        Events are logged on-chain and can be queried from the contract.
                    </p>
                </div>
            </div>

            <div className="history-stats">
                <div className="stat-item">
                    <span className="label">Total Payments</span>
                    <span className="value">0</span>
                </div>
                <div className="stat-item">
                    <span className="label">Total Amount</span>
                    <span className="value">$0</span>
                </div>
                <div className="stat-item">
                    <span className="label">Last Payment</span>
                    <span className="value">N/A</span>
                </div>
            </div>
        </div>
    );
}

export default History;
