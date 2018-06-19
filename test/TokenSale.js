var TokenSale = artifacts.require("./TokenSale.sol");
var Token = artifacts.require("./Token.sol");

contract("Token Sale", function(accounts){
    var tokenInstance;
    var tokenSaleInstance;
    var tokenPrice = 10000000000000000;//WEI 0.01 ETH
    var admin = accounts[0];
    var buyer = accounts[1];
    var nbTokens = 21;
    var nbTokensAvailable = 10500000;//50% of 21,000,000

    it("init contract w/ correct values", function() {
        return TokenSale.deployed().then(function(i){
            tokenSaleInstance = i;
            return tokenSaleInstance.address;
        }).then(function(address){
            assert.notEqual(address, 0x0, "token contract address"); 
            return tokenSaleInstance.tokenContract();
        }).then(function(address){
            assert.notEqual(address, 0x0, "token contract address");  
            return tokenSaleInstance.tokenPrice();
        }).then(function(price){
            assert(price, tokenPrice, "token price correct");
        });
    });

    it("facilitates token buying", function(){
        return Token.deployed().then(function(i){
            tokenInstance = i;
            return TokenSale.deployed();
        }).then(function(i){
            tokenSaleInstance = i;
            return tokenInstance.transfer(tokenSaleInstance.address, nbTokensAvailable, { from : admin});
        }).then(function(receipt){
            return tokenSaleInstance.buyToken(nbTokens, {from : buyer, value : nbTokens * tokenPrice});
        }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, "triggers one event");
            assert.equal(receipt.logs[0].event, "Sell", "should be the 'Sell' event");
            assert.equal(receipt.logs[0].args._buyer, buyer, "logs the account that purchased the token");
            assert.equal(receipt.logs[0].args._amount, nbTokens, "logs number of tokens purchased");
            return tokenSaleInstance.nbTokensSold();  
        }).then(function(amount){
            assert.equal(amount.toNumber(), nbTokens, "increments number of tokens sold");
            return tokenInstance.balanceOf(buyer);
        }).then(function(balance){
            assert.equal(balance.toNumber(), nbTokens);
            return tokenInstance.balanceOf(tokenSaleInstance.address);
        }).then(function(balance){
            assert.equal(balance.toNumber(), nbTokensAvailable - nbTokens);
            return tokenSaleInstance.buyToken(nbTokens, { from : buyer , value : 1 });
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf("revert") >= 0, "value must equal number of tokens in WEI");
            return tokenSaleInstance.buyToken(21000000, { from : buyer , value : 1 });
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf("revert") >= 0, "value must be <= nbTokensAvailable");
        });
    });


    it("ends token sale", function(){
        return Token.deployed().then(function(i){
            tokenInstance = i;
            return TokenSale.deployed();
        }).then(function(i){
            tokenSaleInstance = i;
            return tokenSaleInstance.endSale({from : buyer});
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf("revert") >= 0, "must be admin to end sale");
            return tokenSaleInstance.endSale({from : admin});
        }).then(function(receipt){
            return tokenInstance.balanceOf(admin);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 2100000, "returns all unsold tokens to admin");
            balance = web3.eth.getBalance(tokenSaleInstance.address);
            assert.equal(balance.toNumber(), 0);
        });
    });
});

