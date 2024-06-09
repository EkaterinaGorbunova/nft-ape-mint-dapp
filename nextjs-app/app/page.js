'use client';

import React, { useState } from 'react';
import { connectWallet, mint } from '../utils';
import { Spiner } from '@/components/Spiner';
import ButtonConnectWallet from '../components/ButtonConnectWallet';
import ButtonMint from '../components/ButtonMint';
import BalanceCard from '../components/BalanceCard';

export default function Home() {
  const [userEthAddress, setUserEthAddress] = useState('Connect Wallet (Amoy)');
  const [apeNotRealAvs, setApeNotRealAvs] = useState([]);
  const [ethBalance, setEthBalance] = useState(0);
  const [itemBalance, setItemBalance] = useState(0);

  const [networkDotIndicator, setNetworkDotIndicator] = useState('my-auto w-2.5 h-2.5 bg-red-500 rounded-full');
  const [loading, setLoading] = useState(false);

  async function handleConnectWallet() {
    setLoading(true);
    const walletData = await connectWallet();
    console.log('walletData:', walletData)
    setLoading(false);
    if (walletData) {
      setUserEthAddress(walletData.currentWalletAddress);
      setEthBalance(walletData.ethBalance);
      setItemBalance(walletData.itemBalance);
      setApeNotRealAvs(walletData.apeNotRealAvs);
      setNetworkDotIndicator(walletData.networkDotIndicator);
    }
  }

  async function handleMintNft() {
    await mint();
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2 bg-black'>
      <main className='flex flex-col items-center justify-center w-full flex-1 px-20 text-center text-gray-300'>
        <h1 className='text-4xl md:text-6xl font-bold'>
          Welcome to <br />
          <span className='text-blue-600'>Dapp ApeNotReal NFT!</span>
        </h1>

        <div className='flex-col flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full'>
          <BalanceCard
            ethBalance={ethBalance}
            networkDotIndicator={networkDotIndicator}
            itemBalance={itemBalance}
          />
          <div>
            <ButtonConnectWallet
              getEthAccount={handleConnectWallet}
              buttonName={userEthAddress}
            />
            <ButtonMint buttonName={'MINT NFT'} mint={handleMintNft} />
          </div>
          <div>
            {apeNotRealAvs.length === 0 && userEthAddress !== 'Connect Wallet (Amoy)' ? (
              <div className='my-2 text-center'>
                <p className='text-sm text-center text-gray-200 font-inter'>
                  No ApeNotReal NFTs{' '}
                </p>
              </div>
            ) : null}
          </div>      

          {loading && (
            <div className='my-4'>
              <Spiner />
            </div>
          )}

          <div className='pb-4 mx-auto grid grid-cols-2 gap-4 '>
            {apeNotRealAvs.map(function (av, i) {
              return (
                <img
                  className='mx-auto rounded-lg border-double border-4 border-sky-600'
                  key={i}
                  src={av}
                  width='350'
                  height='350'
                  alt='nft-frog'
                />
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}


// import React from 'react';
// import Head from 'next/head';
// import { ethers } from 'ethers';
// import ButtonConnectWallet from '../components/ButtonConnectWallet';
// import ButtonMint from '../components/ButtonMint';
// import ApeNotReal from '../../hardhat-contract/artifacts/contracts/ApeNotReal.sol/ApeNotReal.json';
// import BalanceCard from '../components/BalanceCard';
// import { apePolygonAmoyAddress } from '@/contractAddresses';

// export default function Home() {
//   const networkNotConnectedDot =
//     'my-auto w-2.5 h-2.5 bg-red-500 rounded-full';
//   const networkConnectedDot =
//     'my-auto w-2.5 h-2.5 bg-teal-500 rounded-full';

//   const [userEthAddress, setUserEthAddress] = React.useState(
//     'Connect Wallet (Amoy)'
//   );
//   const [apeNotRealAvs, setApeNotRealAvs] = React.useState([]);
//   const [provider, setProvider] = React.useState();
//   const [network, setNetwork] = React.useState();
//   const [ethBalance, setEthBalance] = React.useState(0);
//   const [itemBalance, setItemBalance] = React.useState(0);
//   const [networkDotIndicator, setNetworkDotIndicator] = React.useState(
//     networkNotConnectedDot
//   );

//   async function mint() {
//     if (typeof window.ethereum !== 'undefined') {
//       try {
//         // Initialize the Web3 provider
//         const provider = new ethers.BrowserProvider(window.ethereum); // Correct provider for ethers v6.x

//         // Request accounts access if needed
//         await provider.send('eth_requestAccounts', []);

//         // Get network details (optional, but useful for logging)
//         const network = await provider.getNetwork();
//         console.log('Network Name:', network.name);

//         // Get the signer
//         const signer = await provider.getSigner();

//         // Initialize the contract with the signer
//         const apeNotReal = new ethers.Contract(
//           apePolygonAmoyAddress,
//           ApeNotReal.abi,
//           signer
//         );

//         // Mint an NFT
//         console.log('Initialize payment');
//         const nftItem = await apeNotReal.mintNFTs(1, {
//           value: ethers.parseEther('0.1'),
//           gasLimit: 300000,
//           gasPrice: ethers.parseUnits('50', 'gwei'),
//         }); // mint 1 NFT

//         console.log('Minting... please wait');
//         const receipt = await nftItem.wait(); // Wait for the transaction to be mined

//         console.log(
//           `Minted, see transaction: https://amoy.polygonscan.com/tx/${receipt.transactionHash}`
//         );
//         console.log('NFT Item:', nftItem);
//       } catch (error) {
//         console.error('Error initializing ethers:', error);
//       }
//     } else {
//       console.error('No Ethereum browser extension detected.');
//     }
//   }
//   // Connect metamask wallet
//   async function connectWallet() {
//     if (typeof window.ethereum !== 'undefined') {
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       setProvider(provider);
//       const network = await provider.getNetwork();
//       setNetwork(network.name);
//       console.log(network.name);

//       if (network.name === 'matic-amoy') {
//         console.log('Network name is', network.name + '(Poligon Testnet)');
//         setNetworkDotIndicator(networkConnectedDot)

//         const [currentWalletAddress] = await window.ethereum.request({
//           method: 'eth_requestAccounts',
//         });

//         setUserEthAddress(currentWalletAddress);
//         console.log('currentWalletAddress', currentWalletAddress);

//         // Get ETH balance
//         const ethBalance = await provider.getBalance(currentWalletAddress);
//         const formattedEthBalance = ethers.formatEther(ethBalance); // Updated for ethers.js v6.x

//         // Assuming setEthBalance is a function to update your state
//         setEthBalance(Number(formattedEthBalance));

//         let apeNotReal = new ethers.Contract(
//           apePolygonAmoyAddress,
//           ApeNotReal.abi,
//           provider
//         );

//         console.log('apeNotReal:', apeNotReal);

//         // Get item balance
//         let itemBalance = await apeNotReal.balanceOf(currentWalletAddress);
//         console.log('itemBalance:', itemBalance);

//         setItemBalance(itemBalance.toString());
//         console.log('itemBalance ', itemBalance.toString());

//         if (itemBalance > 0) {
//           // check if this account has a apeNotReal
//           console.log('Has apeNotReal', currentWalletAddress);
//           let avs = [];
//           // Get tokens array of owner
//           const tokensId = await apeNotReal.tokensOfOwner(currentWalletAddress);
//           console.log('tokensId', tokensId.toString());
//           for (let i = 0; i < tokensId.length; i++) {
//             // Get token metadata
//             const metaURI =
//               'https://ipfs.io/ipfs/' +
//               (await apeNotReal.tokenURI(tokensId[i])).replace('ipfs://', ''); // https://docs.ipfs.io/how-to/address-ipfs-on-web/
//             console.log('metaURI', metaURI);
//             // load metadata
//             const [meta] = await Promise.all([fetch(metaURI)]);
//             const metajson = await meta.json();
//             // get attributes
//             avs.push(metajson.image);
//           }
//           setApeNotRealAvs(avs);
//           console.log('avs: ', avs);
//         } else {
//           alert('You do not have NFT yet');
//         }
//       } else {
//         alert('Unsupported network. Please switch to Polygon Amoy Testnet');
//       }
//     } else {
//       alert(
//         'MetaMask is not installed. Please consider installing it: https://metamask.io/download.html'
//       );
//     }
//   }

//   return (
//     <div className='flex flex-col items-center justify-center min-h-screen py-2 bg-black'>
//       <main className='flex flex-col items-center justify-center w-full flex-1 px-20 text-center text-gray-300'>
//         <h1 className='text-4xl md:text-6xl font-bold'>
//           Welcome to <br />
//           <span className='text-blue-600'>Dapp ApeNotReal NFT!</span>
//         </h1>

//         <div className='flex-col flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full'>
//           <BalanceCard
//             ethBalance={ethBalance}
//             networkDotIndicator={networkDotIndicator}
//             itemBalance={itemBalance}
//           />
//           <div>
//             <ButtonConnectWallet
//               getEthAccount={connectWallet}
//               buttonName={userEthAddress}
//             />
//             <ButtonMint buttonName={'MINT NFT'} mint={mint} />
//           </div>
//           <div>
//             {apeNotRealAvs.length === 0 &&
//             userEthAddress !== 'Connect Wallet (Amoy)' ? (
//               <div className='my-2 text-center'>
//                 <p className='text-sm text-center text-gray-200 font-inter'>
//                   No ApeNotReal NFTs{' '}
//                 </p>
//               </div>
//             ) : null}
//             {userEthAddress == 'Connect Wallet (Amoy)' ? (
//               <div className='my-2 text-sm text-center text-gray-200 font-inter'>
//                 Your wallet is not connected
//               </div>
//             ) : null}
//           </div>
//           <div className='pb-4 mx-auto grid grid-cols-2 gap-4 '>
//             {apeNotRealAvs.map(function (av, i) {
//               return (
//                 <img
//                   className='mx-auto rounded-lg border-double border-4 border-sky-600'
//                   key={i}
//                   src={av}
//                   width='350'
//                   height='350'
//                   alt='nft-frog'
//                 />
//               );
//             })}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
