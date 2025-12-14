import { Divider, FormProps } from 'antd'
import React, { memo, useState } from 'react'

import MultiResultList from '../result/MultiResultList'

import { GSTabsEnum } from '../../types'
import { ChinaSearchForm, GlobalSearchForm } from '../form'
import { BASIC_COLOR_7, SelectOptionProps } from '../form/common/select/type'

interface FilterParams {
  queryText: string
  // 添加其他可能的键和值的类型
  [key: string]: string | number | boolean | string[] | undefined
}

const GlobalSearchTab: React.FC<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>[]
  queryText: string
  api?: [string, string] | string
  type: GSTabsEnum
  remark?: string
  filterParams?: FilterParams
}> = ({ data, queryText, api, type, remark, filterParams: _filterParams }) => {
  const [filterParams, setFilterParams] = useState<FilterParams>(_filterParams)

  const handleFormChange = (_values: SelectOptionProps, allValues: SelectOptionProps[]) => {
    const params = {}
    Object.entries(allValues).forEach(([key, value]) => {
      if (Array.isArray(value) && value?.length) {
        params[key] = value?.map((res) => res.value).join('|')
      } else if (value?.value) {
        params[key] = value.value
      }
    })
    setFilterParams({ ...params, queryText })
  }

  const onFinish: FormProps['onFinish'] = (values) => console.log(values)

  return (
    <div style={{ width: '100%', background: '#fff', minHeight: '80vh' }}>
      {type === GSTabsEnum.CHINA ? (
        <div style={{ paddingInline: 12, paddingBlock: 6 }}>
          <ChinaSearchForm
            onValuesChange={handleFormChange}
            onFinish={onFinish}
            data-uc-id="TLe6X6NUz"
            data-uc-ct="chinasearchform"
          />
        </div>
      ) : (
        <div style={{ paddingInline: 12, paddingBlock: 6 }}>
          <GlobalSearchForm
            onValuesChange={handleFormChange}
            onFinish={onFinish}
            data-uc-id="B8vsdr4KmX"
            data-uc-ct="globalsearchform"
          />
        </div>
      )}
      {remark && <div style={{ color: BASIC_COLOR_7, paddingInline: 12 }}>{remark}</div>}
      <Divider style={{ marginBlockStart: 4, marginBlockEnd: 12 }} />
      <MultiResultList
        filterParams={{ ...filterParams, queryText }}
        data={data}
        api={api as [string, string]}
        type={type}
      />
    </div>
  )
}

export default memo(GlobalSearchTab)
