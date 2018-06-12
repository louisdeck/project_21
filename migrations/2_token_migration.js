var Token = artifacts.require("./Token.sol");

module.exports = function(deployer) {
  deployer.deploy(Token, "ARP21", "ARP", 21, 21000000);//set name/symbols/decimals/initialSupply
};
