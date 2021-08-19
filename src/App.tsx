import React from 'react'
import './App.css'
import { Input } from './Input'
import styled from 'styled-components'
import { useSusikoira } from './susikoira'

const TextContainer = styled.div`
  text-align: center;
  color: #666;
  font-size: 3rem;
  padding: 3rem;
  text-transform: lowercase;
`

export const App = () => {
  const [words, koiro] = useSusikoira()

  const [kampista, suffe, sumpista, kaffe] = words.map((atom, i) => {
    return <Input atom={atom} index={i} koiro={koiro} />
  })

  // prettier-ignore
  return (
    <>
      <TextContainer>
        harva {kampista} {suffe}{'\u2060'}roi niin kuin {sumpista} {kaffe}-roi
      </TextContainer>
    </>
  )
}

export default App
