import { NavLink } from 'react-router-dom';

function Navigation() {
    return (
        <nav className="sidebar">
            <ul className="nav-links">
                <li>
                    <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
                        <span className="icon">📊</span>
                        <span>Dashboard</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/employees" className={({ isActive }) => isActive ? 'active' : ''}>
                        <span className="icon">👥</span>
                        <span>Employees</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/payroll" className={({ isActive }) => isActive ? 'active' : ''}>
                        <span className="icon">💰</span>
                        <span>Payroll</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/history" className={({ isActive }) => isActive ? 'active' : ''}>
                        <span className="icon">📜</span>
                        <span>History</span>
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default Navigation;
