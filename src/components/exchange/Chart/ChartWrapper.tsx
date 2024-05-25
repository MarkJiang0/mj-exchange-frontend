import { useSymbol } from '@/hooks/exchange/symbol'
import { KlineBar, Trade } from '@/services'
import useStore from '@/stores/exchange/useStore'
import { ISeriesApi, UTCTimestamp, createChart } from 'lightweight-charts'
import { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import CandleChart from './CandleChart'
import MacdChart from './MacdChart'
import VolumeChart from './VolumeChart'
import { CandleOhlcData, ChartGroup, DEFAULT_CHART_COLORS, VolumeData } from './types'
import IndicatorIcon from './icons/IndicatorIcon'
import IndicatorSelectorModal from './IndicatorSelectorModal'
import useModal from '@/components/Modal/useModal'
import { ChartContainer } from './styles'

const chartHeight = {
  expanded: 800,
  standard: 300,
}

const RESOLUTION_LIST = ['1m', '1H', '1D']

const ChartWrapper = () => {
  const symbol = useSymbol()
  const {klineBarMap, fetchKlineMap} = useStore(state => state.kline)
  const [activeIndex, setActiveIndex] = useState<number>(2)
  const [timeOption, setTimeOption] = useState<string>(RESOLUTION_LIST[2])
  const currentBarMapRef = useRef<{[resolution: string]: CandleOhlcData}>({})
  const chartGroupMapRef = useRef<Map<string, MutableRefObject<ChartGroup | null>>>(new Map())
  const [onPresentCallback, onDismiss] = useModal(<IndicatorSelectorModal />)
  

  const register = (id:string, chartGroupRef: MutableRefObject<ChartGroup | null>) => {
    if (!chartGroupRef || !chartGroupRef.current) {
      return 
    }
    chartGroupMapRef.current.set(id, chartGroupRef)
  }
  const unRegister = (id:string) => {
    chartGroupMapRef.current.delete(id)
  }

  const resolution = useMemo(() => {
    let opt = RESOLUTION_LIST[activeIndex]
    if (opt === '1m') {
      return '1'
    }
    return opt
  }, [activeIndex])

  useEffect(() => {
    
    if (!symbol) return
    const now = new Date()
    let to = Math.floor(now.valueOf())
    let from = Math.floor(now.setDate(now.getDate() - 1).valueOf() / 10000) * 10000
    let resolution = RESOLUTION_LIST[activeIndex]

    if (resolution === '1m') {
      resolution = '1'
    } else if (resolution === '1H') {
      from = Math.floor(now.setDate(now.getDate() - 30).valueOf() / 100000) * 100000
      fetchKlineMap({symbol, from, to, resolution})
    } else if (resolution === '1D') {
      from = Math.floor(now.setDate(now.getDate() - 500).valueOf() / 100000) * 100000
      fetchKlineMap({symbol, from, to, resolution})
    }

    fetchKlineMap({symbol, from, to, resolution:'1'})

    
  }, [symbol, fetchKlineMap, resolution])

  const ohlcData:CandleOhlcData[] = useMemo(() => {
    if (!symbol || !klineBarMap[symbol] || !klineBarMap[symbol][resolution]) return []
    
    const ohlcList = klineBarMap[symbol][resolution].map((bar:KlineBar): CandleOhlcData => {
      let ohlc:CandleOhlcData = {
        time: bar.time / 1000 as UTCTimestamp,
        open: bar.openPrice,
        close: bar.closePrice,
        high: bar.highestPrice,
        low: bar.lowestPrice
      }
      
      return ohlc
    })

    return ohlcList
  }, [symbol, klineBarMap, resolution])

  const volumeData:VolumeData[] = useMemo(() => {
    if (!symbol || !klineBarMap[symbol] || !klineBarMap[symbol][resolution]) return []
    
    return klineBarMap[symbol][resolution].map((bar:KlineBar): VolumeData => {
      let vol:VolumeData = {
        time: bar.time / 1000 as UTCTimestamp,
        value: bar.volume as number,
        color: bar.closePrice > bar.openPrice ? '#207350' : '#87313F'
      }
      
      return vol
    })
  }, [symbol, klineBarMap, resolution])

  const fetchMoreChartData = (lastFetchEndTime: number) => {

  }

  const onResolutionOptionSelected = (index: number) => {
    setActiveIndex(index)
    setTimeOption(RESOLUTION_LIST[index])
  }

  const updateChart = (
    candlestickSeries:ISeriesApi<'Candlestick'> | null, 
    volumeSeries:ISeriesApi<'Histogram'> | null, 
    bar?: KlineBar,
    trades?: Trade[]
  ) => {
    console.log(bar);
    
    if (!symbol) return 
    if (!candlestickSeries) {
      return
    }
    if (bar) {
      if (timeOption === '1m') {
        candlestickSeries.update({
          time: bar.time / 1000 as UTCTimestamp,
          open: bar.openPrice,
          low: bar.lowestPrice,
          high: bar.highestPrice,
          close: bar.closePrice
        }) 
      } else if (timeOption === '1D') {
        
        const bars:KlineBar[] = klineBarMap[symbol]['1']
        if (!bars) {
          return
        }

        const time = new Date().setHours(0, 0, 0, 0) / 1000

        if (currentBarMapRef.current[resolution]) {
          const current = currentBarMapRef.current[resolution]
          current.close = bar.closePrice
          current.high = Math.max(bar.highestPrice, current.high)
          current.low = Math.min(bar.lowestPrice, current.low)
          current.time = time as UTCTimestamp
        } else {
          const todayBars = bars.filter(b => b.time >= time)
          const open = todayBars[0].openPrice
          let high = 0
          let low = 100000000000
          todayBars.forEach(bar => {
            high = Math.max(bar.highestPrice, high)
            low = Math.min(bar.lowestPrice, low)
          })

          currentBarMapRef.current[resolution] = {
            time: time as UTCTimestamp,
            open,
            high,
            low,
            close: bar.closePrice
          }
        }
        candlestickSeries.update(currentBarMapRef.current[resolution])
      }

      if (volumeSeries) {
        if (timeOption === '1m') {
          volumeSeries.update({
            time: bar.time / 1000 as UTCTimestamp,
            value: bar.volume,
            color: bar.closePrice > bar.openPrice ? '#207350' : '#87313F'
          })
        }
      }
    }

    if (trades) {
      console.log(trades)
      const price = trades[trades.length - 1].price

      if (timeOption === '1D') {
        const bars:KlineBar[] = klineBarMap[symbol]['1']
        if (!bars) {
          return
        }

        const time = new Date().setHours(0, 0, 0, 0) / 1000

        if (currentBarMapRef.current[resolution]) {
          const current = currentBarMapRef.current[resolution]
          current.close = price
          current.high = Math.max(price, current.high)
          current.low = Math.min(price, current.low)
          current.time = time as UTCTimestamp
        } else {
          const todayBars = bars.filter(b => b.time >= time * 1000)
          const open = todayBars[0].openPrice
          let high = 0
          let low = 100000000000
          todayBars.forEach(bar => {
            high = Math.max(bar.highestPrice, high)
            low = Math.min(bar.lowestPrice, low)
          })

          currentBarMapRef.current[resolution] = {
            time: time as UTCTimestamp,
            open,
            high,
            low,
            close: price
          }
        }
        candlestickSeries.update(currentBarMapRef.current[resolution])
      }
    }
    
  }


  return (
    <Wrapper>
      <ChartHeader>
        {RESOLUTION_LIST.map((item: string, index: number) => (
          <ResolutionOption 
            key={index} 
            $isActive={index === activeIndex} 
            onClick={() => {onResolutionOptionSelected(index)}}>
              {item}
          </ResolutionOption>
        ))}

        <IndicatorSelect onClick={onPresentCallback}>
          <IndicatorIcon fill='rgb(132, 142, 156)'/>
          {/* <IndicatorSelectorModal/> */}
        </IndicatorSelect>
        
      </ChartHeader>
      <CandleChart 
        colors={DEFAULT_CHART_COLORS}
        chartHeight={chartHeight}
        timeOption={timeOption}
        magnet={false}
        ohlcData={ohlcData}
        lastFetchEndTime={1672502400}
        fetchMoreChartData={fetchMoreChartData}
        volumeData={volumeData}
        updateChart={updateChart}
        id={'candle'}
        register={register}
        unRegister={unRegister}
        chartGroupMapRef={chartGroupMapRef}
      />
      <VolumeChart 
        volumeData={volumeData}
        timeOption={timeOption} 
        magnet={false} 
        colors={DEFAULT_CHART_COLORS} 
        id={'volume'}
        register={register}
        unRegister={unRegister}
        chartGroupMapRef={chartGroupMapRef}
        />
      <MacdChart 
        ohlcData={ohlcData}
        timeOption={timeOption} 
        magnet={false} 
        colors={DEFAULT_CHART_COLORS} 
        id={'macd'}
        register={register}
        unRegister={unRegister}
        chartGroupMapRef={chartGroupMapRef}
        />
    </Wrapper>
  )
}

export default ChartWrapper

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`

const ChartHeader = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 40px;
  width: 100%;
  border: 1px solid #252931;
  background: transparent;
  padding-left: 16px;
`

const ResolutionOption = styled.div<{$isActive: Boolean}>`
  box-sizing: border-box;
  margin: 0px 8px 0px 0px;
  min-width: 0px;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  color: rgb(132, 142, 156);
  cursor: pointer;
  font-size: 12px;
  line-height: 16px;
  padding: 4px;
  border-radius: 2px;

  &:hover {
    color: #E3B014;
  }

  ${(props) => {
    return props.$isActive ? css`color: #E3B014;` : css`color: rgb(132, 142, 156);`
  }}
`

const IndicatorSelect = styled.div`
  position: relative;
  border: 1px solid transparent;
  padding: 1px 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  

  &:hover {
    opacity: 0.5;
    border: 1px solid #E3B014;
  }
`