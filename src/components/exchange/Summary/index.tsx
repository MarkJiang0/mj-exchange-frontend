import { useSymbolThumb } from '@/hooks/exchange/symbol'
import type { CoinThumb } from '@/services'
import styled, { css } from 'styled-components'



const SymbolSummary = () => {
  const symbolThumb: CoinThumb = useSymbolThumb()
  
  return (
    <Wrapper>
      <FlexRow>
        <FlexBtw>
          <SymbolBox>{symbolThumb.symbol}</SymbolBox>
          <SymbolPriceBox>{symbolThumb.close.toFixed(2)}</SymbolPriceBox>
        </FlexBtw>
        <FlexRow>
          <SummaryItem>
            <SummaryItemKey>24h Change</SummaryItemKey>
            <SummaryItemValue $isInc={symbolThumb.close > symbolThumb.open}>{`${symbolThumb.change.toFixed(2)}  ${(symbolThumb.chg * 100).toFixed(2)}%`}</SummaryItemValue>
          </SummaryItem>
          <SummaryItem>
            <SummaryItemKey>24h High</SummaryItemKey>
            <SummaryItemValue>{symbolThumb.high.toFixed(2)}</SummaryItemValue>
          </SummaryItem>
          <SummaryItem>
            <SummaryItemKey>24h Low</SummaryItemKey>
            <SummaryItemValue>{symbolThumb.low.toFixed(2)}</SummaryItemValue>
          </SummaryItem>
          <SummaryItem>
            <SummaryItemKey>24h Volume</SummaryItemKey>
            <SummaryItemValue>{symbolThumb.volume.toFixed(2)}</SummaryItemValue>
          </SummaryItem>
          <SummaryItem>
            <SummaryItemKey>24h Turnover</SummaryItemKey>
            <SummaryItemValue>{symbolThumb.turnover.toFixed(2)}</SummaryItemValue>
          </SummaryItem>

        </FlexRow>
      </FlexRow>
      
    </Wrapper>
  )
}

export default SymbolSummary

const Wrapper = styled.div`
  width: 100%;
  border: 1px solid #252931;
  padding: 10px 0;
`

const FlexRow = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`

const FlexBtw = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 320px;
`

const SymbolBox = styled.div`
  font-size: 40px;
  font-weight: 800;
  color: #EBECEF;
  padding-left: 16px;
`

const SymbolPriceBox = styled.div`
  font-size: 20px;
  font-weight: 500;
  color: #EBECEF;
  border-left: 1px solid #252931;
  padding-left: 10px;
`

const SummaryItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-left: 20px;
`

const SummaryItemKey = styled.div`
  font-size: 12px;
  margin-right: 0px;
  margin-bottom: 2px;
  color: rgb(132, 142, 156);
  line-height: 16px;
  font-weight: 400;
  text-align: left;
  border-bottom: 1px solid transparent;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`

const SummaryItemValue = styled.div<{$isInc?: boolean}>`
  font-size: 12px;
  

  ${(props) => {
    if (props.$isInc === undefined) {
      return css`color: rgb(234, 236, 239);`
    }
    return props.$isInc ? css`color: rgb(14, 203, 129);` : css`color: rgb(246, 70, 93);`
  }}
`