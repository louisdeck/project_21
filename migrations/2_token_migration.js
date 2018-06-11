var Token = artifacts.require("./Token.sol");

module.exports = function(deployer) {
  deployer.deploy(Token, 21000000);
};
