import { Atom, useAtom, WritableAtom } from 'jotai'
import React, { useRef } from 'react'
import { useCallback } from 'react'
import styled from 'styled-components'
import { Change } from './susikoira'

const StyledSpan = styled.span`
  display: inline-block;
  color: black;
  border-bottom: 3px solid #eee;
  min-width: 1rem;
`

interface InputProps {
  atom: Atom<string>
  index: number
  koiro: WritableAtom<string[], Change>
}

export const Input: React.FC<InputProps> = props => {
  const [word] = useAtom(props.atom)
  const [, update] = useAtom(props.koiro)

  const ref: React.Ref<HTMLSpanElement> = useRef(null)

  const getText = useCallback((ev: any) => ev.target.textContent, [])

  const onChange = (blur: boolean, ev: any) =>
    update({
      others: !blur,
      text: getText(ev),
      index: props.index,
    })

  return (
    <StyledSpan
      ref={ref}
      onInput={ev => onChange(false, ev)}
      onBlur={ev => onChange(true, ev)}
      contentEditable
      dangerouslySetInnerHTML={{ __html: word }}
    ></StyledSpan>
  )
}
