import { ethers } from 'ethers';
import { apePolygonAmoyAddress } from './contractAddresses';
import ApeNotReal from './hardhat-contract/artifacts/contracts/ApeNotReal.sol/ApeNotReal.json';

// Function to initialize ethers provider
async function initializeProvider() {
  try {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask is not installed. Please consider installing it: https://metamask.io/download.html');
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    return provider;
  } catch (error) {
    console.error('Error initializing provider:', error);
    throw error;
  }
}

// Function to connect wallet
export async function connectWallet() {
  try {
    const provider = await initializeProvider();
    const network = await provider.getNetwork();

    if (network.name !== 'matic-amoy') {
      alert('Unsupported network. Please switch to Polygon Amoy Testnet');
      return null;
    }

    // const signer = provider.getSigner();
    // const currentWalletAddress = await signer.getAddress();
      const [currentWalletAddress] = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    const ethBalance = await provider.getBalance(currentWalletAddress);
    const formattedEthBalance = ethers.formatEther(ethBalance);

    const nft = await checkNFTBalanceAndFetchMetadata(provider, currentWalletAddress)

    return {
      currentWalletAddress,
      provider,
      networkName: network.name,
      ethBalance: parseFloat(formattedEthBalance),
      networkDotIndicator: 'my-auto w-2.5 h-2.5 bg-teal-500 rounded-full',
      apeNotRealAvs: nft.apeNotRealAvs,
      itemBalance: nft.itemBalance
    };
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
}

// Function to check NFT balance and fetch metadata
export async function checkNFTBalanceAndFetchMetadata(provider, currentWalletAddress) {
  try {
    const apeNotReal = new ethers.Contract(apePolygonAmoyAddress, ApeNotReal.abi, provider);

    const itemBalance = await apeNotReal.balanceOf(currentWalletAddress);
    const avs = [];

    if (itemBalance > 0) {
      const tokensId = await apeNotReal.tokensOfOwner(currentWalletAddress);

      for (let i = 0; i < tokensId.length; i++) {
        const metaURI = 'https://ipfs.io/ipfs/' + (await apeNotReal.tokenURI(tokensId[i])).replace('ipfs://', '');
        const metaResponse = await fetch(metaURI);
        const metajson = await metaResponse.json();
        avs.push(metajson.image);
      }
    } else {
      console.log('You do not have NFTs yet');
    }

    return {
      itemBalance: parseInt(itemBalance.toString()),
      apeNotRealAvs: avs
    };
  } catch (error) {
    console.error('Error checking NFT balance and fetching metadata:', error);
    throw error;
  }
}

// Function to mint NFT
export async function mint() {
  try {
    const provider = await initializeProvider();
    const network = await provider.getNetwork();

    if (network.name !== 'matic-amoy') {
      alert('Unsupported network. Please switch to Polygon Amoy Testnet');
      return;
    }

    const signer = await provider.getSigner();
    const apeNotReal = new ethers.Contract(apePolygonAmoyAddress, ApeNotReal.abi, signer);

    console.log('Initialize payment');
    const nftItem = await apeNotReal.mintNFTs(1, {
      value: ethers.parseEther('0.1'),
      gasLimit: 300000,
      gasPrice: ethers.parseUnits('50', 'gwei'),
    });

    console.log('Minting... please wait');
    const receipt = await nftItem.wait();

    console.log(`Minted, see transaction: https://amoy.polygonscan.com/tx/${receipt.transactionHash}`);
    console.log('NFT Item:', nftItem);

  } catch (error) {
    console.error('Error minting NFT:', error);
    throw error;
  }
}


// export async function connectWallet() {
//   if (typeof window.ethereum !== 'undefined') {
//     try {
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       // await window.ethereum.request({ method: 'eth_requestAccounts' });
//       const [currentWalletAddress] = await window.ethereum.request({
//           method: 'eth_requestAccounts',
//         });
//       const network = await provider.getNetwork();
      
//       if (network.name !== 'matic-amoy') {
//         alert('Unsupported network. Please switch to Polygon Amoy Testnet');
//         return null;
//       }

//       // Get ETH balance
//       const ethBalance = await provider.getBalance(currentWalletAddress);
//       const formattedEthBalance = ethers.formatEther(ethBalance);

//       let apeNotReal = new ethers.Contract(
//         apePolygonAmoyAddress,
//         ApeNotReal.abi,
//         provider
//       );

//       // Get NFT balance
//       let itemBalance = await apeNotReal.balanceOf(currentWalletAddress);

//       // Check if this account has a apeNotReal NFTs
//       if (itemBalance > 0) {
//         let avs = [];
//         // Get tokens array of owner
//         const tokensId = await apeNotReal.tokensOfOwner(currentWalletAddress);

//         for (let i = 0; i < tokensId.length; i++) {
//           // Get token metadata
//           const metaURI = 'https://ipfs.io/ipfs/' +
//             (await apeNotReal.tokenURI(tokensId[i])).replace('ipfs://', '');
//           // load metadata
//           // const [meta] = await Promise.all([fetch(metaURI)]);
//           const meta = await fetch(metaURI);
//           const metajson = await meta.json();
//           // get attributes
//           avs.push(metajson.image);
//         }

//         return {
//           currentWalletAddress,
//           provider,
//           networkName: network.name,
//           ethBalance: parseFloat(formattedEthBalance),
//           itemBalance: parseInt(itemBalance.toString()),
//           apeNotRealAvs: avs,
//           networkDotIndicator: 'my-auto w-2.5 h-2.5 bg-teal-500 rounded-full'
//         };
//       } else {
//         alert('You do not have NFTs yet');
//         return {
//           currentWalletAddress,
//           provider,
//           networkName: network.name,
//           ethBalance: parseFloat(formattedEthBalance),
//           itemBalance: parseInt(itemBalance.toString()),
//           apeNotRealAvs: [],
//           networkDotIndicator: 'my-auto w-2.5 h-2.5 bg-teal-500 rounded-full'
//         };
//       }
//     } catch (error) {
//       console.error('Error connecting wallet:', error);
//       return null;
//     }
//   } else {
//     alert('MetaMask is not installed. Please consider installing it: https://metamask.io/download.html');
//     return null;
//   }
// }

// export async function mint() {
//   if (typeof window.ethereum !== 'undefined') {
//     try {
//       // Initialize the Web3 provider
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       // Request accounts access
//       await provider.send('eth_requestAccounts', []);
//       // Get network details
//       const network = await provider.getNetwork();

//       if (network.name !== 'matic-amoy') {
//         alert('Unsupported network. Please switch to Polygon Amoy Testnet');
//         return;
//       }

//       // Get the signer
//       const signer = await provider.getSigner();

//       // Initialize the contract with the signer
//       const apeNotReal = new ethers.Contract(
//         apePolygonAmoyAddress,
//         ApeNotReal.abi,
//         signer
//       );

//       // Mint an NFT
//       console.log('Initialize payment');
//       const nftItem = await apeNotReal.mintNFTs(1, {
//         value: ethers.parseEther('0.1'),
//         gasLimit: 300000,
//         gasPrice: ethers.parseUnits('50', 'gwei'),
//       });

//       console.log('Minting... please wait');
//       const receipt = await nftItem.wait();

//       console.log(`Minted, see transaction: https://amoy.polygonscan.com/tx/${receipt.transactionHash}`);
//       console.log('NFT Item:', nftItem);

//     } catch (error) {
//       console.error('Error minting NFT:', error);
//     }
//   } else {
//     console.error('MetaMask is not installed. Please consider installing it: https://metamask.io/download.html');
//   }
// }
