// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Game {
    address owner;

    event Play(address indexed _player);
    event Transfer(address indexed _from, address indexed _to, uint256 _amount);

    mapping(address=>bool) public isRegistered;
    mapping(address=>uint256) public scoreOf;

    constructor() {
        address _owner = msg.sender;
        owner = _owner;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    modifier mustBeRegistered {
        require(isRegistered[msg.sender] == true, "You can't play without being registered");
        _;
    }

    function register() public payable {
        require(isRegistered[msg.sender] == false, "You are already registered.");
        require(msg.value >= 0.1 ether, "You must send 0.1 ether to register.");

        payable(owner).transfer(0.1 ether);
        isRegistered[msg.sender] = true;
    }

    function play() public mustBeRegistered {
        scoreOf[msg.sender] += 10;

        emit Play(msg.sender);
    }

    function transfer(address _to, uint256 _amount) public mustBeRegistered {
        require(isRegistered[_to] == true, "You can't send money to a non-registered account.");
        require(scoreOf[msg.sender] >= _amount, "You can't send more than you own.");

        scoreOf[msg.sender] -= _amount;
        scoreOf[_to] += _amount;

        emit Transfer(msg.sender, _to, _amount);
    }
}
