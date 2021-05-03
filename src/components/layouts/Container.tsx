import { TimeFrame } from '@src/utils/getChartData'
import React, { FC, useState } from 'react'

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

  const onchange = (newConfig: ConfigData) => {
    setConfig({ ...config, ...newConfig })
  }
  return (
    <div className="flex">
      <SideBar config={config} onChange={onchange} />
      <div className="flex-1">
        <Chart config={config} />
      </div>
    </div>
  )
}

export default Container
