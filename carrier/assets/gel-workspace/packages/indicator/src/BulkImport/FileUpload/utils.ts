/**
 * 批量导入工具函数
 */

import { toThousandSeparator } from '@/util'
import { read, utils } from 'xlsx'

// 导入接口定义
export interface IndicatorBulkImportData {
  /**
   * 统一社会信用代码
   */
  统一社会信用代码?: string
  /**
   * 公司名称
   */
  公司名称?: string
  /**
   * 其他可能的字段
   */
  [key: string]: unknown
}

/**
 * 处理Excel文件中的公司数据
 * @param idList 公司数据列表
 * @returns 处理后的ID列表
 */
export const processCompanyData = (idList: any[]): string[] => {
  return idList
    .map((i) => (i['统一社会信用代码'] || i['公司名称'])?.toString().trim() || '')
    .filter(Boolean)
    .map((i) => i.replace(/[\r\n]/g, ''))
}

/**
 * 解析Excel文件并提取企业数据
 *
 * 该函数读取Excel文件的二进制内容，将其解析为JSON数据，
 * 并过滤出包含有效企业信息（统一社会信用代码或公司名称）的记录。
 * 同时进行数据验证，确保数据量不超过限制且不为空。
 *
 * @param content Excel文件的二进制内容字符串
 * @param matchCount 最大允许的匹配数量
 * @returns 返回一个对象，包含过滤后的企业数据和对应的ID列表
 * @throws 如果数据量超过限制或为空，则抛出相应错误
 */
export const parseExcelFile = (
  content: string,
  matchCount: number,
  t: (key: string, params?: Record<string, string>) => string
): { filteredData: IndicatorBulkImportData[]; idList: string[] } => {
  if (!content) {
    throw new Error(t('140088')) // 文件内容为空或无效
  }

  // 使用xlsx库读取Excel内容
  const workbook = read(content, { type: 'binary' })

  // 获取第一个工作表
  const sheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[sheetName]

  // 将工作表转换为JSON对象数组
  let rawData = utils.sheet_to_json<IndicatorBulkImportData>(worksheet)

  // 过滤有效数据（包含统一社会信用代码或公司名称的行）
  // 这确保我们只处理有效的企业数据行
  const filteredData = rawData.filter((i) => i['统一社会信用代码'] || i['公司名称'])

  // 验证数据量是否超过限制
  if (filteredData.length > matchCount) {
    throw new Error(t('140084', { matchCount: toThousandSeparator(matchCount) }))
  }

  // 验证是否存在有效数据
  if (filteredData.length === 0) {
    throw new Error(t('140087')) // 没有找到有效的企业数据
  }

  // 处理ID列表，从过滤后的数据中提取企业标识符
  const idList = processCompanyData(filteredData)

  return { filteredData, idList }
}
