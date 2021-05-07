import { TimeFrame } from '@src/utils/getChartData'
import { useAsyncCall, useFetch, usePromiseCall } from '@src/utils/hooks'
import { fetchHuobiproKline } from '@src/utils/initExchange'
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
  const [config, setConfig] = useState<ConfigData>(defaultConfigData)

  const getKilineData = useCallback(() => {
    const { timeframe, tradingPair } = defaultConfigData

    return fetchHuobiproKline(tradingPair, timeframe)
  }, [])
  const { result: initResult } = usePromiseCall(getKilineData)
  const [getkline, { result, loading }] = useAsyncCall(fetchHuobiproKline)

  const onchange = (newConfig: ConfigData) => {
    const assignConfig = { ...config, ...newConfig }
    const { timeframe, tradingPair } = assignConfig
    setConfig(assignConfig)
    getkline(tradingPair, timeframe)
  }

  return (
    <div className="flex">
      <SideBar config={config} onChange={onchange} loading={loading} />
      <div className="flex-1">
        <Chart config={config} data={result || initResult} loading={loading} />
      </div>
    </div>
  )
}

export default Container
