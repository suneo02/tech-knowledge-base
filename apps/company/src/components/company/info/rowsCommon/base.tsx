import Links from '@/components/common/links/Links.tsx'
import { LinksModule } from '@/handle/link'
import { HorizontalTableCol } from '@/types/WindUI/horizontalTable.ts'
import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils'
import React from 'react'
import { CorpBasicInfoFront } from '../handle'

export const corpInfoNameRow: HorizontalTableCol<CorpBasicInfoFront> = {
  title: intl('138677', '企业名称'),
  dataIndex: 'corp_name',
  titleWidth: 140,
  colSpan: 3,
}

export const corpInfoCreditCodeRow: HorizontalTableCol<CorpBasicInfoFront> = {
  title: intl('138808', '统一社会信用代码'),
  dataIndex: 'credit_code',
  titleWidth: 140,
  contentWidth: 200,
}

export const corpInfoBizRegNoRow: HorizontalTableCol<CorpBasicInfoFront> = {
  title: intl('138476', '注册号'),
  dataIndex: 'biz_reg_no',
}
export const corpInfoBussNoRow: HorizontalTableCol<CorpBasicInfoFront> = {
  ...corpInfoBizRegNoRow,
  title: window.en_access_config ? 'Company Code' : '企业编号',
}

// Row for "组织机构代码"
export const corpInfoOrgCodeRow: HorizontalTableCol<CorpBasicInfoFront> = {
  title: intl('100095', '组织机构代码'),
  dataIndex: 'credit_code',
  render: (txt) => {
    return txt ? txt.substr(8, 9) : '--'
  },
}

export const corpInfoTypeRow: HorizontalTableCol<CorpBasicInfoFront> = {
  title: intl(60452, '企业类型'),
  colSpan: 3,
  dataIndex: 'corp_type',
}

// Row for "纳税人识别号"
export const corpInfoTaxIdRow: HorizontalTableCol<CorpBasicInfoFront> = {
  title: intl('138539', '纳税人识别号'),
  dataIndex: 'taxIdNo',
}

export const corpInfoLegalPersonRow: HorizontalTableCol<CorpBasicInfoFront> = {
  title: intl('451206', '法定代表人'),
  dataIndex: 'legal_person_name',
  colSpan: 3,
  render: (res, record) => {
    let module: LinksModule
    if (record?.legal_person_type === 'person') module = LinksModule.CHARACTER
    if (record?.legal_person_type === 'company') module = LinksModule.COMPANY
    return module ? <Links module={module} title={res} id={record.legal_person_id} /> : res || '--'
  },
}

export const corpInfoTaxpayerQualificationRow: HorizontalTableCol<CorpBasicInfoFront> = {
  title: intl('437434', '纳税人资质'),
  dataIndex: 'taxQualiType',
}

export const corpInfoRegCapitalRow: HorizontalTableCol<CorpBasicInfoFront> = {
  title: intl('35779', '注册资本'),
  dataIndex: 'reg_capital',
  render: (_txt, backData) => {
    const unit = backData.reg_unit ? backData.reg_unit : ''
    return backData.reg_capital ? wftCommon.formatMoney(backData.reg_capital) + unit : '--' //注册资金
  },
}

export const corpInfoPaidInCapitalRow: HorizontalTableCol<CorpBasicInfoFront> = {
  title: intl('145876', '实缴资本'),
  dataIndex: 'paid_in_capital_currency',
  render: (_txt, backData) => {
    const paid_in_capital_currency = backData.paid_in_capital_currency ? backData.paid_in_capital_currency : '' //实收资本币种
    const paid_in_capital = backData.paid_in_capital
      ? wftCommon.formatMoney(backData.paid_in_capital) + paid_in_capital_currency
      : '--' //实收资本
    return paid_in_capital
  },
}

export const corpInfoStartDateRow: HorizontalTableCol<CorpBasicInfoFront> = {
  title: intl('2823', '成立日期'),
  dataIndex: 'reg_date',
  render: (txt) => {
    return wftCommon.formatTime(txt)
  },
}

export const corpInfoOperPeriodBeginRow: HorizontalTableCol<CorpBasicInfoFront> = {
  title: window.en_access_config ? 'Business Term Begin' : '营业期限自',
  dataIndex: 'oper_period_begin',
  render: (txt) => {
    return txt ? wftCommon.formatTime(txt) : '--'
  },
}

export const corpInfoOperPeriodEndRow: HorizontalTableCol<CorpBasicInfoFront> = {
  title: window.en_access_config ? 'Business Term End' : '营业期限至',
  dataIndex: 'oper_period_end',
  render: (txt) => {
    return txt ? wftCommon.formatTime(txt) : intl('271247', '无固定期限')
  },
}

export const corpInfoOperPeriodRangeRow: HorizontalTableCol<CorpBasicInfoFront> = {
  title: intl(448305, '证书有效期'),
  // dataIndex 可以不设，或只设为其中一个字段。但如果你需要排序筛选，需要与后端字段保持一致。
  dataIndex: 'oper_period_begin',
  render: (_, record) => {
    const { oper_period_begin, oper_period_end } = record
    const begin = oper_period_begin ? wftCommon.formatTime(oper_period_begin) : intl('448306', '日期不明')
    const end = oper_period_end ? wftCommon.formatTime(oper_period_end) : intl('271247', '无固定期限')
    // 如果都没有 日期不明
    if (!oper_period_begin && !oper_period_end) return intl('448306', '日期不明')
    return `${begin} ${window.en_access_config ? '~' : '至'} ${end}` // TODO 待优化
  },
}

export const corpInfoProvinceRow: HorizontalTableCol<CorpBasicInfoFront> = {
  title: intl('437319', '所属省份'),
  dataIndex: 'province',
}

export const corpInfoAreaRow: HorizontalTableCol<CorpBasicInfoFront> = {
  ...corpInfoProvinceRow,
  title: window.en_access_config ? intl('32674', '地区') : '国家/地区',
}

export const corpInfoRegAuthorityRow: HorizontalTableCol<CorpBasicInfoFront> = {
  title: intl('138477', '登记机关'),
  dataIndex: 'reg_authority',
}

export const corpInfoOrgAuthorityRow: HorizontalTableCol<CorpBasicInfoFront> = {
  title: intl('410938', '举办单位'),
  dataIndex: 'organizingEntity',
  render: (value, record) => {
    if (!value) {
      // 兼容处理，如果举办单位为空，则显示登记机关，待后端升级后去除
      return record.reg_authority || '--'
    }
    return value || '--'
  },
}

export const corpInfoIssueDateRow: HorizontalTableCol<CorpBasicInfoFront> = {
  title: intl('138157', '核准日期'),
  dataIndex: 'issue_date',
  render: (txt) => {
    return wftCommon.formatTime(txt)
  },
}
