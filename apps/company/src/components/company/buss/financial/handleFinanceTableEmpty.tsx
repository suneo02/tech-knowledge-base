import { TableProps } from '@wind/wind-ui-table'
import { t } from 'gel-util/intl'

export const getEmptyFinanceTableColumns = () => {
  const columns: TableProps['columns'] = [
    {
      title: t('1794', '报告期'),
      dataIndex: 'reportDate',
      width: '30%',
    },
    {
      title: t('451119', '报告日期'),
      dataIndex: 'period',
      width: '70%',
      align: 'left',
    },
  ]
  return columns
}
