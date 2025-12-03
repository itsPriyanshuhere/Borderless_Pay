import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import axios from 'axios';
import { BACKEND_URL, OWNER_ADDRESS } from '../config/wagmi';

function Employees() {
    const { address } = useAccount();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        wallet: '',
        salaryUSD: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [employees, setEmployees] = useState<Array<{ wallet: string; salaryUSD: string; exists?: boolean }>>([]);

    useEffect(() => {
        if (address && OWNER_ADDRESS && address.toLowerCase() !== OWNER_ADDRESS.toLowerCase()) {
            navigate('/dashboard');
            return;
        }
        fetchEmployees();
    }, [address, navigate]);

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
        const addr = formData.wallet?.trim();
        const isAddress = /^0x[a-fA-F0-9]{40}$/.test(addr);
        if (!isAddress) {
            setMessage({ type: 'error', text: 'Invalid wallet address format' });
            setLoading(false);
            return;
        }

        try {
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
            <div className="page-header">
                <h2>Employee Management</h2>
                <p className="text-muted">Manage your team and their salaries</p>
            </div>

            <div className="employees-grid">
                {/* Add Employee Form */}
                <div className="glass-card form-section">
                    <h3>Add New Employee</h3>
                    <form onSubmit={handleSubmit} className="employee-form">
                        <div className="form-group" style={{marginTop: '1rem'}}>
                            <label htmlFor="wallet">Wallet Address</label>
                            <input
                                id="wallet"
                                type="text"
                                placeholder="0x..."
                                value={formData.wallet}
                                onChange={(e) => setFormData({ ...formData, wallet: e.target.value })}
                                required
                                className="glass-input"
                            />
                        </div>

                        <div className="form-group" style={{marginTop: '1rem'}}>
                            <label htmlFor="salaryUSD">Monthly Salary (In Token)</label>
                            <input
                                id="salaryUSD"
                                type="number"
                                placeholder="1.5"
                                step="0.01"
                                min="0.01"
                                value={formData.salaryUSD}
                                onChange={(e) => setFormData({ ...formData, salaryUSD: e.target.value })}
                                required
                                className="glass-input"
                            />
                        </div>

                        {message && (
                            <div className={`message ${message.type}`}>
                                {message.text}
                            </div>
                        )}

                        <button type="submit" className="btn-primary full-width" disabled={loading} style={{marginTop: '1rem'}}>
                            {loading ? 'Adding...' : '➕ Add Employee'}
                        </button>
                    </form>
                </div>

                {/* Employee List */}
                <div className="glass-card list-section">
                    <div className="list-header">
                        <h3>Team Members</h3>
                        <span className="badge">{employees.length} Active</span>
                    </div>

                    {employees.length === 0 ? (
                        <div className="empty-state">
                            <h3>No Employees Yet</h3>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table className="glass-table">
                                <thead>
                                    <tr>
                                        <th>Wallet</th>
                                        <th>Salary (USD)</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employees.map((emp) => (
                                        <tr key={emp.wallet}>
                                            <td className="font-mono">{emp.wallet.slice(0, 6)}...{emp.wallet.slice(-4)}</td>
                                            <td className="text-glow">${parseFloat(emp.salaryUSD || '0').toLocaleString()}</td>
                                            <td><span className="status-badge active">Active</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .employees-page {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }

                .employees-grid {
                    display: grid;
                    grid-template-columns: 1fr 2fr;
                    gap: 2rem;
                }

                .form-section, .list-section {
                    padding: 2rem;
                }



                .list-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }

                .badge {
                    background: rgba(45, 106, 255, 0.1);
                    color: var(--neon-blue);
                    padding: 0.25rem 0.75rem;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    font-weight: 600;
                }

                .glass-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .glass-table th {
                    text-align: left;
                    padding: 1rem;
                    color: var(--text-muted);
                    font-weight: 500;
                    border-bottom: 1px solid var(--border-glass);
                }

                .glass-table td {
                    padding: 1rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.03);
                }

                .glass-table tr:hover td {
                    background: rgba(255, 255, 255, 0.02);
                }

                .font-mono {
                    font-family: 'Fira Code', monospace;
                    color: var(--text-secondary);
                }

                .status-badge {
                    padding: 0.25rem 0.75rem;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 600;
                }

                .status-badge.active {
                    background: rgba(10, 255, 96, 0.1);
                    color: var(--neon-green);
                }

                .empty-state {
                    text-align: center;
                    padding: 3rem;
                    color: var(--text-muted);
                }

                .empty-state .icon {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                    opacity: 0.5;
                }

                @media (max-width: 1024px) {
                    .employees-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
}

export default Employees;
