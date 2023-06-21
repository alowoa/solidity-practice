"use client"
import Link from 'next/link'
import { useContext } from 'react'
import { CustomThemeContext } from '@/context/theme'

export default function Home() {

  const theme = useContext(CustomThemeContext)
  console.log(theme);

  return (
    
    <main>
      <div>theme: color: {theme.color} </div> 
      <Link href="/">Home</Link> <br/>
      <Link href="/cv">CV</Link> <br/>
      <Link href="/jeu">Jeu</Link> <br/>
      <Link href="/contact">Contact</Link> <br/>
    </main>
  )
}
