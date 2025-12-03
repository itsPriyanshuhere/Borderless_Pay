import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Payroll from './pages/Payroll';
import History from './pages/History';
import EmployeeDashboard from './pages/EmployeeDashboard';
import Invoices from './pages/Invoices';
import Sidebar from './components/Sidebar';
import { ConnectButton } from '@rainbow-me/rainbowkit';

function App() {
    const { isConnected } = useAccount();

    return (
        <Router>
            <div className="app">
                <Routes>
                    <Route path="/" element={<Landing />} />

                    {/* Protected Routes */}
                    <Route
                        path="/*"
                        element={
                            isConnected ? (
                                <div className="main-layout">
                                    <Sidebar />
                                    <div className="app-content">
                                        <header className="dashboard-header glass-card">
                                            <div className="header-title">
                                                <h2>QIE Payroll</h2>
                                                <span className="subtitle">Dashboard</span>
                                            </div>
                                            <ConnectButton />
                                        </header>
                                        <main className="content-area">
                                            <Routes>
                                                <Route path="/dashboard" element={<Dashboard />} />
                                                <Route path="/employees" element={<Employees />} />
                                                <Route path="/payroll" element={<Payroll />} />
                                                <Route path="/history" element={<History />} />
                                                <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
                                                <Route path="/invoices" element={<Invoices />} />
                                                <Route path="*" element={<Navigate to="/dashboard" replace />} />
                                            </Routes>
                                        </main>
                                    </div>
                                </div>
                            ) : (
                                <Navigate to="/" replace />
                            )
                        }
                    />
                </Routes>
            </div>
            <style>{`
                .app-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    min-height: 100vh;
                    margin-left: 260px; /* Sidebar width */
                }

                .dashboard-header {
                    position: sticky;
                    top: 1rem;
                    margin: 1rem 2rem;
                    padding: 1rem 2rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    z-index: 50;
                }

                .content-area {
                    padding: 0 2rem 2rem;
                }

                .header-title h2 {
                    font-size: 1.5rem;
                    margin: 0;
                    background: var(--gradient-main);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                @media (max-width: 768px) {
                    .app-content {
                        margin-left: 0;
                        padding-bottom: 80px; /* Bottom nav space */
                    }
                    .dashboard-header {
                        margin: 1rem;
                    }
                }
            `}</style>
        </Router>
    );
}

export default App;
