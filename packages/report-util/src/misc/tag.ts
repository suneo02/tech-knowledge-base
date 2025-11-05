export type TagColors =
  | 'color-1'
  | 'color-2'
  | 'color-3'
  | 'color-4'
  | 'color-5'
  | 'color-6'
  | 'color-7'
  | 'color-8'
  | 'color-9'
  | 'color-10'

export type TagSizes = 'mini' | 'small' | 'default' | 'large'
export type TagTypes = 'primary' | 'secondary'

export type TagsModule =
  | 'company' // 公司 | 投资机构
  | 'companyProduct' // 企业产品
  | 'featureCompany' // 特殊企业
  | 'stock' // 股票
  | 'group' // 集团系
  | 'risk' // 风险
  | 'rankDict' // 名录
  | 'trend' // 企业详情页 动态
  | 'publicSentiment' // 企业详情页 舆情
  | 'businessOpportunity' // 企业详情页 商机
  | 'ultimateBeneficiary' // 最终受益人
  | 'actualController' // 实际控制人
  | 'isChangeName' // 是否已更名
  | 'relatedParties' // 关联方/一致行动人

export const TagCfgByModuleMap: Partial<
  Record<
    TagsModule,
    {
      color: TagColors
      type: TagTypes
      size?: TagSizes
    }
  >
> = {
  ['company']: {
    color: 'color-2',
    type: 'primary',
  },
  ['companyProduct']: {
    color: 'color-1',
    type: 'primary',
  },
  ['featureCompany']: {
    color: 'color-2',
    type: 'primary',
  },
  ['stock']: {
    color: 'color-2',
    type: 'primary',
  },
  ['group']: {
    color: 'color-2',
    type: 'primary',
  },

  ['risk']: {
    color: 'color-4',
    type: 'primary',
  },
  ['rankDict']: {
    color: 'color-5',
    type: 'primary',
  },
  ['ultimateBeneficiary']: {
    color: 'color-3',
    type: 'primary',
    size: 'mini',
  },
  ['actualController']: {
    color: 'color-2',
    type: 'primary',
    size: 'mini',
  },
  ['isChangeName']: {
    color: 'color-3',
    type: 'primary',
    size: 'mini',
  },
  ['relatedParties']: {
    color: 'color-1',
    type: 'primary',
    size: 'mini',
  },
}

export const getTagPropsByModule = (module: TagsModule) => {
  return TagCfgByModuleMap[module]
}
