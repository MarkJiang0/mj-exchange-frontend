import { useSymbol } from '@/hooks/exchange/symbol'
import { KlineBar, Trade } from '@/services'
import { CrosshairMode, ISeriesApi, Time, createChart } from 'lightweight-charts'
import { debounce } from 'lodash'
import { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { crosshairConfig, gridConfig, layoutConfig, localizationTimeFormat, tickMarkFormat } from './chartHelper'
import { useChartGroup } from './hooks'
import { MA, ema } from './indicator'
import { ChartContainer, ToolTipWrapper } from './styles'
import { CandleOhlcData, ChartColors, ChartGroup, ChartHeight, VolumeData } from './types'
import { candleToolTipHtml, tipHtml } from './chartToolTip'

type Props = {
  colors: ChartColors
  chartHeight: ChartHeight
  chartExpanded?: boolean
  timeOption: string
  magnet: boolean
  ohlcData: CandleOhlcData[]
  volumeData?: VolumeData[]
  lastFetchEndTime: number
  fetchMoreChartData: (lastFetchEndTime: number) => void
  updateChart: (candlestickSeries:ISeriesApi<'Candlestick'> | null, volumeSeries:ISeriesApi<'Histogram'> | null, bar?: KlineBar, trades?: Trade[]) => void
  id: string
  chartGroupMapRef: MutableRefObject<Map<string, MutableRefObject<ChartGroup | null>>>
  register: (id:string, chartGroupRef: MutableRefObject<ChartGroup | null>) => void
  unRegister: (id:string) => void
}

const CandleChart = ({
  colors, 
  chartHeight, 
  chartExpanded,
  timeOption,
  magnet,
  ohlcData,
  volumeData,
  lastFetchEndTime,
  fetchMoreChartData,
  updateChart,
  id, chartGroupMapRef, register, unRegister
}: Props) => {
  const symbol = useSymbol()
  const seriesRefMapRef = useRef<Map<string, MutableRefObject<ISeriesApi<'Candlestick' | 'Histogram' | 'Line' | 'Area' | 'Bar'> | null>>>(new Map())
  const seriesRef = useRef<ISeriesApi<'Candlestick' | 'Histogram' | 'Line' | 'Area' | 'Bar'> | null>(null)
  const {
    chartContainerRef, 
    chartRef, 
    toolTipRef, 
    doSubscribe
  } = useChartGroup({id, chartGroupMapRef, register, unRegister, seriesRefMapRef, timeOption, data: ohlcData})
  const ma5SeriesRef = useRef<ISeriesApi<'Line'> | null>(null)
  const ma10SeriesRef = useRef<ISeriesApi<'Line'> | null>(null)
  const ema5SeriesRef = useRef<ISeriesApi<'Line'> | null>(null)
  
  const lastFetchEndTimeRef = useRef<number>(lastFetchEndTime)
  
  const [fetchingMore, setFetchingMore] = useState(false)
  const [lastTimescale, setLastTimescale] = useState<{ from: Time; to: Time } | null>(null)

  const totalDecimalPlacesRef = useRef(4)

  const debouncedFetchMoreChartData = useRef(
    debounce(
      () => {
        if (fetchingMore) {
          return
        }
        setFetchingMore(true)
        fetchMoreChartData(lastFetchEndTimeRef.current)
      },
      500,
      { leading: true, trailing: false }
    )
  )

  const ma5Data = useMemo(() => {
    return MA(5, ohlcData)
  }, [ohlcData])

  const ma10Data = useMemo(() => {
    return MA(10, ohlcData)
  }, [ohlcData])

  const ema5Data = useMemo(() => {
    return ema(5, ohlcData)
  }, [ohlcData])

  

  useEffect(() => {
    if (!chartContainerRef || !chartContainerRef.current || !chartRef || !seriesRef) {
      return
    }

    chartRef.current = createChart(chartContainerRef.current, {
      layout: layoutConfig,
      width: 866,
      height: chartExpanded ? chartHeight.expanded : chartHeight.standard,
      timeScale: {
        visible: false,
        tickMarkFormatter: (time: number) => tickMarkFormat(time, timeOption)
      },
      localization: {
        timeFormatter: (time: number) => localizationTimeFormat(time, timeOption),
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
    chartRef.current.timeScale();

    

    if (ohlcData && !seriesRef.current) {
      seriesRef.current = chartRef.current.addCandlestickSeries({
        priceLineStyle: 2,
        upColor: '#0ECB80',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#0ECB80',
        wickDownColor: '#ef5350',
        priceLineVisible: false,
        priceFormat: {
          type: 'custom',
          formatter: (price: any) => {
            let [whole, fraction] = price.toString().split('.')

            if (!fraction) {
              return price.toFixed(4)
            }

            let nonZeroIndex = fraction.split('').findIndex((char: any) => char !== '0')

            // If the price is less than 1, then there will be 4 decimal places after the first non-zero digit.
            // If the price is greater than or equal to 1, there will be 4 decimal places after the decimal point.
            totalDecimalPlacesRef.current = price >= 1 ? 4 : nonZeroIndex + 4

            return price.toFixed(totalDecimalPlacesRef.current)
          },
          minMove: 0.0000001,
        },
      })
      seriesRef.current.priceScale().applyOptions({
        scaleMargins: {
          top: 0.1,
          bottom: 0.01,
        },
      })
    }

    

    if (ma5Data && !ma5SeriesRef.current) {
      ma5SeriesRef.current = chartRef.current.addLineSeries({ 
        color: 'rgba(4, 111, 232, 1)', 
        lineWidth: 1,
        priceLineVisible: false,
        lastValueVisible: false,
        crosshairMarkerVisible: false
      })
    }

    if (ma10Data && !ma10SeriesRef.current) {
      ma10SeriesRef.current = chartRef.current.addLineSeries({ 
        color: '#25C6DA', 
        lineWidth: 1,
        priceLineVisible: false,
        lastValueVisible: false,
        crosshairMarkerVisible: false
      })
    }

    if (ema5Data && !ema5SeriesRef.current) {
      ema5SeriesRef.current = chartRef.current.addLineSeries({ 
        color: '#7C4605', 
        lineWidth: 1,
        priceLineVisible: false,
        lastValueVisible: false,
        crosshairMarkerVisible: false
      })
    }

    const handleVisibleLogicalRangeChange = () => {
      if (fetchingMore || !chartRef.current || !seriesRef.current) {
        return
      }

      const timeScale = chartRef.current.timeScale()
      const logicalRange = timeScale.getVisibleLogicalRange()

      if (!logicalRange) {
        return
      }

      const barsInfo = seriesRef.current.barsInLogicalRange(logicalRange)
      if (barsInfo && barsInfo.barsBefore < 50) {
        debouncedFetchMoreChartData.current()

        setLastTimescale(timeScale.getVisibleRange())
      }
    }

    if (toolTipRef && toolTipRef.current && ohlcData && ohlcData.length > 0) {
      const data = ohlcData[ohlcData.length - 1]
      if (data) {
        toolTipRef.current.innerHTML = candleToolTipHtml(data)
      }
      
    }

    seriesRefMapRef.current.set('candle', seriesRef)
    seriesRefMapRef.current.set('ma5', ma5SeriesRef)
    seriesRefMapRef.current.set('ma10', ma10SeriesRef)
    seriesRefMapRef.current.set('ema5', ema5SeriesRef)

    doSubscribe()

    return () => {  
      ma5SeriesRef.current = null
      ma10SeriesRef.current = null
      ema5SeriesRef.current = null
      seriesRef.current = null
      seriesRefMapRef.current = new Map()
      
    }
  }, [
    ohlcData,
    timeOption
  ])

  useEffect(() => {
    if (!chartRef) {
      return
    }

    if (seriesRef && seriesRef.current) {
      seriesRef.current.setData(ohlcData)
      setFetchingMore(false)
    }
    if (ma5SeriesRef.current) {
      ma5SeriesRef.current.setData(ma5Data)
    }
    if (ma10SeriesRef.current) {
      ma10SeriesRef.current.setData(ma10Data)
    }
    if (ema5SeriesRef.current) {
      ema5SeriesRef.current.setData(ema5Data)
    }


  }, [
    ohlcData,
    timeOption
  ])

  // useSubscription(ws.market.kline + symbol, (msg: IMessage) => {
    
  //   if (symbol) {
  //     if (!chartRef.current) return

  //     const bar: KlineBar = JSON.parse(msg.body)

  //     updateChart(candlestickSeriesRef.current, volumeSeriesRef.current, bar, undefined)
  //   }
  // })

  // useSubscription(ws.market.trade + symbol, (msg: IMessage) => {
  //   if (symbol) {
  //     if (!chartRef.current) return
  //     const trades: Trade[] = JSON.parse(msg.body)
  //     updateChart(candlestickSeriesRef.current, volumeSeriesRef.current, undefined, trades)
  //   }
  // })

  return (
    <FlexCol>
      <ChartContainer ref={chartContainerRef}>
        <ToolTipWrapper ref={toolTipRef}></ToolTipWrapper>
      </ChartContainer>
    </FlexCol>
  )
}

const FlexCol = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
`

const SubChartContainer = styled.div`
  width: 100%;
  position: relative;
  border-top: 1px solid #252931;
`

export default CandleChart
