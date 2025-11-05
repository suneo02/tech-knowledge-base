import { getServerApiByConfig } from '@/api/serverApi'
import NoData from '@/components/common/noData/NoData'
import { Spin } from '@wind/wind-ui'
import { cloneDeep } from 'lodash'
import React, { FC, memo, useEffect, useState } from 'react'
import BarChart from './BarChart'
import PieChart from './PieChart'
import { IConfigDetailApiJSON } from '../../../types/configDetail/common.ts'
import { IChartOption } from '../../../types/configDetail/chart.ts'

const WCB_Raw: FC<
  {
    type: IChartOption['type']
    params?
    meta?
    data?
    width?
    height?
    format?
    dataType?
    loading?: boolean
  } & IConfigDetailApiJSON
> = function (props) {
  const { type, params, meta, api, apiExtra, data, width, height, format, ...rest } = props

  const [chartData, setChartData] = useState(data)
  const [loading, setLoading] = useState(!!rest?.loading)

  const getApiData = async () => {
    setLoading(true)
    const { Data } = await getServerApiByConfig({
      api,
      apiExtra,
      params,
    }).finally(() => setLoading(false))
    if (Array.isArray(Data)) {
      setChartData(Data?.filter((res) => res.num)?.map((res) => ({ [res.area]: res.num })))
    }
    if (Data?.list) {
      let _list = Data.list
      if (props?.dataType === 'publishState') {
        _list = _list?.[0]?.children || []
      }
      setChartData(_list?.filter((res) => res.doc_count)?.map((res) => ({ [res.key]: res.doc_count })))
    }
  }

  useEffect(() => {
    if (!data && api) {
      getApiData()
    }
  }, [params])

  useEffect(() => {
    let _list = cloneDeep(data)
    if (props?.dataType === 'publishState') {
      _list = _list?.[0]?.children || []
    }
    if (_list?.length) {
      _list = _list
        ?.filter((res) => res && res[format?.doc_count || 'doc_count'])
        ?.map((res) => ({ [res?.[format?.key || 'key']]: res[format?.doc_count || 'doc_count'] }))
    }
    setChartData(_list)
  }, [data])

  const renderCharts = () => {
    switch (type) {
      case 'pie':
        return <PieChart meta={meta} chartData={chartData} {...rest} />
      case 'bar':
        return <BarChart meta={meta} chartData={chartData} {...rest} />
      default:
        return <BarChart meta={meta} chartData={chartData} {...rest} />
    }
  }

  return (
    // @ts-expect-error ttt
    <Spin spinning={loading}>
      <div style={{ width: width || '100%', height: height || 300 }}>
        {chartData?.length || typeof chartData === 'object' ? renderCharts() : null}
        {loading ? null : (chartData?.length === 0 || !chartData) && <NoData />}
      </div>
    </Spin>
  )
}
const WCB = memo(WCB_Raw)

WCB.displayName = 'WindChartBarOrPie'

export { WCB }
