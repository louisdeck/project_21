pragma solidity ^0.4.2;

import "./Token.sol";

contract TokenSale {

    address admin;
    Token public tokenContract;
    uint256 public tokenPrice;
    uint256 public nbTokensSold;

    event Sell(
        address _buyer,
        uint256 _amount
    );

    function TokenSale(Token _tokenContract, uint256 _tokenPrice) public {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    function multiply(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    function buyToken(uint256 _nbTokens) public payable {
        require(msg.value == multiply(_nbTokens, tokenPrice));
        require(tokenContract.balanceOf(this) >= _nbTokens);
        require(tokenContract.transfer(msg.sender, _nbTokens));
        
        nbTokensSold += _nbTokens;
        Sell(msg.sender, _nbTokens);
    }

    function endSale() public {
        require(msg.sender == admin);
        require(tokenContract.transfer(admin, tokenContract.balanceOf(this)));
        selfdestruct(admin);
    }
}