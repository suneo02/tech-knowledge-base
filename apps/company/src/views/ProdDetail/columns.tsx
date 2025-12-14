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
    title: intl('207828', '应用市场'),
    dataIndex: 'storeName',
    render: (data) => data || '--',
  },
  {
    title: intl('208884', '产品全称'),
    dataIndex: 'appName',
    render: (data) => data || '--',
  },
  {
    title: intl('207829', '开发商名称'),
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
    title: intl('208885', '下载数量'),
    dataIndex: 'downNum',
    render: (data) => data || '--',
  },
  {
    title: intl('208881', '评分'),
    dataIndex: 'score',
    render: (data) => data || '--',
  },
  {
    title: intl('207830', '评论数量'),
    dataIndex: 'noteNum',
    render: (data) => data || '--',
  },
  {
    title: intl('208874', '最新版本号'),
    dataIndex: 'lstVer',
    render: (data) => data || '--',
  },
  {
    title: intl('138868', '更新时间'),
    dataIndex: 'uptDate',
    render: (data) => wftCommon.formatTime(data),
  },
]
