import React from 'react'
import styled from 'styled-components'
import { ListItem, PriceCell, TextCell } from '../styles'
import { useLatestTrades } from '@/hooks/exchange/trade'
import { Trade } from '@/services'

function formatDateTime(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return `${pad(hour)}:${pad(minute)}:${pad(second)}`;
}

function pad(num: number):string {
  return num.toString().padStart(2, '0');
}

const Trades = () => {
  const latestTrades: Trade[] | undefined = useLatestTrades()

  return (
    <TradesArea>
      <TradesHeader>
        <ListItem>
          <TextCell $left={true}>Price(USDT)</TextCell>
          <TextCell>Amount(BTC)</TextCell>
          <TextCell>Time</TextCell>
        </ListItem>
      </TradesHeader>
      <TradeList>
        {latestTrades?.map((trade, index) => (
          <ListItem key={index}>
            <PriceCell $isBuy={trade.direction === 'BUY'}>{trade.price.toFixed(2)}</PriceCell>
            <TextCell>{trade.amount}</TextCell>
            <TextCell>{formatDateTime(new Date(trade.time))}</TextCell>
          </ListItem>
        ))}
      </TradeList>
    </TradesArea>
  )
}

export default Trades

const TradesArea = styled.div`
  border: 1px solid #252931;
`

const TradeList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 400px;
  overflow-y: auto;
`

const TradesHeader = styled.div`
  padding: 10px 0;
`
