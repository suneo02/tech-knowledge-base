import { HorizontalTableColPropsShared, TablePropsShared, TIntl } from '@/types'

export const tableIndexColumn: HorizontalTableColPropsShared = {
  title: '',
  dataIndex: 'index',
  width: 40,
  align: 'center',
  render: (_value, _record, index) => {
    return index + 1
  },
}

// Default options for the HorizontalTable class instance
export const instanceTableDefaultOptions = (t: TIntl): Required<TablePropsShared> => {
  return {
    type: 'verticalTable',
    className: '',
    loading: false,
    noDataText: t('17235', '暂无数据'),
    rowKey: 'id',
    rowClassName: '',
    showHeader: true,
    title: '',
    api: null,
    columns: [],
  }
}
