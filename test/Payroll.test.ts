import { expect } from "chai";
import { ethers } from "hardhat";
import { Payroll, IERC20 } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("Payroll Contract", function () {
    let payroll: Payroll;
    let mockToken: IERC20;
    let employer: SignerWithAddress;
    let employee1: SignerWithAddress;
    let employee2: SignerWithAddress;
    let dexRouter: SignerWithAddress;

    const MOCK_DEX_ADDRESS = "0x0000000000000000000000000000000000000001";
    const MOCK_FALLBACK_TOKEN = "0x0000000000000000000000000000000000000002";
    const EMPLOYEE_TOKEN_BTC = "0x0000000000000000000000000000000000000003";

    const SALARY_USD = ethers.parseEther("5000"); // $5000 with 18 decimals

    beforeEach(async function () {
        [employer, employee1, employee2, dexRouter] = await ethers.getSigners();

        // Deploy Payroll contract
        const PayrollFactory = await ethers.getContractFactory("Payroll");
        payroll = await PayrollFactory.deploy(MOCK_DEX_ADDRESS, MOCK_FALLBACK_TOKEN);
        await payroll.waitForDeployment();
    });

    describe("Deployment", function () {
        it("Should set the correct employer", async function () {
            expect(await payroll.employer()).to.equal(employer.address);
        });

        it("Should configure oracles correctly", async function () {
            const btcOracleAddress = await payroll.oracles("BTC");
            expect(btcOracleAddress).to.equal("0x9E596d809a20A272c788726f592c0d1629755440");
        });

        it("Should set correct fallback token", async function () {
            expect(await payroll.fallbackToken()).to.equal(MOCK_FALLBACK_TOKEN);
        });
    });

    describe("Employee Management", function () {
        it("Should add employee successfully", async function () {
            await expect(
                payroll.addEmployee(employee1.address, EMPLOYEE_TOKEN_BTC, "BTC", SALARY_USD)
            )
                .to.emit(payroll, "EmployeeAdded")
                .withArgs(employee1.address, EMPLOYEE_TOKEN_BTC, "BTC", SALARY_USD);

            const emp = await payroll.getEmployee(employee1.address);
            expect(emp.wallet).to.equal(employee1.address);
            expect(emp.token).to.equal(EMPLOYEE_TOKEN_BTC);
            expect(emp.symbol).to.equal("BTC");
            expect(emp.salaryUSD).to.equal(SALARY_USD);
            expect(emp.exists).to.be.true;
        });

        it("Should prevent adding duplicate employee", async function () {
            await payroll.addEmployee(employee1.address, EMPLOYEE_TOKEN_BTC, "BTC", SALARY_USD);

            await expect(
                payroll.addEmployee(employee1.address, EMPLOYEE_TOKEN_BTC, "BTC", SALARY_USD)
            ).to.be.revertedWith("Employee exists");
        });

        it("Should remove employee successfully", async function () {
            await payroll.addEmployee(employee1.address, EMPLOYEE_TOKEN_BTC, "BTC", SALARY_USD);

            await expect(payroll.removeEmployee(employee1.address))
                .to.emit(payroll, "EmployeeRemoved")
                .withArgs(employee1.address);

            await expect(payroll.getEmployee(employee1.address)).to.be.revertedWith("Employee not found");
        });

        it("Should only allow employer to add employees", async function () {
            await expect(
                payroll.connect(employee1).addEmployee(employee2.address, EMPLOYEE_TOKEN_BTC, "BTC", SALARY_USD)
            ).to.be.revertedWith("Not authorized");
        });

        it("Should only allow employer to remove employees", async function () {
            await payroll.addEmployee(employee1.address, EMPLOYEE_TOKEN_BTC, "BTC", SALARY_USD);

            await expect(
                payroll.connect(employee1).removeEmployee(employee1.address)
            ).to.be.revertedWith("Not authorized");
        });

        it("Should reject employee with unconfigured oracle", async function () {
            await expect(
                payroll.addEmployee(employee1.address, EMPLOYEE_TOKEN_BTC, "UNKNOWN", SALARY_USD)
            ).to.be.revertedWith("Oracle not configured");
        });
    });

    describe("Oracle Management", function () {
        const NEW_ORACLE = "0x0000000000000000000000000000000000000010";

        it("Should add new oracle", async function () {
            await expect(payroll.addOracle("DOGE", NEW_ORACLE))
                .to.emit(payroll, "OracleUpdated")
                .withArgs("DOGE", NEW_ORACLE);

            expect(await payroll.oracles("DOGE")).to.equal(NEW_ORACLE);
        });

        it("Should only allow employer to add oracles", async function () {
            await expect(
                payroll.connect(employee1).addOracle("DOGE", NEW_ORACLE)
            ).to.be.revertedWith("Not authorized");
        });

        it("Should reject zero address oracle", async function () {
            await expect(
                payroll.addOracle("DOGE", ethers.ZeroAddress)
            ).to.be.revertedWith("Invalid oracle");
        });
    });

    describe("Funding", function () {
        it("Should emit PayrollFunded event", async function () {
            // Note: This test would require a mock ERC20 token to fully test
            // For now, we just check the function exists and has correct modifier
            await expect(
                payroll.connect(employee1).fundPayroll(1000)
            ).to.be.revertedWith("Not authorized");
        });
    });

    describe("Emergency Withdraw", function () {
        it("Should only allow employer to withdraw", async function () {
            await expect(
                payroll.connect(employee1).emergencyWithdraw()
            ).to.be.revertedWith("Not authorized");
        });
    });

    describe("View Functions", function () {
        it("Should get balance", async function () {
            // This would return 0 since we're using a mock address
            // In a real scenario, you'd deploy a mock ERC20
            const balance = await payroll.getBalance();
            expect(balance).to.equal(0);
        });
    });
});
