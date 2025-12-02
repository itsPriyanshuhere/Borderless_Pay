import { ethers } from "hardhat";

async function main() {
    console.log("🚀 Starting SimplePayroll Contract Deployment...\n");

    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);
    console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "native tokens\n");

    // Deploy SimplePayroll Contract
    console.log("📝 Deploying SimplePayroll contract...");
    const SimplePayrollFactory = await ethers.getContractFactory("SimplePayroll");
    const simplePayroll = await SimplePayrollFactory.deploy();

    await simplePayroll.waitForDeployment();
    const simplePayrollAddress = await simplePayroll.getAddress();

    console.log("✅ SimplePayroll contract deployed to:", simplePayrollAddress);
    console.log("   - Employer:", deployer.address);

    console.log("\n💾 Deployment Summary:");
    console.log("====================");
    console.log(`SimplePayroll Contract: ${simplePayrollAddress}`);
    console.log(`Network: ${(await ethers.provider.getNetwork()).name}`);
    console.log(`Chain ID: ${(await ethers.provider.getNetwork()).chainId}`);

    console.log("\n📋 Next Steps:");
    console.log("1. Fund the payroll contract with native tokens");
    console.log("2. Add employees using addEmployee(address, salary)");
    console.log("3. Execute payroll using payEmployee(address) or payAllEmployees()");

    console.log("\n✅ Deployment Complete!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment Error:", error);
        process.exit(1);
    });
