import { Link, useLocation } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { OWNER_ADDRESS } from '../config/wagmi';

const Sidebar = () => {
    const location = useLocation();
    const { address } = useAccount();

    const isOwner = address && OWNER_ADDRESS && address.toLowerCase() === OWNER_ADDRESS.toLowerCase();

    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { path: '/dashboard', icon: '📊', label: 'Dashboard' },
        { path: '/invoices', icon: '🧾', label: 'Invoices' },
        ...(isOwner ? [
            { path: '/employees', icon: '👥', label: 'Employees' },
            { path: '/payroll', icon: '💰', label: 'Run Payroll' },
            { path: '/history', icon: '📜', label: 'History' },
        ] : []),
        ...(!isOwner ? [
            { path: '/employee-dashboard', icon: '📈', label: 'My Stats' },
        ] : []),
    ];

    return (
        <aside className="sidebar glass-card">
            <div className="sidebar-logo">
                <div className="logo-icon">Q</div>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-label">{item.label}</span>
                        {isActive(item.path) && <div className="active-glow" />}
                    </Link>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="status-indicator">
                    <span className="status-dot"></span>
                    <span className="status-text">QIE Network Active</span>
                </div>
            </div>

            <style>{`
                .sidebar {
                    position: fixed;
                    left: 1rem;
                    top: 1rem;
                    bottom: 1rem;
                    width: 240px;
                    display: flex;
                    flex-direction: column;
                    padding: 2rem 1rem;
                    z-index: 100;
                    border-radius: 20px;
                }

                .sidebar-logo {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 3rem;
                }

                .logo-icon {
                    width: 50px;
                    height: 50px;
                    background: var(--gradient-main);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: white;
                    box-shadow: 0 0 20px rgba(45, 106, 255, 0.4);
                }

                .sidebar-nav {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    flex: 1;
                }

                .nav-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    color: var(--text-secondary);
                    text-decoration: none;
                    border-radius: 12px;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }

                .nav-item:hover {
                    color: var(--text-primary);
                    background: rgba(255, 255, 255, 0.03);
                }

                .nav-item.active {
                    color: white;
                    background: rgba(45, 106, 255, 0.1);
                    border: 1px solid rgba(45, 106, 255, 0.2);
                }

                .nav-icon {
                    font-size: 1.25rem;
                }

                .nav-label {
                    font-weight: 500;
                    font-size: 0.95rem;
                }

                .active-glow {
                    position: absolute;
                    left: 0;
                    top: 0;
                    bottom: 0;
                    width: 3px;
                    background: var(--neon-cyan);
                    box-shadow: 0 0 10px var(--neon-cyan);
                }

                .sidebar-footer {
                    margin-top: auto;
                    padding-top: 1rem;
                    border-top: 1px solid var(--border-glass);
                }

                .status-indicator {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.8rem;
                    color: var(--text-muted);
                    padding: 0.5rem;
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 8px;
                }

                .status-dot {
                    width: 8px;
                    height: 8px;
                    background: var(--neon-green);
                    border-radius: 50%;
                    box-shadow: 0 0 5px var(--neon-green);
                    animation: pulse 2s infinite;
                }

                @media (max-width: 768px) {
                    .sidebar {
                        left: 0;
                        right: 0;
                        top: auto;
                        bottom: 0;
                        width: 100%;
                        height: 70px;
                        flex-direction: row;
                        padding: 0.5rem;
                        border-radius: 20px 20px 0 0;
                        justify-content: space-around;
                        align-items: center;
                    }

                    .sidebar-logo, .sidebar-footer, .nav-label {
                        display: none;
                    }

                    .nav-item {
                        padding: 0.5rem;
                        flex-direction: column;
                        gap: 0.25rem;
                    }

                    .active-glow {
                        width: 100%;
                        height: 3px;
                        top: auto;
                        bottom: 0;
                    }
                }
            `}</style>
        </aside>
    );
};

export default Sidebar;
