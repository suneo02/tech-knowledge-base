import { ConfigTableCellJsonConfig } from 'gel-types'
import { isEn } from 'gel-util/intl'
import { reportTableCellCustomSimpleRenderMap } from 'report-util/table'
import { HorizontalTableColProps } from '../../../../types/table'
import { tForRPPreview } from '../../../../utils'
import { renderText } from '../renderers'
import { renderBussChangeInfo } from './bussChangeInfo'
import { corpInfoBussStateRender } from './bussState'
import { corpInfoAnouncementShareholderNameRender } from './corpInfoAnnounceShareholderName'
import { corpInfoBussInfoShareholderNameRender } from './corpInfoBussInfoShareholderName'
import { renderHKUsedNames } from './hkUsedNames'
import { renderOverseasAlias } from './overseasAlias'
import { renderStockChange } from './stockChange'

/**
 * 处理自定义渲染类型
 *
 * @param baseColumn 基础列配置
 * @param config 行配置
 * @returns 处理后的列配置
 */
export function handleConfigTableColCustomRender(
  baseColumn: HorizontalTableColProps,
  config: ConfigTableCellJsonConfig
): HorizontalTableColProps {
  const { renderConfig } = config
  const customRenderName = renderConfig?.customRenderName

  const render = customRenderName ? reportTableCellCustomSimpleRenderMap[customRenderName] : undefined
  if (render) {
    return {
      ...baseColumn,
      render: (txt, record) =>
        render(txt, record, config, {
          t: tForRPPreview,
          isEn: isEn(),
        }),
    }
  }
  // 根据不同的自定义渲染名称处理
  switch (customRenderName) {
    case 'announcementShareholderName':
      return {
        ...baseColumn,
        render: (txt, record) => corpInfoAnouncementShareholderNameRender(txt, record, config),
      }

    case 'bussInfoShareholderName':
      return {
        ...baseColumn,
        render: (txt, record) => corpInfoBussInfoShareholderNameRender(txt, record, config),
      }
    case 'stockChange':
      return {
        ...baseColumn,
        render: (txt, record) => renderStockChange(txt, config.renderConfig, record),
      }
    case 'bussStatus':
      return {
        ...baseColumn,
        render: (txt, record) => corpInfoBussStateRender(txt, record, config),
      }
    case 'bussChangeInfo':
      return {
        ...baseColumn,
        render: (_txt, record) => renderBussChangeInfo(record),
      }
    case 'hkUsedNames':
      return {
        ...baseColumn,
        render: (txt) => renderHKUsedNames(txt),
      }
    case 'overseasAlias':
      return {
        ...baseColumn,
        render: (txt) => renderOverseasAlias(txt),
      }
    // 可以根据需要添加更多自定义渲染类型
    default:
      // 没有匹配的自定义渲染名称，返回默认渲染
      console.warn(`Unknown customRenderName: ${customRenderName}, using default renderer`, baseColumn, config)
      return {
        ...baseColumn,
        render: (txt, record) => renderText(txt, record, config),
      }
  }
}
