import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import axios from 'axios';
import { BACKEND_URL } from '../config/wagmi';
import IncomeChart from '../components/Dashboard/IncomeChart';
import OwnerChart from '../components/Dashboard/OwnerChart';
import { useIsOwner } from '../hooks/isOwner';

interface DashboardStats {
    totalEarned: number;
    transactionCount: number;
    chartData: { name: string; value: number }[];
}

const EmployeeDashboard = () => {
    const { address } = useAccount();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [ownerChartData, setOwnerChartData] = useState<any[] | null>(null);
    const isOwner = useIsOwner();

    useEffect(() => {
       
        if (isOwner) {
            fetchStatsForOwner();
        } else if (address) {
            fetchStats();
        }
    }, [address, isOwner]);

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

    const fetchStatsForOwner = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${BACKEND_URL}/api/history/stats`);
            if (res.data?.success) {
                const s = res.data.stats;
                if (s?.spending && s?.buying) {
                    const merged: any[] = [];
                    const len = Math.max(s.spending.length, s.buying.length);
                    for (let i = 0; i < len; i++) {
                        const sp = s.spending[i] || { name: `T${i+1}`, value: 0 };
                        const by = s.buying[i] || { name: sp.name || `T${i+1}`, value: 0 };
                        merged.push({ name: sp.name || by.name, spending: sp.value || 0, buying: by.value || 0 });
                    }
                    setStats({
                        totalEarned: s.totalEarned || 0,
                        transactionCount: s.transactionCount || 0,
                        chartData: merged.map((m: any) => ({ name: m.name, value: m.spending }))
                    });
                    setOwnerChartData(merged);
                } else if (s?.chartData) {
                    setStats(s);
                    setOwnerChartData(s.chartData.map((d: any) => ({ name: d.name, spending: d.value, buying: d.value })));
                } else {
                    setStats(s);
                }
            }
        } catch (error) {
            console.error('Failed to fetch owner stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading dashboard...</div>;

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h2>{isOwner ? 'Dashboard' : 'Employee Dashboard'}</h2>
                <p className="text-muted">{isOwner ? 'Overview of company spending and buying' : 'Overview of your earnings and activity'}</p>
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
                <h3>{isOwner ? 'Spending & Buying Over Time' : 'Income Over Time'}</h3>
                <div className="chart-container">
                    {isOwner ? (
                        ownerChartData && <OwnerChart data={ownerChartData} />
                    ) : (
                        stats?.chartData && <IncomeChart data={stats.chartData} />
                    )}
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
