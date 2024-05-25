import { IChartApi, ISeriesApi, LogicalRange, OhlcData } from "lightweight-charts"
import { MutableRefObject, useEffect, useMemo, useRef } from "react"
import { createCandleTooltipForAll } from "./chartToolTip"
import { ChartGroup, VolumeData } from "./types"

type Props = {
  id: string
  chartGroupMapRef: MutableRefObject<Map<string, MutableRefObject<ChartGroup | null>>>
  register: (id:string, chartGroupRef: MutableRefObject<ChartGroup | null>) => void
  unRegister: (id:string) => void
  seriesRefMapRef: MutableRefObject<Map<string, MutableRefObject<ISeriesApi<'Candlestick' | 'Histogram' | 'Line' | 'Area' | 'Bar'> | null>>>
  data: OhlcData[] | VolumeData[]
  timeOption: string
}



export const useChartGroup = ({id, chartGroupMapRef, register, unRegister, seriesRefMapRef, data ,timeOption}: Props) => {
  const chartGroupRef = useRef<ChartGroup | null>(null)
  const chartContainerRef = useRef<any | null>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const toolTipRef = useRef<any | null>(null)

  useEffect(() => {
    chartGroupRef.current = {
      id,
      chartContainerRef,
      chartRef,
      toolTipRef,
      seriesRefMapRef 
    }

    register(id,chartGroupRef)

    return () => {
      chartRef.current?.unsubscribeCrosshairMove(handleSubscribeCrosshairMove)
      chartRef.current?.timeScale().unsubscribeVisibleLogicalRangeChange(handleVisibleLogicalRangeChange)
      
      unRegister(id)

      if (chartRef.current) {
        chartRef.current.remove()
        chartRef.current = null
      }  
    }
  }, [data, timeOption])

  const handleSubscribeCrosshairMove = (param: any) => {
    
    for (let thatkey of chartGroupMapRef.current.keys()) {
      
      if (id === thatkey) {
        continue
      }
      const thatChartGroupRef = chartGroupMapRef.current.get(thatkey)
      
      
      if (param.time && thatChartGroupRef?.current?.seriesRefMapRef && thatChartGroupRef?.current?.seriesRefMapRef.current
        && thatChartGroupRef?.current?.seriesRefMapRef.current.size > 0) {
        const firstSeriesRef = [...thatChartGroupRef.current.seriesRefMapRef.current.values()][0]
        if (firstSeriesRef.current) {
          thatChartGroupRef?.current?.chartRef.current?.setCrosshairPosition(-100000000000, param.time, firstSeriesRef?.current)
        }
      }
      if (
        param.point === undefined ||
        !param.time ||
        param.point.x < 0 ||
        param.point.x > chartContainerRef.current?.clientWidth ||
        param.point.y < 0 ||
        param.point.y > chartContainerRef.current?.clientHeight
      ) {
        thatChartGroupRef?.current?.chartRef.current?.clearCrosshairPosition()
      }
    }
    
    createCandleTooltipForAll(param, id, chartGroupMapRef)
  }

  const handleVisibleLogicalRangeChange = (logicalRange: LogicalRange | null) => {
    if (logicalRange) {
      for (const thatkey of chartGroupMapRef.current.keys()) {
        if (id === thatkey) {
          continue
        }
        const thatChartGroupRef = chartGroupMapRef.current.get(thatkey)
        thatChartGroupRef?.current?.chartRef.current?.timeScale().setVisibleLogicalRange(logicalRange)
      }
    }
  }

  const setter = useMemo(() => {

    const doSubscribe = () => {
      
      chartRef.current?.subscribeCrosshairMove(handleSubscribeCrosshairMove)
      chartRef.current?.timeScale().subscribeVisibleLogicalRangeChange(handleVisibleLogicalRangeChange)
      
    }

    return {doSubscribe}
  }, [])

  return {...chartGroupRef.current, ...setter}
}