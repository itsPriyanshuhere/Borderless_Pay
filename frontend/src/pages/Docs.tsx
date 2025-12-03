import { useState } from 'react';

const Docs = () => {
    const [activeSection, setActiveSection] = useState('smart-contract');

    const sections = [
        { id: 'smart-contract', title: 'Smart Contract' },
        { id: 'oracle', title: 'Oracle Integration' },
        { id: 'dex', title: 'DEX Integration' },
        { id: 'api', title: 'API Reference' },
        { id: 'security', title: 'Security' },
    ];

    return (
        <div className="docs-page">
            <nav className="docs-nav glass-card">
                <div className="logo">
                    <h1 className="text-gradient">QIE Docs</h1>
                </div>
                <button className="btn-secondary" onClick={() => window.location.href = '/'}>
                    Back to Home
                </button>
            </nav>

            <div className="docs-container container">
                <aside className="docs-sidebar">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            className={`docs-link ${activeSection === section.id ? 'active' : ''}`}
                            onClick={() => setActiveSection(section.id)}
                        >
                            {section.title}
                        </button>
                    ))}
                </aside>

                <main className="docs-content glass-card">
                    {activeSection === 'smart-contract' && (
                        <div className="section-content">
                            <h2>Smart Contract Architecture</h2>
                            <p>The BORDERLESS PAY Protocol uses a modular smart contract system designed for gas efficiency and security.</p>

                            <div className="code-block">
                                <div className="code-header">
                                    <span className="lang">Solidity</span>
                                    <span className="file">Payroll.sol</span>
                                </div>
                                <pre>
                                    {`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract QIEPayroll is Ownable {
    struct Employee {
        address wallet;
        uint256 salaryUSD;
        address preferredToken;
    }
    
    mapping(address => Employee) public employees;
    
    function processPayroll() external onlyOwner {
        // Automated payroll logic
    }
}`}
                                </pre>
                            </div>
                        </div>
                    )}

                    {activeSection === 'oracle' && (
                        <div className="section-content">
                            <h2>Oracle Integration</h2>
                            <p>We utilize QIE Oracles to fetch real-time asset prices, ensuring employees are paid the exact USD equivalent in their chosen token.</p>
                            <div className="info-box">
                                ℹ️ Prices are updated every block to prevent slippage.
                            </div>
                        </div>
                    )}

                    {/* Add other sections as needed */}
                    {activeSection === 'dex' && (
                        <div className="section-content">
                            <h2>DEX Integration</h2>
                            <p>Automated swaps are handled via the QIE DEX router, providing deep liquidity for payroll execution.</p>
                        </div>
                    )}
                </main>
            </div>

            <style>{`
                .docs-page {
                    min-height: 100vh;
                    padding-top: 80px;
                }

                .docs-nav {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 70px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 2rem;
                    z-index: 100;
                    border-radius: 0;
                    border-top: none;
                    border-left: none;
                    border-right: none;
                }

                .docs-container {
                    display: grid;
                    grid-template-columns: 250px 1fr;
                    gap: 2rem;
                    padding-top: 2rem;
                    padding-bottom: 2rem;
                }

                .docs-sidebar {
                    position: sticky;
                    top: 100px;
                    height: fit-content;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .docs-link {
                    background: transparent;
                    border: none;
                    color: var(--text-secondary);
                    text-align: left;
                    padding: 0.75rem 1rem;
                    cursor: pointer;
                    border-radius: 8px;
                    transition: all 0.2s ease;
                    font-size: 1rem;
                }

                .docs-link:hover {
                    color: var(--text-primary);
                    background: rgba(255, 255, 255, 0.05);
                }

                .docs-link.active {
                    color: var(--neon-cyan);
                    background: rgba(0, 243, 255, 0.1);
                    border-left: 3px solid var(--neon-cyan);
                }

                .docs-content {
                    padding: 3rem;
                    min-height: 600px;
                }

                .section-content h2 {
                    font-size: 2rem;
                    margin-bottom: 1.5rem;
                    color: var(--text-primary);
                }

                .section-content p {
                    color: var(--text-secondary);
                    margin-bottom: 2rem;
                    line-height: 1.8;
                }

                .code-block {
                    background: #0a0a0c;
                    border: 1px solid var(--border-glass);
                    border-radius: 12px;
                    overflow: hidden;
                    margin: 2rem 0;
                }

                .code-header {
                    background: rgba(255, 255, 255, 0.03);
                    padding: 0.75rem 1.5rem;
                    border-bottom: 1px solid var(--border-glass);
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.85rem;
                    color: var(--text-muted);
                }

                pre {
                    padding: 1.5rem;
                    overflow-x: auto;
                    color: #e0e0e0;
                    font-family: 'Fira Code', monospace;
                    font-size: 0.9rem;
                    line-height: 1.5;
                }

                .info-box {
                    background: rgba(45, 106, 255, 0.1);
                    border: 1px solid var(--neon-blue);
                    padding: 1rem;
                    border-radius: 8px;
                    color: var(--neon-blue);
                }

                @media (max-width: 768px) {
                    .docs-container {
                        grid-template-columns: 1fr;
                    }
                    .docs-sidebar {
                        display: none;
                    }
                }
            `}</style>
        </div>
    );
};

export default Docs;
