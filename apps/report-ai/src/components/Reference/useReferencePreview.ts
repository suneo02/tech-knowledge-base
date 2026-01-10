import { ReferenceMap } from '@/domain/chat';
import { generateChatRefKey } from '@/domain/chat/ref/referenceUtils';
import { PreviewContentType, RefPreviewData, RefPreviewOptions } from '@/types';
import { useCallback, useState } from 'react';
import { createPreviewDataFromReference } from './utils/previewDataUtils';

/**
 * 引用资料预览 Hook
 *
 * 封装引用资料预览相关的状态管理和逻辑处理
 */
export const useReferencePreview = (
  referenceMap: ReferenceMap,
  onPreviewStart?: (previewData: RefPreviewData) => void,
  onPreviewEnd?: () => void,
  onRagFocus?: (id: string) => void
) => {
  // 预览状态管理
  const [previewMode, setPreviewMode] = useState<'list' | 'preview'>('list');
  const [currentPreviewData, setCurrentPreviewData] = useState<RefPreviewData | null>(null);

  /**
   * 开始预览的回调函数
   */
  const handlePreviewStart = useCallback(
    (previewData: RefPreviewData) => {
      setCurrentPreviewData(previewData);
      setPreviewMode('preview');
      onPreviewStart?.(previewData);
    },
    [onPreviewStart]
  );

  /**
   * 返回列表视图的回调函数
   */
  const handleBackToList = useCallback(() => {
    setPreviewMode('list');
    setCurrentPreviewData(null);
    onPreviewEnd?.();
  }, [onPreviewEnd]);

  /**
   * 根据 ID 和类型预览资料
   * 注意：rag 类型不会进入预览模式，而是触发聚焦行为
   */
  const previewById = useCallback(
    (id: string, type: PreviewContentType, options?: RefPreviewOptions) => {
      // 使用类型安全的 ReferenceMap，必须同时提供 type 和 id
      const rpRef = referenceMap.get(type, id);
      if (!rpRef) {
        console.warn(`[useReferencePreview] 未找到引用资料: type=${type}, id=${id}`);
        return;
      }

      // rag 类型不进入预览模式，而是触发聚焦
      if (type === 'rag') {
        onRagFocus?.(generateChatRefKey(type, id));
        return;
      }

      // file 和 dpu 类型才进入预览模式
      const previewData = createPreviewDataFromReference(rpRef, options);
      handlePreviewStart(previewData);
    },
    [referenceMap, handlePreviewStart, onRagFocus]
  );

  /**
   * 关闭预览
   */
  const closePreview = useCallback(() => {
    handleBackToList();
  }, [handleBackToList]);

  /**
   * 检查是否有预览正在显示
   */
  const isPreviewOpen = useCallback(() => {
    return previewMode === 'preview';
  }, [previewMode]);

  /**
   * 获取当前预览的资料 ID
   */
  const getCurrentPreviewId = useCallback(() => {
    return currentPreviewData?.id || null;
  }, [currentPreviewData]);

  return {
    // 状态
    previewMode,
    currentPreviewData,

    // 核心方法
    handlePreviewStart,
    handleBackToList,

    // 对外接口
    previewById,
    closePreview,
    isPreviewOpen,
    getCurrentPreviewId,
  };
};
