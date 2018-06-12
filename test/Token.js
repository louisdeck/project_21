var Token =  artifacts.require("./Token.sol");

contract("Token", function(accounts) {
    var tokenInstance;

    it("initializes the contracts with the correct inputs", function(){
        return Token.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.name();
        }).then(function(name){
            assert.equal(name, "ARP21", "check if token name is correct");
            return tokenInstance.symbol();
        }).then(function(symbol){
            assert.equal(symbol, "ARP", "check if token symbol is correct");
            return tokenInstance.decimals();
        }).then(function(decimals){
            assert.equal(decimals.toNumber(), 21, "check if token decimals is correct")
        });
    });

    it("it allocates the total supply upon deployment", function() {//test before deployment
        return Token.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply) {
            assert.equal(totalSupply.toNumber(), 21000000, "sets total supply to 21,000,000");
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(adminBalance){
            assert.equal(adminBalance.toNumber(), 21000000, "it allocates the initial supply to the admin account");
        });
    });


    it("transfers token ownership", function() {
        return Token.deployed().then(function(instance) {
          tokenInstance = instance;
          return tokenInstance.transfer.call(accounts[1], 99999999999999999999999);//doesn"t trigger transfer transaction with call, 
                                                                                   //just to trigger return data
        }).then(assert.fail).catch(function(error) {
          assert(error.message.indexOf("revert") >= 0, "error message must contain revert");
          return tokenInstance.transfer.call(accounts[1], 500000, { from: accounts[0] });//transfer test
        }).then(function(success) {
          assert.equal(success, true, "it returns true");
          return tokenInstance.transfer(accounts[1], 500000, { from: accounts[0] });
        }).then(function(receipt) {//part of transfer test
                assert.equal(receipt.logs.length, 1, "triggers one event");
                assert.equal(receipt.logs[0].event, "Transfer", "should be the 'Transfer' event");
                assert.equal(receipt.logs[0].args._from, accounts[0], "logs the account the tokens are transferred from");
                assert.equal(receipt.logs[0].args._to, accounts[1], "logs the account the tokens are transferred to");
                assert.equal(receipt.logs[0].args._value, 500000, "logs the transfer amount");
          return tokenInstance.balanceOf(accounts[1]);
        }).then(function(balance) {
          assert.equal(balance.toNumber(), 500000, "adds the amount to the receiving account");
          return tokenInstance.balanceOf(accounts[0]);
        }).then(function(balance) {
          assert.equal(balance.toNumber(), 20500000, "deducts the amount from the sending account");
        });
      });


      it("approves tokens for delegated transfer", function(){
          return Token.deployed().then(function(i){
              tokenInstance = i;
              return tokenInstance.approve.call(accounts[1], 100);
          }).then(function(success){
              assert.equal(success, true, "it returns true");
              return tokenInstance.approve(accounts[1], 100, { from: accounts[0] });
          }).then(function(receipt){
                assert.equal(receipt.logs.length, 1, "triggers one event");
                assert.equal(receipt.logs[0].event, "Approval", "should be the 'Approval' event");
                assert.equal(receipt.logs[0].args._owner, accounts[0], "logs the account the tokens are authorized by");
                assert.equal(receipt.logs[0].args._spender, accounts[1], "logs the account the tokens are authorized to");
                assert.equal(receipt.logs[0].args._value, 100, "logs the transfer amount");
                return tokenInstance.allowance(accounts[0], accounts[1]);
          }).then(function(allowance){
              assert.equal(allowance.toNumber(), 100, "stores the allowance for delegated transfer");
          });
      });
});