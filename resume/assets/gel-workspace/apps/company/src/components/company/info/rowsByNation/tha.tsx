import { industry_oversea_render } from '@/components/company/info/comp/industry.tsx'
import { CorpInfoHeaderComp } from '@/components/company/info/comp/misc.tsx'
import { corpInfoAnotherNameRow } from '@/components/company/info/rowsCommon/names.tsx'
import { HorizontalTableColumns } from '@/types/WindUI/horizontalTable.ts'
import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils.tsx'
import { ICorpBasicInfoFront } from '../handle'

export const thaRows: HorizontalTableColumns<ICorpBasicInfoFront> = [
  [
    {
      title: CorpInfoHeaderComp(intl('138677', '企业名称'), 'ชื่อนิติบุคคล'),
      dataIndex: 'corp_name',
      colSpan: 5,
    },
  ],
  [corpInfoAnotherNameRow],
  [
    {
      title: CorpInfoHeaderComp(window.en_access_config ? 'Corporate Type' : intl('', '注册类型'), 'ประเภทนิติบุคคล'),
      dataIndex: 'corp_type',
      colSpan: 2,
    },
    {
      title: CorpInfoHeaderComp(intl('138416', '经营状态'), 'สถานะนิติบุคคล'),
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
      title: CorpInfoHeaderComp(intl('138860', '成立日期'), 'วันที่จดทะเบียนจัดตั้ง'),
      dataIndex: 'reg_date',
      colSpan: 2,
      render: (txt) => {
        return wftCommon.formatTime(txt)
      },
    },
  ],
  [
    {
      title: CorpInfoHeaderComp(window.en_access_config ? 'Company Code' : '企业编号', 'เลขทะเบียนนิติบุคคล'),
      dataIndex: 'biz_reg_no',
      colSpan: 2,
    },
    {
      title: CorpInfoHeaderComp(intl('35779', '注册资本'), 'ทุนจดทะเบียน'),
      dataIndex: 'reg_capital',
      colSpan: 2,
      render: (txt, backData) => {
        const unit = backData.reg_unit ? backData.reg_unit : ''
        return backData.reg_capital ? wftCommon.formatMoney(backData.reg_capital) + unit : '--' //注册资金
      },
    },
  ],
  [
    {
      title: CorpInfoHeaderComp('最新财报商业类型', 'ประเภทธุรกิจที่ส่งงบการเงินปีล่าสุด'),
      dataIndex: 'overseasCorpIndustryList',
      colSpan: 2,
      render: industry_oversea_render,
    },
    {
      title: CorpInfoHeaderComp('最新财报目的', 'วัตถุประสงค์'),
      dataIndex: 'business_scope',
      colSpan: 2,
    },
  ],
  [
    {
      title: CorpInfoHeaderComp(intl('35776', '注册地址'), 'ที่ตั้งสำนักงานแห่งใหญ่'),
      dataIndex: 'reg_address',
      colSpan: 5,
    },
  ],
]
