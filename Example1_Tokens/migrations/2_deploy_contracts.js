var TutorialToken = artifacts.require("TutorialToken");
var TutorialERC721 = artifacts.require("TutorialERC721");

module.exports = function(deployer) {
  deployer.deploy(TutorialToken);
};

module.exports = function(deployer) {
  deployer.deploy(TutorialERC721);
};