const SIMPLE_STORAGE_ABI = require('./contract/SimpleStorage.abi.json');
const CONFIG = require('./secret-config.json');
const { Web3 } = require('web3'); 


const ALCHEMY_RPC_URL = 'https://eth-sepolia.g.alchemy.com/v2/'+ CONFIG.SEPOLIA_PK;
 
const web3 = new Web3(ALCHEMY_RPC_URL);

// get balance from a public address
web3.eth.getBalance(WALLET_PUBLIC_ADDR)
    .then((weiBalance) => { 
        const balance = web3.utils.fromWei(weiBalance, 'ether');
        console.log(`Balance: ${balance} ether`);
    }
);

const simpleStorage = new web3.eth.Contract(SIMPLE_STORAGE_ABI, CONFIG.SIMPLE_STORAGE_SEPOLIA_ADDR);

 
simpleStorage.methods.get().call()
    .then((valueStored) =>  console.log(`simpleStorage.get() = ${valueStored}`));

