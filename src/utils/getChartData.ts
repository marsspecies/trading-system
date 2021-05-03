import ccxt, { OHLCV } from 'ccxt'

// DateItem = [open, close, lowest, highest]
type DataItem = [number, number, number, number]

export type TimeFrame = '1d' | '1m' | '5m' | '15m' | '30m' | '1w' | '1M' | '1H'

const getDateStr = (dateTime: number): string => {
  const date = new Date(dateTime)
  const dateStr = `${date.getFullYear()}/${
    date.getMonth() + 1
  }/${date.getDate()}`
  return dateStr
}

const getPredictData = (
  pastData: DataItem[],
  pastDates: number[]
): {
  futureData: DataItem[]
  futureAverageData: number[]
  futureDates: string[]
} => {
  const futureData: DataItem[] = []
  const futureAverageData: number[] = []
  const futureDates: string[] = []
  const pastAveragePrice: number[] = []
  const reversePastData = [...pastData].reverse()
  const originItemData = reversePastData[0]
  const originAveragePrice = Number(
    ((originItemData[3] + originItemData[2]) / 2).toFixed(4)
  )
  const originOpenPrice = originItemData[0]
  const originClosePrice = originItemData[1]
  const originLowestPrice = originItemData[2]
  const originHighestPrice = originItemData[3]

  reversePastData.slice(1).forEach((item, index) => {
    const averagePrice = Number(((item[3] + item[2]) / 2).toFixed(4))
    pastAveragePrice.push(averagePrice)
    // exchange the price

    const openPrice = Number((2 * originAveragePrice - item[1]).toFixed(4))
    const closePrice = Number((2 * originAveragePrice - item[0]).toFixed(4))
    const lowestPrice = Number((2 * originAveragePrice - item[3]).toFixed(4))
    const highestPrice = Number((2 * originAveragePrice - item[2]).toFixed(4))
    const futureAveragePrice = Number(
      (2 * originAveragePrice - averagePrice).toFixed(4)
    )
    futureAverageData.push(futureAveragePrice)
    futureData.push([openPrice, closePrice, lowestPrice, highestPrice])
  })

  const reversePastDates = [...pastDates].reverse()
  const originDate = reversePastDates[0]
  reversePastDates.slice(1).forEach((item, index) => {
    futureDates.push(getDateStr(2 * originDate - item))
  })
  return {
    futureData,
    futureAverageData,
    futureDates,
  }
}

function calculateMA(dayCount: number, data: DataItem[]) {
  let result = []
  for (let i = 0, len = data.length; i < len; i++) {
    if (i < dayCount) {
      result.push('-')
      continue
    }
    let sum = 0
    for (let j = 0; j < dayCount; j++) {
      sum += data[i - j][1]
    }
    result.push((sum / dayCount).toFixed(4))
  }
  return result
}

