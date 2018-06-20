App = {
    web3Provider : null,
    contracts : {},
    account : "0x0",

    init : function()
    {
        console.log("init");
        return App.initWeb3();
    },

    initWeb3 : function() {
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
        } 
        else {
            App.web3Provider = new Web3.providers.HttpProvider("http://localhost:7545");
            web3 = new Web3(App.web3Provider);
        }
        return App.initContract();
    },

    initContract : function() {//configure metamask on browser => custom rpc HTTP://127.0.0.1:7545/ and import ganache accs in metamask
        $.getJSON("TokenSale.json", function(tokenSale){
            App.contracts.TokenSale = TruffleContract(tokenSale);
            App.contracts.TokenSale.setProvider(App.web3Provider);
            App.contracts.TokenSale.deployed().then(function(tokenSale){
                console.log("token sale address : ", tokenSale.address);
            });
        }).done(function(){
            $.getJSON("Token.json", function(token){
                App.contracts.Token = TruffleContract(token);
                App.contracts.Token.setProvider(App.web3Provider);
                App.contracts.Token.deployed().then(function(token){
                    console.log("token sale address : ", token.address);
                });
                return App.render();
            });
        });
    },

    render : function(){
        web3.eth.getCoinbase(function(err, account) {
            if(err == null)
                App.account = account;
            $("#account-address").html("Account : " + account);
            
        });
    }
}

$(function(){
    $(window).on('load', function(){
        App.init();
    })
});
