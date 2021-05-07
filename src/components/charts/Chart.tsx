import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import * as echarts from 'echarts'
import { getOptions, TimeFrame } from 'utils/getChartData'
import { OHLCV } from 'ccxt'

import { ConfigData } from '../layouts/Sidebar'

interface ClickEventContext {
  data: OHLCV[]
  seriesName: string
  tradingPair: string
  timeframe: TimeFrame
  pastCount: number
}

enum ComponentSubType {
  candlestick = 'candlestick',
  line = 'line',
}
interface Props {
  config: ConfigData
  data: OHLCV[] | null
  loading: boolean
}
const Chart: FC<Props> = ({
  config: { tradingPair, timeframe, pastCount },
  data,
  loading,
}) => {
  const chart = useRef<echarts.ECharts>()

  const seriesName = useMemo(() => `${tradingPair} ${timeframe}`, [
    timeframe,
    tradingPair,
  ])

  const handleBarClick = useCallback(function (
    this: ClickEventContext,
    params: any
  ) {
    let {
      data,
      tradingPair,
      timeframe,
      pastCount,
      seriesName,
    } = this as ClickEventContext

    if (
      params.componentSubType === ComponentSubType.candlestick &&
      params.seriesName === seriesName
    ) {
      const option = getOptions({
        data,
        tradingPair,
        timeframe,
        pastCount,
        originIndex: params.data[0],
      })
      chart.current?.setOption(option)
    }
  },
  [])

  useEffect(() => {
    if (!data || !chart.current || loading) return

    const option = getOptions({
      data,
      tradingPair,
      timeframe,
      pastCount,
    })

    chart.current.setOption(option)
  }, [data, handleBarClick, loading, pastCount, timeframe, tradingPair])

  useEffect(() => {
    chart.current?.off('click', handleBarClick)
    chart.current?.on('click', handleBarClick, {
      data,
      tradingPair,
      timeframe,
      pastCount,
      seriesName,
    })
  }, [data, handleBarClick, pastCount, seriesName, timeframe, tradingPair])

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
