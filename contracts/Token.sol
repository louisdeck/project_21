pragma solidity ^0.4.2;

// doc => https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md
contract Token {
    
    string public name;
    string public symbol;
    uint public decimals; 
    uint256 public totalSupply;

    // balanceOf(address => balance)
    mapping(address => uint) public balanceOf;
    /*function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }*/


    //mapping(A => mapping(B => X))
    // B account is allowed to spend X tokens for A account
    mapping(address => mapping(address => uint256)) public allowance;
    /*function allowance(address _owner, address _spender) public view returns (uint256 remaining) {
        return allowed[_owner][_spender];
    }*/

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

    function Token(string _name, string _symbol, uint _decimals, uint256 _initSupply) public {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
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

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[_from] >= _value && allowance[_from][msg.sender] >= _value);
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