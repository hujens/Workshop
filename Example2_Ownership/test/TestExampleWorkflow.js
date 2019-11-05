// This script is designed to test the solidity smart contract ExampleWorkflow.sol

// Truffle-assertions npm package for testing events
const truffleAssert = require('truffle-assertions');

var ExampleWorkflow = artifacts.require('ExampleWorkflow');

contract('ExampleWorkflow', function(accounts) {
    var upc = 1;
    const ownerID = accounts[0];
    const architectID = accounts[1];
    const architectName = "Architect1";
    const engineerID = accounts[2];
    const engineerName = "Engineer1";
    const data = "TestData";
    const amount = web3.utils.toWei('1', "ether");
    const amount1 = web3.utils.toWei('0.9', "ether");
    const amount2 = web3.utils.toWei('2', "ether");
    //const emptyAddress = '0x00000000000000000000000000000000000000';

    console.log("ganache-cli accounts used here...");
    console.log("Owner: accounts[0] ", accounts[0]);
    console.log("Architect: accounts[1] ", accounts[1]);
    console.log("Engineer: accounts[2] ", accounts[2]);

    // 1st Test
    it("Testing smart contract function createObject() that allows an architect to generate an object", async() => {
        const exampleWorkflow = await ExampleWorkflow.deployed();
        // Add roles (also for following tests)
        await exampleWorkflow.addArchitect(architectID, {from: ownerID});
        await exampleWorkflow.addEngineer(engineerID, {from: ownerID});
        // Mark an object as Created by calling function createItem(), watch tx to check event
        let tx = await exampleWorkflow.createObject(architectName, engineerID, engineerName, {from: architectID});
        // Retrieve the just now saved item by calling function fetchItem()
        const resultBufferOne = await exampleWorkflow.fetchItemBufferOne.call(upc);
        const resultBufferTwo = await exampleWorkflow.fetchItemBufferTwo.call(upc);
        // Verify the result set
        assert.equal(resultBufferOne[0], upc, 'Error: Invalid item UPC');
        assert.equal(resultBufferOne[1], architectID, 'Error: Missing or Invalid ownerID');
        assert.equal(resultBufferOne[2], architectID, 'Error: Missing or Invalid architectID');
        assert.equal(resultBufferOne[3], architectName, 'Error: Missing or Invalid architectName');
        assert.equal(resultBufferTwo[0], 0, 'Error: invalid objectState');
        assert.equal(resultBufferTwo[1], engineerID, 'Error: Missing or Invalid engineerID');
        assert.equal(resultBufferTwo[2], engineerName, 'Error: Missing or Invalid engineerName');
        // check if event was emitted
        truffleAssert.eventEmitted(tx, 'Created');
    })

    // 2nd Test
    it("Testing smart contract function fillItem() that allows an engineer to add data", async() => {
        const exampleWorkflow = await ExampleWorkflow.deployed();
        // Mark a product as ForSale by calling function sellItem(), watch tx to check event
        let tx = await exampleWorkflow.fillItem(upc, data, {from: engineerID});
        // Retrieve the just now saved item by calling function fetchItem()
        const resultBufferOne = await exampleWorkflow.fetchItemBufferOne.call(upc);
        const resultBufferTwo = await exampleWorkflow.fetchItemBufferTwo.call(upc);      
        // Verify the result set
        assert.equal(resultBufferTwo[0], 1, 'Error: invalid objectState');
        assert.equal(resultBufferTwo[3], data, 'Error: Invalid data entry');
        // check if event was emitted
        truffleAssert.eventEmitted(tx, 'Filled');
    })

    // 3rd Test
    it("Testing smart contract function checkObject() that allows an architect to check an object", async() => {
        const exampleWorkflow = await ExampleWorkflow.deployed();
        // Declare variables to test both cases of correct and failed installation
        const checkPassed = true;
        const checkFailed = false;
        // Mark an item as checkedFailed by calling function checkObject(), watch tx to check event;
        let tx = await exampleWorkflow.checkObject(upc, checkFailed, {from: architectID});
        // Retrieve the just now saved item from blockchain by calling function fetchItem();
        const resultBufferTwo = await exampleWorkflow.fetchItemBufferTwo.call(upc)
        // Verify the result set;
        assert.equal(resultBufferTwo[0], 3, 'Error: Invalid item State')
        // check if event was emitted;
        truffleAssert.eventEmitted(tx, 'CheckFailed');
        // Refill data by calling function installItem()
        await exampleWorkflow.fillItem(upc, data, {from: engineerID});
        // Mark an item as checkPassed by calling function checkObject(), watch tx to check event;
        let tx2 = await exampleWorkflow.checkObject(upc, checkPassed, {from: architectID});
        // Retrieve the just now saved item from blockchain by calling function fetchItem();
        const resultBufferTwo_2 = await exampleWorkflow.fetchItemBufferTwo.call(upc)
        // Verify the result set;
        assert.equal(resultBufferTwo_2[0], 2, 'Error: Invalid item State')
        // check if event was emitted;
        truffleAssert.eventEmitted(tx2, 'CheckPassed');
    })

    // 4th Test
    it("Testing smart contract function executeLogic() that allows an architect to pay the engineer", async() => {
        const exampleWorkflow = await ExampleWorkflow.deployed();
        // Check if transaction fails if not enough ether is sent
        let fail = false;
        try 
        {
            await exampleWorkflow.executeLogic(upc, {from: architectID, value: amount1});   
        }
        catch(e) {
            fail = true;
        }
        assert.equal(fail, true, "Should fail when not enough ether is sent"); 
        // Check balances before transaction
        const balanceOfArchitectBeforeTransaction = await web3.eth.getBalance(architectID);
        // Execute logic by calling function executeLogic(), watch tx to check event
        let tx = await exampleWorkflow.executeLogic(upc, {from: architectID, value: amount2, gasPrice:0});   
        // Check balances after transaction
        const balanceOfArchitectAfterTransaction = await web3.eth.getBalance(architectID);
        // Verify the balances
        let value = Number(balanceOfArchitectBeforeTransaction) - Number(balanceOfArchitectAfterTransaction);
        assert.equal(value, amount);
        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await exampleWorkflow.fetchItemBufferTwo.call(upc);
        // Verify the result set
        assert.equal(resultBufferTwo[0], 4, 'Error: Invalid item State');
        // check if event was emitted
        truffleAssert.eventEmitted(tx, 'Executed');
    })

});