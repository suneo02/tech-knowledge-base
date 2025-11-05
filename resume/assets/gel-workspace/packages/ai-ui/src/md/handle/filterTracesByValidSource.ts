import { VALITYPE } from '@/constants'
import { ChatTraceResponse } from 'gel-api'

/**
 * 根据有效来源过滤溯源标记数据
 * @param {ChatTraceResponse[]} traces - 原始溯源标记数组
 * @param {number} dpuTableLength - DPU表格长度，用于判断溯源索引是否在DPU表格中
 * @param {any[]} suggest - 参考资料数组，用于判断溯源索引是否在有效的参考资料类型中
 * @returns {Array<{value: string, traced: any[]}>} 过滤后的溯源标记数组，只包含有效来源的溯源标记
 * @example
 * const filteredTraces = filterTracesByValidSource(traces, 2, [{type: 'NEWS'}, {type: 'ANN'}]);
 * // 返回只包含DPU表格和有效类型(NEWS,ANN等)参考资料的溯源标记
 */

export const filterTracesByValidSource = (traces: ChatTraceResponse[], dpuTableLength: number, suggest: any[]) => {
  const tracesRes: ChatTraceResponse[] = []
  traces.forEach((item) => {
    if (item?.value && item?.traced?.length) {
      const itemRes = {
        value: item.value,
        traced: [],
      } as ChatTraceResponse
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

        // 溯源在reg的里
        const type = suggest[index - dpuTableLength].type
        const isValid = VALITYPE.includes(type)
        if (isValid) {
          itemRes.traced.push(traceItem)
        }
      })
      tracesRes.push(itemRes)
    }
  })
  return tracesRes
}
