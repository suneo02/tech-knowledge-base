import { CorpInfoHeaderComp } from '@/components/company/info/comp/misc.tsx'
import { corpInfoAnotherNameRow } from '@/components/company/info/rowsCommon/names.tsx'
import { HorizontalTableColumns } from '@/types/WindUI/horizontalTable.ts'
import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils.tsx'
import { ICorpBasicInfoFront } from '../handle'

export const japanRows: HorizontalTableColumns<ICorpBasicInfoFront> = [
  [
    {
      title: CorpInfoHeaderComp(intl('138677', '企业名称'), '商号又は名称'),
      dataIndex: 'corp_name',
      colSpan: 5,
    },
  ],
  [corpInfoAnotherNameRow],
  [
    { title: intl('138681', '公司类型'), dataIndex: 'corp_type', colSpan: 2 },
    {
      title: window.en_access_config ? intl('32674', '地区') : '国家/地区',
      dataIndex: 'province',
      colSpan: 2,
    },
  ],
  [
    {
      title: CorpInfoHeaderComp(
        intl('419638', '关闭注册记录日期'),
        '登記記録の閉鎖等（合併による解散等）事由発生年月日'
      ),
      dataIndex: 'reg_date',
      colSpan: 2,
      render: (txt) => {
        return wftCommon.formatTime(txt)
      },
    },
    {
      title: CorpInfoHeaderComp(intl('417513', '企业编号'), '法人番号'),
      dataIndex: 'biz_reg_no',
      colSpan: 2,
    },
  ],

  [
    {
      title: CorpInfoHeaderComp(intl('35776', '注册地址'), '本店又は主たる事務所の所在地'),
      dataIndex: 'reg_address',
      colSpan: 5,
    },
  ],
]
