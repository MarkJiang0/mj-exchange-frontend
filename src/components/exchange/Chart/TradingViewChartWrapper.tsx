import React, { useEffect, useRef } from 'react'
import { ChartingLibraryWidgetOptions, CrossHairMovedEventParams, EntityInfo, IChartingLibraryWidget, LanguageCode, ResolutionString, widget } from '../../../../public/charting_library/charting_library.min'
import styled, { css } from 'styled-components';
import { datafeed_dummy } from './trading_view/trading_view.datafeed';
import { height } from 'styled-system';


const TradingViewChartWrapper = ({props, height}: {props: Partial<ChartingLibraryWidgetOptions>, height?: string}) => {
  const chartContainerRef = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
  const widgetRef = useRef<IChartingLibraryWidget | null>(null) as React.MutableRefObject<IChartingLibraryWidget | null>;

  const toggleIndicator = (studies: EntityInfo[], name: string, create: () => void) => {
    if (!studies) {
      create()
      return
    }
    const macdStudyList = studies.filter(i => i.name.toLowerCase() === name.toLowerCase())
    if (macdStudyList && macdStudyList.length > 0) {
      macdStudyList.forEach(i => {
        widgetRef.current?.chart().removeEntity(i.id)
      })
    } else {
      create()
    }
  }

  const setVisible = (studies: EntityInfo[], name: string) => {
    if (!studies) {
      return
    }
    const macdStudyList = studies.filter(i => i.name.toLowerCase() === name.toLowerCase())
    if (macdStudyList && macdStudyList.length > 0) {
      macdStudyList.forEach(i => {
        const study = widgetRef.current?.chart().getStudyById(i.id)
        if (study?.isVisible()) study?.setVisible(false)
      })
    }
  }
  
  useEffect(() => {
    if (!props.symbol) {
      return
    }
    
		const widgetOptions: ChartingLibraryWidgetOptions = {
			symbol: props.symbol,
			datafeed: datafeed_dummy,
			interval: props.interval as ResolutionString,
			container_id: chartContainerRef.current.id,
			library_path: props.library_path,
			locale: props.locale as LanguageCode,
			disabled_features: props.disabled_features,
			enabled_features: props.enabled_features,
			charts_storage_url: props.charts_storage_url,
			charts_storage_api_version: props.charts_storage_api_version,
			client_id: props.client_id,
			user_id: props.user_id,
			fullscreen: props.fullscreen,
			autosize: props.autosize,
      overrides: props.overrides,
      study_count_limit: props.study_count_limit,
      studies_overrides: props.studies_overrides,
      preset: 'mobile'
		};

		widgetRef.current = new widget(widgetOptions);

    // widgetRef.current.onChartReady(() => {
    //   widgetRef.current?.chart().createStudy('MACD', false, false)
    // })

    widgetRef.current.onChartReady(() => {
      // const id = widgetRef.current?.chart().createStudy('Moving Average', false, false, [7])
      // console.log(widgetRef.current?.chart().getStudyById(id).getInputValues())
      // widgetRef.current?.chart().createStudy('MACD', false, false)
      widgetRef.current?.chart().crossHairMoved((param: CrossHairMovedEventParams) => {
        const studies = widgetRef.current?.chart().getAllStudies()
        studies?.map(i => {
          
          
          
        })
      })

      window.addEventListener('message', handleMessage)
    })

		return () => {
      // if (widgetRef.current) {
      //   widgetRef.current.remove()
      // }
      window.removeEventListener('message', handleMessage)
			widgetRef.current = null
		}
	}, [props]);

  const handleMessage = (event: any) => {
    if (!widgetRef.current) {
      return 
    }
    

    if (event.data === '1D' || event.data === '1M' || event.data === '1H' || event.data === '1m' || event.data === '5m' || event.data === '15m') {
      widgetRef.current.chart().setResolution(event.data, () => {})
      return
    }

    const studies = widgetRef.current.chart().getAllStudies()
    
    if (event.data === 'MACD') {
      toggleIndicator(studies, 'MACD', () => {widgetRef.current?.chart().createStudy('MACD', false, false)})  
    } else if (event.data === 'RSI') {
      toggleIndicator(studies, 'Relative Strength Index', () => {widgetRef.current?.chart().createStudy('Relative Strength Index', false, false)})
      
    } else if (event.data === 'VOL') {
      toggleIndicator(studies, 'Volume', () => {widgetRef.current?.chart().createStudy('Volume', false, false)})
    } else if (event.data === 'MA') {
      toggleIndicator(studies, 'Moving Average', () => {
        widgetRef.current?.chart().createStudy('Moving Average', false, false, [7])
        widgetRef.current?.chart().createStudy('Moving Average', false, false, [25])
        widgetRef.current?.chart().createStudy('Moving Average', false, false, [99])
      })

      setVisible(studies, 'Moving Average Exponential')
      setVisible(studies, 'Bollinger Bands')
      
    } else if (event.data === 'EMA') {
      toggleIndicator(studies, 'Moving Average Exponential', () => {
        widgetRef.current?.chart().createStudy('Moving Average Exponential', false, false, [7])
        widgetRef.current?.chart().createStudy('Moving Average Exponential', false, false, [25])
        widgetRef.current?.chart().createStudy('Moving Average Exponential', false, false, [99])
      })
      setVisible(studies, 'Moving Average')
      setVisible(studies, 'Bollinger Bands')
      
    } else if (event.data === 'BOLL') {
      toggleIndicator(studies, 'Bollinger Bands', () => {widgetRef.current?.chart().createStudy('Bollinger Bands', false, false)})
      setVisible(studies, 'Moving Average Exponential')
      setVisible(studies, 'Moving Average')
    }
  }
  


  return (
    <Container id='tv_chart_container' ref={chartContainerRef} $height={height}/>
  )
}

export default TradingViewChartWrapper

const Container = styled.div<{$height?: string}>`
  
  
  width: 100vw;

  ${(props) => {
    return props.$height ? css`height: ${props.$height}; ` : css`height: 400px; `
  }}
`
