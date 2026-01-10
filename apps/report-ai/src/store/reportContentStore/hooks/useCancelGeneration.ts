/**
 * 统一的 AIGC 取消 Hook
 *
 * 整合全文生成、多章节生成、单章节生成的取消逻辑
 * 提供统一的取消方法，根据当前操作类型自动调用对应的取消 action
 *
 * @see apps/report-ai/docs/specs/aigc-cancel-feature/spec-core-v1.md
 */

import { useReportDetailContext } from '@/context';
import { useCallback } from 'react';
import { useRPDetailDispatch, useRPDetailSelector } from '../hooksRedux';
import { selectGlobalOperationKind } from '../selectors';
import { rpDetailActions } from '../slice';

export interface UseCancelGenerationReturn {
  /**
   * 取消当前正在进行的生成操作
   * 根据 globalOp.kind 自动判断并调用对应的取消 action
   */
  cancelGeneration: () => void;
}

/**
 * 统一的 AIGC 取消 Hook
 *
 * 职责：
 * - 提供统一的 cancelGeneration 方法
 * - 根据当前操作类型自动调用对应的取消 action
 * - 先中断 SSE 流式请求，再清理 Redux 状态
 *
 * 支持的操作类型：
 * - full_generation: 全文生成
 * - multi_chapter_generation: 多章节顺序生成
 * - chapter_regeneration: 单章节生成
 *
 * @example
 * ```tsx
 * const { cancelGeneration, currentOperationKind } = useCancelGeneration();
 *
 * const handleStopClick = () => {
 *   Modal.confirm({
 *     title: '停止生成',
 *     content: '确定要停止生成吗？',
 *     onOk: () => {
 *       cancelGeneration();
 *       message.success('已停止生成');
 *     },
 *   });
 * };
 * ```
 */
export const useCancelGeneration = (): UseCancelGenerationReturn => {
  const dispatch = useRPDetailDispatch();
  const { cancelRequests, setMsgs } = useReportDetailContext();
  const currentOperationKind = useRPDetailSelector(selectGlobalOperationKind);

  /**
   * 统一的取消方法
   * 根据当前操作类型自动调用对应的取消 action
   */
  const cancelGeneration = useCallback(() => {
    // 1. 先中断 SSE 流式请求
    cancelRequests();

    // 2. 清空 Context 中的消息，避免残留消息干扰后续操作
    setMsgs([]);

    // 3. 根据操作类型清理 Redux 状态
    switch (currentOperationKind) {
      case 'full_generation':
        dispatch(rpDetailActions.cancelFullDocumentGeneration());
        break;

      case 'multi_chapter_generation':
        dispatch(rpDetailActions.cancelMultiChapterGeneration());
        break;

      case 'chapter_regeneration':
        dispatch(rpDetailActions.cancelChapterRegeneration());
        break;

      default:
        // 如果不是生成操作，不执行任何操作
        console.warn('[useCancelGeneration] No active generation operation to cancel');
        break;
    }
  }, [cancelRequests, currentOperationKind, dispatch]);

  return {
    cancelGeneration,
  };
};
