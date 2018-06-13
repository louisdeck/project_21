var Token = artifacts.require("./Token.sol");
var TokenSale = artifacts.require("./TokenSale.sol");

module.exports = function(deployer) {
  deployer.deploy(Token, "ARP21", "ARP", 18, 2100000).then(function(){
    return deployer.deploy(TokenSale, Token.address, 10000000000000000);//token.address given ?
                                                     //whereas the var in the constructor that we have to give is typed as a 'Token';
  });
};
