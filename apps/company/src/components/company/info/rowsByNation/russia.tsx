import { CorpInfoHeaderComp } from '@/components/company/info/comp/misc.tsx'
import { corpInfoAnotherNameRow } from '@/components/company/info/rowsCommon/names.tsx'
import { HorizontalTableColumns } from '@/types/WindUI/horizontalTable.ts'
import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils.tsx'
import { CorpBasicInfoFront } from '../handle'

export const russiaRows: HorizontalTableColumns<CorpBasicInfoFront> = [
  [
    {
      title: CorpInfoHeaderComp(intl('138677', '企业名称'), 'Полное наименование'),
      dataIndex: 'corp_name',
      colSpan: 5,
    },
  ],
  [corpInfoAnotherNameRow],
  [
    {
      title: CorpInfoHeaderComp(intl('417513', '企业编号'), 'ОГРН'),
      dataIndex: 'biz_reg_no',
      colSpan: 2,
    },
    {
      title: CorpInfoHeaderComp(intl('419633', '税号'), 'ИНН'),
      dataIndex: 'credit_code',
      colSpan: 2,
    },
  ],
  [
    {
      title: CorpInfoHeaderComp(intl('138860', '成立日期'), 'Дата регистрации'),
      dataIndex: 'reg_date',
      colSpan: 2,
      render: (txt) => {
        return wftCommon.formatTime(txt)
      },
    },
    {
      title: CorpInfoHeaderComp(intl('206121', '吊销日期'), 'Дата прекращения деятельности'),
      dataIndex: 'cancel_date',
      colSpan: 2,
      render: (txt) => {
        return wftCommon.formatTime(txt)
      },
    },
  ],
  [
    {
      title: window.en_access_config ? intl('32674', '地区') : '国家/地区',
      dataIndex: 'province',
      colSpan: 2,
    },
    {
      title: CorpInfoHeaderComp(intl('134794', '企业状态'), 'Состояние организации'),
      dataIndex: 'state',
      colSpan: 2,
    },
  ],
  [
    {
      title: intl('138477', '登记机关'),
      dataIndex: 'reg_authority',
      colSpan: 2,
    },
    {
      title: intl('9177', '经营范围'),
      dataIndex: 'business_scope',
      colSpan: 2,
    },
  ],
  [
    {
      title: CorpInfoHeaderComp(intl('35776', '注册地址'), 'Адрес организации'),
      dataIndex: 'reg_address',
      colSpan: 5,
    },
  ],
]
