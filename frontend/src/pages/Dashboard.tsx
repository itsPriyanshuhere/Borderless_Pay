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
            // Fetch balance from backend for the current chain
            if (address && chainId) {
                const chainName = getBackendChainName(chainId);
                try {
                    // Backend URL should be a proper base url, ensure no extra spaces
                    const balanceRes = await axios.get(`${BACKEND_URL}/api/transfer/balance/${address}/${chainName}`);
                    if (balanceRes.data?.success) {
                        setBalance(balanceRes.data.balance || '0');
                    }
                } catch (err) {
                    console.error('Failed to fetch balance:', err);
                }
            }

            // Fetch live prices
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

    if (!isConnected) {
        return (
            <div className="dashboard-empty">
                <div className="empty-state">
                    <h2>Connect Wallet</h2>
                    <p>Please connect your wallet to view your dashboard and manage assets.</p>
                </div>
            </div>
        );
    }

    if (loading && !balance) {
        return <div className="loading">Loading dashboard...</div>;
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h2>Dashboard</h2>
                <span className="network-badge">
                    {getNetwork(chainId || 0)?.name || 'Unknown Network'}
                </span>
            </div>

            <div className="stats-grid">
                <div className="stat-card primary">
                    <div className="stat-icon">💰</div>
                    <div className="stat-content">
                        <h3>Your Balance</h3>
                        <p className="stat-value">{parseFloat(balance).toLocaleString()} {networkSymbol}</p>
                        <span className="stat-label">Native Token</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                        <h3>Active Employees</h3>
                        <p className="stat-value">-</p>
                        <span className="stat-label">Total registered</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">📅</div>
                    <div className="stat-content">
                        <h3>Next Payroll</h3>
                        <p className="stat-value">Scheduled</p>
                        <span className="stat-label">Monthly on 1st</span>
                    </div>
                </div>
            </div>

            <div className="main-grid">
                <div className="price-section">
                    <h3>Live Token Prices (USD)</h3>
                    <div className="price-grid">
                        {Object.entries(prices).map(([symbol, price]) => (
                            <div key={symbol} className="price-card">
                                <span className="token-symbol">{symbol}</span>
                                <span className="token-price">
                                    {price !== 'N/A' ? `$${parseFloat(price).toLocaleString()}` : 'N/A'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="transfer-section">
                    <TransferForm />
                </div>
            </div>

            <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="action-buttons">
                    <button className="action-btn" onClick={() => window.location.href = '/employees'}>
                        ➕ Add Employee
                    </button>
                    <button className="action-btn" onClick={() => window.location.href = '/payroll'}>
                        💰 Fund Payroll
                    </button>
                    <button className="action-btn primary" onClick={() => window.location.href = '/payroll'}>
                        ⚡ Execute Payroll
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
