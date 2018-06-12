pragma solidity ^0.4.2;

// doc => https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md
contract Token {

    //VARIABLES DECLARATION
    string public name = "ARP21"; //ARP21
    string public symbol = "ARP"; //ARP
    uint public decimals = 21; //21
    uint256 public totalSupply; //21,000,000

    // Can create too a function instead of a mapping, same kinda
    // balanceOf(address => balance)
    mapping(address => uint) public balanceOf;
    /*function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }*/


    //allowance (_owner_adr => spender_adr + value)
    //nested mapping ^_^ 
    mapping(address => mapping(address => uint256)) public allowance;

    //EVENTS DECLARATION
    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    event Approval(
        address indexed _owner, 
        address indexed _spender, 
        uint256 _value
    );

    //CONSTRUCTOR, warning : same fonction name that contract name for constructor: deprecated
    function Token(uint256 _initSupply) public {
        balanceOf[msg.sender] = _initSupply;
        totalSupply = _initSupply;
    }

    //FONCTIONS/METHODS
    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        Transfer(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[_from] >= _value);
        require(allowance[_from][msg.sender] >= _value);
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        Transfer(_from, _to, _value);
        return true;
     }

     function approve(address _spender, uint256 _value) public returns (bool success) {
         allowance[msg.sender][_spender] = _value;//allowance => nested mapping
         Approval(msg.sender, _spender, _value);
         return true;
     }
}