export default {
  market: {
      tradePlate: '/topic/market/trade-plate/', //订阅盘口消息
      thumb: '/topic/market/thumb', //订阅价格变化消息
      trade: '/topic/market/trade/', //订阅实时成交信息
      orderCancel: '/topic/market/order-canceled/', //订阅委托取消信息
      orderCompleted: '/topic/market/order-completed/', //订阅委托交易完成
      orderTrade: '/topic/market/order-trade/', //订阅委托部分交易
      kline: '/topic/market/kline/'
  }
}
