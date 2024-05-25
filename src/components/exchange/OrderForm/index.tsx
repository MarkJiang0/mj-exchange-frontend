import React from 'react'
import styled from 'styled-components'
import CurrencyInput from './CurrencyInput'
import Form from './Form'
import { ExchangeOrderDirection, ExchangeOrderType } from '@/services'

const OrderForm = () => {
  
  return (
    <Container>
      <FlexRow>
        <Form type={'LIMIT_PRICE'} direction={'BUY'} />
        <Form type={'LIMIT_PRICE'} direction={'SELL'} />
      </FlexRow>
      
    </Container>
  )
}

export default OrderForm

const Container = styled.div`
  width: 100%;
  border: 1px solid #252931;
  padding: 10px 10px;
`

const FlexRow = styled.div`
  display: flex;
  justify-content: flex-start;
`
