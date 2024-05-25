import { CoinThumb, getSymbolInfo } from "@/services"
import { produce } from "immer"
import _ from "lodash"
import type { State } from "./useStore"

type SliceState = {
  symbolThumbMap: {[symbol: string]: CoinThumb} 
}

const sliceKey = 'symbolThumb'

export type SymbolThumbSlice = {
  [sliceKey]: SliceState & {
    fetchSymbolThumbMap: () => void
    updateSymbolThumbMap: (thumb: CoinThumb) => void
  }
}

const DEFAULT_STATE: SliceState = {
  symbolThumbMap: {}
}

const createSymbolThumbSlice = (set: any, get: any): SymbolThumbSlice => ({
  [sliceKey]: {
    ...DEFAULT_STATE,

    fetchSymbolThumbMap: () => {
      getSymbolInfo().then(resp => {
        set(
          produce((state: State) => {
            state.symbolThumb.symbolThumbMap = _.keyBy(resp.data, 'symbol')
          })
        )
      })
    },
    updateSymbolThumbMap: (thumb: CoinThumb) => {
      set(
        produce((state: State) => {
          state.symbolThumb.symbolThumbMap[thumb.symbol] = thumb
        })
      )
    }

  }
})

export default createSymbolThumbSlice