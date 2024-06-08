require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();
// require('@nomiclabs/hardhat-etherscan');

const {
  ALCHEMY_POLYGON_AMOY_URL,
  METAMASK_ACCOUNT_PRIVATE_KEY,
  ETHERSCAN_API,
} = process.env;


module.exports = {
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      chainId: 1337,
    },
    polygon_amoy: {
      // Alchemy endpoint url
      url: ALCHEMY_POLYGON_AMOY_URL || '',
      // Metamask account private key
      accounts: METAMASK_ACCOUNT_PRIVATE_KEY !== undefined ? [METAMASK_ACCOUNT_PRIVATE_KEY] : [],
    },
  },
  // // Etherscan API Key to verify contract
  // etherscan: {
  //   apiKey: ETHERSCAN_API,
  // },
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
