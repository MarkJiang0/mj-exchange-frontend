import { CrosshairMode, IChartApi, ISeriesApi, createChart } from 'lightweight-charts'
import { MutableRefObject, useEffect, useRef } from 'react'
import { crosshairConfig, gridConfig, layoutConfig, localizationTimeFormat, tickMarkFormat } from './chartHelper'
import { useChartGroup } from './hooks'
import { ChartContainer, ToolTipWrapper } from './styles'
import { ChartColors, ChartGroup, VolumeData } from './types'

type Props = {
  colors: ChartColors
  timeOption: string
  magnet: boolean
  volumeData: VolumeData[]
  id: string
  chartGroupMapRef: MutableRefObject<Map<string, MutableRefObject<ChartGroup | null>>>
  register: (id:string, chartGroupRef: MutableRefObject<ChartGroup | null>) => void
  unRegister: (id:string) => void
}

const VolumeChart = ({colors, timeOption, magnet, volumeData, id, chartGroupMapRef, register, unRegister}: Props) => {
  const seriesRefMapRef = useRef<Map<string, MutableRefObject<ISeriesApi<'Candlestick' | 'Histogram' | 'Line' | 'Area' | 'Bar'> | null>>>(new Map())
  const seriesRef = useRef<ISeriesApi<'Candlestick' | 'Histogram' | 'Line' | 'Area' | 'Bar'> | null>(null)

  const {
    chartContainerRef, 
    chartRef, 
    toolTipRef, 
    doSubscribe
  } = useChartGroup({id, chartGroupMapRef, register, unRegister, seriesRefMapRef, timeOption, data: volumeData})

  const totalDecimalPlacesRef = useRef(4)

  useEffect(() => {
    if (!chartContainerRef || !chartContainerRef.current || !chartRef) {
      return
    } 
    
    chartRef.current = createChart(chartContainerRef.current, {
      layout: layoutConfig,

      width: 866,
      height: 100,
      timeScale: { 
        visible: false,
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
          bottom: 0,
        },
        minimumWidth: 100
      },
      grid: gridConfig,
      crosshair: {
        mode: magnet ? CrosshairMode.Magnet : CrosshairMode.Normal,
        ...crosshairConfig
      },
    })


    console.log(chartRef.current)


    if (volumeData && !seriesRef.current && chartRef.current) {
      
      seriesRef.current = chartRef.current.addHistogramSeries({
        priceLineVisible: false,
        lastValueVisible: false,
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
          bottom: 0,
        },
      })
    }

    seriesRefMapRef.current.set('volume', seriesRef)
    doSubscribe()

    return () => {
      seriesRef.current = null
      chartRef.current?.remove()
      chartRef.current = null
      seriesRefMapRef.current = new Map()
    }
  }, [volumeData,
    timeOption])

  useEffect(() => {
    if (!chartRef || !chartRef.current) return
    if (seriesRef.current) {
      seriesRef.current.setData(volumeData)
    }
  }, [volumeData,
    timeOption])

  return (
    <ChartContainer ref={chartContainerRef}>
      <ToolTipWrapper ref={toolTipRef}>
      </ToolTipWrapper>
    </ChartContainer>
  )
}

export default VolumeChart

