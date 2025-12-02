import { ethers } from 'ethers';
import config from '../config';
import PayrollArtifact from './abis/Payroll.json';

// Extract ABI from Hardhat artifact
const PayrollABI = (PayrollArtifact as any).abi;

class BlockchainService {
    private provider: ethers.JsonRpcProvider;
    private signer: ethers.Wallet;
    private payrollContract: ethers.Contract;

    constructor() {
        // Initialize provider
        this.provider = new ethers.JsonRpcProvider(config.rpcUrl);

        // Initialize signer
        this.signer = new ethers.Wallet(config.privateKey, this.provider);

        // Initialize contract
        this.payrollContract = new ethers.Contract(
            config.contractAddress,
            PayrollABI,
            this.signer
        );
    }

    // Employee Management
    async addEmployee(wallet: string, token: string, symbol: string, salaryUSD: string) {
        try {
            const tx = await this.payrollContract.addEmployee(
                wallet,
                token,
                symbol,
                ethers.parseEther(salaryUSD)
            );
            const receipt = await tx.wait();
            return { success: true, txHash: receipt.hash };
        } catch (error: any) {
            throw new Error(`Failed to add employee: ${error.message}`);
        }
    }

    async removeEmployee(wallet: string) {
        try {
            const tx = await this.payrollContract.removeEmployee(wallet);
            const receipt = await tx.wait();
            return { success: true, txHash: receipt.hash };
        } catch (error: any) {
            throw new Error(`Failed to remove employee: ${error.message}`);
        }
    }

    async getEmployee(wallet: string) {
        try {
            const employee = await this.payrollContract.getEmployee(wallet);
            return {
                wallet: employee.wallet,
                token: employee.token,
                symbol: employee.symbol,
                salaryUSD: ethers.formatEther(employee.salaryUSD),
                exists: employee.exists,
            };
        } catch (error: any) {
            throw new Error(`Failed to get employee: ${error.message}`);
        }
    }

    // Payroll Execution
    async payEmployee(employeeAddress: string) {
        try {
            const tx = await this.payrollContract.payEmployee(employeeAddress);
            const receipt = await tx.wait();
            return { success: true, txHash: receipt.hash };
        } catch (error: any) {
            throw new Error(`Failed to pay employee: ${error.message}`);
        }
    }

    async payAllEmployees(employeeAddresses: string[]) {
        try {
            const tx = await this.payrollContract.payAllEmployees(employeeAddresses);
            const receipt = await tx.wait();
            return { success: true, txHash: receipt.hash };
        } catch (error: any) {
            throw new Error(`Failed to execute batch payment: ${error.message}`);
        }
    }

    // Funding
    async fundPayroll(amount: string) {
        try {
            const tx = await this.payrollContract.fundPayroll(ethers.parseEther(amount));
            const receipt = await tx.wait();
            return { success: true, txHash: receipt.hash };
        } catch (error: any) {
            throw new Error(`Failed to fund payroll: ${error.message}`);
        }
    }

    async getBalance() {
        try {
            const balance = await this.payrollContract.getBalance();
            return ethers.formatEther(balance);
        } catch (error: any) {
            throw new Error(`Failed to get balance: ${error.message}`);
        }
    }

    // Oracle
    async getLatestPrice(symbol: string) {
        try {
            const price = await this.payrollContract.getLatestPrice(symbol);
            return ethers.formatUnits(price, 8); // Oracle returns 8 decimals
        } catch (error: any) {
            throw new Error(`Failed to get price for ${symbol}: ${error.message}`);
        }
    }

    async addOracle(symbol: string, oracleAddress: string) {
        try {
            const tx = await this.payrollContract.addOracle(symbol, oracleAddress);
            const receipt = await tx.wait();
            return { success: true, txHash: receipt.hash };
        } catch (error: any) {
            throw new Error(`Failed to add oracle: ${error.message}`);
        }
    }

    // Event Listeners
    listenToEvents() {
        this.payrollContract.on('EmployeeAdded', (wallet, token, symbol, salaryUSD, event) => {
            console.log('✅ Employee Added:', {
                wallet,
                token,
                symbol,
                salaryUSD: ethers.formatEther(salaryUSD),
                txHash: event.log.transactionHash,
            });
        });

        this.payrollContract.on('EmployeePaid', (wallet, token, symbol, amountToken, amountUSD, event) => {
            console.log('💰 Employee Paid:', {
                wallet,
                token,
                symbol,
                amountToken: ethers.formatEther(amountToken),
                amountUSD: ethers.formatEther(amountUSD),
                txHash: event.log.transactionHash,
            });
        });

        this.payrollContract.on('PayrollFunded', (employer, amount, event) => {
            console.log('💵 Payroll Funded:', {
                employer,
                amount: ethers.formatEther(amount),
                txHash: event.log.transactionHash,
            });
        });

        console.log('📡 Event listeners active');
    }

    // Utility
    async getBlockNumber() {
        return await this.provider.getBlockNumber();
    }

    async getNetworkInfo() {
        const network = await this.provider.getNetwork();
        return {
            name: network.name,
            chainId: network.chainId.toString(),
        };
    }
}

export default new BlockchainService();
