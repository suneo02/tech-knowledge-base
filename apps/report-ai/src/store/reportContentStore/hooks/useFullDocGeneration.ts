/**
 * 基于Redux的全文生成操作 Hook
 *
 * 专门负责全文生成的操作方法，不包含副作用监听
 * 副作用监听由 useFullDocGenerationController 统一处理
 * 重注水由独立的 Hook 和 Redux reducer 处理
 * 使用 GenerationOrchestrator 管理核心生成逻辑
 *
 * @see {@link ../../../docs/RPDetail/ContentManagement/lifecycle-flow.md | 生命周期与交互控制 - AIGC 生成流程}
 * @see {@link ./rehydration/HYDRATION.md | Hydration 运行手册}
 * @see {@link ./README.md | Hooks 架构说明}
 * @see {@link ./useFullDocGenerationController.ts | 全文生成控制器 Hook}
 * @see {@link ../../../docs/issues/full-doc-generation-duplicate-requests.md | 全文生成重复请求问题}
 */

import { useCallback } from 'react';
import { useRPDetailDispatch, useRPDetailSelector } from '../hooksRedux';

import { selectIsGlobalBusy, selectLeafChapters } from '../selectors';

import { useReportDetailContext } from '@/context';
import { rpDetailActions } from '../slice';

export interface UseFullDocumentGenerationReduxParams {
  /** 生成开始回调 */
  onGenerationStart?: () => void;
}

export interface UseFullDocumentGenerationReduxReturn {
  // 操作方法（包含业务逻辑）
  startGeneration: () => void;
}

/**
 * 全文生成操作 Hook
 *
 * 专注于提供生成操作方法，不包含副作用监听
 * 副作用监听由 useFullDocGenerationController 统一处理
 * 重注水由独立的 Hook 和 Redux reducer 处理
 * 使用 GenerationOrchestrator 管理核心生成逻辑
 *
 * **重要**: 只对叶子节点（没有子章节的章节）进行AI内容生成
 * 父章节只作为结构节点，不生成具体内容
 */
export const useFullDocGeneration = (
  params?: UseFullDocumentGenerationReduxParams
): UseFullDocumentGenerationReduxReturn => {
  const { onGenerationStart } = params || {};

  const dispatch = useRPDetailDispatch();

  const { setMsgs } = useReportDetailContext();

  // 从Redux获取状态
  const leafChapters = useRPDetailSelector(selectLeafChapters);
  const isGlobalBusy = useRPDetailSelector(selectIsGlobalBusy);

  // 注：重注水与合并逻辑由 reducers + useRehydrationOrchestrator 统一处理

  /**
   * 开始全文生成
   */
  const startGeneration = useCallback(() => {
    // 仅在下述状态阻止重复启动；允许 completed/error/interrupted 再次启动
    const blocked = isGlobalBusy;

    if (blocked) {
      console.warn('[FullDocumentGeneration] Generation already in progress');
      return;
    }

    try {
      // 🔑 关键：先清空 Context 中的历史消息，避免 ChatSync 重新同步回来
      // 这样可以防止 useCompletionHandler 重复检测到历史完成消息
      setMsgs([]);

      // 1. 准备章节队列 - 只生成叶子节点（没有子章节的章节）
      if (leafChapters.length === 0) {
        dispatch(rpDetailActions.setFullDocumentGenerationError('No leaf chapters to generate'));
        return;
      }

      const chapterIds = leafChapters.map((chapter) => String(chapter.chapterId));

      // 统一入口：批量锁定章节、清空内容并为每个章节生成 correlationId
      dispatch(
        rpDetailActions.startChapterOperation({
          mode: 'batch',
          chapterIds,
        })
      );
      dispatch(rpDetailActions.startFullDocumentGeneration({ chapterIds }));

      onGenerationStart?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start generation';
      dispatch(rpDetailActions.setFullDocumentGenerationError(errorMessage));
    }
  }, [leafChapters, dispatch, isGlobalBusy, onGenerationStart]);

  return {
    startGeneration,
  };
};
