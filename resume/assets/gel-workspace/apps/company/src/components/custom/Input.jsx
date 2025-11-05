import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

const Input = ({
  type = 'text',
  focus = false,
  onChange,
  value,
  ...args
}) => {
  const isInputting = useRef(false)
  const inputRef = useRef()

  useEffect(() => {
    // console.log(inputRef);
    inputRef.current.value = value || ''
  }, [value, inputRef])

  return (
    <InputBox
      type={type}
      ref={inputRef}
      autoFocus={focus}
      // value={value}
      onCompositionStart={
        () => {
          isInputting.current = true
        }
      }
      onCompositionEnd={
        (e) => {
          isInputting.current = false
          onChange(e)
        }
      }
      onChange={
        (e) => {
          if (isInputting.current) return
          onChange(e)
        }
      }
      {
      ...args
      }
    />
  )
}

const InputBox = styled.input`
  outline: none;
  border: none;
  background-color: transparent;
  width: 100%;
`
export default Input