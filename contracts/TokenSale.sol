pragma solidity ^0.4.2;

import "./Token.sol";

contract TokenSale {

    address admin;
    Token public tokenContract;
    uint256 public tokenPrice;

    function TokenSale(Token _tokenContract, uint256 _tokenPrice) public {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }
}