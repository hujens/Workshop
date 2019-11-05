pragma solidity ^0.5.0;

// Import 'Roles' from OpenZeppelin:
import "../node_modules/openzeppelin-solidity/contracts/access/Roles.sol";

// Define a contract 'EngineerRole' to manage this role - add, remove, check
contract EngineerRole {
  using Roles for Roles.Role;

  // 2 events, one for Adding, and other for Removing
  event EngineerAdded(address indexed account);
  event EngineerRemoved(address indexed account);

  // Defining a struct 'customers' by inheriting from 'Roles' library, struct Role
  Roles.Role private engineers;

  // In the constructor make the address that deploys this contract the 1st customer
  constructor() public {
    _addEngineer(msg.sender);
  }

  // Define a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyEngineer() {
    require(isEngineer(msg.sender), "sender is not an engineer");
    _;
  }

  // Define a function 'isEngineer' to check this role
  function isEngineer(address account) public view returns (bool) {
    return engineers.has(account);
  }

  // Define a function 'addEngineer' that adds this role
  function addEngineer(address account) public onlyEngineer {
    _addEngineer(account);
  }

  // Define a function 'renounceEngineer' to renounce this role
  function renounceEngineer() public {
    _removeEngineer(msg.sender);
  }

  // Define an internal function '_addEngineer' to add this role, called by 'addEngineer'
  function _addEngineer(address account) internal {
    engineers.add(account);
    emit EngineerAdded(account);
  }

  // Define an internal function '_removeEngineer' to remove this role, called by 'removeEngineer'
  function _removeEngineer(address account) internal {
    engineers.remove(account);
    emit EngineerRemoved(account);
  }
}