/**
 * 渲染器模块索引文件
 *
 * 从各个专门的渲染器文件中重新导出所有渲染函数，
 * 使得可以通过此索引文件统一导入所需的渲染函数
 */

import { HorizontalTableColProps } from '@/types/table'
import { isEnForRPPrint, t } from '@/utils/lang'
import { ConfigTableCellJsonConfig } from 'gel-types'
import { reportTableCellSimpleRenderMap } from 'report-util/table'
import { handleConfigTableColCustomRender } from '../custom'
import { parseConfigTableCellTitleConfig } from '../title'
import { renderCaseParty } from './caseParty'
import { renderDateRange } from './dateRenderers'
import { renderImage } from './image'
import { renderText } from './textRenderers'

// 文本渲染器
export * from './textRenderers'

// 日期渲染器
export * from './dateRenderers'

// 货币渲染器
export * from './currencyRenderers'

/**
 * 将 json 配置转换为表格列配置
 *
 * 该 Hook 根据传入的 JSON 配置，生成对应的 HorizontalTableCol 配置
 * 处理各种不同类型字段的渲染逻辑，包括文本、日期、货币、自定义渲染等
 *
 * @param config JSON 配置对象
 * @returns 返回表格列配置对象
 */
export const parseConfigTableCellConfig = (config: ConfigTableCellJsonConfig): HorizontalTableColProps | undefined => {
  try {
    // 处理标题
    const title = parseConfigTableCellTitleConfig(config.title, config.titleIntl, config.titleRenderConfig)

    // 基础表格列配置
    const baseColumn: HorizontalTableColProps = {
      ...config,
      title,
      dataIndex: String(config.dataIndex),
    }

    if (config?.renderConfig) {
      const render = reportTableCellSimpleRenderMap[config.renderType]
      if (render) {
        return {
          ...baseColumn,
          render: (value, record) =>
            render(value, record, config, {
              t,
              isEn: isEnForRPPrint(),
            }),
        }
      }
    }
    // 根据不同的渲染类型处理
    switch (config.renderType) {
      case 'dateRange':
        return {
          ...baseColumn,
          render: (_, record) => renderDateRange(_, record, config),
        }
      case 'image':
        return {
          ...baseColumn,
          render: (txt, record) => renderImage(txt, record, config.renderConfig),
        }
      case 'caseParty':
        return {
          ...baseColumn,
          render: (txt, record) => renderCaseParty(txt, record, config),
        }
      case 'custom':
        return handleConfigTableColCustomRender(baseColumn, config)

      // 如果没有指定渲染类型，默认为普通文本
      default:
        return {
          ...baseColumn,
          render: (txt, record) => renderText(txt, record, config),
        }
    }
  } catch (e) {
    console.error('parseConfigTableCellConfig error:', e)
  }
}
