import { CorpBasicInfo, CorpCardInfo } from 'gel-types'
import { getLocale } from '../../intl/handle'
import type { SupportedLocale } from '../../intl/type'
import type { DisplayMode } from './displayModes'
import { shouldAllowAIForMain } from './displayModes'
import { getDetectorByLocale } from './languageDetector'

/**
 * 企业名称输入
 *
 * @description 表示可用于展示的企业名称信息。`nameTrans` 与 `nameAITransFlag` 通常由后端提供；
 * 当前端需要兜底 AI 翻译时，可为空，由异步方法决定是否触发 AI。
 */
export interface EnterpriseNameInput {
  /** 原始名称（不做任何翻译的源），必填 */
  name: string
  /** 翻译后的名称（需与请求 locale 对齐）；可能缺失 */
  nameTrans?: string | null
  /** 翻译是否来自 TRANS/AI（用于展示 “Provided by AI”），官方/6254 为 false；可能缺失 */
  nameAITransFlag?: boolean | null
}

/**
 * 名称展示基础选项（不包含 position）
 *
 * @description 前端展示行为配置：当前语言与显示模式。
 * `locale` 可选，缺省时默认从 intl/handle.getLocale() 推断；SSR/非浏览器环境回退 'zh-CN'。
 */
export interface NameDisplayBaseOptions {
  /** 当前语言（'zh-CN' | 'en-US'），缺省时自动获取 */
  locale?: SupportedLocale
  /** 显示模式（详见文档），控制是否允许在何处使用翻译/AI */
  mode: DisplayMode
}

/**
 * 名称展示结果
 *
 * @description `primaryText` 一定存在；`secondaryText` 仅在主要位置需要上下两行时提供。
 * `showAiBadge` 表示是否展示“Provided by AI”标识；`usedTranslation` 表示当前是否使用了译文。
 */
export interface NameDisplayResult {
  primaryText: string
  secondaryText?: string
  showAiBadge: boolean
  usedTranslation: boolean
}

// ========== Helpers ==========
/**
 * 获取目标语言
 *
 * @description 优先使用传入的 `locale`，否则使用全局 `getLocale()`。
 */
const getTargetLocale = (locale?: SupportedLocale): SupportedLocale => locale || getLocale()

/**
 * 是否存在可用翻译
 *
 * @description 非空字符串且去除空白后仍有内容，视为存在译名。
 */
const hasTranslation = (t?: string | null): boolean => Boolean(t && t.trim())

/**
 * 是否为目标语种
 *
 * @description 使用统一的 `getDetectorByLocale` 做字符级检测。
 */
const isTargetLanguage = (value: string, targetLocale: SupportedLocale): boolean =>
  getDetectorByLocale(targetLocale)(value)

// 官方/6254 标识：此前用于其余位置仅接受官方译名的策略；
// 现已精简为“其余位置仅展示原始名称”，不再使用该判断。

/**
 * 构造“仅原始名称”的结果对象（单行）
 */
const resultOriginal = (name: string): NameDisplayResult => ({
  primaryText: name,
  showAiBadge: false,
  usedTranslation: false,
})

/**
 * 构造“主要位置：原始+译名（上下两行）”的结果对象
 */
const resultMainWithTrans = (name: string, trans: string, aiFlag?: boolean | null): NameDisplayResult => ({
  primaryText: name,
  secondaryText: trans,
  showAiBadge: Boolean(aiFlag),
  usedTranslation: true,
})

// 其余位置已统一为仅展示原始名称，不再提供“仅译名”的结果构造器

/**
 * 从通用对象中提取企业名称输入（原始、译名、AI 标识）
 *
 * @description 支持驼峰和下划线两种命名风格：
 * - 驼峰命名：传入 'corpName'，读取 corpName、corpNameTrans、corpNameAITransFlag
 * - 下划线：传入 'corp_name'，读取 corp_name、corp_nameTrans、corp_nameAITransFlag
 *
 * @param record - 接口/业务对象
 * @param field - 基础字段名（如 'corpName' 或 'corp_name'）
 *
 * @example
 * ```typescript
 * // 驼峰命名（推荐）
 * deriveCorpNameInputFromRecord(data, 'corpName')
 * // 读取: corpName, corpNameTrans, corpNameAITransFlag
 *
 * // 下划线命名（兼容）
 * deriveCorpNameInputFromRecord(data, 'corp_name')
 * // 读取: corp_name, corp_nameTrans, corp_nameAITransFlag
 * ```
 */
export const deriveCorpNameInputFromRecord = (record: Record<string, unknown>, field: string): EnterpriseNameInput => {
  try {
    const transKey = `${field}Trans`
    const aiFlagKey = `${field}AITransFlag`

    const rawName = record?.[field]
    const rawTrans = record?.[transKey as keyof typeof record]
    const rawAiFlag = record?.[aiFlagKey as keyof typeof record]

    const name = typeof rawName === 'string' ? rawName : String(rawName ?? '')
    const nameTrans = rawTrans == null ? undefined : typeof rawTrans === 'string' ? rawTrans : String(rawTrans)
    const nameAITransFlag = rawAiFlag == null ? null : Boolean(rawAiFlag)

    return { name, nameTrans, nameAITransFlag }
  } catch {
    return { name: '', nameTrans: undefined, nameAITransFlag: null }
  }
}

