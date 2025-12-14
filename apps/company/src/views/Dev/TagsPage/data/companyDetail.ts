import { TagsModule } from 'gel-ui'

export const CorpDetailInfoTagsDataCfg = {
  title: '企业详情 企业信息模块',
  windUIData: [
    { module: TagsModule.COMPANY, title: '企业' },
    { module: TagsModule.STOCK, title: '股票' },
    { module: TagsModule.GROUP, title: '集团系' },
    { module: TagsModule.FEATURE_COMPANY, title: '特殊企业' },

    { module: TagsModule.COMPANY_PRODUCT, title: '企业产品' },
    { module: TagsModule.RISK, title: '风险' },
    { module: TagsModule.RANK_DICT, title: '名录' },
  ],
  customData: [
    { module: TagsModule.TREND, title: '企业详情页 动态' },
    { module: TagsModule.BUSINESS_OPPORTUNITY, title: '企业详情页 商机' },
    { module: TagsModule.PUBLIC_SENTIMENT, title: '企业详情页 舆情 默认' },
    { module: TagsModule.PUBLIC_SENTIMENT, title: '企业详情页 舆情 中性', emotion: '中性' },
    { module: TagsModule.PUBLIC_SENTIMENT, title: '企业详情页 舆情 负面3', emotion: '负面', level: 3 },
    { module: TagsModule.PUBLIC_SENTIMENT, title: '企业详情页 舆情 负面4', emotion: '负面', level: 4 },
    { module: TagsModule.PUBLIC_SENTIMENT, title: '企业详情页 舆情 负面5', emotion: '负面', level: 5 },
  ],
}

export const CorpDetailPeopleTagsDataCfg = {
  title: '企业详情页 人物',
  windUIData: [
    { module: TagsModule.ULTIMATE_BENEFICIARY, title: '最终受益人' },
    { module: TagsModule.ACTUAL_CONTROLLER, title: '实际控制人' },
    { module: TagsModule.IS_CHANGE_NAME, title: '是否已更名' },
  ],
}
