import { CoinThumb } from "@/services";
import useStore, { State } from "@/stores/exchange/useStore";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";

const DEFAULT_COIN_THUMB = {
  symbol: '',
  open: 0,
  high: 0,
  low: 0,
  close: 0,
  chg: 0,
  change: 0,
  volume: 0,
  turnover: 0,
  lastDayClose: 0,
  usdRate: 0,
  baseUsdRate: 0
}

export function useSymbol(): string | undefined {
  const router = useRouter()

  const symbol: string | undefined = useMemo(() => {
    return router.query.symbol?.toString().toUpperCase().replace('_', '/')
  }, [router])

  return symbol
}

export function useSymbolThumb(): CoinThumb {
  const {symbolThumbMap, fetchSymbolThumbMap} = useStore((state: State) => state.symbolThumb)
  const symbol = useSymbol()

  useEffect(() => {
    fetchSymbolThumbMap()
  }, [symbol])

  const symbolThumb: CoinThumb = useMemo(() => {
    return symbol ? symbolThumbMap[symbol] : DEFAULT_COIN_THUMB
  }, [symbol, symbolThumbMap])

  return symbolThumb
}
