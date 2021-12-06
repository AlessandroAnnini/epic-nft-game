const contractAddress = '0x97E895D97cEfec092185dd72da8388bAFdb93228';

const transformCharacterData = (characterData) => ({
  name: characterData.name,
  imageURI: characterData.imageURI,
  hp: characterData.hp.toNumber(),
  maxHp: characterData.maxHp.toNumber(),
  attackDamage: characterData.attackDamage.toNumber(),
});

export { contractAddress, transformCharacterData };
