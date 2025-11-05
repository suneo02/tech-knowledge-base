/**
 * 资质荣誉模块
 */
export interface CorpBasicNumQualification {
  admin_licence_num: number // 行政许可[信用中国]
  adminLicenceCount: number // 行政许可[工商局]
  commercial_franchise_info_num: number // 商业特许经营
  financial_licence_num: number // 金融许可
  telelic_num: number // 电信许可
  gameLicenseCount: number // 游戏审批
  build_qualification_num: number // 建筑资质
  realestateCertificate: number // 房地产企业开发资质
  logisticsCreditRate: number // 物流信用评级
  impexp_num: number // 进出口信用
  certification_merge_num: number // 认证认可
  taxaCreditCount: number // A级纳税人
  listingTagsDataCount: number // 入选名录
  cosmeticslicenseNum: number // 化妆品生产许可
}
