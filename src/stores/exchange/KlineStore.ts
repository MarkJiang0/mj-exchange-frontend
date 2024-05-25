import { KlineBar, Trade, getKlines, getTrades } from "@/services"
import { produce } from "immer"
import _ from "lodash"
import type { State } from "./useStore"

type SliceState = {
  klineBarMap: {[symbol: string]: {[resolution: string]: KlineBar[]}}
}

const sliceKey = 'kline'

export type KlineSlice = {
  [sliceKey]: SliceState & {
    fetchKlineMap: (param: {symbol: string, from: number, to: number, resolution: string}) => void
    updateKlineMap: (symbol: string, kline: KlineBar) => void
  }
}

const DEFAULT_STATE: SliceState = {
  klineBarMap: {},
}

const createKlineSlice = (set: any, get: any): KlineSlice => ({
  [sliceKey]: {
    ...DEFAULT_STATE,

    fetchKlineMap: (param: {symbol: string, from: number, to: number, resolution: string}) => {
      getKlines(param).then(resp => {
        set(
          produce((state: State) => {
            
            if (!state.kline.klineBarMap[param.symbol]) {
              state.kline.klineBarMap[param.symbol] = {}
            }
            
            state.kline.klineBarMap[param.symbol][param.resolution] = resp.data.map((item: any[]) => {
              const bar: KlineBar = {
                time: item[0] as number,
                openPrice: item[1] as number,
                highestPrice: item[2] as number,
                lowestPrice: item[3] as number,
                closePrice: item[4] as number,
                volume: item[5] as number,
                period: item[6] as string,
                count: item[7] as number,
                turnover: item[8] as number,
              }
              return bar
            })
          })
        )
      })
    },
    updateKlineMap: (symbol: string, kline: KlineBar) => {
      set(
        produce((state: State) => {
          const list:KlineBar[] = _.clone(get().kline.kline1mMap[symbol])
          list.push(kline)
          if (list.length > 100) {
            list.slice(0, 100)
          }
          state.kline.klineBarMap[symbol]['1m'] = list
        })
      )
    }

  }
})

export default createKlineSlice