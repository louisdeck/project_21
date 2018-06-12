pragma solidity ^0.4.2;

// doc => https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md
contract Token {

    //vars declaration
    string public name = "ARP21"; //ARP21
    string public symbol = "ARP"; //ARP
    uint public decimals = 21; //21
    uint256 public totalSupply; //21,000,000

    /* name, symbol, decimals, totalSupply, balanceOf
       transfer, transferFrom, approve, allowance (methods)
    */
    // Transfer, Approval (events)

    // address => balance
    mapping(address => uint) public balanceOf;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    function Token(uint256 _initSupply) public {
        balanceOf[msg.sender] = _initSupply;
        totalSupply = _initSupply;
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        Transfer(msg.sender, _to, _value);
        return true;
    }
}