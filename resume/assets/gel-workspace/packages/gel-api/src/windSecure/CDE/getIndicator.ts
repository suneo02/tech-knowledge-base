export interface getCDEIndicatorParams {
  cmd: 'getcrossfilterquery'
}
export interface getCDEIndicatorPayload {
  cmdType: 'indicator'
}

export const CDEIndicatorOverall = [
  {
    indicator: 'No.',
    name: '序号',
  },
  {
    indicator: 'credit_code',
    name: '统一社会信用代码',
  },
  {
    indicator: 'govlevel',
    name: '经营状态',
  },
  {
    indicator: 'established_time',
    name: '成立日期',
  },
  {
    indicator: 'cancel_time',
    name: '注销日期',
  },
  {
    indicator: 'oper_period_end',
    name: '营业期限',
  },
  {
    indicator: 'register_capital',
    name: '注册资本(万)',
  },
  {
    indicator: 'capital_unit',
    name: '注册资本币种',
  },
  {
    indicator: 'artificial_person',
    name: '法定代表人',
  },
  {
    indicator: 'region',
    name: '省份地区',
  },
  {
    indicator: 'register_address',
    name: '注册地址',
  },
  {
    indicator: 'business_address',
    name: '办公地址',
  },
  {
    indicator: 'industry_gb_1',
    name: '国标行业-门类',
  },
  {
    indicator: 'industry_gb_2',
    name: '国标行业-大类',
  },
  {
    indicator: 'industry_gb',
    name: '国标行业-中类',
  },
  {
    indicator: 'tel',
    name: '联系电话',
  },
  {
    indicator: 'mail',
    name: '邮箱',
  },
  {
    indicator: 'biz_scope',
    name: '经营范围',
  },
  {
    indicator: 'brief',
    name: '企业简介',
  },
  {
    indicator: 'data_from',
    name: '机构类型',
  },
  {
    indicator: 'corp_type',
    name: '企业类型',
  },
  {
    indicator: 'eng_name',
    name: '英文名称',
  },
  {
    indicator: 'endowment_num',
    name: '参保人数',
  },
  {
    indicator: 'ent_scale_num_indicator',
    name: '人员规模',
  },
  {
    indicator: 'count.patent_num',
    name: '专利数量',
  },
  {
    indicator: 'count.trademark_num',
    name: '商标数量',
  },
  {
    indicator: 'domain',
    name: '网址',
  },
] as const

type ExtractIndicator<T> = T extends { indicator: infer U } ? U : never
export type CDEIndicatorField = ExtractIndicator<(typeof CDEIndicatorOverall)[number]>

export type CDEIndicatorItem = {
  indicator: CDEIndicatorField
  name: string
  can_sort?: boolean
  isVip?: number
}
