/*
const HDWalletProvider = require('truffle-hdwallet-provider');
const fs = require('fs');
const infuraKey = fs.readFileSync(".secretInfuraKey").toString().trim();
const mnemonic = fs.readFileSync(".secretMnemonic").toString().trim();
*/

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545, //Port 8545 for canache-cli, Port 7545 for Ganache-GUI
      network_id: "*" // Match any network id
    }/*,
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${infuraKey}`),
      network_id: 4,       // Rinkeby's id
      gas: 4500000,        // Rinkeby has a lower block limit than mainnet
      gasPrice: 10000000000
      //confirmations: 2,    // # of confs to wait between deployments. (default: 0)
      //timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      //skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    }*/
  }
};