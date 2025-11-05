/**
 * ConfigTable utility functions
 */
import { ReportDetailTableJson } from 'gel-types'
import styles from './index.module.less'

/**
 * 创建表格标题元素
 * @param title - 标题文本
 * @returns 标题元素
 */
export function createTitleElement(title: string): JQuery {
  return $('<div></div>').addClass(styles.configTableTitle).text(title)
}

/**
 * 创建表格容器元素
 * @param className - 可选的额外类名
 * @returns 表格容器元素
 */
export function createTableContainer(className?: string): JQuery {
  const $container = $('<div></div>').addClass(styles.configTableContainer)

  if (className) {
    $container.addClass(className)
  }

  return $container
}

/**
 * 创建配置表格的根元素
 * @returns 根元素
 */
export function createRootElement(): JQuery {
  return $('<div></div>').addClass(styles.configTable)
}

/**
 * 日志辅助函数 - 打印警告
 * @param message - 警告信息
 */
export function logWarning(message: string): void {
  console.warn(`[ConfigTable] ${message}`)
}

/**
 * 日志辅助函数 - 打印错误
 * @param message - 错误信息
 * @param error - 错误对象（可选）
 */
export function logError(message: string, error?: any): void {
  console.error(`[ConfigTable] ${message}`, error)
}

/**
 * 验证配置是否有效
 * @param config - 表格配置
 * @returns 是否有效
 */
export function validateConfig(config: ReportDetailTableJson | null): boolean {
  return !!config && 'columns' in config
}

/**
 * 验证jQuery容器是否有效
 * @param $container - jQuery元素
 * @returns 是否有效
 */
export function validateContainer($container?: JQuery): boolean {
  return !!$container && $container.length > 0
}
