# Solidity example 1: Tokens

This example is based on the sources below and adapted:

[Source Truffle Box](https://www.trufflesuite.com/boxes/tutorialtoken)

[Source Tutorial OpenZeppelin: Creation of Tokens](https://www.trufflesuite.com/tutorials/robust-smart-contracts-with-openzeppelin)

What you should learn with this example:
- How to specify and deploy ERC20 & ERC721 tokens using the OpenZeppelin contract templates.
- Test if the deployment was successfull. This can be done via test cases in truffle (here shown for the ERC721) or by using the front-end and metamask (here shown for the ERC20).

In case you want to learn more on how to create SmartContracts that interact with tokens, you should check out this tutorial:

[Source Tutorial Medium Coinmonks: Creating SmartContracts for Tokens](https://medium.com/coinmonks/build-a-smart-contract-that-transfers-erc20-token-from-your-wallet-to-other-addresses-or-erc20-ee8dc35f40f6)

## Functionality

ERC20: A simple fungible token called `TutorialToken` with an total supply of 10'000 units.

ERC721: A non-fungible token `TutorialERC721` representing a star with a name and ID. The smart contract allows to create new stars, put them up for sale, and allowing to buy and sell these stars.

## Use Truffle to test and deploy contract

Contract deployment and testing is done via [Truffle](https://truffleframework.com/). To install Truffle:

```
npm install -g truffle
```

## Deployment

First, start [Ganache](https://www.trufflesuite.com/ganache).

Point in `truffle.js` (Mac) or `truffle-config.js` (Windows) the network `development` to the right port of your local Gancache blockchain (usually HTTP://127.0.0.1:7545 for the GUI).

Compile the contracts:
```
truffle compile
```

Deploy the contracts to the local blockchain:
```
truffle migrate --reset --network development
```

## Testing the ERC721 contract with test cases

Run the test cases with the command:

```
truffle test
```

## Testing the ERC20 contract with Ganache and the Front-End (Metamask)

Run the `liteserver` development server (in a new console tab) for front-end hot reloading. Smart contract changes must be manually recompiled and migrated. It serves the front-end on http://localhost:3000.

```
npm run dev
```

Now you can interact with addresses that hold the token through metamask. To show the custom token in Metamask, you need to create a [custom token](https://tokenmint.io/blog/how-to-add-your-custom-erc-token-to-metamask.html) using the contract address of the tutorial ERC20 token.




