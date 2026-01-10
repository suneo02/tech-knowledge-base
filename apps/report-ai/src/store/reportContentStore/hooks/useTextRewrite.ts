/**
 * 文本改写控制 Hook
 *
 * 基于 Redux 的文本改写控制逻辑
 * Hook 只负责封装方法，状态存储在 Redux 中
 *
 * @see apps/report-ai/docs/specs/text-ai-rewrite-implementation/spec-implementation-v1.md
 * @see apps/report-ai/src/store/reportContentStore/hooks/useChapterRegeneration.ts - 参考实现
 */

import { useReportDetailContext } from '@/context';
import { buildRewriteContent } from '@/domain/chat/aiTask';
import { generateTextRewriteCorrelationId } from '@/domain/chat/correlation';
import type { AIActionData, AIInvokeFunction } from '@/types/editor';
import { useCallback, useRef } from 'react';
import { useRPDetailDispatch, useRPDetailSelector } from '../hooksRedux';
import { selectIsTextRewriting, selectTextRewriteCorrelationId } from '../selectors';
import { rpDetailActions } from '../slice';

/**
 * Hook 配置选项
 */
export interface UseTextRewriteOptions {
  /** AI 操作调用函数 */
  onAIInvoke: AIInvokeFunction;
}

/**
 * Hook 返回值
 */
export interface UseTextRewriteReturn {
  /** 开始改写（包含验证、构建请求等业务逻辑） */
  startRewrite: (data: AIActionData) => void;
  /** 确认应用改写结果（包含状态标记逻辑） */
  confirmRewrite: () => void;
  /** 拒绝改写结果（包含状态标记逻辑） */
  rejectRewrite: () => void;
}

/**
 * 文本改写控制 Hook
 *
 * 职责：
 * - 提供 startRewrite 方法触发改写
 * - 监听消息流，自动检测完成
 * - 提供取消和重置方法
 *
 * 不负责：
 * - 状态管理（由 Redux 处理）
 * - 流式预览（由 useTextRewritePreview 处理）
 * - 内容替换（由调用方处理）
 *
 * @example
 * ```tsx
 * const { startRewrite, cancelRewrite } = useTextRewrite({
 *   onAIInvoke,
 * });
 *
 * // 在 onAIAction 回调中使用
 * const handleAIAction = (data: AIActionData) => {
 *   startRewrite(data);
 * };
 * ```
 */
export function useTextRewrite(): UseTextRewriteReturn {
  const { sendRPContentMsg, setMsgs } = useReportDetailContext();

  const dispatch = useRPDetailDispatch();

  // 从 Redux 获取状态
  const isRewriting = useRPDetailSelector(selectIsTextRewriting);
  const correlationId = useRPDetailSelector(selectTextRewriteCorrelationId);

  // 防重复请求标记
  const requestedRef = useRef<string | null>(null);

  // 完成检测标记（避免重复检测）
  const completedCorrelationsRef = useRef<Set<string>>(new Set());

  /**
   * 开始文本改写
   */
  const startRewrite = useCallback(
    (data: AIActionData) => {
      // 检查是否已经在改写中
      if (isRewriting) {
        return;
      }

      try {
        // 🔑 关键：先清空 Context 中的历史消息，避免 ChatSync 重新同步回来
        // 这样可以防止 useCompletionHandler 重复检测到历史完成消息
        setMsgs([]);
        const { actionType, snapshot, chapterId } = data;

        // 生成 correlationId
        const newCorrelationId = generateTextRewriteCorrelationId();

        // 更新 Redux 状态
        dispatch(
          rpDetailActions.startTextRewrite({
            snapshot,
            correlationId: newCorrelationId,
            chapterId: chapterId || '',
            taskType: actionType,
          })
        );

        // 构造请求内容：预设问题 + 实际文本
        const content = buildRewriteContent(actionType, snapshot);

        // 调用 AI 操作
        sendRPContentMsg({ content, chapterId });

        requestedRef.current = newCorrelationId;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to start rewrite';

        dispatch(
          rpDetailActions.failTextRewrite({
            code: 'START_FAILED',
            message: errorMessage,
          })
        );
      }
    },
    [isRewriting, sendRPContentMsg, dispatch]
  );

  /**
   * 确认应用改写结果
   * 在 AIGC 完成后，用户点击"应用"按钮时调用
   *
   * 包含业务逻辑：
   * - 标记 correlationId 已处理，避免重复操作
   * - 清理请求标记
   * - 重置状态
   *
   * 注意：调用方应该在调用此方法前先完成内容替换
   */
  const confirmRewrite = useCallback(() => {
    if (!isRewriting) {
      return;
    }

    // 标记当前 correlationId 已处理，避免重复操作
    if (correlationId) {
      completedCorrelationsRef.current.add(correlationId);
    }

    // 重置状态，结束整个 operation
    dispatch(rpDetailActions.resetTextRewrite());
    requestedRef.current = null;
  }, [isRewriting, correlationId, dispatch]);

  /**
   * 拒绝改写结果
   * 在 AIGC 完成后，用户点击"取消"按钮时调用
   *
   * 包含业务逻辑：
   * - 标记 correlationId 已处理，避免重复操作
   * - 清理请求标记
   * - 重置状态（不执行内容替换）
   */
  const rejectRewrite = useCallback(() => {
    if (!isRewriting) {
      return;
    }

    // 标记当前 correlationId 已处理，避免重复操作
    if (correlationId) {
      completedCorrelationsRef.current.add(correlationId);
    }

    // 重置状态，结束整个 operation（不执行内容替换）
    dispatch(rpDetailActions.resetTextRewrite());
    requestedRef.current = null;
  }, [isRewriting, correlationId, dispatch]);

  /**
   * 注意：不需要监听消息流来调用 completeTextRewrite
   *
   * 完成状态通过 selectTextRewriteIsCompleted 衍生得出，
   * 该 selector 会检查消息中的完成信号。
   *
   * 只有用户点击 apply 或 reject 时才真正结束流程。
   *
   * @see apps/report-ai/src/store/reportContentStore/selectors/textRewrite.ts - selectTextRewriteIsCompleted
   */

  return {
    startRewrite,
    confirmRewrite,
    rejectRewrite,
  };
}
