import { create } from "zustand";
import createSymbolThumbSlice, { SymbolThumbSlice } from "./SymbolThumbStore";
import createOrderBookSlice, { OrderBookSlice } from "./OrderBookStore";
import createTradesSlice, { TradesSlice } from "./TradesStore";
import createKlineSlice, { KlineSlice } from "./KlineStore";
import createIndicatorSelectSlice, { IndicatorSelectSlice } from "./IndicatorSelectStore";

export type State = SymbolThumbSlice & OrderBookSlice & TradesSlice & KlineSlice & IndicatorSelectSlice


const store = (set: any, get: any): State => ({
  ...createSymbolThumbSlice(set, get),
  ...createOrderBookSlice(set, get),
  ...createTradesSlice(set, get),
  ...createKlineSlice(set, get),
  ...createIndicatorSelectSlice(set, get)
})

const useStore = create<State>(store)

export default useStore