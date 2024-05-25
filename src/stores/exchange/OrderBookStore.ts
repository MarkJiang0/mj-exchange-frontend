import { OrderBook, OrderBookDetail, getFullOrderBook, getMiniOrderBook } from "@/services"
import { State } from "./useStore"
import { produce } from "immer"

type SliceState = {
  fullOrderBookMap: {[symbol: string]: OrderBook}
  miniOrderBookMap: {[symbol: string]: OrderBook}
}

const sliceKey = 'orderBook'

export type OrderBookSlice = {
  [sliceKey]: SliceState & {
    fetchMiniOrderBook: (symbol: string) => void
    fetchFullOrderBook: (symbol: string) => void
    updateMiniOrderBook: (symbol: string, orderBookDetail: OrderBookDetail) => void
  } 
}

const DEFAULT_STATE: SliceState = {
  fullOrderBookMap: {},
  miniOrderBookMap: {}
}

const createOrderBookSlice = (set: any, get: any): OrderBookSlice => ({
  [sliceKey]: {
    ...DEFAULT_STATE,
    fetchMiniOrderBook: (symbol: string) => {
      getMiniOrderBook({symbol}).then(resp => {
        set(
          produce((state: State) => {
            state.orderBook.miniOrderBookMap[symbol] = resp.data
          })
        )
      })
    },
    fetchFullOrderBook: (symbol: string) => {
      getFullOrderBook({symbol}).then(resp => {
        set(
          produce((state: State) => {
            state.orderBook.fullOrderBookMap[symbol] = resp.data
          })
        )
      })
    },
    updateMiniOrderBook: (symbol: string, orderBookDetail: OrderBookDetail) => {
      set(
        produce((state: State) => {
          orderBookDetail.direction === 'SELL' ? 
            state.orderBook.miniOrderBookMap[symbol].ask = orderBookDetail : 
            state.orderBook.miniOrderBookMap[symbol].bid = orderBookDetail
        })
      )
    }
  }
})

export default createOrderBookSlice