import { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import { transformCharacterData } from './../constants';

const useContract = ({
  account,
  contractAddress,
  contractABI,
  onCharacterMint,
  onAttackComplete,
  isDebug,
}) => {
  const contractRef = useRef(null);
  const [characterNFT, setCharacterNFT] = useState(null);
  const [allCharacterNFT, setAllCharacterNFT] = useState([]);
  const [boss, setBoss] = useState(null);
  const [attackState, setAttackState] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const consoleLog = (...args) => isDebug && console.log(...args);

  // Make sure we have access to window.ethereum
  const getEthereum = () => {
    const { ethereum } = window;
    if (!ethereum) {
      consoleLog('Make sure you have a connected wallet');
      setError({
        type: 'ethereum',
        message: 'Make sure you have a connected wallet',
      });
      return false;
    }

    return ethereum;
  };

  const handleCharacterNFTMinted = (from, tokenId) => {
    const tokenIdNumber = tokenId.toNumber();
    consoleLog({ from, tokenIdNumber });
    console.log(
      `https://testnets.opensea.io/assets/${contractAddress}/${tokenIdNumber}`
    );
    setCharacterNFT(tokenIdNumber);
    onCharacterMint && onCharacterMint(tokenIdNumber);
  };

  const handleAttackComplete = (newBossHp, newPlayerHp) => {
    const bossHp = newBossHp.toNumber();
    const playerHp = newPlayerHp.toNumber();

    console.log(`AttackComplete: Boss Hp: ${bossHp} Player Hp: ${playerHp}`);

    /*
     * Update both player and boss Hp
     */
    setBoss((prevState) => {
      return { ...prevState, hp: bossHp };
    });

    setCharacterNFT((prevState) => {
      return { ...prevState, hp: playerHp };
    });
  };

  useEffect(() => {
    const ethereum = getEthereum();
    if (!ethereum) return;

    setIsLoading(true);

    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      contractRef.current = connectedContract;
    } catch (error) {
      consoleLog(error);
      setError({ type: 'contract', message: error.message });
    }

    setIsLoading(false);
  }, [contractAddress, contractABI]);

  useEffect(() => {
    if (!contractRef.current) return;

    try {
      // This will essentially "capture" our event when our contract throws it.
      contractRef.current.on('CharacterNFTMinted', handleCharacterNFTMinted);
    } catch (error) {
      consoleLog(error);
      setError({ type: 'minting', message: error.message });
    }

    setIsLoading(false);

    return () => {
      contractRef.current.removeListener(
        'CharacterNFTMinted',
        handleCharacterNFTMinted
      );
    };
  }, [contractRef.current]);

  useEffect(() => {
    if (!contractRef.current) return;

    try {
      // This will essentially "capture" our event when our contract throws it.
      contractRef.current.on('AttackComplete', handleAttackComplete);
    } catch (error) {
      consoleLog(error);
      setError({ type: 'attack-event', message: error.message });
    }

    setIsLoading(false);

    return () => {
      contractRef.current.removeListener(
        'AttackComplete',
        handleAttackComplete
      );
    };
  }, [contractRef.current]);

  const mintCharacterNft = async (characterId) => {
    setIsLoading(true);

    try {
      consoleLog('Going to pop wallet now to pay gas...');
      const mintTxn = await contractRef.current.mintCharacterNFT(characterId);
      consoleLog('mining...');

      await mintTxn.wait();
      console.log('mintTxn:', mintTxn);

      consoleLog(
        `Mined, see transaction: https://rinkeby.etherscan.io/tx/${mintTxn.hash}`
      );
    } catch (error) {
      consoleLog(error);
      setError({ type: 'minting', message: error.message });
    }
  };

  const fetchNFTMetadata = async () => {
    if (!contractRef.current || !account) return;
    setIsLoading(true);

    const nft = await contractRef.current.checkIfUserHasNFT();
    let nextCharacterNFT;
    if (nft.name) {
      console.log('User has character NFT');
      nextCharacterNFT = transformCharacterData(nft);
      setCharacterNFT(nextCharacterNFT);
    } else {
      console.log('No character NFT found');
    }
    setIsLoading(false);
    return nextCharacterNFT;
  };

  const fetchDefaultCharacters = async () => {
    if (!contractRef.current || !account) return;
    setIsLoading(true);

    /*
     * Call contract to get all mint-able characters
     */
    const charactersTxn = await contractRef.current.getAllDefaultCharacters();
    console.log('charactersTxn:', charactersTxn);

    /*
     * Go through all of our characters and transform the data
     */
    const characters = charactersTxn.map((characterData) =>
      transformCharacterData(characterData)
    );

    setAllCharacterNFT(characters);
    setIsLoading(false);
  };

  const fetchBoss = async () => {
    if (!contractRef.current || !account) return;

    const bossTxn = await contractRef.current.getBigBoss();
    console.log('Big Boss:', bossTxn);
    setBoss(transformCharacterData(bossTxn));
  };

  useEffect(() => {
    if (!contractRef.current || !account) return;
    const getData = async () => {
      const currentCharacter = await fetchNFTMetadata();
      console.log({ currentCharacter });
      if (!currentCharacter) {
        fetchDefaultCharacters();
      } else {
        fetchBoss();
      }
    };
    getData();
  }, [contractRef.current, account]);

  const attackBoss = async () => {
    if (!contractRef.current || !account) return;
    setIsLoading(true);

    try {
      setAttackState('attacking');
      console.log('Attacking boss...');
      const attackTxn = await contractRef.current.attackBoss();
      await attackTxn.wait();
      console.log('attackTxn:', attackTxn);
      setAttackState('hit');
    } catch (error) {
      console.error('Error attacking boss:', error);
      setError({ type: 'attack', message: error.message });
      setAttackState('');
    }
  };

  return {
    mintCharacterNft,
    characterNFT,
    allCharacterNFT,
    boss,
    attackBoss,
    attackState,
    contractIsLoading: isLoading,
    contractError: error,
  };
};

export default useContract;
