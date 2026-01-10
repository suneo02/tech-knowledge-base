/**
 * 招投标搜索相关类型定义
 */

/**
 * 采购单位信息
 */
export interface PurchasingUnit {
  companyCode: string
  companyName: string
}

/**
 * 高亮字段
 */
export interface BidHighlight {
  'associated_role.search'?: string[]
  'subject_name.search'?: string[]
  'title.search'?: string[]
  'project_title.search'?: string[]
}

/**
 * 招投标项目信息
 */
export interface BidItem {
  /** 公告时间 */
  announcement_time: string
  /** 附件数量 */
  attachCount: number
  /** 中标单位列表 */
  bidWinner: any[]
  /** 招标阶段 */
  biddingStage: string
  /** 招标类型名称 */
  bidding_type_name: string
  /** 详情ID（唯一标识） */
  detail_id: string
  /** 高亮字段 */
  highlight?: BidHighlight
  /** 国标行业一级 */
  industry_gb_1: string
  /** 国标行业二级 */
  industry_gb_2: string
  /** 参与单位 */
  participating_unit: string[]
  /** 产品名称列表 */
  productName: any[]
  /** 项目标题 */
  projectTitle: string
  /** 项目地区名称 */
  project_area_name: string
  /** 拟定供应商 */
  proposedSupplier: any[]
  /** 采购单位（对象列表） */
  purchasingUnit: PurchasingUnit[]
  /** 采购单位列表（字符串） */
  purchasingUnitList: string
  /** 采购单位（字符串格式：名称|编码） */
  purchasing_unit: string
  /** 采购单位地区 */
  purchasing_unit_region: string
  /** 搜索标签 */
  search_tag: string
  /** 主题名称列表 */
  subjectName: string[]
  /** 标题 */
  title: string
  /** 英文标题（翻译后） */
  title_en?: string
}

/**
 * 招投标搜索响应数据
 */
export interface BidSearchResponse {
  ErrorCode: string
  data?: {
    list: BidItem[]
  }
  Page?: {
    Records: number
    CurrentPage: number
  }
}
