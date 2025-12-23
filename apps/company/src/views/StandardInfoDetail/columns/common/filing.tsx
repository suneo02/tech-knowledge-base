import intl from '../../../../utils/intl'
import { wftCommon } from '../../../../utils/utils'

export const filingsColumns = [
  [
    {
      title: intl('216408', '备案号'),
      dataIndex: 'filingNo',
      width: '40%',
      render: wftCommon.formatCont,
    },
    {
      title: intl('328162', '备案日期'),
      dataIndex: 'filingDate',
      render: (text) => {
        return wftCommon.formatTime(text)
      },
    },
  ],
]
