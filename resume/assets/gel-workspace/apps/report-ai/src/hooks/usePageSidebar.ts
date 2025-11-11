import { useEffect } from 'react';
import { setSidebarCollapsed, useAppDispatch } from '../store';

/**
 * 页面级别的侧边栏控制 Hook
 *
 * @param collapsed - 是否收起侧边栏
 * @param restoreOnUnmount - 组件卸载时是否恢复默认状态，默认为 true
 */
export const usePageSidebar = (collapsed: boolean, restoreOnUnmount: boolean = true) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setSidebarCollapsed(collapsed));
  }, [dispatch, collapsed]);

  useEffect(() => {
    if (!restoreOnUnmount) return;

    return () => {
      // 组件卸载时恢复默认状态（展开）
      dispatch(setSidebarCollapsed(false));
    };
  }, [dispatch, restoreOnUnmount]);
};

/**
 * 便捷的侧边栏控制函数
 */
export const useCollapsedSidebar = (restoreOnUnmount: boolean = true) => {
  return usePageSidebar(true, restoreOnUnmount);
};

export const useExpandedSidebar = (restoreOnUnmount: boolean = true) => {
  return usePageSidebar(false, restoreOnUnmount);
};
