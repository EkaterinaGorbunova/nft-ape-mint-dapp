# [NextJS 15](https://nextjs.org/blog/next-15-rc) project bootstrapped with `create-next-app@rc`


## Project Logic
1. Create Solidity Smart Contract
2. Deploy Smart Contract to Polygon Amoy test network
3. Integrate MetaMask wallet on the website
4. Mint NFT by sending transaction to the deployed Smart Contract
5. Display minted NFT on the website

# Сreating a project

## Stack

1. Solidity
2. Hardhat
3. Polygon Amoy test network
4. Metamask
5. Alchemy
6. Pinata IPFS
7. NFT ERC721 token
8. Frontend: NextJS 15 + Tailwind CSS

## Create NextJS App

To create NextJS 15 App run:

```Bash
create-next-app@rc
```

If you want to start an empty project (without styles and extra files), you can use the `--empty` flag, resulting in a minimal “hello world” page:

```Bash
npx create-next-app@rc --empty
```

## Setup HardHat

Create and go to `hardhat-contract` directoty:
```Bash
mkdir -p "hardhat-contract" && cd "hardhat-contract"
```

Initialize a Node.js project:
```Bash
npm init -y
```

Install `hardhat` and other dependencies:
```Bash
npm install hardhat @openzeppelin/contracts dotenv
```

Initialize `hardhat` project:

```Bash
npx hardhat init
```

Project structure:

```JSON
contracts/
ignition/modules/
test/
hardhat.config.js
```

- `contracts/` is where the source files for your contracts should be.
- `ignition/modules/` is where the Ignition modules that handle contract deployments should be.
- `test/` is where your tests should go.

### Solidity
Hardhat Network has first-class Solidity support. It always knows which smart contracts are being run, what exactly they do, and why they fail, making smart contract development easier. To do these kinds of things, Hardhat integrates very deeply with Solidity, which means that new versions of it aren't automatically supported.

