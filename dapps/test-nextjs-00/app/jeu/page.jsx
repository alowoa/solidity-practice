"use client"
import React from 'react'
import { useState, useEffect } from 'react'

const jeu = () => {

    const [numberState, setNumberState] = useState(0);

    useEffect(() => {
      console.log(`Number is now ${numberState}`)
    
      return () => { }
    }, [numberState])
    
    useEffect(() => {
        console.log(`Document loaded, number is ${numberState}`)
      
        return () => {
            alert('le composant est demonté')
        }
      }, [])

    const increment = () => {
        setNumberState(numberState+1);
    };
    const decrement = () => {
        setNumberState(numberState-1);
    };

    return (
        <>
        <button onClick={ increment }>Increment</button> <br/>
        <button onClick={ decrement }>Decrement</button> <br/>
        <br/>

        <div>{numberState}</div>
        </>
    )
}

export default jeu