interface OptionConfig {
  data: OHLCV[]
  tradingPair: string
  timeframe?: TimeFrame
  pastCount?: number
  originIndex?: number
}
export const getOptions = ({
  data,
  tradingPair,
  timeframe = '1d',
  pastCount = 30,
  originIndex = data.length - 1,
}: OptionConfig) => {
  const candleData: DataItem[] = []
  const dateTimes: number[] = []
  const dates: string[] = []
  data.forEach(item => {
    const dateStr = getDateStr(item[0])
    dateTimes.push(item[0])
    dates.push(dateStr)
    candleData.push([item[1], item[4], item[3], item[2]])
  })

  const selectedPastCandleData = candleData.slice(
    originIndex - pastCount,
    originIndex + 1
  )
  const selectedPastDates = dateTimes.slice(
    originIndex - pastCount,
    originIndex + 1
  )

  const { futureData, futureDates, futureAverageData } = getPredictData(
    selectedPastCandleData,
    selectedPastDates
  )

  const getCandleEmptyData = (data: any[]) => {
    return data.map(() => ['-', '-', '-', '-'])
  }
  const getEmptyData = (data: any[]) => {
    return data.map(() => '-')
  }

  const lengendTime = `${tradingPair} ${timeframe}`

  let completedCandleData: any[] = candleData
  let completedFutureData: any[]
  let completedFutureAverageData: any[]
  let MA5Data: any[] = calculateMA(5, candleData)
  let MA10Data: any[] = calculateMA(10, candleData)
  let MA20Data: any[] = calculateMA(20, candleData)
  let MA30Data: any[] = calculateMA(30, candleData)
  const differ = candleData.length - 1 - originIndex
  if (differ > 0) {
    const leftRedundantData = candleData.slice(0, originIndex + 1)
    if (differ < pastCount) {
      // use the past selected day as origin to predict past data and future data
      const candleDataLength = candleData.length
      completedFutureData = getCandleEmptyData(leftRedundantData).concat(
        futureData as any
      )
      const rightRedundantData = completedFutureData.slice(candleDataLength)
      const rightEmptyLineData = getEmptyData(
        completedFutureData.slice(candleDataLength)
      )
      completedCandleData = completedCandleData.concat(
        getCandleEmptyData(rightRedundantData)
      )
      MA5Data = MA5Data.concat(rightEmptyLineData)
      MA10Data = MA10Data.concat(rightEmptyLineData)
      MA20Data = MA20Data.concat(rightEmptyLineData)
      MA30Data = MA30Data.concat(rightEmptyLineData)
      completedFutureAverageData = getEmptyData(leftRedundantData).concat(
        futureAverageData as any
      )
    } else if (differ > pastCount) {
      // use the past selected day as origin to predict past data
      const rightRedundantData = candleData.slice(originIndex + pastCount + 1)
      completedFutureData = getCandleEmptyData(leftRedundantData)
        .concat(futureData as any)
        .concat(getCandleEmptyData(rightRedundantData) as any)
      completedFutureAverageData = getEmptyData(leftRedundantData)
        .concat(futureAverageData as any)
        .concat(getEmptyData(rightRedundantData) as any)
    } else {
      // use the past selected day as origin to predict past data and the last predict date is today
      completedFutureData = getCandleEmptyData(leftRedundantData).concat(
        futureData as any
      )
      completedFutureAverageData = getEmptyData(leftRedundantData).concat(
        futureData as any
      )
    }
  } else {
    // the origin is today
    completedCandleData = (candleData as any).concat(
      getCandleEmptyData(futureData)
    )
    const rightEmptyData = getEmptyData(futureData)
    MA5Data = MA5Data.concat(rightEmptyData)
    MA10Data = MA10Data.concat(rightEmptyData)
    MA20Data = MA20Data.concat(rightEmptyData)
    MA30Data = MA30Data.concat(rightEmptyData)
    completedFutureData = getCandleEmptyData(candleData).concat(
      futureData as any
    )
    completedFutureAverageData = getEmptyData(candleData).concat(
      futureAverageData as any
    )
  }

  let option: echarts.EChartOption = {
    legend: {
      data: [
        lengendTime,
        'Future',
        'Future-average',
        'MA5',
        'MA10',
        'MA20',
        'MA30',
      ],
      // inactiveColor: '#777',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        animation: false,
        type: 'cross',
        lineStyle: {
          color: '#376df4',
          width: 2,
          opacity: 1,
        },
      },
    },
    xAxis: {
      type: 'category',
      data: dates.concat(futureDates),
      axisLine: { lineStyle: { color: '#8392A5' } },
    },
    yAxis: {
      scale: true,
      axisLine: { lineStyle: { color: '#8392A5' } },
      splitLine: { show: false },
    },
    grid: {
      bottom: 80,
    },
    dataZoom: [
      {
        textStyle: {
          color: '#8392A5',
        },
        handleIcon:
          'path://M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        dataBackground: {
          areaStyle: {
            color: '#8392A5',
          },
          lineStyle: {
            opacity: 0.8,
            color: '#8392A5',
          },
        },
        // brushSelect: true,
        start: 80,
      },
      {
        type: 'inside',
      },
    ],
    series: [
      {
        type: 'candlestick',
        name: lengendTime,
        data: completedCandleData,
        itemStyle: {
          color: '#FD1050',
          color0: '#0CF49B',
          borderColor: '#FD1050',
          borderColor0: '#0CF49B',
        },
      },
      {
        name: 'Future',
        type: 'candlestick',
        data: completedFutureData,
        showAllSymbol: true,
        itemStyle: {
          normal: {
            color: '#ddd',
            color0: '#ddd',
            borderColor: '#ddd',
            borderColor0: '#ddd',
          },
        },
      },
      {
        name: 'Future-average',
        type: 'line',
        data: completedFutureAverageData,
        smooth: true,
        showSymbol: false,
        itemStyle: {
          color: '#000',
        },
        lineStyle: {
          width: 1,
          color: '#ccc',
        },
      },
      {
        name: 'MA5',
        type: 'line',
        data: MA5Data,
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 1,
        },
      },
      {
        name: 'MA10',
        type: 'line',
        data: MA10Data,
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 1,
        },
      },
      {
        name: 'MA20',
        type: 'line',
        data: MA20Data,
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 1,
        },
      },
      {
        name: 'MA30',
        type: 'line',
        data: MA30Data,
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 1,
        },
      },
    ],
  }

  return option
}
