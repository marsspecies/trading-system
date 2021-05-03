import React, { FC, useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'
import { fetchHuobiproKlineOfCroUsdt } from 'utils/initExchange'
import { useAsyncCall } from 'utils/hooks'
import { getOptions } from 'utils/getChartData'

import { ConfigData } from '../layouts/Sidebar'

enum ComponentSubType {
  candlestick = 'candlestick',
  line = 'line',
}
interface Props {
  config: ConfigData
}
const Chart: FC<Props> = ({
  config: { tradingPair, timeframe, pastCount },
}) => {
  const chart = useRef<echarts.ECharts>()
  const [getkline, { result }] = useAsyncCall(fetchHuobiproKlineOfCroUsdt)

  useEffect(() => {
    getkline(tradingPair, timeframe)
  }, [getkline, timeframe, tradingPair])

  useEffect(() => {
    if (!result || !chart.current) return

    const seriesName = `${tradingPair} ${timeframe}`
    const option = getOptions({
      data: result,
      tradingPair,
      timeframe,
      pastCount,
    })

    chart.current.setOption(option)
    chart.current?.on('click', (params: any) => {
      if (
        params.componentSubType === ComponentSubType.candlestick &&
        params.seriesName === seriesName
      ) {
        console.log(params.data[0])
        const option = getOptions({
          data: result,
          tradingPair,
          timeframe,
          pastCount: 100,
          originIndex: params.data[0],
        })
        chart.current?.setOption(option)
      }
    })
  }, [pastCount, result, timeframe, tradingPair])

  return (
    <div
      id="kline"
      style={{ width: '100%', height: '100vh' }}
      ref={node => {
        if (!node) return
        chart.current = echarts.init(node)
      }}
    ></div>
  )
}

export default Chart
