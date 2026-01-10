import { CorpInfoHeaderComp } from '@/components/company/info/comp/misc.tsx'
import { corpInfoAnotherNameRow } from '@/components/company/info/rowsCommon/names.tsx'
import { HorizontalTableColumns } from '@/types/WindUI/horizontalTable.ts'
import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils.tsx'
import { CorpBasicInfoFront } from '../handle'

export const franceRows: HorizontalTableColumns<CorpBasicInfoFront> = [
  [
    {
      title: CorpInfoHeaderComp(intl('138677', '企业名称'), 'Dénomination de la société'),
      dataIndex: 'corp_name',
      colSpan: 5,
    },
  ],
  [corpInfoAnotherNameRow],
  [
    {
      title: CorpInfoHeaderComp(intl('138681', '公司类型'), 'Nature juridique'),
      dataIndex: 'corp_type',
      colSpan: 2,
    },
    {
      title: CorpInfoHeaderComp(intl('134794', '企业状态'), 'État'),
      dataIndex: 'state',
      colSpan: 2,
    },
  ],
  [
    {
      title: window.en_access_config ? intl('32674', '地区') : '国家/地区',
      dataIndex: 'province',
      colSpan: 2,
    },
    {
      title: CorpInfoHeaderComp(intl('6228', '公司编号'), 'SIRET'),
      dataIndex: 'biz_reg_no',
      colSpan: 2,
    },
  ],
  [
    {
      title: CorpInfoHeaderComp(intl('138860', '成立日期'), 'Date de création de la société'),
      dataIndex: 'reg_date',
      colSpan: 2,
      render: (txt) => {
        return wftCommon.formatTime(txt)
      },
    },
    {
      title: CorpInfoHeaderComp(intl('138186', '注销日期'), 'Date de fermeture'),
      dataIndex: '',
      colSpan: 2,
      render: (txt, backData) => {
        return wftCommon.formatTime(txt)
      },
    },
  ],
  [
    {
      title: intl('138477', '登记机关'),
      dataIndex: 'reg_authority',
      colSpan: 2,
    },
    {
      title: CorpInfoHeaderComp(intl('438015', '公司地址'), 'Adresse'),
      dataIndex: 'reg_address',
      colSpan: 2,
    },
  ],
]
