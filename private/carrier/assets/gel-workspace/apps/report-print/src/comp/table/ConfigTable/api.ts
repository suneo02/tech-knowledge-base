import { TableProps } from '@/types/table'

/**
 * 验证API配置是否有效
 *
 * @param tableProps - 表格属性
 * @param apiExecutor - API执行器
 * @returns 是否有效
 */
export function validateApiConfig(tableProps: TableProps | null): boolean {
  return !!(tableProps && tableProps.api)
}
