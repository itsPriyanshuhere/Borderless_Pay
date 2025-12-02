import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Navigate } from 'react-router-dom';

const Landing = () => {
    const { isConnected } = useAccount();

    if (isConnected) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="landing-page">
            {/* Navigation */}
            <nav className="landing-nav glass-card">
                <div className="container flex-center" style={{ justifyContent: 'space-between', padding: '1rem 0' }}>
                    <div className="logo">
                        <h1 className="text-gradient" style={{ fontSize: '1.5rem' }}>QIE Payroll</h1>
                    </div>
                    <div className="nav-actions">
                        <ConnectButton />
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="container" style={{ textAlign: 'center', paddingTop: '8rem', paddingBottom: '6rem' }}>
                    <div className="animate-float">
                        <span className="badge-glass">Powered by QIE Oracles</span>
                    </div>
                    <h1 className="hero-title text-gradient">
                        On-chain Payroll.<br />
                        Automated. Trustless.
                    </h1>
                    <p className="hero-subtitle">
                        The future of decentralized workforce payments. Pay your team in any token with real-time Oracle pricing and automated liquidity.
                    </p>
                    <div className="hero-actions flex-center" style={{ gap: '1.5rem', marginTop: '2.5rem' }}>
                        <ConnectButton.Custom>
                            {({ openConnectModal }) => (
                                <button onClick={openConnectModal} className="btn-primary">
                                    Launch App
                                </button>
                            )}
                        </ConnectButton.Custom>
                        <button className="btn-secondary" onClick={() => window.location.href = '/docs'}>
                            Read Docs
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section" style={{ padding: '4rem 0' }}>
                <div className="container">
                    <div className="grid-cols-3">
                        <div className="glass-card feature-card">
                            <div className="icon-glow">💎</div>
                            <h3>Multi-Token Payroll</h3>
                            <p>Pay in USDT, ETH, or QIE. Employees receive their preferred token automatically via DEX integration.</p>
                        </div>
                        <div className="glass-card feature-card">
                            <div className="icon-glow">⚡</div>
                            <h3>Real-Time Oracles</h3>
                            <p>Powered by QIE Oracle Network for precise, tamper-proof exchange rates at the moment of payment.</p>
                        </div>
                        <div className="glass-card feature-card">
                            <div className="icon-glow">🛡️</div>
                            <h3>Trustless Security</h3>
                            <p>Non-custodial smart contracts ensure funds are safe. No middleman, just code.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="how-it-works" style={{ padding: '6rem 0' }}>
                <div className="container">
                    <h2 className="text-center text-gradient" style={{ marginBottom: '3rem', fontSize: '2.5rem', textAlign: 'center' }}>How It Works</h2>
                    <div className="timeline">
                        <div className="timeline-item glass-card">
                            <span className="step-number">01</span>
                            <h4>Connect Wallet</h4>
                            <p>Manager connects their wallet and funds the payroll smart contract.</p>
                        </div>
                        <div className="timeline-item glass-card">
                            <span className="step-number">02</span>
                            <h4>Add Employees</h4>
                            <p>Register employees with their wallet addresses and salary amounts in USD.</p>
                        </div>
                        <div className="timeline-item glass-card">
                            <span className="step-number">03</span>
                            <h4>One-Click Pay</h4>
                            <p>Execute payroll. Smart contracts handle conversions and transfers instantly.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer" style={{ borderTop: '1px solid var(--border-glass)', padding: '3rem 0', marginTop: '4rem' }}>
                <div className="container flex-center" style={{ flexDirection: 'column', gap: '1.5rem' }}>
                    <h3 className="text-gradient">QIE Payroll Protocol</h3>
                    <div className="footer-links flex-center" style={{ gap: '2rem' }}>
                        <a href="#" className="text-muted hover-glow">Documentation</a>
                        <a href="#" className="text-muted hover-glow">GitHub</a>
                        <a href="#" className="text-muted hover-glow">Twitter</a>
                    </div>
                    <p className="text-muted" style={{ fontSize: '0.9rem' }}>© 2024 QIE Payroll Protocol. All rights reserved.</p>
                </div>
            </footer>

            <style>{`
                .landing-nav {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 100;
                    border-radius: 0;
                    border-left: none;
                    border-right: none;
                    border-top: none;
                }
                
                .badge-glass {
                    background: rgba(0, 243, 255, 0.1);
                    border: 1px solid var(--neon-cyan);
                    color: var(--neon-cyan);
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    box-shadow: 0 0 10px rgba(0, 243, 255, 0.2);
                }

                .hero-title {
                    font-size: 4.5rem;
                    line-height: 1.1;
                    margin: 2rem 0 1.5rem;
                }

                .hero-subtitle {
                    font-size: 1.25rem;
                    color: var(--text-secondary);
                    max-width: 600px;
                    margin: 0 auto;
                }

                .feature-card {
                    padding: 2rem;
                    text-align: center;
                }

                .icon-glow {
                    font-size: 3rem;
                    margin-bottom: 1.5rem;
                    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
                }

                .timeline {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 2rem;
                }

                .timeline-item {
                    padding: 2rem;
                    position: relative;
                }

                .step-number {
                    font-size: 4rem;
                    font-weight: 700;
                    color: rgba(255, 255, 255, 0.05);
                    position: absolute;
                    top: 1rem;
                    right: 1.5rem;
                }

                .hover-glow:hover {
                    color: var(--neon-cyan);
                    text-shadow: 0 0 10px var(--neon-cyan);
                }

                @media (max-width: 768px) {
                    .hero-title {
                        font-size: 3rem;
                    }
                    .grid-cols-3, .timeline {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default Landing;
