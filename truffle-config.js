/* eslint-disable */
const HDWalletProvider = require("truffle-hdwallet-provider");
const fs = require("fs");
const mnemonic = fs
    .readFileSync(".secret")
    .toString()
    .trim();

module.exports = {
    networks: {
        development: {
            host: "127.0.0.1",
            port: 7545,
            network_id: "*"
        },
        testnet: {
            host: "127.0.0.1", // Localhost (default: none)
            port: 9545, // Standard BSC port (default: none)
            network_id: "*" ,// Any network (default: none)
            // provider: () =>
            //     new HDWalletProvider(
            //         mnemonic,
            //         `https://data-seed-prebsc-1-s1.binance.org:8545`
            //     ),
            // network_id: 97,
            confirmations: 10,
            timeoutBlocks: 200,
            skipDryRun: true,
            networkCheckTimeout: 100000,
            gasPrice: 10000000000,
        },
        bsc: {
            provider: () =>
                new HDWalletProvider(mnemonic, `https://bsc-dataseed1.binance.org`),
            network_id: 56,
            confirmations: 10,
            timeoutBlocks: 200,
            skipDryRun: true
        }
    },

    // Set default mocha options here, use special reporters etc.
    mocha: {
        // timeout: 100000
    },

    // Configure your compilers
    compilers: {
        solc: {
            optimizer: {
              enabled: true,
              runs: 200
            },
            version: "^0.5.16"
          }
    }
    ,
    contracts_directory: "./src/contracts/",
    contracts_build_directory: "./src/abis/"
};
