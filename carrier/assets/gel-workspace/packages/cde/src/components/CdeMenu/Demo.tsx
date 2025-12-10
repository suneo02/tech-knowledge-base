import { Button } from '@wind/wind-ui'
import { CDEMenu } from './CDEMenu'
import { CDEFormBizValues, CDEFormValues, CDEMenuConfigItem } from '../CdeForm/types'
import React, { useState } from 'react'
import { t } from 'gel-util/intl'

const STRINGS = {
  TITLE: t('', '企业数据浏览器'),
  RESET: t('', '重置'),
  SAVE: t('', '保存'),
  SEARCH: t('', '搜索'),
}

interface CDEMenuDemoProps {
  config: CDEMenuConfigItem[]
}

const CDEMenuDemo: React.FC<CDEMenuDemoProps> = ({ config }) => {
  const [count, setCount] = useState<number>(0)
  const initialValues: CDEFormBizValues[] = [
    // 暂不支持多语言传参
    {
      field: 'data_from',
      itemId: '78',
      logic: 'any',
      title: '机构类型',
      value: ['298010000,298020000,298040000'],
    },
    {
      field: 'govlevel',
      itemId: '77',
      logic: 'any',
      title: '营业状态',
      value: ['存续'],
    },
  ]
  const onValuesChange = (_: CDEFormValues, allValues: CDEFormBizValues[]) => {
    // console.log('fieldValues', fieldValues)
    // console.log('allValues', allValues)
    setCount(allValues.length)
  }

  return (
    <div style={{ border: '1px solid #f0f0f0' }}>
      <h3 style={{ padding: '12px', borderBlockEnd: '1px solid #f0f0f0' }}>{STRINGS.TITLE}</h3>
      <CDEMenu config={config} onValuesChange={onValuesChange} initialValues={initialValues} />
      <div
        style={{
          padding: '12px',
          display: 'flex',
          justifyContent: 'flex-end',
          borderTop: '1px solid #f0f0f0',
          gap: 12,
        }}
      >
        <Button>{STRINGS.RESET}</Button>
        <Button>{STRINGS.SAVE}</Button>
        <Button type="primary">
          {STRINGS.SEARCH}({count})
        </Button>
      </div>
    </div>
  )
}

export default CDEMenuDemo
