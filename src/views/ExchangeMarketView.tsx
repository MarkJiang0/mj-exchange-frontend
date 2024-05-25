import ChartWrapper from '@/components/exchange/Chart/ChartWrapper'
import OrderBook from '@/components/exchange/OrderBook'
import OrderForm from '@/components/exchange/OrderForm'
import StompSubscription from '@/components/exchange/StompSubscription'
import SymbolSummary from '@/components/exchange/Summary'
import Trades from '@/components/exchange/Trade'
import styled from 'styled-components'

const chartHeight = {
  expanded: 800,
  standard: 500,
}

const ExchangeMarketView = () => {  
  return (
    <>
      <StompSubscription />
      <SymbolSummary />
      
      <FlexRow>
        <OrderBook />

        <FlexCol>
          <ChartWrapper />

          <OrderForm />
        </FlexCol>
        
        <Trades />
        
      </FlexRow>
      
    </>
  )
}

export default ExchangeMarketView

const FlexRow = styled.div`
  display: flex;
  justify-content: flex-start;
`

const FlexCol = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`
