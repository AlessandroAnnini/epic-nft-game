const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory('MyEpicGame');
  const gameContract = await gameContractFactory.deploy(
    ['Lipton', 'Nestea', 'Estathe'], // Names
    [
      // ipfs images
      'QmeE4UmLK77c32eXiLDR3KFD9QBFgttcqCQjN8sKqwjetx',
      'QmcFypuMy4QDnT16UtHiefw4m1VhZ6qenaqhUHGXc7WBUV',
      'QmY6a92KDEF3e8BANjYi45saJ7p1BK7DpQqHe241ebcsir',
    ],
    [5000, 2500, 1300], // HP values
    [250, 500, 1000], // Attack damage values
    'Huang Shan Mao Feng', // Boss name
    'QmfYbSkHsa8dkBEt3TcdAm7C1cdJjQtoNJy1GmULe2ju8U', // ipfs Boss image
    100000, // Boss hp
    500 // Boss attack damage
  );
  await gameContract.deployed();
  console.log('Contract deployed to:', gameContract.address);

  let txn;
  // We only have three characters.
  // an NFT w/ the character at index 2 of our array.
  txn = await gameContract.mintCharacterNFT(2);
  await txn.wait();

  txn = await gameContract.attackBoss();
  await txn.wait();

  txn = await gameContract.attackBoss();
  await txn.wait();

  console.log('Done!');

  // Get the value of the NFT's URI.
  // let returnedTokenUri = await gameContract.tokenURI(1);
  // console.log('Token URI:', returnedTokenUri);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
