import { ethers } from "hardhat";

async function main() {
    console.log("Starting SimplePayroll Contract Deployment \n");

    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);
    console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "native tokens\n");

    console.log("Deploying SimplePayroll contract");
    const SimplePayrollFactory = await ethers.getContractFactory("SimplePayroll");
    const simplePayroll = await SimplePayrollFactory.deploy();

    await simplePayroll.waitForDeployment();
    const simplePayrollAddress = await simplePayroll.getAddress();

    console.log("SimplePayroll contract deployed to:", simplePayrollAddress);
    console.log("Employer:", deployer.address);

    console.log(`SimplePayroll Contract: ${simplePayrollAddress}`);
    console.log(`Network: ${(await ethers.provider.getNetwork()).name}`);
    console.log(`Chain ID: ${(await ethers.provider.getNetwork()).chainId}`);

    console.log("Deployment Complete!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error:", error);
        process.exit(1);
    });
