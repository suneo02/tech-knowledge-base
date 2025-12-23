import { Spin } from '@wind/wind-ui'
import React, { FC, ReactNode } from 'react'
import NoData from '../../../common/noData/NoData'
import { useTranslateService } from '@/hook'
import { IConfigDetailApiJSON } from '@/types/configDetail/common.ts'
import { useGetApiData } from '@/components/layout/container/ApiContainer/handle'

const ApiContainer: FC<
  {
    api: string
    params: Record<string, any>
    children: (arg0: any) => ReactNode
  } & Pick<IConfigDetailApiJSON, 'apiExtra'>
> = (props) => {
  const { data, loading } = useGetApiData({ api: props.api, apiExtra: props.apiExtra, params: props.params })
  const [dataIntl] = useTranslateService(data)

  const isNonEmptyObject = (obj) => {
    return typeof obj === 'object' && obj !== null && !Array.isArray(obj)
  }

  return (
    // @ts-expect-error ttt
    <Spin spinning={loading}>
      <div style={{ minHeight: 300 }}>
        {dataIntl?.length || isNonEmptyObject(dataIntl) ? props.children(dataIntl) : null}
        {!loading && (dataIntl?.length === 0 || !dataIntl) && (
          <div
            style={{
              minHeight: 300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <NoData />
          </div>
        )}
      </div>
    </Spin>
  )
}

export default ApiContainer
