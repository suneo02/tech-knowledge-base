import { Form, InputNumber, Radio, Space } from 'antd'
import { ReactNode } from 'react'

export type DataRangeValue = 'first100' | 'all' | 'custom'

export interface DataRangeProps {
  /**
   * 表单字段名
   */
  name?: string
  /**
   * 表单标签
   */
  label?: ReactNode
  /**
   * 初始值
   */
  initialValue?: DataRangeValue
  /**
   * 自定义数量字段名
   */
  customCountName?: string
  /**
   * 价格配置
   */
  prices?: {
    first100?: number
    all?: number
  }
}

/**
 * 数据范围选择组件
 */
export const DataRange = ({
  name = 'dataRange',
  label = '数据范围',
  initialValue = 'first100',
  customCountName = 'customCount',
  prices = { first100: 10, all: 50 },
}: DataRangeProps) => {
  const dataRangeValue = Form.useWatch(name)

  return (
    <Form.Item name={name} label={label} initialValue={initialValue}>
      <Radio.Group>
        <Space direction="vertical">
          <Radio value="first100">添加前100条 (¥{prices.first100})</Radio>
          <Radio value="all">添加全部 (¥{prices.all})</Radio>
          <Radio value="custom">
            自定义
            {dataRangeValue === 'custom' && (
              <Form.Item name={customCountName} noStyle rules={[{ required: true, message: '请输入条数' }]}>
                <InputNumber min={1} max={10000} style={{ width: 100, marginLeft: 10 }} placeholder="输入条数" />
              </Form.Item>
            )}
          </Radio>
        </Space>
      </Radio.Group>
    </Form.Item>
  )
}

export default DataRange
