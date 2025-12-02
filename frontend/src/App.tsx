import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Payroll from './pages/Payroll';
import History from './pages/History';
import Navigation from './components/Navigation';

function App() {
    const { isConnected } = useAccount();

    return (
        <Router>
            <div className="app">
                <header className="header">
                    <div className="header-content">
                        <div className="logo">
                            <h1>💼 Crypto Payroll</h1>
                            <span className="subtitle">On-Chain Payment System</span>
                        </div>
                        <ConnectButton />
                    </div>
                </header>

                {isConnected ? (
                    <div className="main-layout">
                        <Navigation />
                        <main className="content">
                            <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/employees" element={<Employees />} />
                                <Route path="/payroll" element={<Payroll />} />
                                <Route path="/history" element={<History />} />
                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                        </main>
                    </div>
                ) : (
                    <div className="welcome-screen">
                        <div className="welcome-content">
                            <h2>Welcome to Crypto Payroll</h2>
                            <p>Pay your employees in any cryptocurrency with real-time oracle pricing</p>
                            <div className="features">
                                <div className="feature">
                                    <span className="feature-icon">🌐</span>
                                    <h3>Multi-Token Support</h3>
                                    <p>BTC, ETH, SOL, XRP, QIE, and more</p>
                                </div>
                                <div className="feature">
                                    <span className="feature-icon">📊</span>
                                    <h3>Real-Time Pricing</h3>
                                    <p>Powered by QIE Oracle Network</p>
                                </div>
                                <div className="feature">
                                    <span className="feature-icon">⚡</span>
                                    <h3>Instant Swaps</h3>
                                    <p>Automated DEX integration</p>
                                </div>
                            </div>
                            <p className="cta">Connect your wallet to get started</p>
                        </div>
                    </div>
                )}
            </div>
        </Router>
    );
}

export default App;
