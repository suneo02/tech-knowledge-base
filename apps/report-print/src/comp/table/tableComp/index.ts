/**
 * tableComp.ts
 * 共享表格组件
 */

import { isEnForRPPrint, t } from '@/utils/lang'
import { ReportDetailCustomNodeJson, ReportDetailTableJson } from 'gel-types'
import { getNoDataLocaleAuto } from 'report-util/constants'
import { configDetailIntlHelper } from 'report-util/corpConfigJson'
import styles from './index.module.less'

/**
 * 创建一个无数据提示组件
 * @param message - 可选的自定义提示消息
 * @param className - 可选的额外CSS类名
 * @returns 无数据提示的jQuery对象
 */
export function createNoDataElement(message: string = '暂无数据', className: string = ''): JQuery {
  const $noData = $('<div></div>')
    .addClass(styles.tableNoData)
    .addClass(className)
    .append($('<span>').addClass(styles.noDataInner).text(message))

  return $noData
}

export function createTableNoDataElement(config: ReportDetailTableJson | ReportDetailCustomNodeJson): JQuery {
  return createNoDataElement(
    getNoDataLocaleAuto(configDetailIntlHelper(config, 'title', t), config?.key, isEnForRPPrint())
  )
}

/**
 * 在表格中创建一个跨列的无数据提示行
 * @param colSpan - 单元格需要跨的列数
 * @param message - 可选的自定义提示消息
 * @returns 包含无数据提示的tr jQuery对象
 */
export function createNoDataRow(colSpan: number, message: string = '暂无数据'): JQuery {
  const $tr = $('<tr></tr>').addClass(styles.noDataRow)
  const $td = $('<td></td>')
    .attr('colspan', colSpan)
    .addClass(styles.noDataCell)
    .html(`<div class="${styles.noDataInner}">${message}</div>`)

  $tr.append($td)
  return $tr
}
