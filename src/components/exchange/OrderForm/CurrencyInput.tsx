import React, { useState } from 'react'
import styled from 'styled-components'

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`)

const CurrencyInput = ({
  label,
  suffix,
  value, 
  setValue
}:{
  label: string
  suffix: string | undefined
  value: number | undefined, 
  setValue: (v: number | undefined) => void}
) => {

  const handleOnChange = (input: string) => {
    if (inputRegex.test(escapeRegExp(input))) {
      setValue(input ? Number(input) : undefined)
    }
  }

  return (
    <FlexRow>
      <Label>{label}</Label>
      <InputBox value={value}
          onChange={(e) => handleOnChange(e.target.value.replace(/,/g, '.'))}
          inputMode="decimal"
          autoComplete="off"
          autoCorrect="off"
          type="text"
          pattern="^[0-9]*[.,]?[0-9]*$"
          placeholder={'0.0'}
          minLength={1}
          maxLength={79}
          />
      <Suffix>{suffix}</Suffix>
    </FlexRow>
  )
}

export default CurrencyInput

const FlexRow = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 0;
  background-color: #2A2E34;
  border-radius: 3px;
  width: 100%;
  height: auto;
  border: 1px solid transparent;

  &:hover {
    border: 1px solid #E3B014;
  }

  &:focus {
    border: 1px solid #E3B014;
  }
`

const Label = styled.div`
  background-color: transparent;
  width: 60px;
  height: 40px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 14px;
  color: rgb(132, 142, 156);
  padding: 0 10px;
`

const Suffix = styled.div`
  background-color: transparent;
  width: 48px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: rgb(234, 236, 239);
  padding: 0 10px;
`

const InputBox = styled.input`
  border: none;
  outline: none;
  background-color: transparent;
  font-weight: 500px;
  margin-left: 20px;
  width: 100%;
  color: rgb(234, 236, 239);
  font-size: 14px;
  padding-left: 4px;
  padding-right: 4px;
  text-align: right;
  height: 40px;
`
