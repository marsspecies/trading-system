import { TimeFrame } from '@src/utils/getChartData'
import ccxt, { Exchange } from 'ccxt'
import { useAsyncCall, useFetch, usePromiseCall } from 'hooks/index'
import { fetchAllTransactions, fetchKline, init } from '@src/utils/initExchange'
import React, { FC, useCallback, useEffect, useState } from 'react'

import Chart from '../charts/Chart'

import SideBar, { ConfigData } from './Sidebar'

const defaultTradingPair = 'CRO/USDT'
const defaultConfigData: ConfigData = {
  tradingPair: defaultTradingPair,
  timeframe: '1d',
  pastCount: 100,
}
const Container: FC = () => {
  const [huobipro, setHuobipro] = useState<ccxt.huobipro>()
  const [tradingPairs, setTradingPairs] = useState<string[]>([])
  const [config, setConfig] = useState<ConfigData>(defaultConfigData)

  const [getkline, { result: klineResult, loading }] = useAsyncCall(fetchKline)

  const [getAllTransaction, { result: transactionResult }] = useAsyncCall(
    fetchAllTransactions
  )

  const { loading: initLoading, result: initResult } = usePromiseCall(init)

  useEffect(() => {
    if (!huobipro) return
    const { tradingPair } = defaultConfigData
    getkline(huobipro, tradingPair)
    getAllTransaction(huobipro, tradingPair)
  }, [getAllTransaction, getkline, huobipro])

  const onchange = (newConfig: ConfigData) => {
    if (!huobipro) return
    const assignConfig = { ...config, ...newConfig }
    const { timeframe, tradingPair } = assignConfig
    setConfig(assignConfig)
    getkline(huobipro, tradingPair, timeframe)
    console.log('=====')
    getAllTransaction(huobipro, tradingPair)
  }

  useEffect(() => {
    if (initResult) {
      const { tradingPairs, huobipro } = initResult
      setTradingPairs(tradingPairs)
      setHuobipro(huobipro)
    }
  }, [initResult])

  return (
    <div className="flex">
      <SideBar
        config={config}
        onChange={onchange}
        loading={loading}
        tradingPairs={tradingPairs}
      />
      <div className="flex-1">
        {huobipro && klineResult && (
          <Chart
            transactionResult={transactionResult}
            exchange={huobipro}
            config={config}
            data={klineResult}
            loading={loading}
          />
        )}
      </div>
    </div>
  )
}

export default Container
