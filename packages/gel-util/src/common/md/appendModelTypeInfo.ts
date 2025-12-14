import { t } from '@/intl'
import { EModelType } from 'gel-api'

/**
 * 在内容末尾添加模型类型标识
 *
 * 如果提供了模型类型，会在内容末尾添加一行 "回答使用模型: {modelType}" 的提示信息。
 *
 * ## 设计文档
 * @see {@link file://../../../../../packages/gel-ui/docs/biz/ai-chat/md-rendering-design.md MD 文本渲染系统设计文档}
 *
 * @author 刘兴华 <xhliu.liuxh@wind.com.cn>
 * @param {string} content - 原始内容文本
 * @param {EModelType | undefined} modelType - 模型类型（如 GPT、Claude 等）
 * @returns {string} 处理后的内容，如有模型类型则在末尾添加标识
 *
 * @example
 * // 场景：添加模型类型标识
 * appendModelTypeInfo('你好，这是回答内容', EModelType.GPT)
 * // 返回: '你好，这是回答内容\n回答使用模型: GPT'
 *
 * @example
 * // 场景：未提供模型类型
 * appendModelTypeInfo('你好，这是回答内容', undefined)
 * // 返回: '你好，这是回答内容'
 */
export const appendModelTypeInfo = (content: string, modelType: EModelType | undefined): string => {
  if (!content) return content
  return modelType ? `${content}\n${t('', '回答使用模型')}: ${modelType}` : content
}
