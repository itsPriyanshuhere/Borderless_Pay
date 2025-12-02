import { useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../config/wagmi';

interface Employee {
    wallet: string;
    token: string;
    symbol: string;
    salaryUSD: string;
}

function Employees() {
    const [formData, setFormData] = useState({
        wallet: '',
        token: '',
        symbol: 'BTC',
        salaryUSD: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const res = await axios.post(`${BACKEND_URL}/api/employees`, formData);

            if (res.data.success) {
                setMessage({ type: 'success', text: `Employee added! Tx: ${res.data.txHash}` });
                setFormData({ wallet: '', token: '', symbol: 'BTC', salaryUSD: '' });
            }
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.response?.data?.error || 'Failed to add employee'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="employees-page">
            <h2>Employee Management</h2>

            <div className="employee-form-card">
                <h3>Add New Employee</h3>

                <form onSubmit={handleSubmit} className="employee-form">
                    <div className="form-group">
                        <label htmlFor="wallet">Employee Wallet Address</label>
                        <input
                            id="wallet"
                            type="text"
                            placeholder="0x..."
                            value={formData.wallet}
                            onChange={(e) => setFormData({ ...formData, wallet: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="token">Token Address</label>
                        <input
                            id="token"
                            type="text"
                            placeholder="0x..."
                            value={formData.token}
                            onChange={(e) => setFormData({ ...formData, token: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="symbol">Token Symbol</label>
                        <select
                            id="symbol"
                            value={formData.symbol}
                            onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                            required
                        >
                            <option value="BTC">BTC - Bitcoin</option>
                            <option value="ETH">ETH - Ethereum</option>
                            <option value="XRP">XRP - Ripple</option>
                            <option value="SOL">SOL - Solana</option>
                            <option value="QIE">QIE - QIE Token</option>
                            <option value="XAUt">XAUt - Tether Gold</option>
                            <option value="BNB">BNB - Binance Coin</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="salaryUSD">Monthly Salary (USD)</label>
                        <input
                            id="salaryUSD"
                            type="number"
                            placeholder="5000"
                            step="0.01"
                            value={formData.salaryUSD}
                            onChange={(e) => setFormData({ ...formData, salaryUSD: e.target.value })}
                            required
                        />
                    </div>

                    {message && (
                        <div className={`message ${message.type}`}>
                            {message.text}
                        </div>
                    )}

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Adding Employee...' : '➕ Add Employee'}
                    </button>
                </form>
            </div>

            <div className="employee-list-card">
                <h3>Employee List</h3>
                <p className="info">Connect to backend to view employees</p>
                {/* Employee list would be populated here from contract events or backend API */}
            </div>
        </div>
    );
}

export default Employees;
