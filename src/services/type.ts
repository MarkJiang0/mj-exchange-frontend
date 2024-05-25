export interface CoinThumb {
  symbol: string
  open: number
  high: number
  low: number
  close: number
  chg: number
  change: number
  volume: number
  turnover: number
  lastDayClose: number
  usdRate: number
  baseUsdRate: number
}

export interface OrderBookItem {
  price: number,
  amount: number
}

export interface OrderBookDetail {
  direction: string
  highestPrice: number
  lowestPrice: number
  maxAmount: number
  minAmount: number
  symbol: string
  items: OrderBookItem[]
}

export interface OrderBook {
  bid: OrderBookDetail
  ask: OrderBookDetail
}

export interface Trade {
  symbol: string
  price: number
  amount: number
  buyTurnover: number
  sellTurnover: number
  direction: string
  buyOrderId: string
  sellOrderId: string
  time: number
}

export interface KlineBar {
  time: number
  openPrice: number
  highestPrice: number
  lowestPrice: number
  closePrice: number
  period: string
  count: number
  volume: number
  turnover: number
}

export type ExchangeOrderDirection = 'BUY' | 'SELL'

export type ExchangeOrderType = 'MARKET_PRICE' | 'LIMIT_PRICE'

export interface ExchangeOrder {
  symbol: string
  price: number
  amount: number
  direction: ExchangeOrderDirection
  type: ExchangeOrderType
}

export interface RegisterInfo {
  phone: string
  password: string
  code: string
}

export interface LoginInfo {
  username: string
  password: string
}

export interface User {
  username?: string
  realName?: string
  avatar?: string
}