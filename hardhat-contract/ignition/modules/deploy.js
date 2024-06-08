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
  console.log("Contract deployed to address:", contract.target); // 0xd58378F805C6e72693724a4A67Dab8d08DaB28B8
}

main()
  .then(() => process.exit(0))
  .catch(error => {
      console.error(error);
      process.exit(1);
  });