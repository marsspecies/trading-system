import React, { FC, useEffect, useState } from 'react'
import { Form, Select, Button, Input } from 'antd'
import { ErrorListProps } from 'antd/lib/form'
import { TimeFrame } from '@src/utils/getChartData'
import { fetchHuobiproKline, init } from '@src/utils/initExchange'
import { OHLCV } from 'ccxt'
import { useAsyncCall } from '@src/utils/hooks'

const { Option } = Select

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
}
export interface ConfigData {
  tradingPair: string
  timeframe: TimeFrame
  pastCount: number
}
interface Props {
  onChange: (data: ConfigData) => void
  config: ConfigData
  loading?: boolean
}
const SideBar: FC<Props> = ({ onChange, config, loading }) => {
  const [tradingParis, setTradingParis] = useState<string[]>()

  const onFinish = (value: ConfigData) => {
    onChange(value)
  }
  const onFinishFailed = (errorInfo: any) => {}
  const handleTradingPairChange = () => {}

  useEffect(() => {
    init().then(({ tradingPairs }) => {
      setTradingParis(tradingPairs)
    })
  }, [])
  return (
    <div className="w-370 py-32 px-md">
      <Form
        {...layout}
        name="basic"
        initialValues={config}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item label="Trading Pair" name="tradingPair">
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Select a person"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {tradingParis?.map(pair => (
              <Option value={pair} key={pair}>
                {pair}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Time frame" name="timeframe">
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Select a person"
            optionFilterProp="children"
          >
            {/* '1d' | '1m' | '5m' | '15m' | '30m' | '1w' | '1M' | '1H' */}
            <Option value="1d" key="1d">
              1d
            </Option>
            <Option value="1m" key="1m">
              1m
            </Option>
            <Option value="5m" key="5m">
              5m
            </Option>
            <Option value="15m" key="15m">
              15m
            </Option>
            <Option value="30m" key="30m">
              30m
            </Option>
            <Option value="1w" key="1w">
              1w
            </Option>
            <Option value="1M" key="1M">
              1M
            </Option>
            <Option value="1H" key="1H">
              1H
            </Option>
          </Select>
        </Form.Item>
        <Form.Item label="Past count" name="pastCount">
          <Input type="number" />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default SideBar
