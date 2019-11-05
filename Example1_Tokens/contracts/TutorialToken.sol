pragma solidity ^0.5.0;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract TutorialToken is ERC20 {

// Definition of token details
string public name = "TutorialToken";
string public symbol = "TT";
uint8 public decimals = 2;
uint public INITIAL_SUPPLY = 10000;

// Mint all tokens with the total supply and give it to the contract deployer
constructor() public {
  _mint(msg.sender, INITIAL_SUPPLY);
}

}