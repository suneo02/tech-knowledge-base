import { SearchOutlined } from '@ant-design/icons'
import { Form, Input, InputNumber } from 'antd'
import WSelect from '../WSelect'
import './index.scss'
import React from 'react'
export interface WFilterProps {
  onSearch?: (values: any) => void // 搜索
  search?: { columns: any[] } // 用于渲染搜索的功能
  filterList?: any[] // 用于添加筛选过滤的功能
  style?: React.CSSProperties // 集成style
  initialValues?: any // 初始化参数
  align?: 'left' | 'right' // 对齐方式
}

/**
 * 只针对调用接口的table，不调用接口的table不在此次改造中
 * @returns
 */
const WFilter = (props: WFilterProps) => {
  const [form] = Form.useForm()
  const renderFormItemChildren = (res: any) => {
    switch (res.type) {
      case 'input':
        return (
          <Input
            suffix={<SearchOutlined />}
            onKeyDown={(e) => {
              if (e.key === 'Enter') form.submit()
            }}
            allowClear
            style={{
              maxWidth: 160,
            }}
          />
        )
      case 'number':
        return (
          <InputNumber
            suffix={res.suffix}
            onKeyDown={(e) => {
              if (e.key === 'Enter') form.submit()
            }}
          ></InputNumber>
        )
      case 'select':
        return (
          <WSelect
            defaultValue={res.defaultValue || ''}
            options={res.options.map((res: any) => {
              if (typeof res === 'string' || typeof res === 'number') {
                return { label: res, value: res }
              }
              return res
            })}
            defaultActiveFirstOption
            popupMatchSelectWidth={false}
            style={{ maxWidth: 200, minWidth: 80 }}
            popupClassName="pop-container"
            placeholder={res.placeholder || '请选择对应的选项'}
            onChange={() => {
              form.submit()
            }}
          ></WSelect>
        )
      default:
        return null
    }
  }
  return (
    <div
      className="w-filter-container"
      style={{ display: 'flex', ...props.style, justifyContent: props?.align === 'right' ? 'flex-end' : 'flex-start' }}
    >
      {props?.search?.columns || props?.filterList?.length ? (
        <Form form={form} layout="inline" size="small" onFinish={props.onSearch} initialValues={props.initialValues}>
          {props?.filterList?.map((res, index) => {
            const defaultItem = res.options.find((option: any) => option.default)
            return (
              <Form.Item
                key={index}
                name={res?.key}
                label={res?.label}
                initialValue={res?.defaultValue || defaultItem?.value || ''}
              >
                {renderFormItemChildren({ ...res, type: 'select' })}
              </Form.Item>
            )
          })}
          {props?.search?.columns?.map((res, index) => (
            <Form.Item key={index} name={res?.key} label={res?.label} initialValue={res?.defaultValue}>
              {renderFormItemChildren(res)}
            </Form.Item>
          ))}
        </Form>
      ) : null}
    </div>
  )
}

export default WFilter
