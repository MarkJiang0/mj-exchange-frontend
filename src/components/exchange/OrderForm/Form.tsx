import React, { useEffect, useMemo } from 'react'
import styled, { css } from 'styled-components'
import CurrencyInput from './CurrencyInput'
import { useExchangeOrderForm } from '@/hooks/exchange/exchangeOrderForm'
import { ExchangeOrderDirection, ExchangeOrderType, addOrder } from '@/services'
import { useSymbol } from '@/hooks/exchange/symbol'


const Form = ({type, direction}: {type: ExchangeOrderType, direction: ExchangeOrderDirection}) => {
  const {formData, setPrice, setAmount, initForm, submitForm} = useExchangeOrderForm()
  const symbol = useSymbol()

  useEffect(() => {
    if (!symbol) return
    initForm(symbol, type, direction)
  }, [symbol])

  const symbolPart = useMemo(() => {
    if (!symbol) return
    return symbol.split('/')
  }, [symbol])

  return (
    <FormBox>
      <InputRow>
        <CurrencyInput label='Price' suffix={symbolPart?.[1]} value={formData.price} setValue={setPrice} />
      </InputRow>

      <InputRow>
        <CurrencyInput label='Amount' suffix={symbolPart?.[0]} value={formData.amount} setValue={setAmount} />
      </InputRow>

      <FormButton $direction={direction} onClick={submitForm}>{direction}</FormButton>
      
    </FormBox>
  )
}

export default Form

const FormBox = styled.div`
  flex: 1;
  padding: 0 10px;
`

const InputRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 0;
`

const FormButton = styled.div<{$direction: ExchangeOrderDirection}>`
  background-color: rgb(14, 203, 129);
  color: rgb(234, 236, 239);
  text-align: center;
  height: 40px;
  line-height: 40px;
  border-radius: 3px;
  font-size: 16px;
  font-weight: 800;
  margin-top: 10px;
  cursor: pointer;

  ${(props) => {
    return props.$direction === 'BUY' ? css`background-color: rgb(14, 203, 129);` : css`background-color: rgb(246, 70, 93);`
  }}
`