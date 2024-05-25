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
      <TVChartContainer height={'200px'} />
    </>
    
  )
}

export default market
