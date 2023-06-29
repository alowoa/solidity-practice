"use client"
import Head from 'next/head'
import Header from './components/Header'
import useWalletProvider from './hooks/useWalletProvider'
import { Text } from '@chakra-ui/layout'

export default function Home() {
 
  const { account, provider, setAccount, chainId, connect} = useWalletProvider();

  return (
    <>
      <Head>
        <title>Advanced Metamask Connexion</title>
      </Head>
      <Header />
      {account ? (
        <Text p="2rem">Connnected with address {account}.</Text>
      ): (
        <Text p="2rem">You are not connected.</Text>
      )}
    </>
  )
}
