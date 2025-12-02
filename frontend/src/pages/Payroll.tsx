import { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../config/wagmi';

function Payroll() {
    const [fundAmount, setFundAmount] = useState('');
    const [employeeAddress, setEmployeeAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [employees, setEmployees] = useState<Array<{ wallet: string; salaryUSD?: string }>>([]);
    const [contractBalance, setContractBalance] = useState<string | null>(null);

    useEffect(() => {
        fetchMetadata();
    }, []);

    const fetchMetadata = async () => {
        try {
            const [empRes, balRes] = await Promise.all([
                axios.get(`${BACKEND_URL}/api/employees`),
                axios.get(`${BACKEND_URL}/api/payroll/balance`),
            ]);

            if (empRes.data?.success) setEmployees(empRes.data.employees || []);
            if (balRes.data?.success) setContractBalance(balRes.data.balance || null);
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
            <h2>Payroll Management</h2>

            <div className="payroll-grid">
                <div className="payroll-card">
                    <h3>💵 Fund Payroll Contract</h3>
                    <p>Add USDT to the payroll contract for employee payments</p>

                    <form onSubmit={handleFund}>
                        <div className="form-group">
                            <label htmlFor="fundAmount">Amount (USDT)</label>
                            <input
                                id="fundAmount"
                                type="number"
                                placeholder="10000"
                                step="0.01"
                                value={fundAmount}
                                onChange={(e) => setFundAmount(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Processing...' : 'Fund Contract'}
                        </button>
                    </form>
                </div>

                <div className="payroll-card">
                    <h3>💰 Pay Single Employee</h3>
                    <p>Execute payment for a specific employee</p>

                    <form onSubmit={handlePayEmployee}>
                        <div className="form-group">
                            <label htmlFor="employeeAddress">Employee Address</label>
                            <input
                                id="employeeAddress"
                                type="text"
                                placeholder="0x..."
                                value={employeeAddress}
                                onChange={(e) => setEmployeeAddress(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Processing...' : 'Pay Employee'}
                        </button>
                    </form>
                </div>

                <div className="payroll-card highlight">
                    <h3>⚡ Execute Batch Payroll</h3>
                    <p>Pay all registered employees in a single transaction</p>

                    <div className="batch-info">
                        <p><strong>Employees:</strong> 0 registered</p>
                        <p><strong>Estimated Cost:</strong> Check contract balance</p>
                    </div>

                    <button
                        className="submit-btn primary"
                        onClick={handlePayAll}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : '🚀 Execute Payroll'}
                    </button>
                </div>
            </div>

            {message && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}
        </div>
    );
}

export default Payroll;
