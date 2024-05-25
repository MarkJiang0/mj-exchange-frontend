import { getKlines } from '@/services';
import {
  Bar,
  HistoryCallback,
  IBasicDataFeed,
  LibrarySymbolInfo,
  OnReadyCallback,
  ResolutionString,
  ResolveCallback,
  SearchSymbolResultItem,
  SearchSymbolsCallback,
  SubscribeBarsCallback,
} from '../../../../../public/charting_library/charting_library.min'

import {
  makeApiRequest,
  parseFullSymbol,
  getAllSymbols,
  configurationData,
  lastBarsCache,
} from "./trading_view.helpers"
// import {
//   subscribeOnStream,
//   unsubscribeFromStream,
// } from "./trading_view.streaming";

export const datafeed_dummy: IBasicDataFeed = {
  onReady: (callback: OnReadyCallback) => {
    console.log("tv: [onReady]: Method call");
    callback(configurationData);
  },

  // searchSymbols: async (
  //   userInput: string,
  //   exchange: string,
  //   symbolType: string,
  //   onResult: SearchSymbolsCallback
  // ) => {
  //   console.log("tv: [searchSymbols]: Method call");
  //   const symbols = await getAllSymbols();

  //   const newSymbols: SearchSymbolResultItem[] = symbols.filter((symbol) => {
  //     const isExchangeValid = exchange === "" || symbol.exchange === exchange;
  //     const isFullSymbolContainsInput =
  //       symbol.full_name.toLowerCase().indexOf(userInput.toLowerCase()) !== -1;
  //     return isExchangeValid && isFullSymbolContainsInput;
  //   });

  //   onResult(newSymbols);
  // },

  // @ts-ignore
  resolveSymbol: async (
    symbolName: string,
    onResolve: ResolveCallback,
    onError: ErrorCallback,
    extension?: any | undefined
  ) => {
    console.log("tv: [resolveSymbol]: Method call", { symbolName });
    // const symbols = await getAllSymbols();
    // const symbolItem = symbols.find(
    //   ({ full_name }) => full_name === symbolName
    // );
    // if (!symbolItem) {
    //   //console.log("tv: [resolveSymbol]: Cannot resolve symbol", { symbolName });
    //   onError(
    //     new DOMException("tv: [resolveSymbol]: err Cannot resolve symbol")
    //   );
    //   return;
    // }

    // console.log("tv: symbolItem ", symbolItem);

    const symbolInfo: LibrarySymbolInfo = {
      name: symbolName,
      full_name: 'BTC/USDT',
      ticker: '',
      description: 'BTC/USDT',
      type: 'bitcoin',
      session: "24x7",
      exchange: '',
      listed_exchange: "",
      timezone: "Asia/Shanghai",
      pricescale: 100,
      minmov: 1,
      has_intraday: true,
      has_no_volume: true, // whether to show volume bars or not
      has_weekly_and_monthly: true,
      supported_resolutions: ["1","5","15","30","60","1D","1W","1M"] as ResolutionString[],
      volume_precision: 2,
      data_status: "streaming",
    };
    onResolve(symbolInfo);
  },

  // @ts-ignore
  getBars: async (
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    rangeStartDate: number, 
    rangeEndDate: number, 
    onResult: HistoryCallback,
    onError: ErrorCallback,
    isFirstCall: boolean,
  ) => {
    // console.log(periodParams)
    // const { from, to, firstDataRequest } = periodParams;

    // console.log("tv: [getBars]: Method call", symbolInfo, resolution, from, to);

    // const parsedSymbol = parseFullSymbol(symbolInfo.full_name);
    // const urlParameters = {
    //   e: parsedSymbol?.exchange,
    //   fsym: parsedSymbol?.fromSymbol,
    //   tsym: parsedSymbol?.toSymbol,
    //   toTs: to,
    //   limit: 100,
    // };
    // const query = Object.keys(urlParameters)
    //   // @ts-ignore
    //   .map((name) => `${name}=${encodeURIComponent(urlParameters[name])}`)
    //   .join("&");

    try {
      const resp = await getKlines({
        symbol: symbolInfo.name,
        from: rangeStartDate*1000,
        to: isFirstCall ? new Date().getTime(): rangeEndDate*1000,
        resolution: resolution
      });
      
      // if (
      //   (data.Response && data.Response === "Error") ||
      //   data.Data.length === 0
      // ) {
      //   // "noData" should be set if there is no data in the requested period.
      //   onResult([], {
      //     noData: true,
      //   });
      //   return;
      // }

      let bars: Bar[] = [];
      // console.log(resp)

        for(var i = 0;i<resp.data.length;i++){
            var item = resp.data[i];
            bars.push({time:item[0],open:item[1],high:item[2],low:item[3],close:item[4],volume:item[5]})
        }

        // that.lastBar = bars.length > 0 ? bars[bars.length-1]:null;
        // that.currentBar = that.lastBar;
        // var noData = bars.length == 0;

      // data.Data.forEach((bar: any) => {
      //   if (bar.time >= from && bar.time < to) {
      //     bars = [
      //       ...bars,
      //       {
      //         time: bar.time * 1000,
      //         low: bar.low,
      //         high: bar.high,
      //         open: bar.open,
      //         close: bar.close,
      //         volume: bar.volumefrom, // pass to show volume bars
      //       },
      //     ];
      //   }
      // });

      if (isFirstCall) {
        lastBarsCache.set(symbolInfo.full_name, {
          ...bars[bars.length - 1],
        });
      }
      console.log(`tv: [getBars]:`);
      // console.log(bars)

      console.log(onResult)
      console.log(onError)
      onResult(bars, {
        noData: false,
      });
    } catch (error: any) {
      //console.log("tv: [getBars]: Get error", error);
      // onError(new DOMException("tv: [getBars]: Get error", error));
    }
  },

  subscribeBars: (
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    onTick: SubscribeBarsCallback,
    listenerGuid: string,
    onResetCacheNeededCallback: () => void
  ) => {
    // console.log("tv: [subscribeBars]: Method call with listenerGuid:",listenerGuid);

  //   subscribeOnStream(
  //     symbolInfo,
  //     resolution,
  //     onTick,
  //     listenerGuid,
  //     onResetCacheNeededCallback,
  //     lastBarsCache.get(symbolInfo.full_name)
  //   );
  },

  // unsubscribeBars: (subscriberUID: string) => {
  //   // console.log("tv: [unsubscribeBars]: Method call with subscriberUID:",subscriberUID);
  //   unsubscribeFromStream(subscriberUID);
  // },
};
