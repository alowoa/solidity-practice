//import SimpleStorageABI from './SimpleStorage.abi.js';
// const SimpleStorageABI = require('./SimpleStorage.abi.js');

export const SimpleStorageABIJSON = [
    {
      "inputs": [],
      "name": "getMyNumber",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_myNumber",
          "type": "uint256"
        }
      ],
      "name": "setMyNumber",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];
export const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

