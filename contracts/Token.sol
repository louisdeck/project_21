pragma solidity ^0.4.2;

// doc => https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md
contract Token {

    //vars declaration
    string public name;
    string public symbol;
    string public decimals;
    uint256 public totalSupply;

    //balanceOf, transfer, transferFrom, approve, allowance (methods)
    // Transfer, Approval (events)
    mapping(address => uint) public balanceOf;

    function Token(uint256 _initSupply) public {
        balanceOf[msg.sender] = _initSupply;
        totalSupply = _initSupply;
    }
}