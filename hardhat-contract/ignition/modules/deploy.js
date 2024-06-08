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
  console.log("Contract deployed to address:", contract.target); // 0xa513E6E4b8f2a923D98304ec87F64353C4D5C853
}

main()
  .then(() => process.exit(0))
  .catch(error => {
      console.error(error);
      process.exit(1);
  });