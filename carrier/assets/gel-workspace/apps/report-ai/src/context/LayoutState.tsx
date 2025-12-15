import { createContext, FC, ReactNode, useContext } from 'react';
import { LayoutState, useLayoutState } from '../hooks/useLayoutState';

/**
 * 布局状态上下文类型
 */
interface LayoutStateContextType {
  layoutState: LayoutState;
  expandForPreview: () => void;
  restoreNormalLayout: () => void;
  isPreviewExpanded: boolean;
}

/**
 * 布局状态上下文
 */
const LayoutStateContext = createContext<LayoutStateContextType | null>(null);

/**
 * 布局状态提供者组件属性
 */
interface LayoutStateProviderProps {
  children: ReactNode;
}

/**
 * 布局状态提供者组件
 *
 * @description 为应用提供布局状态管理功能
 * @since 1.0.0
 */
export const LayoutStateProvider: FC<LayoutStateProviderProps> = ({ children }) => {
  const layoutStateHook = useLayoutState();

  return <LayoutStateContext.Provider value={layoutStateHook}>{children}</LayoutStateContext.Provider>;
};

/**
 * 使用布局状态 Hook
 *
 * @description 获取布局状态管理功能
 * @returns 布局状态管理对象
 * @throws 如果在 LayoutStateProvider 外部使用会抛出错误
 */
export const useLayoutStateContext = (): LayoutStateContextType => {
  const context = useContext(LayoutStateContext);
  if (!context) {
    throw new Error('useLayoutStateContext must be used within a LayoutStateProvider');
  }
  return context;
};
