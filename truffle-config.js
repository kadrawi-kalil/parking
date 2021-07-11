require('babel-register');
require('babel-polyfill');
require('dotenv').config();
const HDWalletProvider = require('truffle-hdwallet-provider-privkey');
const privateKeys = "b272a2045d42624d42a9938782df83c5645b36116f6d826941053fa629ae8d51"

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(
          privateKeys.split(','), // Array of account private keys
          `https://rinkeby.infura.io/v3/d566da53e602438aaf5feba485d23bd1`// Url to an Ethereum Node
        )
      },
      gas: 5000000,
      gasPrice: 25000000000,
      network_id: 4
    }
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}