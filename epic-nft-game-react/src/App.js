import React from 'react';
import SelectCharacter from './Components/SelectCharacter';
import Arena from './Components/Arena';

import useWallet from './hooks/useWallet';
import useContract from './hooks/useContract';
import { contractAddress } from './constants';
import MyEpicGame from './utils/MyEpicGame.json';

import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Constants
const TWITTER_LINK_ALE_ANNINI = `https://twitter.com/ale_annini`;
const TWITTER_LINK_BUILDSPACE = `https://twitter.com/_buildspace`;

const chainId = '0x4';
const isDebug = true;

const App = () => {
  const { account, connectWallet, walletIsLoading, walletError } = useWallet({
    chainId,
    isDebug,
  });
  const {
    mintCharacterNft,
    characterNFT,
    allCharacterNFT,
    boss,
    attackBoss,
    attackState,
    contractIsLoading,
    contractError,
  } = useContract({
    account,
    contractAddress,
    contractABI: MyEpicGame.abi,
    isDebug,
  });

  // Render Methods
  const renderContent = () => {
    /*
     * Scenario #1
     */
    if (!account) {
      return (
        <div className="connect-wallet-container">
          <img
            src="https://i.makeagif.com/media/5-22-2015/YpBgfn.gif"
            alt="Dan Petersen Gif"
          />
          <button
            disabled={walletIsLoading}
            className="cta-button connect-wallet-button"
            onClick={connectWallet}>
            Connect Wallet To Get Started
          </button>
        </div>
      );
      /*
       * Scenario #2
       */
    } else if (account && !characterNFT) {
      return (
        <SelectCharacter
          isLoading={contractIsLoading}
          characters={allCharacterNFT}
          mintCharacterNft={mintCharacterNft}
        />
      );
    } else if (account && characterNFT) {
      return (
        <Arena
          isLoading={contractIsLoading}
          boss={boss}
          characterNFT={characterNFT}
          attackBoss={attackBoss}
          attackState={attackState}
        />
      );
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">🍵 Metaverse Theine Battles 🍵</p>
          <p className="sub-text">Theine up to protect the Metaverse!</p>
          {renderContent()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK_ALE_ANNINI}
            target="_blank"
            rel="noreferrer">{`built by @ale_annini`}</a>
          <a
            className="footer-text"
            href={TWITTER_LINK_BUILDSPACE}
            target="_blank"
            rel="noreferrer">{`with @_buildspace`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
