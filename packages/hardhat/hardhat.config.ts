import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ignition-ethers";
import "dotenv/config";

const config: any = {
  solidity: "0.8.24",
  networks: {
    "base-sepolia": {
      url: "https://sepolia.base.org",
      accounts: [process.env.PRIVATE_KEY as string],
      gasPrice: 1000000000,
    },
    Sepolia: {
      url: "https://sepolia.rpc.zora.energy",
      accounts: [process.env.PRIVATE_KEY as string],
    },
    // sepolia: {
    //   url: process.env.NETWORK_URL,
    //   accounts: [process.env.PRIVATE_KEY],
    // },

    // sourcify: {
    //   // Disabled by default
    //   // Doesn't need an API key
    //   enabled: true,
    // },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
