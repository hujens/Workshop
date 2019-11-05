# Solidity example 0: Simple Bank

This example is taken from the sources below and adapted slightly.

[Source Codementor](https://www.codementor.io/rogargon/exercise-simple-solidity-smart-contract-for-ethereum-blockchain-m736khtby)

[Source Github](https://github.com/rogargon/simple_bank)

What you should learn:
- Example of functionality and structure of a smart contract written in Solidity
- How to test and interact with the smart contract on Remix IDE
- How to deploy the smart contract to a local test net with Truffle
- How to test the smart contract using test cases in Truffle

## Migrations file

This is a modified version of the Simple Bank smart contract example using Solidity. 
Instead of rewarding all clients, which means that the bank contract should hold all that Ether beforehand,
it only rewards the 3 first clients with 10 Ether each. 

Consequently, when deployed, the contract should be fetched 30 Ether and the constructor is payable. 
To do so for tests, the Truffle deployment script `2_deploy_contracts.js` is:

```
const ether = 10**18; // 1 ether = 1000000000000000000 wei
var SimpleBank = artifacts.require("SimpleBank");

module.exports = function(deployer) {
  deployer.deploy(SimpleBank, { value: 30 * ether });
};
```

The contract features an additional method to retrieve all the Ether in the contract.

## Test SimpleBank.sol in Remix IDE

To get familiar with the contract function, open [Remix IDE](https://remix.ethereum.org/#optimize=false&evmVersion=null&version=soljson-v0.5.11+commit.c082d0b4.js) Solidity compiler. Copy and paste the SimpleBank.sol code in Remix and explore the contract functions using the JavaScriptVM Environment by selecting the compiled contract.

You can also try Remix IDE with a local [Ganache](https://www.trufflesuite.com/ganache) blockchain pointing Remix to "Web3 Provider" as an environment and the correct localhost address.

To test [Metamask](https://metamask.io), you can use "Injected Web3" as an enviroment. You then need to point Metamask to your local Ganache blockchain and import the needed accounts using their private keys.

## Use Truffle to test and deploy contract

Contract deployment and testing is done via [Truffle](https://truffleframework.com/). To install Truffle:

```
npm install -g truffle
```

Note: checked with version

* Truffle v5.0.37 / Solidity v0.5.8

## Deployment and Testing with Local Truffle sample accounts

First, start a local development network:

```
truffle develop
```

This will start Truffle Develop at http://127.0.0.1:9545 together with 10 sample accounts.

Then, compile the contracts in a different terminal (truffle develop keeps running the network):

```
truffle compile
```

If there are no errors, the contracts can be deployed to the local development network:

```
truffle migrate
```

Finally, they can be tested:

```
truffle test
```

With the following expected output:

```
Using network 'development'.

  Contract: SimpleBank - basic initialization
    ✓ should reward 3 first clients with 1 balance (168ms)
    ✓ should deposit correct amount (63ms)

  Contract: SimpleBank - proper withdrawal
    ✓ should withdraw correct amount (63ms)

  Contract: SimpleBank - incorrect withdrawal
    ✓ should keep balance unchanged if withdraw greater than balance (73ms)

  Contract: SimpleBank - fallback works
    ✓ should revert ether sent to this contract through fallback


  5 passing (482ms)
```

## Deployment and Testing with Local Ganache Blockchain

First, start [Ganache](https://www.trufflesuite.com/ganache).

Point in `truffle.js` (Mac) or `truffle-config.js` (Windows) the network `development` to the right port of your local Gancache blockchain (usually HTTP://127.0.0.1:7545 for the GUI).

Compile the contracts:
```
truffle compile
```

Deploy the contracts to the local blockchain:
```
`truffle migrate --reset --network development`
```

Finally, they can be tested:

```
truffle test
```

With the following expected output:

```
Using network 'development'.

  Contract: SimpleBank - basic initialization
    ✓ should reward 3 first clients with 1 balance (168ms)
    ✓ should deposit correct amount (63ms)

  Contract: SimpleBank - proper withdrawal
    ✓ should withdraw correct amount (63ms)

  Contract: SimpleBank - incorrect withdrawal
    ✓ should keep balance unchanged if withdraw greater than balance (73ms)

  Contract: SimpleBank - fallback works
    ✓ should revert ether sent to this contract through fallback


  5 passing (482ms)
```