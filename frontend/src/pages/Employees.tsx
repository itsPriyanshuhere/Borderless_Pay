import { useState, useEffect } from 'react';
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
        salaryUSD: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [employees, setEmployees] = useState<Array<{ wallet: string; salaryUSD: string; exists?: boolean }>>([]);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await axios.get(`${BACKEND_URL}/api/employees`);
            if (res.data.success) setEmployees(res.data.employees || []);
        } catch (err) {
            console.warn('Failed to fetch employees list', err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        // Basic address validation (simple check)
        const addr = formData.wallet?.trim();
        const isAddress = /^0x[a-fA-F0-9]{40}$/.test(addr);
        if (!isAddress) {
            setMessage({ type: 'error', text: 'Invalid wallet address format' });
            setLoading(false);
            return;
        }

        try {
            // Backend expects `wallet` and `salary` (salary as string).
            const payload = {
                wallet: addr,
                salary: formData.salaryUSD,
            } as Record<string, any>;
            const res = await axios.post(`${BACKEND_URL}/api/employees`, payload);

            if (res.data.success) {
                setMessage({ type: 'success', text: `Employee added! Tx: ${res.data.txHash}` });
                setFormData({ wallet: '', salaryUSD: '' });
                await fetchEmployees();
            } else {
                setMessage({ type: 'error', text: res.data.error || 'Failed to add employee' });
            }
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.response?.data?.error || error.message || 'Failed to add employee'
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
                {employees.length === 0 ? (
                    <p className="info">No employees registered yet.</p>
                ) : (
                    <table className="employee-table">
                        <thead>
                            <tr>
                                <th>Wallet</th>
                                <th>Salary (USD)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((emp) => (
                                <tr key={emp.wallet}>
                                    <td>{emp.wallet}</td>
                                    <td>{parseFloat(emp.salaryUSD || '0').toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default Employees;
