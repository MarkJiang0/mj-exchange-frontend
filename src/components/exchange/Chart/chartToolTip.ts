import { MutableRefObject } from "react";
import { CandleOhlcData, ChartGroup } from "./types";

export const createCandleTooltipForAll = (param: any, id: string, chartGroupMapRef: MutableRefObject<Map<string, MutableRefObject<ChartGroup | null>>>) => {
  
  const chartGroupMap = chartGroupMapRef.current
  if (!chartGroupMap) {
    return
  }
  const currentChartGroupRef = chartGroupMap.get(id) // current chart cursor pointed
  if (!currentChartGroupRef?.current?.chartContainerRef || !currentChartGroupRef?.current?.chartContainerRef.current) {
    return
  }

  for (let key of chartGroupMap.keys()) {
        
    const chartGroupRef = chartGroupMap.get(key)
    
    if (chartGroupRef?.current?.toolTipRef && chartGroupRef?.current?.toolTipRef.current
      && chartGroupRef?.current?.seriesRefMapRef && chartGroupRef?.current?.seriesRefMapRef.current) {

      const container = currentChartGroupRef?.current?.chartContainerRef.current
      const toolTip = chartGroupRef?.current?.toolTipRef.current
      const seriesRefMap = chartGroupRef?.current?.seriesRefMapRef.current
      

      if (cursorMoveOutChartWindow(param, container)) {
        
        if (key === 'candle') {
          const series = seriesRefMap.get('candle')?.current
          if (!series) {
            return
          }
          const data = series.data()[series.data().length - 1]
          if (!data) {
            return
          }

          let html = ''

          for (const name of seriesRefMap.keys()) {
            if (name !== 'candle') {
              const series = seriesRefMap.get(name)?.current
              if (!series) {
                continue
              }
              const data = series.data()[series.data().length - 1]
              if (!data) {
                continue
              }
              html += toolTip.innerHTML = tipHtml([
                {value: name.toUpperCase(), color: '#7E8895', fontSize: 12},
                {value: data.value.toFixed(2), color: '#e80476', fontSize: 12}
              ])
            }
          }

          toolTip.innerHTML = candleToolTipHtml(data) + html
  
        } else if (key === 'macd') {
          const diffSeries = seriesRefMap.get('diff')?.current
          const stickSeries = seriesRefMap.get('stick')?.current
          const deaSeries = seriesRefMap.get('dea')?.current

          const diffData = diffSeries?.data()[diffSeries.data().length - 1]
          const stickData = stickSeries?.data()[stickSeries.data().length - 1]
          const deaData = deaSeries?.data()[deaSeries.data().length - 1]


          toolTip.innerHTML = tipHtml([
            {value: key, color: '#7E8895', fontSize: 12},
            {label: 'DIFF', value: diffData?.value.toFixed(2), color: 'rgba(4, 111, 232, 1)', fontSize: 12},
            {label: 'DEA', value: deaData?.value.toFixed(2), color: '#e80476', fontSize: 12},
            {label: 'STICK', value: stickData?.value.toFixed(2), color: stickData?.color, fontSize: 12}
          ])
        } else if (key === 'volume') {
          const series = seriesRefMap.get('volume')?.current
          if (!series) {
            return
          }
          const data = series.data()[series.data().length - 1]
          if (!data) {
            return
          }
          toolTip.innerHTML = tipHtml([
            {value: key, color: '#7E8895', fontSize: 12},
            {value: data?.value.toFixed(2), color: data.color, fontSize: 12}
          ])
        }
        continue
      }
      
      
      if (key === 'candle') {
        const series = seriesRefMap.get('candle')?.current
        if (!series) {
          return
        }
        const data = series.dataByIndex(param.logical)
        if (!data) {
          return
        }

        let html = ''
        for (const name of seriesRefMap.keys()) {
          if (name !== 'candle') {
            const series = seriesRefMap.get(name)?.current
            if (!series) {
              continue
            }
            const data = series.dataByIndex(param.logical)
            if (!data) {
              continue
            }
            html += toolTip.innerHTML = tipHtml([
              {value: name.toUpperCase(), color: '#7E8895', fontSize: 12},
              {value: data.value.toFixed(2), color: '#e80476', fontSize: 12}
            ])
          }
        }

        toolTip.innerHTML = candleToolTipHtml(data) + html

      } else if (key === 'macd') {
        const diffSeries = seriesRefMap.get('diff')?.current
        const stickSeries = seriesRefMap.get('stick')?.current
        const deaSeries = seriesRefMap.get('dea')?.current

        const diffData = diffSeries?.dataByIndex(param.logical)
        const stickData = stickSeries?.dataByIndex(param.logical)
        const deaData = deaSeries?.dataByIndex(param.logical)
        toolTip.innerHTML = tipHtml([
          {value: key, color: '#7E8895', fontSize: 12},
          {label: 'DIFF', value: diffData?.value.toFixed(2), color: 'rgba(4, 111, 232, 1)', fontSize: 12},
          {label: 'DEA', value: deaData?.value.toFixed(2), color: '#e80476', fontSize: 12},
          {label: 'STICK', value: stickData?.value.toFixed(2), color: stickData?.color, fontSize: 12}
        ])
      } else if (key === 'volume') {
        const series = seriesRefMap.get('volume')?.current
        if (!series) {
          return
        }
        const data = series.dataByIndex(param.logical)
        if (!data) {
          return
        }
        toolTip.innerHTML = tipHtml([
          {value: key, color: '#7E8895', fontSize: 12},
          {value: data?.value.toFixed(2), color: data.color, fontSize: 12}
        ])
      }
      
          
      toolTip.style.left = '1px';
      toolTip.style.top = '1px';
    }
  }
}

type TipData = {
  label?: string
  value: number | string
  color: string
  labelColor?: string
  fontSize: number
}

export const candleToolTipHtml = (data: CandleOhlcData) => {
  const color = data.open > data.close ? '#ef5350' : '#0ECB80'
  const fontSize = 14
  const labelColor = '#7E8895'
  return tipHtml([
    {label: 'Open', value: data.open.toFixed(2), color, fontSize, labelColor},
    {label: 'High', value: data.high.toFixed(2), color, fontSize, labelColor},
    {label: 'Low', value: data.low.toFixed(2), color, fontSize, labelColor},
    {label: 'Close', value: data.close.toFixed(2), color, fontSize, labelColor},
  ])
}


export const tipHtml = (dataList: TipData[]) => {
  const items = dataList.reduce((a, i) => {
    return `
    ${a}
    <div style="font-size: ${i.fontSize}px; margin: 2px 2px; color: ${i.color}">
      <span style="color: ${i.labelColor ?? i.color}">${i.label??''}<span> 
      <span style="color: ${i.color}">${i.value}<span> 
    </div>`
  }, '')

  return `
    <div style="display: flex; justify-content: flex-start; align-items: center;">
      ${items}
    </div>
  `
}

const cursorMoveOutChartWindow = (param: any, container: any) => {
  return param.point === undefined ||
        !param.time ||
        param.point.x < 0 ||
        param.point.x > container.clientWidth ||
        param.point.y < 0 ||
        param.point.y > container.clientHeight
}