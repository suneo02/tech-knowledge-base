import { ChatTraceItem, RAGItem, RAGType } from 'gel-api'

/**
 * 有效的溯源来源类型列表
 * 用于过滤溯源标记时判断参考资料类型是否有效
 *
 * ## 设计文档
 * @see {@link file://../../../../../packages/gel-ui/docs/biz/ai-chat/md-rendering-design.md MD 文本渲染系统设计文档}
 */
export const VALID_CHAT_SUGGEST_SOURCE_TYPES: RAGType[] = ['RN', 'N', 'R', 'A', 'L', 'YQ']

/**
 * 根据有效来源类型过滤溯源标记数据
 *
 * ## 设计文档
 * @see {@link file://../../../../../packages/gel-ui/docs/biz/ai-chat/md-rendering-design.md MD 文本渲染系统设计文档}
 *
 * 该函数会过滤掉不符合要求的溯源标记，仅保留：
 * 1. 溯源索引在 DPU 表格范围内的标记（index < dpuTableLength）
 * 2. 溯源索引在有效参考资料类型范围内的标记（类型在 VALID_CHAT_SUGGEST_SOURCE_TYPES 中）
 *
 * @author 刘兴华 <xhliu.liuxh@wind.com.cn>
 * @param {ChatTraceItem[]} traces - 原始溯源标记数组，每个元素包含 value 和 traced 信息
 * @param {number} dpuTableLength - DPU 表格的长度，用于判断溯源索引是否在 DPU 表格范围内
 * @param {ChatApiResponseSuggestItem[]} suggest - 参考资料数组，用于验证溯源索引对应的参考资料类型是否有效
 * @returns {ChatTraceItem[]} 过滤后的溯源标记数组，仅包含有效来源的溯源标记
 *
 * @example
 * // 场景：过滤包含 2 个 DPU 表格项和多个参考资料的溯源标记
 * const traces = [
 *   {
 *     value: '营收增长 20%',
 *     traced: [
 *       { index: 0, start: 0, end: 10 },  // DPU 表格内
 *       { index: 3, start: 20, end: 30 }, // 参考资料（假设类型为 NEWS）
 *       { index: 5, start: 40, end: 50 }, // 参考资料（假设类型为无效类型）
 *     ]
 *   }
 * ]
 * const suggest = [
 *   { type: 'NEWS' },  // index 2（= 0 + dpuTableLength）
 *   { type: 'ANN' },   // index 3
 *   { type: 'BK' },    // index 4（无效类型）
 * ]
 * const result = filterTracesByValidSource(traces, 2, suggest)
 * // 返回：只包含 index=0 和 index=3 的溯源标记（index=5 被过滤）
 */
export const filterTracesByValidSource = (
  traces: ChatTraceItem[],
  dpuTableLength: number,
  suggest: RAGItem[]
): ChatTraceItem[] => {
  const tracesRes: ChatTraceItem[] = []
  traces.forEach((item) => {
    if (item?.value && item?.traced?.length) {
      const itemRes: ChatTraceItem = {
        value: item.value,
        traced: [],
      }
      item.traced.forEach((traceItem) => {
        const { index } = traceItem

        // 溯源在dpu表格中
        if (index < dpuTableLength) {
          itemRes.traced.push(traceItem)
          return
        }

        // 溯源不在参考资料里
        if (index >= dpuTableLength + suggest.length) {
          return
        }

        // 溯源在参考资料中，检查类型是否有效
        const type = suggest[index - dpuTableLength].type
        const isValid = VALID_CHAT_SUGGEST_SOURCE_TYPES.includes(type)
        if (isValid) {
          itemRes.traced.push(traceItem)
        }
      })
      tracesRes.push(itemRes)
    }
  })
  return tracesRes
}
