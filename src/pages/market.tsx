import ExchangeMarketView from '@/views/ExchangeMarketView'
import React from 'react'
import styled from 'styled-components'

const market = () => {
  return (
    <Container>
      <ExchangeMarketView />
    </Container>
  )
}

export default market

const Container = styled.div`
  margin: 0 auto;
  background-color: #161A1E;
  width: 100%;
  padding: 0 100px;
`
