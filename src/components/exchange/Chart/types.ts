import type { IChartApi, ISeriesApi, UTCTimestamp } from 'lightweight-charts'
import { MutableRefObject } from 'react'

export type ChartType = 'swap' | 'crvusd' | 'poolPage'
export type TimeOptions = '15m' | '30m' | '1h' | '4h' | '6h' | '12h' | '1d' | '7d' | '14d'
export type FetchingStatus = 'LOADING' | 'ERROR' | 'READY'
export type IndicatorType = 'MA' | 'EMA' | 'SMA' | 'WMA' | 'VOL' | 'MACD' | 'RSI'


export const DEFAULT_CHART_COLORS: ChartColors = {
  // backgroundColor: '#fafafa',
  backgroundColor: '#161A1E',
  lineColor: '#2962FF',
  // textColor: 'black',
  textColor: '#59616E',
  areaTopColor: '#2962FF',
  areaBottomColor: 'rgba(41, 98, 255, 0.28)',
  chartGreenColor: '#2962FF',
  chartRedColor: '#ef5350',
  chartLabelColor: '#9B7DFF',
  chartVolumeRed: '#ef53507e',
  chartVolumeGreen: '#26a6997e',
  chartOraclePrice: '#3360c9c0',
  rangeColor: '#dfb316',
  rangeColorA25: '#dfb4167f',
  rangeColorOld: '#ab792f',
  rangeColorA25Old: '#ab792f25',
}

export type ChartGroup = {
  id: string
  chartContainerRef: MutableRefObject<any | null>
  chartRef: MutableRefObject<IChartApi | null>
  toolTipRef: MutableRefObject<any | null>
  seriesRefMapRef: MutableRefObject<Map<string, MutableRefObject<ISeriesApi<'Candlestick' | 'Histogram' | 'Line' | 'Area' | 'Bar'> | null>>>
}

export type ChartColors = {
  backgroundColor: string
  lineColor: string
  textColor: string
  areaTopColor: string
  areaBottomColor: string
  chartGreenColor: string
  chartRedColor: string
  chartLabelColor: string
  chartVolumeRed: string
  chartVolumeGreen: string
  chartOraclePrice: string
  rangeColor: string
  rangeColorA25: string
  rangeColorOld: string
  rangeColorA25Old: string
}

export type ChartHeight = {
  expanded: number
  standard: number
}


export interface CandleOhlcData {
  time: UTCTimestamp
  open: number
  close: number
  high: number
  low: number
}

export interface VolumeData {
  time: UTCTimestamp
  value: number
  color: string
}

export interface IndicatorInfo {
  name: string
  type: IndicatorType
  selected: boolean
  chartRef: MutableRefObject<IChartApi | null>
  calculate: Function
  color: string
}
