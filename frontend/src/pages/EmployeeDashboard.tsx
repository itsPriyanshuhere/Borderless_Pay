import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import axios from 'axios';
import { BACKEND_URL } from '../config/wagmi';
import IncomeChart from '../components/Dashboard/IncomeChart';

interface DashboardStats {
    totalEarned: number;
    transactionCount: number;
    chartData: { name: string; value: number }[];
}

const EmployeeDashboard = () => {
    const { address } = useAccount();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (address) {
            fetchStats();
        }
    }, [address]);

    const fetchStats = async () => {
        try {
            const res = await axios.get(`${BACKEND_URL}/api/history/stats/${address}`);
            if (res.data?.success) {
                setStats(res.data.stats);
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading dashboard...</div>;

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h2>Employee Dashboard</h2>
                <p className="text-muted">Overview of your earnings and activity</p>
            </div>

            <div className="stats-grid">
                <div className="glass-card stat-card">
                    <span className="label">Total Earned</span>
                    <span className="value">{stats?.totalEarned.toFixed(4) || '0.00'} QIE</span>
                </div>
                <div className="glass-card stat-card">
                    <span className="label">Total Transactions</span>
                    <span className="value">{stats?.transactionCount || 0}</span>
                </div>
            </div>

            <div className="glass-card chart-section">
                <h3>Income Over Time</h3>
                <div className="chart-container">
                    {stats?.chartData && <IncomeChart data={stats.chartData} />}
                </div>
            </div>

            <style>{`
                .dashboard-page {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 1.5rem;
                }
                .stat-card {
                    padding: 2rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    align-items: center;
                    text-align: center;
                }
                .stat-card .label {
                    color: var(--text-muted);
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .stat-card .value {
                    font-size: 2rem;
                    font-weight: 700;
                    color: var(--neon-green);
                }
                .chart-section {
                    padding: 2rem;
                }
                .chart-section h3 {
                    margin-bottom: 2rem;
                    color: white;
                }
                .loading {
                    text-align: center;
                    padding: 4rem;
                    color: var(--text-muted);
                }
            `}</style>
        </div>
    );
};

export default EmployeeDashboard;
