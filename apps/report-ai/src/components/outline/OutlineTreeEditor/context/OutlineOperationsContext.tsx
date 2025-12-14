/**
 * OutlineOperations Context - 大纲编辑器业务操作管理
 *
 * @description 提供大纲编辑器的业务操作 Context，包含所有异步操作方法
 * 与状态管理 Context 分离，实现关注点分离和更好的性能
 */

import React, { createContext, useContext } from 'react';
import { useOutlineOperations } from '../hooks';
import { UseOutlineOperationsOptions, UseOutlineOperationsReturn } from '../types/hook';

/**
 * 扩展的操作返回值
 */
export interface ExtendedOperationsReturn extends UseOutlineOperationsReturn {
  // 暂时保持空接口，未来可能添加其他扩展
}

/**
 * 大纲编辑器操作 Context
 */
const OutlineOperationsContext = createContext<ExtendedOperationsReturn | null>(null);

/**
 * OutlineOperations Provider Props
 */
export interface OutlineOperationsProviderProps {
  /** 子组件 */
  children: React.ReactNode;
  /** 操作配置选项 */
  options?: UseOutlineOperationsOptions;
}

/**
 * OutlineOperations Provider 组件
 *
 * @description 提供大纲编辑器业务操作的 Context Provider
 * 在这里创建一次 operations 实例，避免重复创建
 */
export const OutlineOperationsProvider: React.FC<OutlineOperationsProviderProps> = ({ children, options = {} }) => {
  // 在顶层创建一次操作实例，实现单例模式
  const operations = useOutlineOperations(options);

  // 直接使用操作实例作为扩展操作
  const extendedOperations: ExtendedOperationsReturn = {
    ...operations,
  };

  return <OutlineOperationsContext.Provider value={extendedOperations}>{children}</OutlineOperationsContext.Provider>;
};

/**
 * 使用大纲编辑器操作的 Hook
 *
 * @description 获取大纲编辑器的所有业务操作函数
 * 必须在 OutlineOperationsProvider 内部使用
 *
 * @returns 大纲操作函数集合
 * @throws 如果在 OutlineOperationsProvider 外部使用会抛出错误
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const { rename, updateThought, insertAfter } = useOutlineOperations()
 *
 *   const handleRename = async () => {
 *     await rename([0], 'New Title')
 *   }
 *
 *   return (
 *     <button onClick={handleRename}>
 *       Rename Chapter
 *     </button>
 *   )
 * }
 * ```
 */
export const useOutlineOperationsContext = (): ExtendedOperationsReturn => {
  const operations = useContext(OutlineOperationsContext);

  if (!operations) {
    throw new Error('useOutlineOperationsContext must be used within OutlineOperationsProvider');
  }

  return operations;
};
