'use client';

import React, { useState } from 'react';
import { connectWallet, mint, checkNFTBalanceAndFetchMetadata, initializeProvider } from '../utils';
import { Spiner } from '@/components/Spiner';
import ButtonConnectWallet from '../components/ButtonConnectWallet';
import ButtonMint from '../components/ButtonMint';
import BalanceCard from '../components/BalanceCard';

export default function Home() {
  const [userEthAddress, setUserEthAddress] = useState('Connect Wallet (Amoy)');
  const [apeNotRealAvs, setApeNotRealAvs] = useState([]);
  const [ethBalance, setEthBalance] = useState(0);
  const [itemBalance, setItemBalance] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  async function handleConnectWallet() {
    setIsLoading(true);
    const walletData = await connectWallet();
    console.log('walletData:', walletData)
    setIsLoading(false);
    if (walletData) {
      setUserEthAddress(walletData.currentWalletAddress);
      setEthBalance(walletData.ethBalance);
      setItemBalance(walletData.itemBalance);
      setApeNotRealAvs(walletData.apeNotRealAvs);
    }
  }
  
  async function handleMintNft() {
    await mint();

    // Re-fetch NFT data after minting
    try {
      const provider = await initializeProvider();
      const nftData = await checkNFTBalanceAndFetchMetadata(provider, userEthAddress);
      setApeNotRealAvs(nftData.apeNotRealAvs);
      setItemBalance(nftData.itemBalance);
    } catch (error) {
      console.error('Error updating NFT data:', error);
    }
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2 bg-black'>
      <main className='flex flex-col items-center justify-center w-full flex-1 px-20 text-center text-gray-300'>
        <h1 className='text-4xl md:text-5xl font-bold'>
          Welcome to <br />
          <span className='text-blue-600'>Dapp ApeNotReal NFT!</span>
        </h1>

        <ul className='mt-4 list-decimal text-left'>
          <li>Connect MetaMask to Polygon Amoy Testnet</li>
          <li>Mint NFT</li>
          <li>View NFT on this page</li>
        </ul>

        <div className='flex-col flex-wrap items-center justify-around max-w-4xl my-4 sm:w-full'>
          <BalanceCard
            ethBalance={ethBalance}
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

          {isLoading && (
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