import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const config: HardhatUserConfig = {
  defaultNetwork: "gnosis",
  networks: { 
    gnosis: {
      url: process.env.GNOSIS_RPC_URL,
      accounts: [process.env.PRIVATE_KEY!],
      chainId: 100
    }
  },
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./sol",
    tests: "./test",
    artifacts: "./artifacts"
  }
};

export default config;
