import React, { FC, useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'

import { fetchHuobiproKlineOfCroUsdt } from '../../utils/initExchange'
import { useAsyncCall } from '../../utils/hooks'
import { getOptions } from '../../utils/getChartData'
const Chart: FC = () => {
  const chart = useRef<echarts.ECharts>()
  const [getkline, { result }] = useAsyncCall(fetchHuobiproKlineOfCroUsdt)

  useEffect(() => {
    getkline()
  }, [getkline])

  useEffect(() => {
    if (!result || !chart.current) return
    const option = getOptions(result, '1d', 100)

    chart.current.setOption(option)
  }, [result])

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
