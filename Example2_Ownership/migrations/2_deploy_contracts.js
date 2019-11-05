// migrating the appropriate contracts
var ArchitectRole = artifacts.require("./ArchitectRole.sol");
var EngineerRole = artifacts.require("./EngineerRole.sol");
var ExampleWorkflow = artifacts.require("./ExampleWorkflow.sol");

module.exports = function(deployer) {
  deployer.deploy(ArchitectRole);
  deployer.deploy(EngineerRole);
  deployer.deploy(ExampleWorkflow);
};
