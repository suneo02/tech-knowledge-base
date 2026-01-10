import intl from '../../../../utils/intl'
import { wftCommon } from '../../../../utils/utils'

export const patentLawRows = [
  {
    title: '',
    dataIndex: '',
    width: '4%',
    render: (txt, record, index) => {
      return index + 1
    },
  },
  {
    title: intl('470299', '法律状态公告日'),
    dataIndex: 'annTime',
    render: (txt, record, index) => {
      return wftCommon.formatTime(txt)
    },
  },
  {
    title: intl('138372', '法律状态'),
    dataIndex: 'lawStatus',
  },
  {
    title: intl('470300', '法律状态信息'),
    dataIndex: 'lawDesc',
  },
]
