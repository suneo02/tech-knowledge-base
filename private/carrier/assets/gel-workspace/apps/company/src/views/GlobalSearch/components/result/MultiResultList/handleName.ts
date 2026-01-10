import { translateData } from '@/utils/intl'
import { CompanyInfoInSearch } from 'gel-api'
import { isEn } from 'gel-util/intl'
import { detectChinese, detectEnglish } from 'gel-util/misc'

// 参考文档：docs/intl/company-name/frontend.md
// 重要变更：中文环境不再使用前端 AI 翻译作为回退
// 双向引用：本文件实现与文档保持一致，文档已指向此文件

// 英文环境处理逻辑
// - 原始为英文：不需要翻译，清除翻译字段与 AI 标识
// - 有后端翻译：直接使用
// - 无后端翻译：使用批量翻译结果作为回退，并打 AI 标识
// 文档参考：docs/intl/company-name/frontend.md#英文环境
const handleItemEn = (
  item: CompanyInfoInSearch,
  itemTrans: CompanyInfoInSearch
): CompanyInfoInSearch & { statusAfterOriginal?: string } => {
  const originalName = item.corpName
  // 英文名称无需翻译，避免展示不必要的翻译
  if (detectEnglish(originalName)) {
    return {
      ...item,
      ...itemTrans,
      corpName: originalName,
      corpNameTrans: undefined,
      corpNameAITransFlag: undefined,
      statusAfterOriginal: item.statusAfter,
    }
  }
  // 后端已提供翻译，直接使用
  if (item.corpNameTrans) {
    return {
      ...item,
      ...itemTrans,
      corpName: originalName,
      statusAfterOriginal: item.statusAfter,
    }
  }
  // 使用批量翻译结果作为回退，并显示 AI 标识
  return {
    ...item,
    ...itemTrans,
    corpName: originalName,
    corpNameTrans: itemTrans?.corpName,
    corpNameAITransFlag: true,
    statusAfterOriginal: item.statusAfter,
  }
}

// 中文环境处理逻辑
// - 原始为中文：展示“中文名称 + 英文名称（若有 corpNameEng）”，AI 标识依据后端 aiTransFlag
// - 原始非中文：不触发前端 AI 回退，仅返回原始名称与后端数据
// 文档参考：docs/intl/company-name/frontend.md#中文环境
const handleItemZh = (
  item: CompanyInfoInSearch,
  itemTrans: CompanyInfoInSearch
): CompanyInfoInSearch & { statusAfterOriginal?: string } => {
  const originalName = item.corpName
  // 中文企业：双行展示，英文名优先使用 corpNameEng
  if (detectChinese(originalName)) {
    return {
      ...item,
      ...itemTrans,
      corpName: originalName,
      corpNameTrans: item.corpNameEng || undefined,
      corpNameAITransFlag: item.corpNameEng ? item.aiTransFlag : undefined,
      statusAfterOriginal: item.statusAfter,
    }
  }
  // 非中文：不触发前端 AI，保持原始名称
  return {
    ...item,
    ...itemTrans,
    corpName: originalName,
    statusAfterOriginal: item.statusAfter,
  }
}

// 统一分派函数：根据语言环境选择处理逻辑
// 文档参考：docs/intl/company-name/frontend.md#展示模式 与 重要变更（2025-12）
export const handleItem = (
  item: CompanyInfoInSearch,
  itemTrans: CompanyInfoInSearch
): CompanyInfoInSearch & { statusAfterOriginal?: string } => {
  return isEn() ? handleItemEn(item, itemTrans) : handleItemZh(item, itemTrans)
}

export const transCorpSearchResult = async (
  data: CompanyInfoInSearch[]
): Promise<(CompanyInfoInSearch & { statusAfterOriginal?: string })[]> => {
  let dataTrans: CompanyInfoInSearch[] = []
  if (isEn()) {
    // 英文环境：批量翻译时跳过不需要翻译的字段
    dataTrans = (
      await translateData(data, {
        skipFields: ['corpNameEng', 'corporationTags3', 'corpNameAITransFlag', 'corpNameTrans', 'orgType'],
        sourceLocale: 'zh-CN', // 明确指定源语言为中文
        targetLocale: 'en-US', // 明确指定目标语言为英文
      })
    ).data
  } else {
    // 中文环境：不再进行前端批量 AI 翻译，直接使用原始数据
    dataTrans = data
  }

  return data.map((item) => {
    const itemTrans = dataTrans.find((enItem) => enItem.corpId === item.corpId)
    // 确保即使找不到对应的翻译项也能正常处理
    return handleItem(item, itemTrans || item)
  })
}
