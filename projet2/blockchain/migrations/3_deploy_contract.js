const FactureTracker = artifacts.require("PaiementTracker");

module.exports = function (deployer) {
  // Déployer le contrat FactureTracker
  deployer.deploy(FactureTracker);
}; 