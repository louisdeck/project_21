var TokenSale = artifacts.require("./TokenSale.sol");

contract("Token Sale", function(accounts){
    var instance;
    var tokenPrice = 10000000000000000; //WEI, 0.01 ETH

    it("init contract w/ correct values", function() {
        return TokenSale.deployed().then(function(i){
            instance = i;
            return instance.address;
        }).then(function(address){
            assert.notEqual(address, 0x0, "token contract address"); 
            return instance.tokenContract();
        }).then(function(address){
            assert.notEqual(address, 0x0, "token contract address");  
            return instance.tokenPrice();
        }).then(function(price){
            assert(price, tokenPrice, "token price correct");

        })
    });
});

