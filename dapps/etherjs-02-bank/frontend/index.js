import { ethers } from '../backend/node_modules/ethers/dist/ethers.min.js';
import { contractAddress, contractABI } from './constant.js';
 

const loadContractWithProvider = () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contractWithProvider = new ethers.Contract(contractAddress, contractABI, provider);
    return {provider, contractWithProvider};
};
const loadContractWithSigner = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contractWithSigner = new ethers.Contract(contractAddress, contractABI, signer);
    return {provider, signer, contractWithSigner};
};

const connectBtn = document.getElementById('connectBtn');
const balanceSpan = document.getElementById('balanceSpan');
const getBalanceBtn = document.getElementById('getBalanceBtn');
const sendInput = document.getElementById('sendInput');
const sendBtn = document.getElementById('sendBtn');
const withdrawInput = document.getElementById('withdrawInput');
const withdrawBtn = document.getElementById('withdrawBtn');

let connectedAccount;

// What happens when the user clicks on the connect button
connectBtn.addEventListener('click', async () => {
    if(typeof window.ethereum !== 'undefined') {
        const resultAccount = await window.ethereum.request({ method: 'eth_requestAccounts' });
        connectedAccount = ethers.getAddress(resultAccount[0])
        connectBtn.innerHTML = "Connected with " + connectedAccount.substring(0, 4) + "..." + connectedAccount.substring(connectedAccount.length - 4)
    } else {
        connectBtn.innerHTML = "Please install Metamask!"
    }
})

getBalanceBtn.addEventListener('click', async () => {
    if(typeof window.ethereum !== "undefined" && connectedAccount) {
        try {
            const { provider, contractWithProvider } = await loadContractWithProvider(); 
            // const network = await provider.getNetwork()
            // console.log(network.chainId.toString())
 
            let balance = await provider.getBalance(contractAddress);
            balance = ethers.formatUnits(balance, "ether");
            balanceSpan.innerHTML = balance + " ether";
        }
        catch(e) {
            console.log(e)
        }
    }
})

sendBtn.addEventListener('click', async () => {
    if(typeof window.ethereum !== "undefined" && connectedAccount) {
        try {
            let amountToSend = sendInput.value; 
            amountToSend = ethers.parseEther(amountToSend); 
            console.log("amount to send B: "+amountToSend);

            const { contractWithSigner } = await loadContractWithSigner(); 

            // Receive an event when ANY transfer occurs
            // contractWithSigner.on("Transfer", (from, to, amount, event) => {
            //     console.log(`${ from } sent ${ formatEther(amount) } to ${ to}`);
            //     // The event object contains the verbatim log data, the
            //     // EventFragment and functions to fetch the block,
            //     // transaction and receipt and event functions
            // });
            
            console.log(contractWithSigner); 
            
            await contractWithSigner.sendEthers({value: amountToSend});

        } catch(e) {
            console.log(e)
        }
    }
})

withdrawBtn.addEventListener('click', async () => {
    if(typeof window.ethereum !== "undefined" && connectedAccount) {
        try {
            let withdrawAmount = withdrawInput.value;
            withdrawAmount = ethers.parseEther(withdrawAmount); 
            console.log("amount to withdraw: "+withdrawAmount);
            
            const { contractWithSigner } = await loadContractWithSigner(); 

            await contractWithSigner.withdraw(withdrawAmount);
            
        } catch(e) {
            console.log(e)
        }
    }
})