import { CoinThumb, getSymbolInfo } from "@/services"
import { produce } from "immer"
import _ from "lodash"
import type { State } from "./useStore"
import { IndicatorInfo, IndicatorType } from "@/components/exchange/Chart/types"

type SliceState = {
  enabledIndicators: Partial<IndicatorInfo>[]
  selectedIndicators: string[]
}

const sliceKey = 'indicator'

export type IndicatorSelectSlice = {
  [sliceKey]: SliceState & {
    selected: (ind: string) => void
    unselected: (ind: string) => void
    removeAll: () => void
    selectAll: () => void
  }
}

const EABLED_INDICATORS: Partial<IndicatorInfo>[] = [
  {name:'MA5', type: 'MA', color: '#A96E29'},
  {name:'MA15', type: 'MA', color: '#A52BAD'},
  {name:'MA30', type: 'MA', color: '#52B1B2'},
  {name:'EMA5', type: 'EMA', color: '#6220AC'},
  {name:'EMA15', type: 'EMA', color: '#0018AC'},
  {name:'EMA30', type: 'EMA', color: '#A52419'},
  {name:'SMA5', type: 'SMA', color: '#3D5E9D'},
  {name:'SMA15', type: 'SMA', color: '#B3B23D'},
  {name:'SMA30', type: 'SMA', color: '#52AF36'},
  {name:'WMA5', type: 'WMA', color: '#61140D'},
  {name:'WMA15', type: 'WMA', color: '#A52BAD'},
  {name:'WMA30', type: 'WMA', color: '#52B1B2'},
  {name:'VOL', type: 'VOL', color: '#52B1B2'},
  {name:'MACD', type: 'MACD', color: '#52B1B2'},
  {name:'RSI', type: 'RSI', color: '#52B1B2'},
]

const DEFAULT_STATE: SliceState = {
  enabledIndicators: EABLED_INDICATORS,
  selectedIndicators: []
}

const createIndicatorSelectSlice = (set: any, get: any): IndicatorSelectSlice => ({
  [sliceKey]: {
    ...DEFAULT_STATE,

    selected: (ind: string) => {
      set(
        produce((state: State) => {
          state.indicator.selectedIndicators.push(ind)
        })
      )
    },
    unselected: (ind: string) => {
      set(
        produce((state: State) => {
          state.indicator.selectedIndicators = _.remove(state.indicator.selectedIndicators, (i) => i !== ind)
        })
      )
    },
    removeAll: () => {
      set(
        produce((state: State) => {
          state.indicator.selectedIndicators = []
        })
      )
    },
    selectAll: () => {
      set(
        produce((state: State) => {
          state.indicator.selectedIndicators = state.indicator.enabledIndicators.map(i => i.name)
        })
      )
    }
  }
})

export default createIndicatorSelectSlice