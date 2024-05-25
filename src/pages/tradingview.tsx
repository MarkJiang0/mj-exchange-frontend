import ResetCSS from '@/ResetCSS';
import dynamic from 'next/dynamic';

const TVChartContainer = dynamic(
  () =>
    import("@/views/TradingChartView").then((mod) => mod.default),
  { ssr: false }
);

const market = () => {
  return (
    <>
      <ResetCSS />
      <TVChartContainer height={'400px'} />
    </>
    
  )
}

export default market
