import { CorpInfoHeaderComp } from '@/components/company/info/comp/misc.tsx'
import { corpInfoAnotherNameRow } from '@/components/company/info/rowsCommon/names.tsx'
import { HorizontalTableColumns } from '@/types/WindUI/horizontalTable.ts'
import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils.tsx'
import { ICorpBasicInfoFront } from '../handle'

export const germanyRows: HorizontalTableColumns<ICorpBasicInfoFront> = [
  [
    {
      title: CorpInfoHeaderComp(intl('138677', '企业名称'), 'EntName'),
      dataIndex: 'corp_name',
      colSpan: 5,
    },
  ],
  [corpInfoAnotherNameRow],
  [
    {
      title: CorpInfoHeaderComp(intl('138681', '公司类型'), 'Rechtsform'),
      dataIndex: 'corp_type',
      colSpan: 2,
    },
    {
      title: CorpInfoHeaderComp(intl('134794', '企业状态'), 'Status'),
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
      title: CorpInfoHeaderComp(intl('2823', '成立日期'), 'Eintragsdatum'),
      dataIndex: 'reg_date',
      colSpan: 2,
      render: (txt, backData) => {
        return wftCommon.formatTime(txt)
      },
    },
  ],
  [
    {
      title: CorpInfoHeaderComp(intl('138476', '注册号'), 'Registernummer'),
      dataIndex: 'biz_reg_no',
      colSpan: 2,
    },
    {
      title: CorpInfoHeaderComp('注册法院', 'Gericht'),
      dataIndex: 'reg_authority',
      colSpan: 2,
    },
  ],
  [
    {
      title: CorpInfoHeaderComp(intl('35779', '注册资本'), 'Kapital'),
      dataIndex: 'reg_capital',
      colSpan: 2,
      render: (txt, backData) => {
        const unit = backData.reg_unit ? backData.reg_unit : ''
        return backData.reg_capital ? wftCommon.formatMoney(backData.reg_capital) + unit : '--' //注册资金
      },
    },
    {
      title: CorpInfoHeaderComp(intl('438015', '公司地址'), 'Anschrift'),
      colSpan: 2,
      dataIndex: 'reg_address',
    },
  ],
]
