require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();
// require('@nomiclabs/hardhat-etherscan');

const {
  ALCHEMY_POLYGON_AMOY_URL,
  METAMASK_ACCOUNT_PRIVATE_KEY,
  POLYGONSCAN_AMOY_API_KEY,
} = process.env;

module.exports = {
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      chainId: 1337,
    },
    polygon_amoy: {
      // Alchemy endpoint URL
      url: ALCHEMY_POLYGON_AMOY_URL || '',
      // Metamask account Private Key
      accounts: METAMASK_ACCOUNT_PRIVATE_KEY !== undefined ? [METAMASK_ACCOUNT_PRIVATE_KEY] : [],
    },
  },
  // Verify smart contract
  etherscan: {
    apiKey: {
      polygon_amoy: POLYGONSCAN_AMOY_API_KEY,
    },
    customChains: [
      {
        network: "polygon_amoy",
        chainId: 80002,
        urls: {
          apiURL: "https://api-amoy.polygonscan.com/api",
          browserURL: "https://amoy.polygonscan.com"
        },
      }
    ]
  },
  sourcify: {
    enabled: true
  },
  solidity: {
    version: '0.8.24',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
