export { VIPDueDiligenceCfg } from './DueDiligence'
export { VIPEnterpriseFeatureCfg, VIPOverseaEnterpriseFeatureCfg } from './EnterpriseFeature'
export { VIPEnterpriseOverviewCfg } from './EnterpriseOverview'
export { VIPInsightBusinessCfg } from './InsightBusiness'
export { VIPOverseaSpecialDataCfg, VIPSpecialDataCfg } from './SpecialData'

/**
 * vip 的各种场景
 */
export enum VIPSceneEnum {
  EnterpriseOverview = 'EnterpriseOverview', // 纵览企业全景
  InsightBusiness = 'InsightBusiness', // 洞察商业关系
  EnterpriseFeature = 'EnterpriseFeature', // 企业特征筛选
  SpecialData = 'SpecialData', // 专项数据查询
  DueDiligence = 'DueDiligence', // 尽职调查
}

export type TVIPSceneCfg = {
  [key in VIPSceneEnum]: {
    title: string
    langKey: string
  }
}
export const VIPSceneCfg: TVIPSceneCfg = {
  [VIPSceneEnum.EnterpriseOverview]: {
    title: '纵览企业全景',
    langKey: '391717',
  },
  [VIPSceneEnum.InsightBusiness]: {
    title: '洞察商业关系',
    langKey: '391718',
  },
  [VIPSceneEnum.EnterpriseFeature]: {
    title: '探索特色企业',
    langKey: '437135',
  },
  [VIPSceneEnum.SpecialData]: {
    title: '查询专项数据',
    langKey: '437154',
  },
  [VIPSceneEnum.DueDiligence]: {
    title: '高效赋能尽调',
    langKey: '437136',
  },
}

export const VIPMenuArr = Object.values(VIPSceneEnum).map((scene) => VIPSceneCfg[scene])
