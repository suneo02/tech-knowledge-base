/**
 * HTTP 请求方法枚举
 * 支持 GET、POST、PUT、DELETE、PATCH 五种标准 HTTP 方法
 */
export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

/**
 * HTTP 请求方法的小写形式
 * 通过 TypeScript 的 Lowercase 工具类型将 RequestMethod 转换为小写
 */
export type LowercaseRequestMethod = Lowercase<RequestMethod>
