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
    version: "0.8.28",
    settings: {
      viaIR: true,
      optimizer: {
        enabled: true,
        runs: 200
      },
      evmVersion: "cancun"
    }
  },
  paths: {
    sources: "./sol",
    tests: "./test",
    artifacts: "./artifacts"
  },
  etherscan: {
    apiKey: {
      xdai: "B6FK7BRUXBVCVZ6ZYJ2JY3TTWT4QNHI33T"
    }
  }
};

export default config;
