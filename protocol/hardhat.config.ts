import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@xyrusworx/hardhat-solidity-json";
import "@openzeppelin/hardhat-upgrades";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  defaultNetwork: "gnosis",
  networks: {
    gnosis: {
      url: process.env.GNOSIS_RPC_URL!,
      accounts: [process.env.PRIVATE_KEY!]
    }
  },
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  sourcify: {
    enabled: true
  },
  // etherscan: {
  //   apiKey: {
  //     arbitrumSepolia: process.env.ARBISCAN_API_KEY!,
  //   },
  //   customChains: [
  //     {
  //       network: "baseSepolia",
  //       chainId: 84532,
  //       urls: {
  //         apiURL: "https://api-sepolia.basescan.org/api",
  //         browserURL: "https://sepolia.basescan.org/"
  //       }
  //     }
  //   ]
  // },
  mocha: {
    timeout: 100000
  }
};

export default config;
