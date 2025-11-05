import { IntellectualTypeEnum, LinksModule, PatentTypeEnum } from '@/handle/link'

/**
 * 各详情页
 */
export const LinksDetailData = [
  {
    title: '企业详情',
    id: '1173319566',
    module: LinksModule.COMPANY,
  },
  {
    title: '企业详情配置化版',
    id: '1047934153',
    module: LinksModule.CompanyNew,
  },
  {
    title: '集团系详情',
    id: '2010500722',
    module: LinksModule.GROUP,
  },
  {
    title: '产品详情',
    id: '4723933',
    module: LinksModule.PRODUCT,
  },
  {
    title: '招聘详情',
    module: LinksModule.JOB,
    id: '185776578',
    extraId: '1320001202',
  },
  {
    title: '标准信息详情',
    module: LinksModule.STANDARD_DETAIL,
    type: 'standardDataCountry',
    standardLevelCode: 3654655,
    id: '35397685555',
  },
  {
    title: '集成电路布图',
    module: LinksModule.IC_LAYOUT,
    id: '33404262725',
  },
  ...[
    {
      title: '专利:发明申请',
      id: '16432017',
      subModule: IntellectualTypeEnum.PATENT,
      type: PatentTypeEnum.FMSQ,
    },
    {
      title: '专利:授权发明',
      id: '31673077',
      subModule: IntellectualTypeEnum.PATENT,
      type: PatentTypeEnum.SQFM,
    },
    {
      title: '专利:实用新型',
      id: '190407840',
      subModule: IntellectualTypeEnum.PATENT,
      type: PatentTypeEnum.SYXX,
    },
    {
      title: '专利:外观设计',
      id: '6082418',
      subModule: IntellectualTypeEnum.PATENT,
      type: PatentTypeEnum.WGSJ,
    },
  ].map((item) => ({
    ...item,
    module: LinksModule.PATENT,
  })),
  ...[
    {
      title: '商标',
      id: '81227457',
      subModule: IntellectualTypeEnum.BRAND,
    },
  ].map((item) => ({
    ...item,
    module: LinksModule.INTELLECTUAL,
  })),
]
