import { Trade, getTrades } from "@/services"
import { produce } from "immer"
import _ from "lodash"
import type { State } from "./useStore"

type SliceState = {
  tradeMap: {[symbol: string]: Trade[]} 
}

const sliceKey = 'latestTrades'

export type TradesSlice = {
  [sliceKey]: SliceState & {
    fetchTradeMap: (param: {symbol: string, size: number}) => void
    updateTrades: (symbol: string, trades: Trade[]) => void
  }
}

const DEFAULT_STATE: SliceState = {
  tradeMap: {}
}

const createTradesSlice = (set: any, get: any): TradesSlice => ({
  [sliceKey]: {
    ...DEFAULT_STATE,

    fetchTradeMap: (param: {symbol: string, size: number}) => {
      getTrades(param).then(resp => {
        set(
          produce((state: State) => {
            state.latestTrades.tradeMap[param.symbol] = resp.data
          })
        )
      })
    },
    updateTrades: (symbol: string, trades: Trade[]) => {
      set(
        produce((state: State) => {
          const list:Trade[] = _.clone(get().latestTrades.tradeMap[symbol])
          for(let i = 0; i < trades.length; i++) {
            list.unshift(trades[i])
          }
          if (list.length > 100) {
            list.slice(0, 100)
          }
          state.latestTrades.tradeMap[symbol] = list
        })
      )
    }

  }
})

export default createTradesSlice