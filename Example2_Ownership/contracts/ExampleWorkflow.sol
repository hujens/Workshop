pragma solidity ^0.5.0;

//Import role contracts to use its modifiers
import "./ArchitectRole.sol";
import "./EngineerRole.sol";

//Import Ownable contract
//import "./Ownable.sol";
import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";

// Define a contract 'ExampleWorkflow' inheriting the contracts imported above
contract ExampleWorkflow is ArchitectRole, EngineerRole, Ownable {

  // Define 'owner'
  // Not needed since only used for isOwner() modifier that is inherited from Ownable.sol
  //address payable owner;

  // Define a variable called 'upc' for Universal Product Code (UPC)
  uint  upc;
  // Define some amount that should be sent if process is executed succesfully
  // (Note: such logic should be separated from the data contract...)
  uint amount = 1 ether;

  // Define a public mapping 'objects' that maps the UPC to a object.
  mapping (uint => Object) objects;

  // Define a public mapping 'objectHistory' that maps the UPC to an array of TxHash,
  // that track its journey through the supply chain -- to be sent from DApp.
  mapping (uint => string[]) objectHistory;

  // Define enum 'State' with the following values:
  enum State
  {
    Created, // 0
    Filled,  // 1
    CheckPassed,  // 2
    CheckFailed,  // 3
    Executed // 4
  }

  State constant defaultState = State.Created;

  // Define a struct 'Object' with the following fields:
  struct Object {
    uint    upc; // Universal Product Code (UPC)
    address payable ownerID;  // Metamask-Ethereum address of the current owner as the object moves through stages
    address payable architectID; // Metamask-Ethereum address of the Architect
    string  architectName; // Architect Name
    State   objectState;  // Object State as represented in the enum above
    address payable engineerID;  // Metamask-Ethereum address of the Engineer
    string  engineerName; // Engineer Name
    string  data; // Example data that needs to be filled in;
  }

  // Define 10 events with the same 10 state values and accept 'upc' as input argument
  event Created(uint upc);
  event Filled(uint upc);
  event CheckPassed(uint upc);
  event CheckFailed(uint upc);
  event Executed(uint upc);

  // Define a modifer that checks to see if msg.sender == owner of the contract
  // Not needed since already inherited from ownable.sol
  /*
  modifier onlyOwner() {
    require(msg.sender == owner, "caller is not owner");
    _;
  }*/

  // Define a modifer that verifies the Caller
  modifier verifyCaller (address _address) {
    require(msg.sender == _address, "caller has not the correct role");
    _;
  }

  // Define a modifier that checks if the sent amount is sufficient
  modifier paidEnough() {
    require(msg.value >= amount, "sent amount not sufficient");
    _;
  }

  // Define a modifier that checks the sent amount and refunds the remaining balance to the architect
  modifier checkValue(uint _upc) {
    _; //first needs to transfer money
    uint amountToReturn = msg.value - amount;
    objects[_upc].architectID.transfer(amountToReturn);
  }

  // Define a modifier that checks if objects.objectState of a upc is Created or CheckFailed
  modifier created(uint _upc) {
    if (objects[_upc].objectState == State.Created) {
      require(objects[_upc].objectState == State.Created, "object state is not Created");
    } else {
      require(objects[_upc].objectState == State.CheckFailed, "object state is not Created or CheckFailed");
    }
    _;
  }

  // Define a modifier that checks if objects.productState of a upc is Filled
  modifier filled(uint _upc) {
    require(objects[_upc].objectState == State.Filled, "object state is not Filled");
    _;
  }

  // Define a modifier that checks if an objects.productState of a upc is CheckPassed
  modifier checked(uint _upc) {
    require(objects[_upc].objectState == State.CheckPassed, "object state is not CheckPassed");
    _;
  }

  // In the constructor set 'owner' to the address that instantiated the contract
  // and set 'upc' to 1
  constructor() public payable {
    //Not needed since only used for isOwner() modifier that is inherited from Ownable.sol
    //owner = msg.sender;
    // set upc to one
    upc = 1;
  }

  // Define a function 'createObject' that allows an architect to create an object
  function createObject(string memory _architectName, address payable _engineerID, string memory _engineerName) public
  // Call modifier to verify caller of this function
  onlyArchitect
  {
    // Add the new object as part of Created
    objects[upc] = Object({
      upc: upc,
      ownerID: msg.sender,
      architectID: msg.sender,
      architectName: _architectName,
      objectState: State.Created,
      engineerID: _engineerID,
      engineerName: _engineerName,
      data: ""
      });
    // Emit the appropriate event
    emit Created(upc);
    // Increment upc
    upc = upc + 1;
  }

  // Define a function 'fillObject' that allows an engineer to mark an item 'Filled'
  function fillItem(uint _upc, string memory _data) public
  // Call modifier to verify caller of this function
  onlyEngineer
  // Call modifier to check if upc has passed previous stage
  created(_upc)
  //verify that it is the right engineer
  verifyCaller(objects[_upc].engineerID)
  {
    // Add data to the mapping
    objects[_upc].data = _data;
    objects[_upc].objectState = State.Filled;
    // Emit event
    emit Filled(_upc);
  }

  // Define a function 'checkObject' that allows the architect to mark an object 'Checked'
  // Input _checkPassed indicates whether check was successfull
  function checkObject(uint _upc, bool _checkPassed) public
  // Call modifier to verify caller of this function
  onlyArchitect
  // Call modifier to check if upc has passed previous stage
  filled(_upc)
  //verify that it is the right customer
  verifyCaller(objects[_upc].architectID)
  {
    // Update the check status
    if (_checkPassed == true) {
      objects[_upc].objectState = State.CheckPassed;
      // Emit event
      emit CheckPassed(_upc);
    } else {
      objects[_upc].objectState = State.CheckFailed;
      // Emit event
      emit CheckFailed(_upc);
    }
  }

  // Define a function 'executeLogic' that allows the customer to execute the wished logic and mark the object "Executed"
  function executeLogic(uint _upc) public payable
  // Call modifier to verify caller of this function
  onlyArchitect
  // Call modifier to check if upc has passed previous supply chain stage
  checked(_upc)
  //verify that it is the right architect
  verifyCaller(objects[_upc].architectID)
  // Call modifer to check if buyer has paid enough
  paidEnough()
  // Call modifer to send any excess ether back to buyer
  checkValue(_upc)
  {
    // Execute some logic here... Exemplary the architect sends the specified "amount" to the engineer
    objects[_upc].engineerID.transfer(amount);
    // Update state
    objects[_upc].objectState = State.Executed;
    // Emit the appropriate event
    emit Executed(_upc);
  }

  // Define a function 'fetchItemBufferOne' that fetches the first data entries (max. 7)
  function fetchItemBufferOne(uint _upc) public view returns
  (
    uint    objectUPC,
    address ownerID,
    address architectID,
    string memory architectName
  )
  {
  return
  (
    objectUPC = objects[_upc].upc,
    ownerID = objects[_upc].ownerID,
    architectID = objects[_upc].architectID,
    architectName = objects[_upc].architectName
  );
  }

  // Define a function 'fetchItemBufferTwo' that fetches the rest of the data entries (max. 7)
  function fetchItemBufferTwo(uint _upc) public view returns
  (
    uint objectState,
    address engineerID,
    string memory engineerName,
    string memory data
  )
  {
  return
  (
    objectState = uint(objects[_upc].objectState),
    engineerID = objects[_upc].engineerID,
    engineerName = objects[_upc].engineerName,
    data = objects[_upc].data
  );
  }

}
