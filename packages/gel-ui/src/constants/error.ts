/**
 * 错误常量定义
 * 用于避免在代码中使用魔法值
 */

/**
 * DOMException 错误名称常量
 * 参考：https://developer.mozilla.org/en-US/docs/Web/API/DOMException
 */
export const DOM_EXCEPTION_NAMES = {
  /** 请求被中止 */
  ABORT_ERROR: 'AbortError',
  /** 请求被取消 */
  CANCELED_ERROR: 'CanceledError',
  /** 数据克隆错误 */
  DATA_CLONE_ERROR: 'DataCloneError',
  /** DOM 字符串大小错误 */
  DOM_STRING_SIZE_ERROR: 'DOMStringSizeError',
  /** 层次结构请求错误 */
  HIERARCHY_REQUEST_ERROR: 'HierarchyRequestError',
  /** 索引大小错误 */
  INDEX_SIZE_ERROR: 'IndexSizeError',
  /** 无效访问错误 */
  INVALID_ACCESS_ERROR: 'InvalidAccessError',
  /** 无效字符错误 */
  INVALID_CHARACTER_DATA_ERROR: 'InvalidCharacterDataError',
  /** 无效修改错误 */
  INVALID_MODIFICATION_ERROR: 'InvalidModificationError',
  /** 无效节点类型错误 */
  INVALID_NODE_TYPE_ERROR: 'InvalidNodeTypeError',
  /** 无效状态错误 */
  INVALID_STATE_ERROR: 'InvalidStateError',
  /** 命名空间错误 */
  NAMESPACE_ERROR: 'NamespaceError',
  /** 网络错误 */
  NETWORK_ERROR: 'NetworkError',
  /** 不支持错误 */
  NOT_SUPPORTED_ERROR: 'NotSupportedError',
  /** 无数据允许错误 */
  NO_DATA_ALLOWED_ERROR: 'NoDataAllowedError',
  /** 无修改允许错误 */
  NO_MODIFICATION_ALLOWED_ERROR: 'NoModificationAllowedError',
  /** 未找到错误 */
  NOT_FOUND_ERROR: 'NotFoundError',
  /** 配额超出错误 */
  QUOTA_EXCEEDED_ERROR: 'QuotaExceededError',
  /** 读取错误 */
  READ_ONLY_ERROR: 'ReadOnlyError',
  /** 安全错误 */
  SECURITY_ERROR: 'SecurityError',
  /** 语法错误 */
  SYNTAX_ERROR: 'SyntaxError',
  /** 类型不匹配错误 */
  TYPE_MISMATCH_ERROR: 'TypeMismatchError',
  /** URL 不匹配错误 */
  URL_MISMATCH_ERROR: 'URLMismatchError',
  /** 验证错误 */
  VALIDATION_ERROR: 'ValidationError',
  /** 错误 */
  WRONG_DOCUMENT_ERROR: 'WrongDocumentError',
} as const

/**
 * 检查错误是否为中止错误
 * @param error 错误对象
 * @returns 是否为中止错误
 */
export const isAbortError = (error: unknown): boolean => {
  return error instanceof Error && error.name === DOM_EXCEPTION_NAMES.ABORT_ERROR
}

/**
 * 检查错误是否为取消错误
 * @param error 错误对象
 * @returns 是否为取消错误
 */
export const isCanceledError = (error: unknown): boolean => {
  return error instanceof Error && error.name === DOM_EXCEPTION_NAMES.CANCELED_ERROR
}
