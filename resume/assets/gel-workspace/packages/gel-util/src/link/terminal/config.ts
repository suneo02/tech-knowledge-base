import { getLocale } from '@/intl/handle'

/**
 * 终端命令参数的标识符
 * 用于构建终端命令字符串时的前缀
 */
export const TerminalCommandParam = 'CommandParam'

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
const DefaultParams: Partial<Record<ETerminalCommandId, Record<string, string>>> = {
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
interface IDocCommandOptions extends IBaseTerminalCommandOptions {
  /** 证券代码，可以是单个代码或代码数组 */
  windcode?: string | string[]
  /** 文档ID，用于舆情等场景 */
  docId?: string
  /** 加密的文档ID，用于公告、研报等场景 */
  docIdEncry?: string
}

/**
 * 终端命令选项类型
 * 根据命令ID自动选择对应的参数类型
 */
type TerminalCommandOptions<T extends ETerminalCommandId> = ICommandOptions[T]

/**
 * 生成终端命令链接
 * 根据不同的命令ID和参数，生成相应格式的终端命令字符串
 *
 * @param cmdId - 终端命令ID，来自ETerminalCommandId枚举
 * @param options - 命令参数选项，根据不同的命令ID自动选择对应的参数类型
 * @returns 格式化后的命令字符串，如果生成失败则返回null
 *
 * @example
 * // 生成F9跳转命令
 * getTerminalCommandLink(ETerminalCommandId.F9, { windcode: "000001.SZ", SubjectID: '4778' });
 *
 * // 生成企业详情命令
 * getTerminalCommandLink(ETerminalCommandId.COMPANY, { CompanyCode: "11111", SubjectID: '4778' });
 *
 * // 生成新闻查看命令
 * getTerminalCommandLink(ETerminalCommandId.NEWS, {
 *   windcode: "000001.SZ",
 *   title: "新闻标题",
 *   lan: "zh_CN"
 * });
 */
export const getTerminalCommandLink = <T extends ETerminalCommandId>(
  cmdId: T,
  options?: TerminalCommandOptions<T>
): string | null => {
  try {
    // 如果没有参数，返回最简单的命令格式
    if (!options) return `!${TerminalCommandParam}[${cmdId}]`

    // 处理命令参数
    const params: Record<string, string> = {}
    const { windcode, docIdEncry, title, lan, isEdeQuery, edeIndicators, edbIndicators, CompanyCode } = options as any
    // 根据命令类型处理
    switch (cmdId) {
      // EDE浏览器命令
      case ETerminalCommandId.EDE_BROWSER:
        if (isEdeQuery && edeIndicators) {
          return getEDEBrowserCommand(cmdId, edeIndicators, windcode)
        }
        break
      // EDB浏览器命令
      case ETerminalCommandId.EDB_BROWSER:
        if (edbIndicators) {
          return getEDBBrowserCommand(cmdId, edbIndicators)
        }
        break
      // F9命令 参数改成ID
      case ETerminalCommandId.F9:
        if (windcode) {
          params.ID = Array.isArray(windcode) ? windcode[0] : windcode
        }
        break

      // COMPANY命令 参数改成ID
      case ETerminalCommandId.COMPANY:
        if (CompanyCode) {
          params.CompanyCode = CompanyCode
        }
        break
      default:
        if (docIdEncry || windcode) {
          params.ID = docIdEncry || (Array.isArray(windcode) ? windcode[0] : windcode) || ''
        }
        break
    }

    // 设置默认参数
    if (DefaultParams[cmdId]) {
      Object.assign(params, DefaultParams[cmdId])
    }

    // 设置标题参数（URL编码）
    if (title) {
      params.TITLE = encodeURIComponent(title)
    }

    // 设置语言参数
    params.LAN = lan || getLocale()

    // 返回最终的命令字符串
    return `!${TerminalCommandParam}(${cmdId},${formatParams(params)})`
  } catch (e) {
    console.error(e)
    return null
  }
}

/**
 * 生成EDE浏览器命令
 */
function getEDEBrowserCommand(
  cmdId: ETerminalCommandId.EDE_BROWSER,
  edeIndicators: string[],
  windcode?: string | string[]
): string {
  let codes = ''
  if (Array.isArray(windcode) && windcode.length) {
    codes = `;SelectWindCode(WindCode=${windcode.join(',')});query()`
  }
  const inds = edeIndicators.map((indId) => `SelectIndicator(id=${indId})`)
  return `!CommandFunc(ExecuteCmd(CMDID=${cmdId});AddSheet();${inds.join(';')}${codes})`
}

/**
 * 生成EDB浏览器命令
 */
function getEDBBrowserCommand(cmdId: ETerminalCommandId.EDB_BROWSER, edbIndicators: string[]): string {
  const inds = edbIndicators.map((indId) => `EDBFolder(code=${indId})`)
  return `!CommandFunc(ExecuteCmd(CMDID=${cmdId});${inds.join(';')};addin())`
}

/**
 * 格式化参数为字符串
 */
function formatParams(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join(',')
}
