"use client"
import React from "react";
import { useState, useEffect } from "react";
import { ethers } from 'ethers';
import detecEthereumProvider from "@metamask/detect-provider";

const WalletContext = React.createContext(null);

export const WalletProvider = ({ children }) => {

    // STATES
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [chainId, setChainId] = useState(null);

    let currentAccount = null;

    // EVENT METAMASK
    useEffect(() => { 
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleAccountsChanged);
          
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleAccountsChanged);
      }
    }, []);
    
    const startApp = (provider) => {
        if (provider !==  window.ethereum) {
            console.log("Do you have multiple wallets installed ?");
        }
    }

    const handleChainChanged = () => {
        window.location.reload();
    };

    const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
            console.log('Account disconnected');
        } else if (accounts[0] !== currentAccount) {
            console.log('Account changed');
            currentAccount = accounts[0];
            setAccount(currentAccount);
            setProvider(new ethers.BrowserProvider(window.ethereum)); 
        } else {
            console.log('Account does not changed');
        }
    };

    const connect = async() => {
        const provider = await detecEthereumProvider();
        if (provider) {
            console.log("connect withj provider")
            startApp(provider);
            const chainId = await ethereum.request({method: 'eth_chainId'});
            if (chainId.toString() === '0x5') { // Goerli
                ethereum.request({method: 'eth_requestAccounts'})
                    .then(handleAccountsChanged)
                    .catch((err) => {
                        if (err.code === 4001) {
                            console.log('Please connect to Metamask!')
                        } else {
                            console.log(err);
                        }
                    }) ;
            } else {
                console.log("Please change your network on Metamask, you need to be connected to Goerli test network!");    
            }
        } else {
            console.log("Please install metamask");
        }
    }

    return (
        <WalletContext.Provider value={{account, provider, setAccount, chainId, connect}} >
            {children}
        </WalletContext.Provider>
    );

};

export default WalletContext;
