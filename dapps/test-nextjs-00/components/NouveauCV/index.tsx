"use client"
import React from 'react'

interface NouveauCVProps {
    title: string
}

const NouveauCV = (props: NouveauCVProps) => {
  return (
    <>
        <h1>{props.title}</h1>
        <div>NouveauCV</div>
    </>
  )
}

export default NouveauCV