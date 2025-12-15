import { HorizontalTableColProps } from '@/types/table'
import { isEnForRPPrint, t } from '@/utils/lang'
import { ConfigTableCellJsonConfig } from 'gel-types'
import { renderIntegrityInformationPenaltyStatus, reportTableCellCustomSimpleRenderMap } from 'report-util/table'
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

  if (customRenderName) {
    const render = reportTableCellCustomSimpleRenderMap[customRenderName]
    if (render) {
      return {
        ...baseColumn,
        render: (txt, record) =>
          render(txt, record, config, {
            t,
            isEn: isEnForRPPrint(),
          }),
      }
    }
  }

  // 根据不同的自定义渲染名称处理
  switch (customRenderName) {
    case 'announcementShareholderName':
      return {
        ...baseColumn,
        render: (txt, record) => corpInfoAnouncementShareholderNameRender(txt, record),
      }

    case 'bussInfoShareholderName':
      return {
        ...baseColumn,
        render: (txt, record) => corpInfoBussInfoShareholderNameRender(txt, record),
      }
    case 'stockChange':
      return {
        ...baseColumn,
        render: (txt, record) => renderStockChange(txt, config, record),
      }
    case 'bussChangeInfo':
      return {
        ...baseColumn,
        render: (txt, record) => renderBussChangeInfo(txt, record),
      }

    case 'integrityPenaltyStatus':
      return {
        ...baseColumn,
        render: (txt, record) =>
          renderIntegrityInformationPenaltyStatus(txt, record, config, {
            t,
            isEn: isEnForRPPrint(),
          }),
      }

    case 'bussStatus':
      return {
        ...baseColumn,
        render: (txt, record) => corpInfoBussStateRender(txt, record, config),
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
