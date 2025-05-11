import { ethers } from "hardhat";
import { Log, TransactionReceipt } from "@ethersproject/abstract-provider";

async function main() {
  // Get the factory address from deployment
  const FACTORY_ADDRESS = "0xA6e7157380F562f796f30D3AD0A58dBAB1B36e07"; // Replace with actual factory address
  const EURE_TOKEN_ADDRESS = "0xcB444e90D8198415266c6a2724b7900fb12FC56E";
  const MINT_POLICY_ADDRESS = "0x274230EbcA7Aae91a655dd72c2B317F7615875c9"; // Replace with actual mint policy address
  
  // Get the factory contract
  const factory = await ethers.getContractAt("TFGroupFactory", FACTORY_ADDRESS);
  
  // Parameters for creating a new trust fund
  const owner = "0x274230EbcA7Aae91a655dd72c2B317F7615875c9"; // Replace with actual owner address
  const service = owner; // Using owner as service for now
  const feeCollection = owner; // Using owner as fee collector for now
  const customMintPolicy = MINT_POLICY_ADDRESS;
  const initialConditions: string[] = []; // Add any initial conditions if needed
  const name = "Stok2Vel"; // Must be 19 chars or less
  const symbol = "STOK2VEL";
  const metadataDigest = ethers.encodeBytes32String("ipfs://..."); // Replace with actual metadata
  
  // Custom parameters
  const eureToken = EURE_TOKEN_ADDRESS;
  const mintPolicy = MINT_POLICY_ADDRESS;
  const contributionAmount = 100n * BigInt(1e18); // 100 EURE per month
  const payOutDay = 1; // Payout on 1st of each month
  const stableCoinTokenAddress = EURE_TOKEN_ADDRESS; // Using EURE as stablecoin
  
  console.log("Creating new trust fund...");
  
  // Create the trust fund
  const tx = await factory.createTrustFund(
    owner,
    service,
    feeCollection,
    customMintPolicy,
    initialConditions,
    name,
    symbol,
    metadataDigest,
    eureToken,
    mintPolicy,
    contributionAmount,
    payOutDay,
    stableCoinTokenAddress
  );
  
  console.log("Transaction hash:", tx.hash);
  console.log("Waiting for confirmation...");
  
  const receipt = await tx.wait();
  
  // Get the created addresses from the event
  if (receipt && receipt.logs) {
    // Get the BaseGroupCreated event
    const baseGroupCreatedEvent = receipt.logs.find(
      (log: Log) => log.topics[0] === ethers.id(
        "BaseGroupCreated(address,address,address,address)"
      )
    );

    if (baseGroupCreatedEvent) {
      // Parse the event data
      const [group, owner, mintHandler, treasury] = ethers.AbiCoder.defaultAbiCoder().decode(
        ["address", "address", "address", "address"],
        baseGroupCreatedEvent.data
      );
    
      console.log("Trust Fund created!");
      console.log("Group address:", group);
      console.log("Mint Handler address:", mintHandler);
      console.log("Treasury address:", treasury);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