To install specific version of the Solidity compiler via Node.js you can run:
```Bash
npm i solc@0.8.19
```
See more in [docs](https://hardhat.org/hardhat-runner/docs/reference/solidity-support).

If you still want to install the latest version of the Solidity you can run:
```Bash
npm i solc
```
Check the version of the Solidity you got:
```Bash
npx solc --version
0.8.19+commit.7dd6d404.Emscripten.clang
```

Install openzeppelin v.4.9.3 :
```Bash
@openzeppelin/contracts@4.9.3 
```
*`Counters.sol` was removed from latest `@openzeppelin/contracts@5.0.2`.

## Updating `hardhat.config.js` file

```JavaScript
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

```
**Check if the solidity version matches (`npx solc --version`)

## Create Smart Contract Logic
```Java
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract ApeNotReal is ERC721Enumerable, Ownable {

  using SafeMath for uint256;
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIds;

  uint public constant MAX_SUPPLY = 10000;
  uint public constant PRICE = 0.01 ether;
  uint public constant MAX_PER_MINT = 1;

  string public baseTokenURI;

  constructor(string memory baseURI) ERC721("ApeNotReal", "ANR") {
      setBaseURI(baseURI);
  }  

  function _baseURI() internal view virtual override returns (string memory) {
      return baseTokenURI;
  }

  function setBaseURI(string memory _baseTokenURI) public onlyOwner {
      baseTokenURI = _baseTokenURI;
  }

  function mintNFTs(uint _count) public payable {
      uint totalMinted = _tokenIds.current();
    require(
      totalMinted.add(_count) <= MAX_SUPPLY, "Not enough NFTs!"
    );
    require(
      msg.value >= PRICE.mul(_count), 
      "Not enough ether to purchase NFTs."
    );
        require(
      _count > 0 && _count <= MAX_PER_MINT, 
      "Cannot mint specified number of NFTs."
    );
      for (uint i = 0; i < _count; i++) {
          _mintSingleNFT();
      }
  }

  function _mintSingleNFT() private {
      uint newTokenID = _tokenIds.current();
      _safeMint(msg.sender, newTokenID);
      _tokenIds.increment();
  }

  function tokensOfOwner(address _owner) external view returns (uint[] memory) {

      uint tokenCount = balanceOf(_owner);
      uint[] memory tokensId = new uint256[](tokenCount);

      for (uint i = 0; i < tokenCount; i++) {
          tokensId[i] = tokenOfOwnerByIndex(_owner, i);
      }
      return tokensId;
  }

  function withdraw() public payable onlyOwner {
      uint balance = address(this).balance;
      require(balance > 0, "No ether left to withdraw");

      (bool success, ) = (msg.sender).call{value: balance}("");
      require(success, "Transfer failed.");
  }
}
```
**Check if the solidity version matches (`npx solc --version`).

## Compile Smart Contract

```Bash
npx hardhat compile
```

Now, you should see a new folder `artifacts` in the root directory.
`artifacts\contracts\ApeNotReal.sol\ApeNotReal.json` file contains the ABI.

Ex. of using ABI in NextJS App:

```JavaScript
import Ghost from "../../artifacts/contracts/Ghost.sol/Ghost.json"
console.log("Ghost ABI: ", Ghost.abi)
```

To clean the cache and artifacts folder:

```Bash
npm hardhat clean
```

## Deploy Smart Contract on Local Network/Blockchain
When we created the project (`npx hardhat`), Hardhat created an example deployment script at `\ignition\modules\Lock.js`. To make the purpose of this script more clear, update the name of `Lock.js` to `deploy.js`.

Next, update the `main()` function in `deploy.js` with the following code:

```JavaScript
const hre = require("hardhat");

const baseTokenURI = "ipfs://QmQ9P4Uph6TGsBuzmQADxkjsqTNgpHMyt1vAX1yNNArTQj/"

async function main() {

  // Get owner/deployer's wallet address
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Get contract that we want to deploy
  const ApeNotReal = await hre.ethers.getContractFactory("ApeNotReal");

  // Deploy contract with the correct constructor arguments
  const contract = await ApeNotReal.deploy(baseTokenURI);

  // Wait for contract deployment
  await contract.waitForDeployment();

  // Get contract address
  console.log("Contract deployed to address:", contract.target);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
      console.error(error);
      process.exit(1);
  });
```

This `deploy.js` script will deploy `ApeNotReal.sol` contract to the blockchain network.
We will first test this on a local network, then deploy it on the Polygon Amoy testnet.

To spin up a local network, open your terminal and run the following command:

```Bash
npx hardhat node
```

This should create a local network with 20 test accounts. Each of these accounts is seeded with 10.000 fake ETH.

Now we can run the `deploy.js` script and give a flag to the CLI that we would like to deploy smart contract to local network.

Keep the node running and open a separate terminal window to deploy smart contract:

```Bash
npx hardhat run ignition/modules/deploy.js --network localhost
```
OR
to simplify contract deployment, we can add a script to `package.json`:

```JSON
  "scripts": {
    "deploy_localhost": "npx hardhat run ignition/modules/deploy.js --network localhost",
  },
```
And then run:
```Bash
npm run deploy_localhost
```
Once the deployment is complete, the CLI should print out the deployer (owner) account address and contract address:

```Bash
Deploying contracts with the account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Contract deployed to address: 0xa513E6E4b8f2a923D98304ec87F64353C4D5C853
```
Save this smart contract address to new `contractAddresses.js` file at the root of NextJS App fronted folder:

```JavaScript
// contractAddresses.js

// ApeNotReal.sol Smart Contract Addresses
export const apeLocalhostAddress = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853"
```

## Import ocal Accounts into MetaMask
You can import the accounts created by the node into your Metamask wallet to try it out in the App.

To import one of these accounts, first switch your MetaMask wallet network to Localhost 8545.
Next, in MetaMask click on Import Account from the account’s menu.

Copy then paste one of the Private Keys logged out by the CLI and click Import. Once the account is imported, you should see some the Eth in the account.


## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)