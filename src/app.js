App = {
    web3Provider : null,
    contracts : {},
    account : "0x0",
    loading: false,
    tokenPrice : 10000000000000000,
    nbTokensSold : 0,
    nbTokensAvailable : 10500000,

    init : function()
    {
        console.log("app initialized");
        return App.initWeb3();
    },

    //init web3 library to interact with ethereum blockchain on browser
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

    //insert blockchain datas into frontend stuff
    render : function() {
        var loader = $("#loader");
        var content = $("#content");

        if(App.loading){
            return;
        }
        App.loading = true;

        loader.show();
        content.hide();

        web3.eth.getCoinbase(function(err, account) {
            if(err == null)
                App.account = account;
            $("#account-address").html("Account : " + account);
            
        });

        //print tokenPrice, nbTokensSold and nbTokensAvailable + progress bar 
        App.contracts.TokenSale.deployed().then(function(i){
            TokenSaleInstance = i;
            return TokenSaleInstance.tokenPrice();
        }).then(function(tokenPrice){
            App.tokenPrice = tokenPrice;
            $(".token-price").html(web3.fromWei(App.tokenPrice, "ether").toNumber());
            return TokenSaleInstance.nbTokensSold();
        }).then(function(nbTokensSold){
            App.nbTokensSold = nbTokensSold.toNumber();
            $(".tokens-sold").html(App.nbTokensSold);
            $(".tokens-available").html(App.nbTokensAvailable);
            var progress = (App.nbTokensSold / App.nbTokensAvailable) * 100;
            $("#progress").css("width", progress + "%");
        });

        //print balance
        App.contracts.Token.deployed().then(function(i){
            TokenInstance = i;
            return TokenInstance.balanceOf(App.account);
        }).then(function(balance){
            $(".balance").html(balance.toNumber());
            App.loading = false;
            loader.hide();
            content.show();
        });
    },

    buyToken : function() {
        var loader = $("#loader");
        var content = $("#content");
        var nbTokens = $("#nbTokens").val();
        var gasLimit = 500000;
        var gasPrice = 20000000000;

        loader.show();
        content.hide();

        App.contracts.TokenSale.deployed().then(function(i){
            return i.buyToken(nbTokens, { from : App.account, value : nbTokens * App.tokenPrice, gas : gasLimit, gasPrice : gasPrice});
        }).then(function(result){
            console.log("Tokens bought...");
            $("form").trigger("reset");//reset value of nbTokens in form
            loader.hide();
            content.show();
            console.log("good");
        });
    }
}

$(function(){
    $(window).on('load', function(){
        App.init();
    })
});
