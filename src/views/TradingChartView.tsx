import ExchangeMarketView from '@/views/ExchangeMarketView'
import dynamic from 'next/dynamic';
import React from 'react'
import styled from 'styled-components'
import { ChartingLibraryWidgetOptions } from '../../public/charting_library/charting_library.min';
import TradingViewChartWrapper from '@/components/exchange/Chart/TradingViewChartWrapper';
import ResetCSS from '@/ResetCSS';

const defaultWidgetProps: Partial<ChartingLibraryWidgetOptions> = {
  // debug: true, // uncomment this line to see Library errors and warnings in the console
  // fullscreen: true,
  autosize: true,
  symbol: 'BTC/USDT',
  interval: '1D',
  library_path: "charting_library/",
  locale: "en",
  //	Regression Trend-related functionality is not implemented yet, so it's hidden for a while
  drawings_access: {type: 'black', tools: [{name: "Regression Trend"}]},
  // enabled_features: ["study_templates"],
  charts_storage_url: 'http://saveload.tradingview.com',
  charts_storage_api_version: "1.1",
  client_id: 'tradingview.com',
  user_id: 'public_user_id',
  studies_overrides: {
    "moving average exponential.plot.linewidth": 3,
    "moving average exponential.plot.color.0" : "#A96E29",
    "moving average exponential.plot.color.1" : "#52B1B2",
    "moving average exponential.plot.color.2" : "#A52BAD",
    "moving average.plot.linewidth": 3,
    "moving average.plot.color.0" : "#6220AC",
    "moving average.plot.color.1" : "#0018AC",
    "moving average.plot.color.2" : "#A52419"
  },
  study_count_limit: 6,
  disabled_features: [
    "use_localstorage_for_settings",
    // 'legend',
    // 'context_menus',
    // 'edit_buttons_in_legend',
    'timeframes_toolbar',
    'go_to_date',
    'volume_force_overlay',
    'header_symbol_search',
    'header_undo_redo',
    'caption_button_text_if_possible',
    'header_chart_type',
    'header_settings',
    'header_interval_dialog_button',
    'show_interval_dialog_on_key_press',
    'header_compare',
    'header_screenshot',
    'header_saveload',
    'header_fullscreen_button',
    // 'legend_context_menu',
    // 'edit_buttons_in_legend',
    'hide_last_na_study_output',
    'left_toolbar',
    'header_resolutions',
    'header_widget',
    'control_bar'
  ],
  overrides: {
      "paneProperties.background": "#0C0F14",
      "paneProperties.vertGridProperties.color": "#1A1E23",
      "paneProperties.horzGridProperties.color": "#1A1E23",
      "symbolWatermarkProperties.transparency": 90,
      "paneProperties.legendProperties.showStudyArguments": false,
      "paneProperties.legendProperties.showStudyTitles": false,
      "paneProperties.legendProperties.showStudyValues": false,


      "paneProperties.legendProperties.showSeriesTitle": false,
      "paneProperties.legendProperties.showSeriesOHLC": false,
      "paneProperties.legendProperties.showBarChange": false,

      "scalesProperties.lineColor": "transparent"
  }
};

const TradingChartView = ({height}:{height: string}) => {
  return (
    <Container>
      
      <TradingViewChartWrapper props={defaultWidgetProps} height={height} />
    </Container>
  )
}

export default TradingChartView

const Container = styled.div`
  margin: 0;
  padding: 0;
  border: 0;
  background-color: #0C0F14;
`