pragma solidity ^0.5.0;

// Import 'Roles' from OpenZeppelin:
import "../node_modules/openzeppelin-solidity/contracts/access/Roles.sol";

// Define a contract 'ContractorRole' to manage this role - add, remove, check
contract ArchitectRole {
  using Roles for Roles.Role;

  // Events, one for Adding, and other for Removing
  event ContractorAdded(address indexed account);
  event ContractorRemoved(address indexed account);

  // Defining a struct 'architects' by inheriting from 'Roles' library, struct Role
  Roles.Role private architects;

  // In the constructor make the address that deploys this contract the 1st Architect
  constructor() public {
    _addArchitect(msg.sender);
  }

  // Defining a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyArchitect() {
    require(isArchitect(msg.sender), "sender is not an architect");
    _;
  }

  // Define a function 'isContractor' to check this role
  function isArchitect(address account) public view returns (bool) {
    return architects.has(account);
  }

  // Define a function 'addArchitect' that adds this role
  function addArchitect(address account) public onlyArchitect {
    _addArchitect(account);
  }

  // Define a function 'renounceArchitect' to renounce this role
  function renounceArchitect() public {
    _removeArchitect(msg.sender);
  }

  // Define an internal function '_addArchitect' to add this role, called by 'addArchitect'
  function _addArchitect(address account) internal {
    architects.add(account);
    emit ContractorAdded(account);
  }

  // Define an internal function '_removeArchitect' to remove this role, called by 'removeArchitect
  function _removeArchitect(address account) internal {
    architects.remove(account);
    emit ContractorRemoved(account);
  }
}