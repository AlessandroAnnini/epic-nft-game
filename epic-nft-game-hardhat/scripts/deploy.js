const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory('MyEpicGame');
  const gameContract = await gameContractFactory.deploy(
    ['Lipton', 'Nestea', 'Estathe'], // Names
    [
      // images
      'https://img1.21food.com/img/cj/2014/10/9/1412791045338298.jpg',
      'https://cdn.shopify.com/s/files/1/2098/6029/products/15066891_alt01_6e4fed2a-6e65-4ed1-9724-4bab515bc683_large.jpg',
      'https://www.mineralpavani.it/1501-large_default/estathe-lattina-x-24-pz-pesca.jpg',
    ],
    [5000, 2500, 1300], // HP values
    [250, 500, 1000], // Attack damage values
    'Huang Shan Mao Feng', // Boss name
    'https://i.postimg.cc/htQsN2qF/Screenshot-2021-12-03-at-08-43-54.png', // Boss image
    100000, // Boss hp
    500 // Boss attack damage
  );
  await gameContract.deployed();
  console.log('Contract deployed to:', gameContract.address);

  // let txn;
  // // We only have three characters.
  // // an NFT w/ the character at index 2 of our array.
  // txn = await gameContract.mintCharacterNFT(2);
  // await txn.wait();

  // txn = await gameContract.attackBoss();
  // await txn.wait();

  // txn = await gameContract.attackBoss();
  // await txn.wait();

  // console.log('Done!');

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
