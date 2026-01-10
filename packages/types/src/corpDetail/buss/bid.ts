/**
 * 投标公告-对外投资
 *
 */
export type TenderNoticeInvest = {
  // 中标单位
  bid_winner: string
  // 中标金额
  bid_winning_money: string
  // 招标类型
  bidding_type: string
  // 招标类型名称
  bidding_type_name: string
  // 公司编码
  companyCode: string
  // 详情ID
  detail_id: string
  // 行业
  industry_gb_2: string[]
  // 最新公告时间
  latest_announcement_time: string
  // 产品名称
  product_name: string[]
  // 项目ID
  project_id: string
  // 项目编号
  project_no: string
  // 项目阶段
  project_stage?: '结果阶段'
  // 采购单位
  purchasing_unit: string
  // 采购单位地区
  purchasing_unit_region: string
  // 标段名称
  subject_name: string[]
  // 投标单位
  tenderUnits: {
    companyCode: string
    companyName: string
    roleName: '中标' | '未中标'
  }[]
}
/**
 * 投标公告-控股企业
 *
 */
export type TenderNoticeHold = {
  // 中标单位
  bid_winner: string
  // 招标类型
  bidding_type: string
  // 招标类型名称
  bidding_type_name: string
  // 公司编码
  companyCode: string
  // 详情ID
  detail_id: string
  // 行业
  industry_gb_2: string[]
  // 最新公告时间
  latest_announcement_time: string
  // 产品名称
  product_name: string[]
  // 项目ID
  project_id: string
  // 项目编号
  project_no: string
  // 项目阶段
  project_stage?: '结果阶段'
  // 采购单位
  purchasing_unit: string
  // 采购单位地区
  purchasing_unit_region: string
  // 标段名称
  subject_name: string[]
  // 投标单位
  tenderUnits: {
    companyCode: string
    companyName: string
    roleName: '中标' | '未中标'
  }[]
  // 标题
  title: string
}
/**
  招标公告 - 控股企业
 */
export type BidNoticeHold = {
  // 招标类型
  bidding_type: string
  // 招标类型名称
  bidding_type_name: string
  // 公司编码
  companyCode: string
  // 详情ID
  detail_id: string
  // 行业
  industry_gb_2: string[]
  // 最新公告时间
  latest_announcement_time: string
  // 最新项目阶段
  latest_project_stage: string
  // 产品名称
  product_name: string[]
  // 项目ID
  project_id: string
  // 采购单位
  purchasing_unit: string
  // 采购单位地区
  purchasing_unit_region: string
  // 标段名称
  subject_name: string[]
  // 投标单位
  tenderUnits: {
    companyCode: string
    companyName: string
    roleName: '中标' | '未中标'
  }[]
  // 标题
  title: string
}
