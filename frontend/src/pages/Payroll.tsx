import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import axios from 'axios';
import { BACKEND_URL, OWNER_ADDRESS } from '../config/wagmi';

function Payroll() {
    const { address } = useAccount();
    const navigate = useNavigate();
    const [fundAmount, setFundAmount] = useState('');
    const [employeeAddress, setEmployeeAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [employees, setEmployees] = useState<Array<{ wallet: string; salaryUSD?: string }>>([]);
    const [contractBalance, setContractBalance] = useState<string>('0');
    const [totalRequired, setTotalRequired] = useState<number>(0);

    useEffect(() => {
        if (address && OWNER_ADDRESS && address.toLowerCase() !== OWNER_ADDRESS.toLowerCase()) {
            navigate('/dashboard');
            return;
        }
        fetchMetadata();
    }, [address, navigate]);

    const fetchMetadata = async () => {
        try {
            const [empRes, balRes] = await Promise.all([
                axios.get(`${BACKEND_URL}/api/employees`),
                axios.get(`${BACKEND_URL}/api/payroll/balance`),
            ]);

            if (empRes.data?.success) {
                const emps = empRes.data.employees || [];
                setEmployees(emps);

                // Calculate total required (salaryUSD is actually native token amount)
                const total = emps.reduce((acc: number, emp: any) => acc + parseFloat(emp.salaryUSD || '0'), 0);
                setTotalRequired(total);
            }

            if (balRes.data?.success) {
                setContractBalance(balRes.data.balance);
            }

        } catch (err) {
            console.warn('Failed to fetch payroll metadata', err);
        }
    };

    const handleFund = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const res = await axios.post(`${BACKEND_URL}/api/payroll/fund`, { amount: fundAmount });

            if (res.data.success) {
                setMessage({ type: 'success', text: `Funded! Tx: ${res.data.txHash}` });
                setFundAmount('');
                await fetchMetadata();
            }
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.response?.data?.error || 'Failed to fund payroll'
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePayEmployee = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const res = await axios.post(`${BACKEND_URL}/api/payroll/execute/${employeeAddress}`);

            if (res.data.success) {
                setMessage({ type: 'success', text: `Employee paid! Tx: ${res.data.txHash}` });
                setEmployeeAddress('');
                await fetchMetadata();
            }
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.response?.data?.error || 'Failed to pay employee'
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePayAll = async () => {
        setLoading(true);
        setMessage(null);

        try {
            const employeeAddresses: string[] = employees.map(e => e.wallet);

            if (employeeAddresses.length === 0) {
                setMessage({ type: 'error', text: 'No employees to pay' });
                setLoading(false);
                return;
            }

            const res = await axios.post(`${BACKEND_URL}/api/payroll/execute`, { employeeAddresses });

            if (res.data.success) {
                setMessage({
                    type: 'success',
                    text: `Batch payment successful! ${res.data.employeeCount} employees paid. Tx: ${res.data.txHash}`
                });
                await fetchMetadata();
            }
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.response?.data?.error || 'Failed to execute batch payment'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="payroll-page">
            <div className="page-header">
                <h2>Run Payroll</h2>
                <p className="text-muted">Manage funds and execute payments</p>
            </div>

            <div className="payroll-grid">
                {/* Fund Contract */}
                <div className="glass-card payroll-card">
                    <div className="card-header">
                        <h3>Fund Contract</h3>
                    </div>
                    <p className="card-desc">Add USDT liquidity to the payroll smart contract.</p>

                    <form onSubmit={handleFund}>
                        <div className="form-group">
                            <label>Amount (In Tokens)</label>
                            <input
                                type="number"
                                placeholder="10000"
                                step="0.01"
                                value={fundAmount}
                                onChange={(e) => setFundAmount(e.target.value)}
                                required
                                className="glass-input"
                            />
                        </div>
                        <button type="submit" className="btn-secondary full-width" disabled={loading} style={{marginTop: '0.5rem'}}>
                            {loading ? 'Processing...' : 'Fund Contract'}
                        </button>
                    </form>
                </div>

                {/* Pay Single */}
                <div className="glass-card payroll-card">
                    <div className="card-header">
                        <h3>Single Payment</h3>
                    </div>
                    <p className="card-desc">Manually trigger payment for one employee.</p>

                    <form onSubmit={handlePayEmployee}>
                        <div className="form-group">
                            <label>Employee Address</label>
                            <input
                                type="text"
                                placeholder="0x..."
                                value={employeeAddress}
                                onChange={(e) => setEmployeeAddress(e.target.value)}
                                required
                                className="glass-input"
                            />
                        </div>
                        <button type="submit" className="btn-secondary full-width" disabled={loading} style={{marginTop: '0.5rem'}}>
                            {loading ? 'Processing...' : 'Pay Employee'}
                        </button>
                    </form>
                </div>

                {/* Batch Pay */}
                <div className="glass-card payroll-card highlight-card">
                    <div className="card-header">
                        <h3>Execute Batch</h3>
                    </div>
                    <p className="card-desc">Pay all {employees.length} registered employees in one transaction.</p>

                    <div className="batch-stats">
                        <div className="stat">
                            <span className="label">Employees</span>
                            <span className="value">{employees.length}</span>
                        </div>
                        <div className="stat">
                            <span className="label">Est. Gas</span>
                            <span className="value">Low</span>
                        </div>
                    </div>

                    {parseFloat(contractBalance) < totalRequired && (
                        <div className="warning-box">
                            ⚠️ Insufficient Funds: Need {totalRequired.toFixed(4)} QIE (Have {parseFloat(contractBalance).toFixed(4)})
                        </div>
                    )}

                    <button
                        className="btn-primary full-width glow-btn"
                        onClick={handlePayAll}
                        disabled={loading || employees.length === 0 || parseFloat(contractBalance) < totalRequired}
                    >
                        {parseFloat(contractBalance) < totalRequired ? 'Insufficient Funds' : (loading ? 'Processing...' : '⚡ Execute All Payments')}
                    </button>
                </div>
            </div>

            {message && (
                <div className={`message-banner ${message.type}`}>
                    {message.text}
                </div>
            )}

            <style>{`
                .payroll-page {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }

                .payroll-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 2rem;
                }

                .payroll-card {
                    padding: 2rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    height: 100%;
                }

                .card-header {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .icon-wrapper {
                    width: 40px;
                    height: 40px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.25rem;
                }

                .icon-wrapper.primary {
                    background: rgba(45, 106, 255, 0.1);
                    color: var(--neon-blue);
                }

                .card-desc {
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                    flex: 1;
                }

                .highlight-card {
                    border: 1px solid var(--neon-blue);
                    box-shadow: 0 0 20px rgba(45, 106, 255, 0.1);
                }

                .batch-stats {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 0.5rem;
                    background: rgba(0, 0, 0, 0.2);
                    padding: 1rem;
                    border-radius: 8px;
                }

                .stat {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .stat .label {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    text-transform: uppercase;
                }

                .stat .value {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: white;
                }

                .glow-btn {
                    box-shadow: 0 0 20px rgba(45, 106, 255, 0.4);
                }

                .message-banner {
                    padding: 1rem;
                    border-radius: 8px;
                    text-align: center;
                    font-weight: 500;
                }

                .message-banner.success {
                    background: rgba(10, 255, 96, 0.1);
                    border: 1px solid var(--neon-green);
                    color: var(--neon-green);
                }

                .message-banner.error {
                    background: rgba(255, 50, 50, 0.1);
                    border: 1px solid #ff3232;
                    color: #ff3232;
                }

                .warning-box {
                    background: rgba(255, 165, 0, 0.1);
                    border: 1px solid orange;
                    color: orange;
                    padding: 0.75rem;
                    border-radius: 8px;
                    font-size: 0.9rem;
                    margin-bottom: 1rem;
                    text-align: center;
                }
            `}</style>
        </div>
    );
}

export default Payroll;
