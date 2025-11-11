/**
 * 错误处理工具函数
 *
 * @description 提供简洁的错误处理和日志记录功能，复用 lodash 工具
 * @author AI Assistant
 * @since 1.0.0
 */

import { isArray, isEmpty, isObject, isString } from 'lodash-es';

/**
 * 错误处理包装器
 * @param fn - 要包装的函数
 * @param context - 错误上下文信息
 * @returns 包装后的函数
 */
export const withErrorHandling = <T extends any[], R>(fn: (...args: T) => R, context: string) => {
  return (...args: T): R | undefined => {
    try {
      return fn(...args);
    } catch (error) {
      console.error(`Error in ${context}:`, error);
      return undefined;
    }
  };
};

/**
 * 异步错误处理包装器
 * @param fn - 要包装的异步函数
 * @param context - 错误上下文信息
 * @returns 包装后的异步函数
 */
export const withAsyncErrorHandling = <T extends any[], R>(fn: (...args: T) => Promise<R>, context: string) => {
  return async (...args: T): Promise<R | undefined> => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error(`Async error in ${context}:`, error);
      return undefined;
    }
  };
};

/**
 * 守卫函数 - 验证输入参数
 * @param condition - 验证条件
 * @param errorMessage - 错误信息
 * @param context - 上下文信息
 * @returns 是否通过验证
 */
export const guard = (condition: boolean, errorMessage: string, context?: string): boolean => {
  if (!condition) {
    const fullMessage = context ? `${context}: ${errorMessage}` : errorMessage;
    console.error(fullMessage);
    return false;
  }
  return true;
};

/**
 * 参数验证守卫 - 使用 lodash 简化
 * @param params - 参数对象
 * @param requiredFields - 必需字段列表
 * @param context - 上下文信息
 * @returns 是否通过验证
 */
export const guardParams = (params: Record<string, any>, requiredFields: string[], context?: string): boolean => {
  if (!isObject(params)) {
    return guard(false, 'Parameters must be an object', context);
  }

  const missingFields = requiredFields.filter((field) => params[field] === undefined || params[field] === null);

  if (missingFields.length > 0) {
    return guard(false, `Missing required fields: ${missingFields.join(', ')}`, context);
  }

  return true;
};

/**
 * 数组验证守卫 - 使用 lodash 简化
 * @param array - 要验证的数组
 * @param minLength - 最小长度
 * @param context - 上下文信息
 * @returns 是否通过验证
 */
export const guardArray = (array: any[], minLength = 0, context?: string): boolean => {
  if (!isArray(array)) {
    return guard(false, 'Expected an array', context);
  }

  if (array.length < minLength) {
    return guard(false, `Array length ${array.length} < required ${minLength}`, context);
  }

  return true;
};

/**
 * 字符串验证守卫 - 使用 lodash 简化
 * @param value - 要验证的字符串
 * @param minLength - 最小长度
 * @param context - 上下文信息
 * @returns 是否通过验证
 */
export const guardString = (value: string, minLength = 1, context?: string): boolean => {
  if (!isString(value)) {
    return guard(false, 'Expected a string', context);
  }

  if (isEmpty(value.trim()) && minLength > 0) {
    return guard(false, 'String cannot be empty', context);
  }

  if (value.trim().length < minLength) {
    return guard(false, `String length ${value.length} < required ${minLength}`, context);
  }

  return true;
};

/**
 * 对象验证守卫 - 使用 lodash 简化
 * @param obj - 要验证的对象
 * @param context - 上下文信息
 * @returns 是否通过验证
 */
export const guardObject = (obj: any, context?: string): boolean => {
  if (!isObject(obj)) {
    return guard(false, 'Expected an object', context);
  }

  return true;
};

/**
 * 创建带错误处理的 reducer 函数
 * @param reducerFn - reducer 函数
 * @param actionType - action 类型名称
 * @returns 包装后的 reducer 函数
 */
export const createSafeReducer = <S, A>(reducerFn: (state: S, action: A) => void, actionType: string) => {
  return (state: S, action: A): void => {
    try {
      reducerFn(state, action);
    } catch (error) {
      console.error(`Error in reducer ${actionType}:`, error);
      // 不重新抛出错误，保持状态稳定性
    }
  };
};

/**
 * 记录操作日志
 * @param operation - 操作名称
 * @param details - 操作详情
 * @param level - 日志级别
 */
export const logOperation = (
  operation: string,
  details?: any,
  level: 'log' | 'info' | 'warn' | 'error' = 'log'
): void => {
  try {
    const timestamp = new Date().toISOString();
    const message = `[${timestamp}] ${operation}`;

    if (details) {
      console[level](message, details);
    } else {
      console[level](message);
    }
  } catch (error) {
    // 静默失败，避免日志记录本身引起错误
  }
};

// 删除了复杂的性能监控和重试机制，保持简洁
