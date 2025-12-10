import { getLang } from '@/intl'
import { DefaultParams, ETerminalCommandId, ICommandOptions, TerminalCommandParam } from './config'

/**
 * 格式化参数为字符串
 */
function formatParams(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join(',')
}

/**
 * 判断是否是终端命令
 * @param url
 * @returns {boolean} 返回是否为终端命令
 */
export const getIfTerminalCmd = (url: string) => {
  // 终端命令格式：!CommandParam[8514,CompanyCode=${id},SubjectID=4778,grid=${target}]
  // !Page[Minute,1810,HK]
  // regex !开始 [ ] 结束, 或者 !CommandParam 开始 或者 !Page 开始
  // 或者 !开始 ( ) 结束
  if (!url) return false

  const commandParamRegex = /^!CommandParam\[(.*?)\]$/
  const pageRegex = /^!Page\[(.*?)\]$/
  const simpleCommandRegex = /^!.*?(?:\[(.*?)\]|\((.*?)\))$/

  // 按优先级尝试匹配不同格式
  if (commandParamRegex.test(url)) {
    return true
  }

  if (pageRegex.test(url)) {
    return true
  }

  // 最后尝试简单的![]格式
  return simpleCommandRegex.test(url)
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
    params.LAN = lan || getLang()

    // 返回最终的命令字符串
    return `!${TerminalCommandParam}(${cmdId},${formatParams(params)})`
  } catch (e) {
    console.error(e)
    return null
  }
}

/**
 * 生成 f9 链接
 * 上述方法把 subject id写死了
 * 这个方法可以传入 subject id
 * @example
 * // 生成F9跳转命令
 * getTerminalCommandLink(ETerminalCommandId.F9, { windcode: "000001.SZ", SubjectID: '4778' });
 *

 */
export const getF9TerminalCommandLink = (options?: TerminalCommandOptions<ETerminalCommandId.F9>): string | null => {
  try {
    // 如果没有参数，返回最简单的命令格式
    if (!options) return `!${TerminalCommandParam}[${ETerminalCommandId.F9}]`

    // 处理命令参数
    const params: Record<string, string> = {}
    const { windcode, title, lan, SubjectID } = options

    params.WindCode = Array.isArray(windcode) ? windcode[0] : windcode

    if (SubjectID) {
      params.SubjectID = SubjectID
    }

    // 设置标题参数（URL编码）
    if (title) {
      params.TITLE = encodeURIComponent(title)
    }

    // 设置语言参数
    params.LAN = lan || getLang()

    // 返回最终的命令字符串
    return `!${TerminalCommandParam}(${ETerminalCommandId.F9},${formatParams(params)})`
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
