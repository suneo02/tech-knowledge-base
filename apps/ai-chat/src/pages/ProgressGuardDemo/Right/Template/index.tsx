import { WIND_UI_THEME } from '@/components/ETable/theme'
import * as ReactVTable from '@visactor/react-vtable'
import { message } from '@wind/wind-ui'
import { t } from 'gel-util/intl'

const option = {
  columns: [
    {
      field: '0',
      columnIndex: 1,
      title: t('149608', '企业名称'),
      dataType: 0,
      filterItems: [],
      initSourceType: 1,
      isFrozen: true,
    },
    {
      field: '1',
      columnIndex: 2,
      title: t('138808', '统一社会信用代码'),
      dataType: 0,
      filterItems: [],
      initSourceType: 1,
      isFrozen: false,
    },
    {
      field: '2',
      columnIndex: 3,
      title: t('5529', '法定代表人'),
      dataType: 0,
      filterItems: [],
      initSourceType: 1,
      isFrozen: false,
    },
    {
      field: '3',
      columnIndex: 4,
      title: t('18688', '注册资本(万元)'),
      dataType: 0,
      filterItems: [],
      initSourceType: 1,
      isFrozen: false,
    },
    {
      field: '4-',
      columnIndex: 5,
      title: t('35776', '注册地址'),
      dataType: 0,
      filterItems: [],
      initSourceType: 1,
      isFrozen: false,
    },
    {
      field: '5',
      columnIndex: 6,
      title: t('138416', '经营状态'),
      dataType: 0,
      filterItems: [],
      initSourceType: 1,
      isFrozen: false,
    },
    {
      field: '6',
      columnIndex: 7,
      title: t('138860', '成立日期'),
      dataType: 0,
      filterItems: [],
      initSourceType: 1,
      isFrozen: false,
    },
    {
      field: '7',
      columnIndex: 8,
      title: t('101049', '网站'),
      dataType: 0,
      filterItems: [],
      initSourceType: 1,
      isFrozen: false,
    },
    {
      field: '8',
      columnIndex: 9,
      title: t('257678', '公司简介'),
      dataType: 0,
      filterItems: [],
      initSourceType: 1,
      isFrozen: false,
    },
  ],
  records: new Array(40).fill([]),
  widthMode: 'autoWidth',
  autoFillWidth: true,
  heightMode: 'autoHeight',
  rowSeriesNumber: {
    title: t('28846', '序号'),
    width: 'auto',
    style: {
      textAlign: 'center',
    },
  },
  theme: WIND_UI_THEME,
  frozenColCount: 2,
  keyboardOptions: {
    pasteValueToCell: true,
    copySelected: true,
    moveEditCellOnArrowKeys: true,
  },
  editor: '',
  tooltip: {
    isShowOverflowTextTooltip: true,
  },
  select: {
    highlightMode: 'row',
  },
  hover: {
    highlightMode: 'row',
  },
}

const handleSelectedCell = () => {
  message.info(t('466423', '请在左侧对话框添加数据'))
}

const VisTableTemplate = () => {
  // @ts-expect-error visactor/react-vtable
  return <ReactVTable.ListTable option={option} onSelectedCell={handleSelectedCell} />
}

export default VisTableTemplate
