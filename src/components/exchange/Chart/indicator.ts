import { EMA, MACD, RSI, SMA, WMA } from "technicalindicators";
import { CandleOhlcData } from "./types";
import { MAInput } from "technicalindicators/declarations/moving_averages/SMA";

export const MA = (maLength: number, candleData: CandleOhlcData[]) => {
  const maData = [];

  for (let i = 0; i < candleData.length; i++) {
      if (i < maLength) {
          // Provide whitespace data points until the MA can be calculated
          maData.push({ time: candleData[i].time });
      } else {
          // Calculate the moving average, slow but simple way
          let sum = 0;
          for (let j = 0; j < maLength; j++) {
              sum += candleData[i - j].close;
          }
          const maValue = sum / maLength;
          maData.push({ time: candleData[i].time, value: maValue });
      }
  }

  return maData;
}


export const sma = (count: number, data: CandleOhlcData[]) => {
  return calMoveAverage(data, 'close', count, SMA.calculate)
}

export function ema(count: number, data: CandleOhlcData[]) {
  return calMoveAverage(data, 'close', count, EMA.calculate)
}

export function wma(count: number, data: CandleOhlcData[]) {
  return calMoveAverage(data, 'close', count, WMA.calculate)
}


export const macd = (fastPeriod: number, slowPeriod: number, signalPeriod: number, data: CandleOhlcData[]) => {
  var result = [];

  const prices = data.map((i:any) => i.close)
  const indList = MACD.calculate({
    values: prices,
    fastPeriod: fastPeriod,
    slowPeriod: slowPeriod,
    signalPeriod: signalPeriod,
    SimpleMAOscillator: false,
    SimpleMASignal: false
  })

  const diff = data.length - indList.length
  for(let i = data.length - 1; i >= 0; i--) {
    const j = i - diff
    const item = j >= 0 ? {time: data[i].time, value: indList[j]} : {time: data[i].time}
    result.unshift(item)
  }
  return result
}

export const rsi = (period: number, data: CandleOhlcData[]) => {
  var result = [];

  const prices = data.map((i:any) => i.close)
  const indList = RSI.calculate({
    values: prices,
    period,
  })

  const diff = data.length - indList.length
  for(let i = data.length - 1; i >= 0; i--) {
    const j = i - diff
    const item = j >= 0 ? {time: data[i].time, value: indList[j]} : {time: data[i].time}
    result.unshift(item)
  }
  return result
}


export const calMoveAverage = (data: CandleOhlcData[], type: string, period: number, calculate: (input: MAInput) => number[]) => {
  var result = [];

  const prices = data.map((i:any) => i[type])
  const indList = calculate({period: period, values: prices})

  const diff = data.length - indList.length
  for(let i = data.length - 1; i >= 0; i--) {
    const j = i - diff
    const item = j >= 0 ? {time: data[i].time, value: indList[j]} : {time: data[i].time}
    result.unshift(item)
  }
  return result
}
