const Lock = artifacts.require("Lock");

module.exports = async function(deployer, network, accounts) {
  // 1) calculer le timestamp actuel
  const now = Math.floor(Date.now() / 1000);
  
  // 2) définir le délai de verrouillage : ici + 1 minute
  const unlockTime = now + 60;

  // 3) déployer avec unlockTime et 1 ether envoyé au contrat
  await deployer.deploy(
    Lock,
    unlockTime,
    { 
      from: accounts[0],
      value: web3.utils.toWei("1", "ether")
    }
  );

  const lockInstance = await Lock.deployed();
  console.log("Lock déployé à :", lockInstance.address);
};