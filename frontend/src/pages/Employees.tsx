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
    const [editingEmployee, setEditingEmployee] = useState<{ wallet: string; salary: string } | null>(null);
    const [deletingEmployee, setDeletingEmployee] = useState<string | null>(null);

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

    const handleUpdateEmployee = async (wallet: string, newSalary: string) => {
        if (!newSalary || parseFloat(newSalary) <= 0) {
            setMessage({ type: 'error', text: 'Invalid salary amount' });
            return;
        }

        try {
            setLoading(true);
            setMessage(null);
            const res = await axios.put(`${BACKEND_URL}/api/employees/${wallet}`, {
                salary: newSalary
            });

            if (res.data.success) {
                setMessage({ type: 'success', text: `Salary updated! Tx: ${res.data.txHash}` });
                setEditingEmployee(null);
                await fetchEmployees();
            } else {
                setMessage({ type: 'error', text: res.data.error || 'Failed to update salary' });
            }
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.response?.data?.error || error.message || 'Failed to update salary'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEmployee = async (wallet: string) => {
        if (!window.confirm(`Are you sure you want to remove this employee?\n${wallet}`)) {
            return;
        }

        try {
            setLoading(true);
            setDeletingEmployee(wallet);
            setMessage(null);
            const res = await axios.delete(`${BACKEND_URL}/api/employees/${wallet}`);

            if (res.data.success) {
                setMessage({ type: 'success', text: `Employee removed! Tx: ${res.data.txHash}` });
                await fetchEmployees();
            } else {
                setMessage({ type: 'error', text: res.data.error || 'Failed to remove employee' });
            }
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.response?.data?.error || error.message || 'Failed to remove employee'
            });
        } finally {
            setLoading(false);
            setDeletingEmployee(null);
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
                        <div className="form-group" style={{ marginTop: '1rem' }}>
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

                        <div className="form-group" style={{ marginTop: '1rem' }}>
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

                        <button type="submit" className="btn-primary full-width" disabled={loading} style={{ marginTop: '1rem' }}>
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
                                        <th>Salary (Tokens)</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employees.map((emp) => (
                                        <tr key={emp.wallet}>
                                            <td className="font-mono">{emp.wallet.slice(0, 6)}...{emp.wallet.slice(-4)}</td>
                                            <td className="text-glow">
                                                {editingEmployee?.wallet === emp.wallet ? (
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0.01"
                                                        value={editingEmployee.salary}
                                                        onChange={(e) => setEditingEmployee({ ...editingEmployee, salary: e.target.value })}
                                                        className="salary-input"
                                                        disabled={loading}
                                                    />
                                                ) : (
                                                    parseFloat(emp.salaryUSD || '0').toLocaleString()
                                                )}
                                            </td>
                                            <td><span className="status-badge active">Active</span></td>
                                            <td>
                                                <div className="action-buttons">
                                                    {editingEmployee?.wallet === emp.wallet ? (
                                                        <>
                                                            <button
                                                                className="btn-action btn-save"
                                                                onClick={() => handleUpdateEmployee(emp.wallet, editingEmployee.salary)}
                                                                disabled={loading}
                                                            >
                                                                ✓
                                                            </button>
                                                            <button
                                                                className="btn-action btn-cancel"
                                                                onClick={() => setEditingEmployee(null)}
                                                                disabled={loading}
                                                            >
                                                                ✕
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                className="btn-action btn-edit"
                                                                onClick={() => setEditingEmployee({ wallet: emp.wallet, salary: emp.salaryUSD })}
                                                                disabled={loading || deletingEmployee === emp.wallet}
                                                            >
                                                                ✎
                                                            </button>
                                                            <button
                                                                className="btn-action btn-delete"
                                                                onClick={() => handleDeleteEmployee(emp.wallet)}
                                                                disabled={loading || deletingEmployee === emp.wallet}
                                                            >
                                                                {deletingEmployee === emp.wallet ? '...' : '🗑'}
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
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

                .action-buttons {
                    display: flex;
                    gap: 0.5rem;
                    justify-content: flex-start;
                }

                .btn-action {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 6px;
                    padding: 0.4rem 0.75rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 1rem;
                    min-width: 36px;
                }

                .btn-action:hover:not(:disabled) {
                    background: rgba(255, 255, 255, 0.1);
                    transform: translateY(-2px);
                }

                .btn-action:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .btn-edit {
                    color: var(--neon-blue);
                    border-color: var(--neon-blue);
                }

                .btn-edit:hover:not(:disabled) {
                    background: rgba(45, 106, 255, 0.2);
                    box-shadow: 0 0 10px rgba(45, 106, 255, 0.3);
                }

                .btn-delete {
                    color: #ff4757;
                    border-color: #ff4757;
                }

                .btn-delete:hover:not(:disabled) {
                    background: rgba(255, 71, 87, 0.2);
                    box-shadow: 0 0 10px rgba(255, 71, 87, 0.3);
                }

                .btn-save {
                    color: var(--neon-green);
                    border-color: var(--neon-green);
                }

                .btn-save:hover:not(:disabled) {
                    background: rgba(10, 255, 96, 0.2);
                    box-shadow: 0 0 10px rgba(10, 255, 96, 0.3);
                }

                .btn-cancel {
                    color: #ffa502;
                    border-color: #ffa502;
                }

                .btn-cancel:hover:not(:disabled) {
                    background: rgba(255, 165, 2, 0.2);
                    box-shadow: 0 0 10px rgba(255, 165, 2, 0.3);
                }

                .salary-input {
                    background: rgba(45, 106, 255, 0.1);
                    border: 1px solid var(--neon-blue);
                    border-radius: 6px;
                    padding: 0.5rem;
                    color: var(--text-primary);
                    font-size: 0.95rem;
                    width: 120px;
                    transition: all 0.3s ease;
                }

                .salary-input:focus {
                    outline: none;
                    box-shadow: 0 0 10px rgba(45, 106, 255, 0.4);
                    background: rgba(45, 106, 255, 0.15);
                }

                .salary-input:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
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
