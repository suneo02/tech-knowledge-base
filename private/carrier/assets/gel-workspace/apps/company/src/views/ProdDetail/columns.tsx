import { wftCommon } from '@/utils/utils'
import { TableProps } from '@wind/wind-ui-table'
import { intl } from 'gel-util/intl'

// 应用市场发布信息
export const prodDetailColumns: TableProps['columns'] = [
  {
    title: intl('28846', '序号'),
    dataIndex: 'storeName',
    render: (_i, _obj, index) => index + 1,
    width: 60,
  },
  {
    title: intl('470281', '应用市场'),
    dataIndex: 'storeName',
    render: (data) => data || '--',
  },
  {
    title: intl('478699', '产品全称'),
    dataIndex: 'appName',
    render: (data) => data || '--',
  },
  {
    title: intl('470282', '开发商名称'),
    dataIndex: 'creatorName',
    render: (data) => data || '--',
    width: 200,
  },
  {
    title: intl('138774', '发布时间'),
    dataIndex: 'relDate',
    render: (data) => data || '--',
  },
  {
    title: intl('470296', '下载数量'),
    dataIndex: 'downNum',
    render: (data) => data || '--',
  },
  {
    title: intl('470295', '评分'),
    dataIndex: 'score',
    render: (data) => data || '--',
  },
  {
    title: intl('470283', '评论数量'),
    dataIndex: 'noteNum',
    render: (data) => data || '--',
  },
  {
    title: intl('470284', '最新版本号'),
    dataIndex: 'lstVer',
    render: (data) => data || '--',
  },
  {
    title: intl('138868', '更新时间'),
    dataIndex: 'uptDate',
    render: (data) => wftCommon.formatTime(data),
  },
]
