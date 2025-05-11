import { ethers } from "hardhat";
import { run } from "hardhat";

async function main() {
  console.log("Deploying TFGroupFactory...");

  const TFGroupFactory = await ethers.getContractFactory("TFGroupFactory");
  const factory = await TFGroupFactory.deploy();
  await factory.waitForDeployment();

  const factoryAddress = await factory.getAddress();
  console.log("TFGroupFactory deployed to:", factoryAddress);

  // Wait for 5 block confirmations
  console.log("Waiting for 5 block confirmations...");
  await factory.deploymentTransaction()?.wait(5);

  // Verify TFGroupFactory
  try {
    console.log("Verifying TFGroupFactory on Etherscan...");
    await run("verify:verify", {
      address: factoryAddress,
      constructorArguments: [],
    });
    console.log("TFGroupFactory verified successfully");
  } catch (error) {
    console.log("Error verifying TFGroupFactory:", error);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
