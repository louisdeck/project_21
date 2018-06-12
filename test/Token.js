var Token =  artifacts.require("./Token.sol");

contract("Token", function(accounts) {
    var tokenInstance;

    it("initializes the contracts with the correct inputs", function(){//test to verify good inputs
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
            assert.equal(decimals.toNumber(), 21, "check if token decimals number is correct")
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


    it("transfers token ownership", function() {//Transfer test
        return Token.deployed().then(function(instance) {
          tokenInstance = instance;
          return tokenInstance.transfer.call(accounts[1], 999999999);//doesn"t trigger transfer transaction with call, 
                                                                                   //just to trigger return data
        }).then(assert.fail).catch(function(error) {
          assert(error.message.indexOf("revert") >= 0, "error message must contain revert");
          return tokenInstance.transfer.call(accounts[1], 500000, { from: accounts[0] });//right here
        }).then(function(success) {
          assert.equal(success, true, "it returns true");
          return tokenInstance.transfer(accounts[1], 500000, { from: accounts[0] });
        }).then(function(receipt) {//Receipt => metadatas
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


      it("approves tokens for delegated transfer", function(){//Approve and allowance test
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

      it("handles delegated token transfers", function(){
          return Token.deployed().then(function(i){
              tokenInstance = i;
              fromAccount = accounts[2];
              toAccount = accounts[3];
              spendingAccount = accounts[4];
              return tokenInstance.transfer(fromAccount, 100, {from : accounts[0]});
          }).then(function(receipt){
              return tokenInstance.approve(spendingAccount, 10, {from : fromAccount});//Approve spendingAccount to spend 10 tokens from fromAccount
          }).then(function(receipt){
              return tokenInstance.transferFrom(fromAccount, toAccount, 999, {from : spendingAccount});//Try transferring something larger than sender's balance
          }).then(assert.fail).catch(function(error){
              assert(error.message.indexOf("revert") >= 0, "can't transfer value larger than balance");
              return tokenInstance.transferFrom(fromAccount, toAccount, 20 , {from :spendingAccount})//try transferring something larger than approved amount
          }).then(assert.fail).catch(function(error){
              assert(error.message.indexOf("revert") >= 0, "can't transfer value larger than approved amount");
              return tokenInstance.transferFrom.call(fromAccount, toAccount, 10, {from : spendingAccount});
          }).then(function(success){
              assert.equal(success, true, "it returns true");
              return tokenInstance.transferFrom(fromAccount, toAccount, 10, {from : spendingAccount});
          }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, "triggers one event");
            assert.equal(receipt.logs[0].event, "Transfer", "should be the 'Transfer' event");
            assert.equal(receipt.logs[0].args._from, fromAccount, "logs the account the tokens are authorized by");
            assert.equal(receipt.logs[0].args._to, toAccount, "logs the account the tokens are authorized to");
            assert.equal(receipt.logs[0].args._value, 10, "logs the transfer amount");
            return tokenInstance.balanceOf(fromAccount);
          }).then(function(balance){
              assert.equal(balance.toNumber(), 90, "deducts the amount from the sending account");
              return tokenInstance.balanceOf(toAccount);
          }).then(function(balance){
              assert.equal(balance.toNumber(), 10, "adds the amount from the receiving account");
              return tokenInstance.allowance(fromAccount, spendingAccount);
          }).then(function(allowance){
              assert.equal(allowance.toNumber(), 0, "deducts the amount from the allowance");
          });
      });
});