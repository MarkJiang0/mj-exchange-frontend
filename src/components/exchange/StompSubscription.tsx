import { useSymbol } from '@/hooks/exchange/symbol'
import ws from '@/services/ws'
import useStore from '@/stores/exchange/useStore'
import { IMessage, useSubscription } from 'react-stomp-hooks'
import React from 'react'

const StompSubscription = () => {
  const symbol = useSymbol()
  const { updateMiniOrderBook } = useStore(state => state.orderBook)
  const { updateSymbolThumbMap } = useStore(state => state.symbolThumb)
  const { updateTrades } = useStore(state => state.latestTrades)

  useSubscription(ws.market.tradePlate + symbol, (msg: IMessage) => {
    if (symbol) {
      updateMiniOrderBook(symbol, JSON.parse(msg.body))
    }
  })

  useSubscription(ws.market.thumb, (msg: IMessage) => {
    updateSymbolThumbMap(JSON.parse(msg.body))
  })

  useSubscription(ws.market.trade + symbol, (msg: IMessage) => {
    if (symbol) {
      updateTrades(symbol, JSON.parse(msg.body))
    }
  })

  return (<></>)
}

export default StompSubscription
