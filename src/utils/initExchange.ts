import ccxt, { Exchange } from 'ccxt'

import { getDateStr } from './getChartData'
import { getLocalJsonField } from './helpers/storageHelper'
import { getTodayStartTime } from './helpers/timeHelper'

const CRO_USDT = 'CRO/USDT'

export const init = async (): Promise<{
  tradingPairs: string[]
  huobipro: ccxt.huobipro
}> => {
  // const kraken = new ccxt.kraken()
  // const bitfinex = new ccxt.bitfinex({ verbose: true })
  console.log(process.env)
  const huobipro = new ccxt.huobipro({
    apiKey: process.env.REACT_APP_API_KEY,
    secret: process.env.REACT_APP_SECRET_KEY,
    enableRateLimit: true,
  })
  console.log(huobipro.checkRequiredCredentials())
  // const transactions = await huobipro.fetchMyTrades(
  //   'LINK/USDT',
  //   undefined,
  //   undefined,
  //   {
  //     'start-time': new Date('2021-06-24').getTime(),
  //     'end-time': new Date('2021-06-25').getTime(),
  //   }
  // )
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
    huobipro,
  }
}

export const fetchKline = async (
  exchange: Exchange,
  tradingPair: string,
  timeframe: string = '1d'
) => {
  return await exchange.fetchOHLCV(tradingPair, timeframe)
}

export const fetchAllOrders = async (
  exchange: Exchange,
  tradingPair: string
) => {
  let startTime = exchange.milliseconds()
  const dayMilliseconds = 24 * 3600 * 1000
  const timeRanges = []
  while (
    startTime - dayMilliseconds > 0 &&
    startTime - dayMilliseconds <= dayMilliseconds * 180
  ) {
    const endTime = startTime - dayMilliseconds
    timeRanges.push({ startTime, endTime })
    startTime -= dayMilliseconds
  }
  const asyncTasks = timeRanges.map(({ startTime, endTime }) => {
    return exchange.fetchOrders(tradingPair, undefined, undefined, {
      'start-time': startTime,
      'end-time': endTime,
    })
  })
  const results = await Promise.all(asyncTasks)
  return results.flat()
}

export const fetchAllTransactions = async (
  exchange: Exchange,
  tradingPair: string
) => {
  let endTime = getTodayStartTime()
  const dayMilliseconds = 24 * 3600 * 1000
  const twoDayMilliseconds = dayMilliseconds * 2
  const timeRanges = []
  while (
    endTime - twoDayMilliseconds > 0 &&
    getTodayStartTime() - endTime <= dayMilliseconds * 10
  ) {
    const startTime = endTime - twoDayMilliseconds
    timeRanges.push({ startTime, endTime })
    endTime -= dayMilliseconds * 2
  }
  const storage = getLocalJsonField(tradingPair)
  let newStorage: Record<string, ccxt.Trade> = storage || {}
  const asyncTasks = timeRanges.map(({ startTime, endTime }) => {
    return exchange
      .fetchMyTrades(tradingPair, undefined, undefined, {
        'start-time': startTime,
        'end-time': endTime,
      })
      .then(res => {
        const flatResults = res.flat()
        flatResults.forEach(item => {
          console.log(
            getDateStr(Number(item.info['created-at'])),
            item.datetime
          )
          newStorage[getDateStr(Number(item.info['created-at']))] = item
        })
        localStorage.setItem(tradingPair, JSON.stringify(newStorage))
        return res
      })
  })

  const results = await Promise.all(asyncTasks)

  return Object.values(newStorage)
}
