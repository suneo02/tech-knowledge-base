/**
 * 在 utils 中也有一份定义
 */
export enum ECorpTypeCode {
  DomesticCompany = 100001, // 境内企业
  LawFirm = 912034101, // 律所
  GovernmentOrganization = 160300000, // 政府组织
  SocialOrganization = 160900000, // 社会组织
  PublicInstitution = 160307000, // 事业单位
  HongKongCompany = 298060000, // 中国香港
  TaiwanCompany = 298001002, // 中国台湾
  Enterprise = 298010000, // 企业
  FarmerCooperative = 298020000, // 农民专业合作社
  IndividualBusiness = 298030000, // 个体工商户
  OtherInstitutions = 298040000, // 其他机构
  OverseasListedCompany = 298050000, // 海外上市公司
  USCompany = 298070000, // 美国
  UKCompany = 298080000, // 英国
  OverseasCompany = 2980890000, // 海外公司
  Party = 160100000, // 党
  Military = 160200000, // 军
  NPC = 160400000, // 人大
  CPPCC = 160500000, // 政协
  Court = 160600000, // 法院
  Procuratorate = 160700000, // 检察院
  YouthLeague = 160800000, // 共青团
  Chairman = 161000000, // 主席
  DemocraticParties = 161100000, // 民主党派
  MassOrganizations = 161600000, // 人民团体
  SocialGroup = 1609020100, // 社会团体
  PrivateNonEnterprise = 1609020200, // 民办非企业单位
  Foundation = 1609020300, // 基金会
  OverseasFoundationRepresentative = 1609020400, // 境外基金会代表机构
  InternationalAssociation = 1609020500, // 国际性社团
  ForeignChamberOfCommerce = 1609020600, // 外国商会
  ForeignRelatedFoundation = 1609020700, // 涉外基金会
  SocialGroup_Alt = 1609010100, // 社会团体 (重复键添加后缀以避免冲突)
  PrivateNonEnterprise_Alt = 1609010200, // 民办非企业单位 (重复键添加后缀以避免冲突)
  Foundation_Alt = 1609010300, // 基金会 (重复键添加后缀以避免冲突)
  OverseasFoundationRepresentative_Alt = 1609010400, // 境外基金会代表机构 (重复键添加后缀以避免冲突)
  InternationalAssociation_Alt = 1609010500, // 国际性社团 (重复键添加后缀以避免冲突)
  ForeignChamberOfCommerce_Alt = 1609010600, // 外国商会 (重复键添加后缀以避免冲突)
  ForeignRelatedFoundation_Alt = 1609010700, // 涉外基金会 (重复键添加后缀以避免冲突)
}

export type CorpTypeCodeTitle =
  | '境内企业'
  | '律所'
  | '政府组织'
  | '社会组织'
  | '事业单位'
  | '中国香港'
  | '中国台湾'
  | '企业'
  | '农民专业合作社'
  | '个体工商户'
  | '其他机构'
  | '海外上市公司'
  | '美国'
  | '英国'
  | '海外公司'
  | '党'
  | '军'
  | '人大'
  | '政协'
  | '法院'
  | '检察院'
  | '共青团'
  | '主席'
  | '民主党派'
  | '人民团体'
  | '社会团体'
  | '民办非企业单位'
  | '基金会'
  | '境外基金会代表机构'
  | '国际性社团'
  | '外国商会'
  | '涉外基金会'
  | '社会团体'
  | '民办非企业单位'
  | '基金会'
  | '境外基金会代表机构'
  | '国际性社团'
  | '外国商会'
  | '涉外基金会'
  | string

export const ECorpTypeCodeTitleMap: Record<ECorpTypeCode, CorpTypeCodeTitle> = {
  [ECorpTypeCode.DomesticCompany]: '境内企业',
  [ECorpTypeCode.LawFirm]: '律所',
  [ECorpTypeCode.GovernmentOrganization]: '政府组织',
  [ECorpTypeCode.SocialOrganization]: '社会组织',
  [ECorpTypeCode.PublicInstitution]: '事业单位',
  [ECorpTypeCode.HongKongCompany]: '中国香港',
  [ECorpTypeCode.TaiwanCompany]: '中国台湾',
  [ECorpTypeCode.Enterprise]: '企业',
  [ECorpTypeCode.FarmerCooperative]: '农民专业合作社',
  [ECorpTypeCode.IndividualBusiness]: '个体工商户',
  [ECorpTypeCode.OtherInstitutions]: '其他机构',
  [ECorpTypeCode.OverseasListedCompany]: '海外上市公司',
  [ECorpTypeCode.USCompany]: '美国',
  [ECorpTypeCode.UKCompany]: '英国',
  [ECorpTypeCode.OverseasCompany]: '海外公司',
  [ECorpTypeCode.Party]: '党',
  [ECorpTypeCode.Military]: '军',
  [ECorpTypeCode.NPC]: '人大',
  [ECorpTypeCode.CPPCC]: '政协',
  [ECorpTypeCode.Court]: '法院',
  [ECorpTypeCode.Procuratorate]: '检察院',
  [ECorpTypeCode.YouthLeague]: '共青团',
  [ECorpTypeCode.Chairman]: '主席',
  [ECorpTypeCode.DemocraticParties]: '民主党派',
  [ECorpTypeCode.MassOrganizations]: '人民团体',
  [ECorpTypeCode.SocialGroup]: '社会团体',
  [ECorpTypeCode.PrivateNonEnterprise]: '民办非企业单位',
  [ECorpTypeCode.Foundation]: '基金会',
  [ECorpTypeCode.OverseasFoundationRepresentative]: '境外基金会代表机构',
  [ECorpTypeCode.InternationalAssociation]: '国际性社团',
  [ECorpTypeCode.ForeignChamberOfCommerce]: '外国商会',
  [ECorpTypeCode.ForeignRelatedFoundation]: '涉外基金会',
  [ECorpTypeCode.SocialGroup_Alt]: '社会团体',
  [ECorpTypeCode.PrivateNonEnterprise_Alt]: '民办非企业单位',
  [ECorpTypeCode.Foundation_Alt]: '基金会',
  [ECorpTypeCode.OverseasFoundationRepresentative_Alt]: '境外基金会代表机构',
  [ECorpTypeCode.InternationalAssociation_Alt]: '国际性社团',
  [ECorpTypeCode.ForeignChamberOfCommerce_Alt]: '外国商会',
  [ECorpTypeCode.ForeignRelatedFoundation_Alt]: '涉外基金会',
}

export type CorpTypeCode = (typeof ECorpTypeCode)[keyof typeof ECorpTypeCode]
export const corpTypeCodes = Object.values(ECorpTypeCode) as Array<CorpTypeCode>

export type CorpOrganizationType =
  // 香港
  | 'HK'
  // 个体工商户
  | 'IIP'
  // 公司
  | 'CO'
  // 机关
  | 'GOV'
  // 事业单位
  | 'SOE'
  // 社会团体
  | 'NGO'
  // 合伙企业
  | 'PE'
  // 农民专业合作社法人
  | 'FPC'
  // 个人独资企业
  | 'SPE'
  // 其他企业 内资非法人企业、内资非公司企业分支机构、内资分公司、外商投资企业分支机构、合伙企业分支机构、个人独资企业分支机构、外国<地区>企业在中国境内从事生产经营活动
  | 'OE'
  // 农民专业合作社分支机构
  | 'FCP'
  // 默认
  | '00'
  | string