// ========== Sync formatters ==========
/**
 * 同步：主要位置展示规则（不触发 AI）
 *
 * @rules
 * - 模式 origin：直接返回原始
 * - 原始名称已为目标语：仅原始（避免冗余）
 * - 原始非目标语且存在译名：上下两行（原始+译名）
 * - 否则：仅原始
 */
const formatEnterpriseNameMain = (input: EnterpriseNameInput, options: NameDisplayBaseOptions): NameDisplayResult => {
  const { name, nameTrans, nameAITransFlag } = input
  const { mode } = options
  const targetLocale = getTargetLocale(options.locale)

  if (mode === 'origin') return resultOriginal(name)
  if (isTargetLanguage(name, targetLocale)) return resultOriginal(name)
  if (hasTranslation(nameTrans)) return resultMainWithTrans(name, nameTrans!, nameAITransFlag)
  return resultOriginal(name)
}

// ========== AI attempt helpers ==========
/**
 * 在“主要位置”尝试 AI 翻译：仅在允许 AI、原始非目标语、且无译名时触发
 *
 * @returns 若触发且成功，返回带有 AI 译名的结果；否则返回 null
 */
const attemptAiForMain = async (
  input: EnterpriseNameInput,
  options: NameDisplayBaseOptions,
  aiTranslate?: (text: string, targetLocale: SupportedLocale) => Promise<string | null | undefined>
): Promise<NameDisplayResult | null> => {
  if (!aiTranslate) return null
  const targetLocale = getTargetLocale(options.locale)
  if (!shouldAllowAIForMain(options.mode)) return null
  if (isTargetLanguage(input.name, targetLocale)) return null
  if (hasTranslation(input.nameTrans)) return null
  try {
    const aiText = await aiTranslate(input.name, targetLocale)
    const resolved = aiText && String(aiText).trim()
    if (!resolved) return null
    return resultMainWithTrans(input.name, resolved, true)
  } catch {
    // 翻译接口异常时静默回退
    return null
  }
}

// 其余位置不再尝试 AI 翻译

// ========== Public async APIs ==========
/**
 * 异步：主要位置（允许时触发 AI）
 *
 * @param input - 企业名称输入（原始、译名、AI 标识）
 * @param options - 展示选项：语言与模式
 * @param aiTranslate - 可选 AI 翻译函数；当允许且无译名时调用
 */
export const formatEnterpriseNameMainWithAI = async (
  input: EnterpriseNameInput,
  options: NameDisplayBaseOptions,
  aiTranslate?: (text: string, targetLocale: SupportedLocale) => Promise<string | null | undefined>
): Promise<NameDisplayResult> => {
  try {
    const syncResult = formatEnterpriseNameMain(input, options)
    const aiResult = await attemptAiForMain(input, options, aiTranslate)
    return aiResult || syncResult
  } catch {
    return resultOriginal(input.name)
  }
}

/**
 * 同步：其余位置展示规则（始终返回原始名称）
 *
 * @description 其余位置（表格列表、关联列表、图谱非中心节点等）统一仅展示原始名称，
 * 不使用翻译，不触发 AI。
 */
export const formatEnterpriseNameOther = (input: EnterpriseNameInput): NameDisplayResult => {
  return resultOriginal(input.name)
}

/**
 * 通用入口（异步）：基于对象与字段名，必要时触发 AI 翻译（主要位置）
 *
 * @param record - 原始对象（通常为接口实体）
 * @param field - 原始字段名，如 'name'；将推导 `${field}Trans` 与 `${field}AITransFlag`
 * @param options - 展示选项：语言与模式
 * @param aiTranslate - 可选 AI 翻译函数
 */
export const formatEnterpriseNameMainFromRecordWithAI = async (
  record: Record<string, unknown>,
  field: string,
  options: NameDisplayBaseOptions,
  aiTranslate?: (text: string, targetLocale: SupportedLocale) => Promise<string | null | undefined>
): Promise<NameDisplayResult> => {
  try {
    const input = deriveCorpNameInputFromRecord(record, field)
    return await formatEnterpriseNameMainWithAI(input, options, aiTranslate)
  } catch {
    return resultOriginal(String(record?.[field] ?? ''))
  }
}

export const getCorpNameOriginalByBaseAndCardInfo = (
  baseInfo: Partial<CorpBasicInfo>,
  headerInfo: Partial<CorpCardInfo>
) => {
  try {
    // chinese_abbr 不清楚是什么，此处应该展示原始企业名称
    return baseInfo && baseInfo.chinese_abbr ? baseInfo.chinese_abbr : headerInfo.corp_name
  } catch (error) {
    console.error(error)
    return ''
  }
}

export const getCorpNameTransByCardInfo = (headerInfo: Partial<CorpCardInfo>) => {
  try {
    return headerInfo?.corpNameTrans
  } catch (error) {
    console.error(error)
    return ''
  }
}
