import { useSymbol, useSymbolThumb } from '@/hooks/exchange/symbol'
import { CoinThumb, OrderBook } from '@/services'
import ws from '@/services/ws'
import useStore from '@/stores/exchange/useStore'
import _ from 'lodash'
import React, { useEffect, useMemo } from 'react'
import { IMessage, useSubscription } from 'react-stomp-hooks'
import styled, { css } from 'styled-components'
import { ListItem, PriceCell, TextCell } from '../styles'

const MINI_ORDER_BOOK_SIZE = 20

const OrderBook = () => {
  const symbol = useSymbol()
  const {
    fullOrderBookMap, 
    miniOrderBookMap, 
    fetchFullOrderBook, 
    fetchMiniOrderBook, 
    updateMiniOrderBook
  } = useStore(state => state.orderBook)

  useEffect(() => {
    if (!symbol) return
    fetchMiniOrderBook(symbol)
    fetchFullOrderBook(symbol)
  }, [symbol, fetchFullOrderBook, fetchFullOrderBook])

  const miniOrderBook: OrderBook | undefined = useMemo(() => {
    const orderBook = symbol ? miniOrderBookMap[symbol] : undefined
    if (orderBook) {
      const cloneOrderBook = _.cloneDeep(orderBook)
      
      if (cloneOrderBook.ask.items.length < MINI_ORDER_BOOK_SIZE) {
        for (let index = cloneOrderBook.ask.items.length; index < MINI_ORDER_BOOK_SIZE; index++) {
          cloneOrderBook.ask.items.push({amount: 0, price: 0})
        }
      }
      const reverseItems = _.reverse(cloneOrderBook.ask.items)
      cloneOrderBook.ask.items = reverseItems

      if (cloneOrderBook.bid.items.length < MINI_ORDER_BOOK_SIZE) {
        for (let index = cloneOrderBook.bid.items.length; index < MINI_ORDER_BOOK_SIZE; index++) {
          cloneOrderBook.bid.items.push({amount: 0, price: 0})
        }
      }
      return cloneOrderBook
    }
    return orderBook
  }, [symbol, miniOrderBookMap])

  const symbolThumb: CoinThumb = useSymbolThumb()

  return (
    <OrderBookArea>
      <OrderBookHeader>
        <ListItem>
          <TextCell $left={true}>Price(USDT)</TextCell>
          <TextCell>Amount(BTC)</TextCell>
          <TextCell>Total</TextCell>
        </ListItem>
      </OrderBookHeader>
      <OrderList $isBuy={false}>
        {miniOrderBook?.ask.items.map((item, index) => (
          <ListItem key={index}>
            <PriceCell $isBuy={false}>{item.price !== 0 ? item.price.toFixed(2) : '-'}</PriceCell>
            <TextCell>{item.amount !== 0 ? item.amount : '-'}</TextCell>
            <TextCell>{item.price !== 0 ? (item.price * item.amount).toFixed(4) : '-'}</TextCell>
          </ListItem>
        ))}
      </OrderList>

      <CurrentPriceBox>
        <CurrentPrice $isInc={symbolThumb.close > symbolThumb.open}>{symbolThumb.close.toFixed(2)} </CurrentPrice>
        <CurrentPrice $isInc={symbolThumb.close > symbolThumb.open}>{symbolThumb.close > symbolThumb.open ? '↑' : '↓'}</CurrentPrice>
      </CurrentPriceBox>

      <OrderList $isBuy={true}>
        {miniOrderBook?.bid.items.map((item, index) => (
          <ListItem key={index}>
            <PriceCell $isBuy={true}>{item.price !== 0 ? item.price.toFixed(2) : '-'}</PriceCell>
            <TextCell>{item.amount !== 0 ? item.amount : '-'}</TextCell>
            <TextCell>{item.price !== 0 ? (item.price * item.amount).toFixed(4) : '-'}</TextCell>
          </ListItem>
        ))}
      </OrderList>
      
    </OrderBookArea>
  )
}

export default OrderBook

const OrderBookArea = styled.div`
  border: 1px solid #252931;
`

const OrderBookHeader = styled.div`
  padding: 10px 0;
`

const OrderList = styled.div<{$isBuy: boolean}>`
  display: flex;
  flex-direction: column;
  
  min-height: 400px;

  ${(props) => {
    return props.$isBuy ? css`justify-content: flex-start;` : css`justify-content: flex-end;`
  }}
`


const CurrentPriceBox = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  line-height: 30px;
  padding-left: 50px;
  padding-right: 16px;
  border-top: 1px solid #252931;
  border-bottom: 1px solid #252931;
`

const CurrentPrice = styled.div<{$isInc?: boolean}>`
  font-size: 20px;
  padding-right: 30px;
  ${(props) => {
    if (props.$isInc === undefined) {
      return css`color: rgb(234, 236, 239);`
    }
    return props.$isInc ? css`color: rgb(14, 203, 129);` : css`color: rgb(246, 70, 93);`
  }}
`
