/**
 * 人物搜索相关类型定义
 */

/**
 * 人物信息
 */
export interface PersonItem {
  /** 公司编码 */
  companyCode: string
  /** 公司名称 */
  companyName: string
  /** 头像图片 */
  image: string
  /** 简介 */
  introduce: string
  /** 人物ID（唯一标识） */
  personId: string
  /** 人物姓名 */
  personName: string
  /** 人物姓名（英文翻译） */
  personName_en?: string
  /** 职位 */
  position: string
}

/**
 * 人物搜索响应数据
 */
export interface PersonSearchResponse {
  ErrorCode: string
  data?: PersonItem[]
  Page?: {
    Records: number
    CurrentPage: number
  }
}
