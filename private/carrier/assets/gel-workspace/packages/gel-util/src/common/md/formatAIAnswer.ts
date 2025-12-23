import { ChatEntityRecognize, ChatModelTypeIdentifier, ChatTraceItem, WithDPUList, WithRAGList } from 'gel-api'
import { appendModelTypeInfo } from './appendModelTypeInfo'
import { filterTracesByValidSource } from './filterTracesByValidSource'
import { insertEntityMarkdownLinks } from './insertEntityMarkdownLinks'
import { insertTraceMarkers } from './insertTraceMarkers'

/**
 * 格式化回答文本参数接口
 */
export interface FormatAIAnswerParams extends Partial<WithDPUList>, Partial<WithRAGList>, ChatModelTypeIdentifier {
  /** 原始回答文本 */
  answers: string
  /** 溯源标记列表 */
  traceContent?: ChatTraceItem[]
  /** 实体识别结果（用于 NER 链接化） */
  entity?: ChatEntityRecognize[]
}

/**
 * 格式化 AI 回答内容（完整版）
 *
 * 按顺序执行完整的内容格式化流程：
 * 1. 插入溯源标记（Trace Markers）
 * 2. 插入实体链接（Entity Links）
 * 3. 添加模型类型标识（Model Type）
 *
 * ## 设计文档
 * @see {@link file://../../../../../packages/gel-ui/docs/biz/ai-chat/md-rendering-design.md MD 文本渲染系统设计文档}
 *
 * @author 刘兴华 <xhliu.liuxh@wind.com.cn>
 * @param {FormatAIAnswerParams} params - 格式化参数对象
 * @returns {string} 格式化后的回答文本
 *
 * @example
 * const result = formatAIAnswerFull({
 *   answers: '小米科技有限责任公司成立于2010年',
 *   dpuList: [],
 *   ragList: [],
 *   traceContent: [{
 *     value: '小米科技有限责任公司',
 *     traced: [{ start: 0, end: 10, index: 0 }],
 *   }],
 *   entity: [{
 *     key: '小米科技有限责任公司',
 *     name: '小米科技有限责任公司',
 *     code: '1047934153',
 *     type: 'company'
 *   }],
 * })
 */
export const formatAIAnswerFull = ({
  answers,
  traceContent,
  dpuList,
  ragList,
  entity,
  modelType,
}: FormatAIAnswerParams): string => {
  let tracesContent = answers
  const dpuTableLength = dpuList?.length || 0

  // 步骤1：过滤并插入溯源标记
  if (traceContent && traceContent.length > 0) {
    const filteredTraces = filterTracesByValidSource(traceContent, dpuTableLength, ragList || [])
    tracesContent = insertTraceMarkers(answers, filteredTraces)
  }

  // 步骤2：插入实体 Markdown 链接
  const formattedAnswers = insertEntityMarkdownLinks(tracesContent, entity)

  // 步骤3：添加模型类型标识
  const formattedContent = appendModelTypeInfo(formattedAnswers, modelType)

  return formattedContent
}

/**
 * 格式化 AI 回答内容（仅实体链接）
 *
 * 不插入溯源标记，仅处理：
 * 1. 插入实体链接（Entity Links）
 * 2. 添加模型类型标识
 *
 * 适用场景：
 * - 报告场景：溯源标记由渲染器在文档末尾统一生成
 * - 简化场景：不需要溯源标记的内容展示
 *
 * @param params - 格式化参数对象
 * @returns 格式化后的回答文本（不含溯源标记）
 *
 * @example
 * const params = {
 *   answers: '小米科技有限责任公司成立于2010年',
 *   entity: [
 *     {
 *       key: '小米科技有限责任公司',
 *       name: '小米科技有限责任公司',
 *       code: '1047934153',
 *       type: 'company'
 *     },
 *   ],
 * }
 * const result = formatAIAnswerWithEntities(params)
 * // 返回: '[小米科技有限责任公司](ner:company:1047934153)成立于2010年'
 */
export const formatAIAnswerWithEntities = ({
  answers,
  entity,
}: Pick<FormatAIAnswerParams, 'answers' | 'entity'>): string => {
  // 步骤1：插入实体 Markdown 链接
  const formattedAnswers = insertEntityMarkdownLinks(answers, entity)

  return formattedAnswers
}
