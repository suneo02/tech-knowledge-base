/**
 * 终端命令参数的标识符
 * 用于构建终端命令字符串时的前缀
 */
export const TerminalCommandParam = 'CommandParam'

/**
 * 终端命令 PAGE 前缀
 */
export const TerminalCommandPage = 'Page'

/**
 * 终端命令ID枚举
 * 定义了各种终端命令的唯一标识符
 */
export enum ETerminalCommandId {
  /** 智能营销银行 */
  INTELLIGENT_MARKETING_BANK = '44141',
  /** 新闻查看命令 */
  NEWS = '1900',
  /** 公告查看命令 */
  ANNOUNCEMENT = '1901',
  /** 研报查看命令 */
  RESEARCH = '1902',
  /** 法律法规查看命令 */
  LAW_REGULATION = '5',
  /** EDE浏览器命令 */
  EDE_BROWSER = '1601',
  /** EDB浏览器命令 */
  EDB_BROWSER = '20005',
  /** F9 windCode跳转 */
  F9 = '1400',
  /** 企业详情 */
  COMPANY = '8514', // companyCode跳转F9
}

/**
 * 基础终端命令参数接口
 * 定义了生成终端命令时可能需要的基础参数
 */
interface IBaseTerminalCommandOptions {
  /** 标题，会被自动进行URL编码 */
  title?: string
  /** 语言设置，如 'zh_CN' */
  lan?: string
}

/**
 * 默认参数
 * 定义了各种终端命令的默认参数
 */
export const DefaultParams: Partial<Record<ETerminalCommandId, Record<string, string>>> = {
  [ETerminalCommandId.F9]: {
    SubjectID: '4778', // F9中企业库模块ID
  },
  [ETerminalCommandId.COMPANY]: {
    SubjectID: '4778', // F9中企业库模块ID
  },
}

/**
 * 命令参数接口定义
 */
export interface ICommandOptions {
  /** F9命令参数接口 */
  [ETerminalCommandId.F9]: {
    /** 证券代码，F9命令必须提供 */
    windcode: string | string[]

    SubjectID?: // 企业库
    | '4779'
      // esg 评级
      | '1108'
  } & IBaseTerminalCommandOptions

  /** COMPANY命令参数接口 */
  [ETerminalCommandId.COMPANY]: {
    /** 企业代码，COMPANY命令必须提供 */
    CompanyCode: string
  } & IBaseTerminalCommandOptions

  /** EDE浏览器命令参数接口 */
  [ETerminalCommandId.EDE_BROWSER]: {
    /** 证券代码，可以是单个代码或代码数组 */
    windcode?: string | string[]
    /** 是否是EDE查询模式 */
    isEdeQuery?: boolean
    /** EDE指标ID列表 */
    edeIndicators?: string[]
  } & IBaseTerminalCommandOptions

  /** EDB浏览器命令参数接口 */
  [ETerminalCommandId.EDB_BROWSER]: {
    /** EDB指标ID列表 */
    edbIndicators?: string[]
  } & IBaseTerminalCommandOptions

  /** 舆情相关命令参数接口 */
  [ETerminalCommandId.NEWS]: IDocCommandOptions
  [ETerminalCommandId.ANNOUNCEMENT]: IDocCommandOptions
  [ETerminalCommandId.RESEARCH]: IDocCommandOptions
  [ETerminalCommandId.LAW_REGULATION]: IDocCommandOptions

  /** 智能营销银行命令参数接口 */
  [ETerminalCommandId.INTELLIGENT_MARKETING_BANK]: IBaseTerminalCommandOptions
}

/**
 * 舆情相关命令参数接口（新闻、公告、研报等）
 */
export interface IDocCommandOptions extends IBaseTerminalCommandOptions {
  /** 证券代码，可以是单个代码或代码数组 */
  windcode?: string | string[]
  /** 文档ID，用于舆情等场景 */
  docId?: string
  /** 加密的文档ID，用于公告、研报等场景 */
  docIdEncry?: string
}
