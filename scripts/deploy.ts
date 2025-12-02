import { ethers } from "hardhat";

async function main() {
    console.log("🚀 Starting Payroll Contract Deployment...\n");

    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);
    console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

    // These addresses should be configured based on the network
    // For testnet deployment, update these in .env or hardhat.config.ts
    const DEX_ROUTER_ADDRESS = process.env.DEX_ROUTER_ADDRESS || "0x0000000000000000000000000000000000000000";
    const FALLBACK_TOKEN_ADDRESS = process.env.FALLBACK_TOKEN_ADDRESS || "0x0000000000000000000000000000000000000000";

    if (DEX_ROUTER_ADDRESS === "0x0000000000000000000000000000000000000000") {
        console.warn("⚠️  WARNING: DEX_ROUTER_ADDRESS not set in environment variables");
        console.warn("⚠️  Using placeholder address. Update .env before deploying to a real network.\n");
    }

    if (FALLBACK_TOKEN_ADDRESS === "0x0000000000000000000000000000000000000000") {
        console.warn("⚠️  WARNING: FALLBACK_TOKEN_ADDRESS not set in environment variables");
        console.warn("⚠️  Using placeholder address. Update .env before deploying to a real network.\n");
    }

    // Deploy Payroll Contract
    console.log("📝 Deploying Payroll contract...");
    const PayrollFactory = await ethers.getContractFactory("Payroll");
    const payroll = await PayrollFactory.deploy(DEX_ROUTER_ADDRESS, FALLBACK_TOKEN_ADDRESS);

    await payroll.waitForDeployment();
    const payrollAddress = await payroll.getAddress();

    console.log("✅ Payroll contract deployed to:", payrollAddress);
    console.log("   - DEX Router:", DEX_ROUTER_ADDRESS);
    console.log("   - Fallback Token:", FALLBACK_TOKEN_ADDRESS);
    console.log("   - Employer:", deployer.address);

    // Display Oracle Addresses
    console.log("\n📊 Configured Oracle Price Feeds:");
    const symbols = ["BTC", "ETH", "XRP", "SOL", "QIE", "XAUt", "BNB"];

    for (const symbol of symbols) {
        try {
            const price = await payroll.getLatestPrice(symbol);
            console.log(`   - ${symbol}/USD: ${ethers.formatUnits(price, 8)} (Oracle configured)`);
        } catch (error) {
            console.log(`   - ${symbol}/USD: Oracle not configured or error`);
        }
    }

    console.log("\n💾 Deployment Summary:");
    console.log("====================");
    console.log(`Payroll Contract: ${payrollAddress}`);
    console.log(`Network: ${(await ethers.provider.getNetwork()).name}`);
    console.log(`Chain ID: ${(await ethers.provider.getNetwork()).chainId}`);

    console.log("\n📋 Next Steps:");
    console.log("1. Verify the contract on block explorer");
    console.log("2. Fund the payroll contract with fallback tokens");
    console.log("3. Add employees using addEmployee()");
    console.log("4. Execute payroll using payEmployee() or payAllEmployees()");

    console.log("\n✅ Deployment Complete!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment Error:", error);
        process.exit(1);
    });
