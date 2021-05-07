import ccxt, { Exchange } from 'ccxt'

const CRO_USDT = 'CRO/USDT'

export const init = async (): Promise<{
  tradingPairs: string[]
}> => {
  // const kraken = new ccxt.kraken()
  // const bitfinex = new ccxt.bitfinex({ verbose: true })
  const huobipro = new ccxt.huobipro()
  // const okcoinusd = new ccxt.okcoinusd({
  //   apiKey: 'YOUR_PUBLIC_API_KEY',
  //   secret: 'YOUR_SECRET_PRIVATE_KEY',
  // })

  const exchangeId = 'binance'
  const exchangeClass = ccxt[exchangeId]
  const exchange = new exchangeClass({
    apiKey: 'YOUR_API_KEY',
    secret: 'YOUR_SECRET',
    timeout: 30000,
    enableRateLimit: true,
  })

  // console.log(kraken.id, await kraken.loadMarkets())
  // console.log(bitfinex.id, await bitfinex.loadMarkets())
  const huobiproId = huobipro.id
  const huobiTradingPairs = await huobipro.loadMarkets()
  const CRO_USDT_MARKETS = huobiTradingPairs[CRO_USDT]
  // console.log(huobiTradingPairs, 'huobiTradingPairs')
  // console.log('market', CRO_USDT_MARKETS)
  const market = await huobipro.fetchOHLCV(CRO_USDT)
  // console.log('fetch market', market)

  // console.log(kraken.id, await kraken.fetchOrderBook(kraken.symbols[0]))
  // console.log(bitfinex.id, await bitfinex.fetchTicker('BTC/USD'))
  // console.log(huobipro.id, await huobipro.fetchTrades(CRO_USDT))
  // const CRO_USDT_TICKER = await huobipro.fetchTicker(CRO_USDT)
  // console.log('ticker', CRO_USDT_TICKER)

  // console.log(okcoinusd.id, await okcoinusd.fetchBalance())

  // sell 1 BTC/USD for market price, sell a bitcoin for dollars immediately
  // console.log(okcoinusd.id, await okcoinusd.createMarketSellOrder('BTC/USD', 1))

  // buy 1 BTC/USD for $2500, you pay $2500 and receive ฿1 when the order is closed
  // console.log(
  //   okcoinusd.id,
  //   await okcoinusd.createLimitBuyOrder('BTC/USD', 1, 2500.0)
  // )

  // pass/redefine custom exchange-specific order params: type, amount, price or whatever
  // use a custom order type
  // bitfinex.createLimitSellOrder('BTC/USD', 1, 10, { type: 'trailing-stop' })

  return {
    tradingPairs: Object.keys(huobiTradingPairs),
  }
}

export const fetchHuobiproKline = async (
  tradingPair: string,
  timeframe: string = '1d'
) => {
  const huobipro = new ccxt.huobipro()
  return await huobipro.fetchOHLCV(tradingPair, timeframe)
}
