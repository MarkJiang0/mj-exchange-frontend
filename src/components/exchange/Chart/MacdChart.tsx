import { CrosshairMode, ISeriesApi, createChart } from 'lightweight-charts'
import { MutableRefObject, useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'
import { crosshairConfig, gridConfig, layoutConfig, localizationTimeFormat, tickMarkFormat } from './chartHelper'
import { useChartGroup } from './hooks'
import { macd } from './indicator'
import { ChartContainer, ToolTipWrapper } from './styles'
import { CandleOhlcData, ChartColors, ChartGroup } from './types'

type Props = {
  colors: ChartColors
  timeOption: string
  magnet: boolean
  ohlcData: CandleOhlcData[]
  id: string
  chartGroupMapRef: MutableRefObject<Map<string, MutableRefObject<ChartGroup | null>>>
  register: (id:string, chartGroupRef: MutableRefObject<ChartGroup | null>) => void
  unRegister: (id:string) => void
}

const MacdChart = ({colors, timeOption, magnet, ohlcData, id, chartGroupMapRef, register, unRegister}: Props) => {
  const seriesRefMapRef = useRef<Map<string, MutableRefObject<ISeriesApi<'Candlestick' | 'Histogram' | 'Line' | 'Area' | 'Bar'> | null>>>(new Map())
  const seriesRef = useRef<ISeriesApi<'Candlestick' | 'Histogram' | 'Line' | 'Area' | 'Bar'> | null>(null)
  const {
    chartContainerRef, 
    chartRef, 
    toolTipRef, 
    doSubscribe
  } = useChartGroup({id, chartGroupMapRef, register, unRegister, seriesRefMapRef, timeOption, data: ohlcData})
  const histogramSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null)
  const signalSeriesRef = useRef<ISeriesApi<'Line'> | null>(null)

  const [macds, histograms, signals] = useMemo(() => {
    const macdData = macd(12, 26, 9, ohlcData)
    return [
      macdData.map(i => {return {time: i.time, value: i.value?.MACD}}),
      macdData.map(i => {return {time: i.time, value: i.value?.histogram, color: i.value?.histogram ? i.value?.histogram > 0 ? '#207350' : '#87313F' : undefined}}),
      macdData.map(i => {return {time: i.time, value: i.value?.signal}})
    ]
  }, [ohlcData,
    timeOption])



  useEffect(() => {
    if (!chartContainerRef || !chartContainerRef.current || !chartRef || !seriesRef) {
      return
    }
    chartRef.current = createChart(chartContainerRef.current, {
      layout: layoutConfig,
      
      width: 866,
      height: 100,
      timeScale: {
        timeVisible: true,
        tickMarkFormatter: (time: number) => tickMarkFormat(time, timeOption)
      },
      localization: {
        timeFormatter: (time: number) => localizationTimeFormat(time, timeOption)
      },
      rightPriceScale: {
        autoScale: true,
        alignLabels: true,
        borderVisible: false,
        scaleMargins: {
          top: 0.1,
          bottom: 0.25,
        },
        minimumWidth: 100,
        
      },
      grid: gridConfig,
      crosshair: {
        mode: magnet ? CrosshairMode.Magnet : CrosshairMode.Normal,
        ...crosshairConfig
      },
    })

    if (histograms && !histogramSeriesRef.current) {
      histogramSeriesRef.current = chartRef.current.addHistogramSeries({
        priceLineVisible: false,
        lastValueVisible: false,
      })
      histogramSeriesRef.current.priceScale().applyOptions({
        scaleMargins: {
          top: 0.1,
          bottom: 0,
        },
      })
    }

    if (macds && !seriesRef.current) {
      seriesRef.current = chartRef.current.addLineSeries({ 
        color: 'rgba(4, 111, 232, 1)', 
        lineWidth: 1,
        priceLineVisible: false,
        lastValueVisible: false,
        crosshairMarkerVisible: false
      })
    }

    if (signals && !signalSeriesRef.current) {
      signalSeriesRef.current = chartRef.current.addLineSeries({ 
        color: '#e80476', 
        lineWidth: 1,
        priceLineVisible: false,
        lastValueVisible: false,
        crosshairMarkerVisible: false
      })
    }

    seriesRefMapRef.current.set('diff', seriesRef)
    seriesRefMapRef.current.set('stick', histogramSeriesRef)
    seriesRefMapRef.current.set('dea', signalSeriesRef)
    doSubscribe()

    return () => {  
      histogramSeriesRef.current = null
      signalSeriesRef.current = null
      seriesRef.current = null
      seriesRefMapRef.current = new Map()
    }
  }, [ohlcData])

  useEffect(() => {
    if (!chartRef || !seriesRef) {
      return
    }
    if (!chartRef.current) return
    if (seriesRef.current) {
      seriesRef.current.setData(macds)
    }
    if (signalSeriesRef.current) {
      signalSeriesRef.current.setData(signals)
    }
    if (histogramSeriesRef.current) {
      histogramSeriesRef.current.setData(histograms)
    }
  }, [ohlcData,
    timeOption])

  return (
    <ChartContainer ref={chartContainerRef}>
      <ToolTipWrapper ref={toolTipRef}></ToolTipWrapper>
    </ChartContainer>
  )
}

export default MacdChart
