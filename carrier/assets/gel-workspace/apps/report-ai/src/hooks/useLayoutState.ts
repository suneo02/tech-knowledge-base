import { useCallback, useState } from 'react';

/**
 * 布局状态类型
 */
export type LayoutState = 'normal' | 'preview-expanded';

/**
 * 布局状态管理 Hook
 *
 * @description 管理页面布局状态，支持正常布局和预览展开布局
 * @since 1.0.0
 */
export const useLayoutState = () => {
  const [layoutState, setLayoutState] = useState<LayoutState>('normal');

  // 切换到预览展开布局
  const expandForPreview = useCallback(() => {
    setLayoutState('preview-expanded');
  }, []);

  // 恢复到正常布局
  const restoreNormalLayout = useCallback(() => {
    setLayoutState('normal');
  }, []);

  return {
    layoutState,
    expandForPreview,
    restoreNormalLayout,
    isPreviewExpanded: layoutState === 'preview-expanded',
  };
};
