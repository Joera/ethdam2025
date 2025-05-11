import { ethers } from "hardhat";
import { run } from "hardhat";

async function main() {
  console.log("Deploying CustomMintPolicy...");

  const EURE_TOKEN_ADDRESS = '0xcB444e90D8198415266c6a2724b7900fb12FC56E'; // Gnosis Chain EURE token
  const CustomMintPolicy = await ethers.getContractFactory("CustomMintPolicy");
  const mintPolicy = await CustomMintPolicy.deploy(EURE_TOKEN_ADDRESS);
  await mintPolicy.waitForDeployment();

  const mintPolicyAddress = await mintPolicy.getAddress();
  console.log("CustomMintPolicy deployed to:", mintPolicyAddress);

  // Wait for 5 block confirmations
  console.log("Waiting for 5 block confirmations...");
  await mintPolicy.deploymentTransaction()?.wait(5);

  // Verify CustomMintPolicy
  try {
    console.log("Verifying CustomMintPolicy on Etherscan...");
    await run("verify:verify", {
      address: mintPolicyAddress,
      constructorArguments: [EURE_TOKEN_ADDRESS],
    });
    console.log("CustomMintPolicy verified successfully");
  } catch (error) {
    console.log("Error verifying CustomMintPolicy:", error);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});