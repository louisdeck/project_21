var Token =  artifacts.require("./Token.sol");

contract('Token', function(accounts) {
    var tokenInstance;

    it("sets the total supply upon deployment", function() {
        return Token.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply) {
            assert.equal(totalSupply.toNumber(), 21000000, "sets total supply to 21,000,000");
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(adminBalance){
            assert.equal(adminBalance.toNumber(), 1000000, "it allocates the initial supply to the admin account");
        });
    });
});