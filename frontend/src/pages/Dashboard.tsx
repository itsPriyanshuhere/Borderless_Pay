import { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../config/wagmi';
import { useWallet } from '../hooks/useWallet';
import { getPrice } from '../services/pricing.service';
import { TransferForm } from '../components/TransferForm';
import { getNetwork, getBackendChainName } from '../config/networks';

function Dashboard() {
    const { isConnected, address, chainId } = useWallet();
    const [balance, setBalance] = useState<string>('0');
    const [prices, setPrices] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [networkSymbol, setNetworkSymbol] = useState('ETH');

    useEffect(() => {
        if (isConnected && chainId) {
            const network = getNetwork(chainId);
            setNetworkSymbol(network?.nativeCurrency.symbol || 'ETH');
            fetchDashboardData();
        }
    }, [isConnected, chainId, address]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            if (address && chainId) {
                const chainName = getBackendChainName(chainId);
                try {
                    const balanceRes = await axios.get(`${BACKEND_URL}/api/transfer/balance/${address}/${chainName}`);
                    if (balanceRes.data?.success) {
                        setBalance(balanceRes.data.balance || '0');
                    }
                } catch (err) {
                    console.error('Failed to fetch balance:', err);
                }
            }

            const symbols = ['QIE', 'ETH', 'BTC', 'USDT'];
            const newPrices: Record<string, string> = {};

            await Promise.all(symbols.map(async (symbol) => {
                const price = await getPrice(symbol);
                if (price !== null) {
                    newPrices[symbol] = price.toString();
                } else {
                    newPrices[symbol] = 'N/A';
                }
            }));

            setPrices(newPrices);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !balance) {
        return <div className="loading">Loading dashboard...</div>;
    }

    return (
        <div className="dashboard-container">
            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="glass-card stat-card primary-glow">
                    <div className="stat-icon">💰</div>
                    <div className="stat-content">
                        <h3>Total Balance</h3>
                        <p className="stat-value text-gradient">{parseFloat(balance).toLocaleString()} {networkSymbol}</p>
                        <span className="stat-label">Available for Payroll</span>
                    </div>
                </div>

                <div className="glass-card stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                        <h3>Active Employees</h3>
                        <p className="stat-value">12</p>
                        <span className="stat-label">Total Registered</span>
                    </div>
                </div>

                <div className="glass-card stat-card">
                    <div className="stat-icon">📅</div>
                    <div className="stat-content">
                        <h3>Next Payroll</h3>
                        <p className="stat-value">Dec 1st</p>
                        <span className="stat-label">Scheduled</span>
                    </div>
                </div>
            </div>

            <div className="main-content-grid">
                {/* Oracle Prices */}
                <div className="glass-card price-section">
                    <div className="section-header">
                        <h3>Live Oracle Prices</h3>
                        <div className="live-indicator">
                            <span className="dot"></span> Live
                        </div>
                    </div>
                    <div className="price-grid">
                        {Object.entries(prices).map(([symbol, price]) => (
                            <div key={symbol} className="price-item">
                                <span className="token-symbol">{symbol}</span>
                                <span className="token-price text-glow">
                                    {price !== 'N/A' ? `$${parseFloat(price).toLocaleString()}` : 'N/A'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="glass-card actions-section">
                    <h3>Quick Actions</h3>
                    <div className="action-buttons">
                        <button className="btn-secondary" onClick={() => window.location.href = '/employees'}>
                            ➕ Add Employee
                        </button>
                        <button className="btn-primary" onClick={() => window.location.href = '/payroll'}>
                            ⚡ Execute Payroll
                        </button>
                    </div>
                </div>
            </div>

            {/* Transfer Form Section */}
            <div className="glass-card transfer-section" style={{ marginTop: '2rem' }}>
                <h3>Direct Transfer</h3>
                <TransferForm />
            </div>

            <style>{`
                .dashboard-container {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 1.5rem;
                }

                .stat-card {
                    padding: 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }

                .primary-glow {
                    border: 1px solid var(--neon-blue);
                    box-shadow: 0 0 20px rgba(45, 106, 255, 0.15);
                }

                .stat-icon {
                    font-size: 2.5rem;
                    background: rgba(255, 255, 255, 0.05);
                    padding: 1rem;
                    border-radius: 12px;
                }

                .stat-value {
                    font-size: 2rem;
                    font-weight: 700;
                    margin: 0.25rem 0;
                }

                .stat-label {
                    color: var(--text-muted);
                    font-size: 0.85rem;
                }

                .main-content-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 1.5rem;
                }

                .price-section, .actions-section {
                    padding: 1.5rem;
                }

                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }

                .live-indicator {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--neon-green);
                    font-size: 0.8rem;
                    font-weight: 600;
                    text-transform: uppercase;
                }

                .dot {
                    width: 8px;
                    height: 8px;
                    background: var(--neon-green);
                    border-radius: 50%;
                    box-shadow: 0 0 5px var(--neon-green);
                    animation: pulse 1s infinite;
                }

                .price-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                    gap: 1rem;
                }

                .price-item {
                    background: rgba(255, 255, 255, 0.03);
                    padding: 1rem;
                    border-radius: 12px;
                    text-align: center;
                    border: 1px solid transparent;
                    transition: all 0.3s ease;
                }

                .price-item:hover {
                    border-color: var(--neon-cyan);
                    background: rgba(0, 243, 255, 0.05);
                }

                .token-symbol {
                    display: block;
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                    margin-bottom: 0.5rem;
                }

                .token-price {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: white;
                }

                .action-buttons {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .transfer-section {
                    padding: 2rem;
                }

                @media (max-width: 1024px) {
                    .main-content-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
}

export default Dashboard;
