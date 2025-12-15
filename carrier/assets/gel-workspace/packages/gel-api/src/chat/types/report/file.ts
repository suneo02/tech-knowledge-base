export interface RPFileIdIdentifier {
  fileId: string
}

/**
 * @deprecated
 */
export interface RPFileIdIdentifierDepre {
  fileID: string
}

/**
 * 文件标签枚举
 */
export enum RPFileTag {
  FINANCIAL_REPORT = 'financialReport', // 财务报告
  OTHER_FINANCIAL = 'otherFinancial', // 其他财务文件
  LEGAL_COMPLIANCE = 'legalCompliance', // 法律合规
  MARKET_RESEARCH = 'marketResearch', // 市场研究
  PRODUCT_SERVICE = 'productService', // 产品服务
  OPERATION = 'operation', // 运营文件
  STRATEGIC_PLANNING = 'strategicPlanning', // 战略规划
  PROJECT = 'project', // 项目文件
  OTHER = 'other', // 其他
}

/**
 * 报告文件状态
 */
export enum RPFileStatus {
  /**
   * 文件解析结束
   */
  FINISHED = 0,
  /**
   * 文件上传成功
   */
  UPLOADED = 1,
  /**
   * 大纲解析完成
   */
  OUTLINE_PARSED = 2,
  /**
   * 解析失败
   */
  FAILED = -1,
  /**
   * 财报-待信息确认
   */
  FINANCE_INFO_PENDING = -11,
  /**
   * 财报-待平衡诊断
   */
  FINANCE_BALANCE_PENDING = -12,
  /**
   * 未配平
   */
  FINANCE_NOT_BALANCED = -13,
}

/**
 * @deprecated
 * 这个命名不够语义话
 * 财报 id 跳转 百分用
 *
 */
export interface RPFileFinanceIdentifier {
  docId?: string
}

export interface RPFile extends RPFileIdIdentifier, RPFileFinanceIdentifier {
  fileName: string
  fileType?: string
  createTime?: number
  status?: RPFileStatus
}

export interface RPFileDepre extends RPFileIdIdentifierDepre, RPFileFinanceIdentifier {
  fileName: string
  createTime: number
  status?: RPFileStatus
}

export interface RPFileTraced extends RPFileIdIdentifier {
  fileName: string
  fileType?: string
  uploadTime?: string
  status?: RPFileStatus
  position?: {
    startPoint: {
      // 开始点x坐标
      x: number
      // 开始点y坐标
      y: number
      // 开始点页码
      page: number
    }
  }
}

/**
 * 文件列表项
 */
export interface RPFileListItem extends RPFileIdIdentifierDepre, RPFileFinanceIdentifier {
  fileName: string // 文件名称
  status: RPFileStatus // 详细状态码
  fileRelateName?: string // 关联企业
  fileRelateCode?: string // 关联企业 code
  tags?: RPFileTag[] // 标签
}
