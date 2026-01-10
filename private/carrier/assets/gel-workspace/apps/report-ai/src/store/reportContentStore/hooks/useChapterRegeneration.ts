/**
 * 章节重生成 Hook
 *
 * 负责章节重生成的控制逻辑（包含首次生成和重新生成）
 * 提供方法让外部主动触发生成
 *
 * 注意：章节完成检测由 useCompletionHandler 统一处理，这里只负责触发和 API 调用
 *
 * @see {@link ../../../docs/specs/single-chapter-aigc-implementation/spec-design-v1.md | 单章节 AIGC 方案设计}
 */

import { ChatPresetQuestion } from 'gel-api';
import { useCallback, useEffect, useRef } from 'react';
import { useRPDetailDispatch, useRPDetailSelector } from '../hooksRedux';

import {
  selectChapterRegenerationChapterId,
  selectIsChapterRegenerating,
  selectIsGlobalBusy,
  selectLatestRequestedOperations,
} from '../selectors';

import { useReportDetailContext } from '@/context';
import { rpDetailActions } from '../slice';

export interface UseChapterRegenerationReturn {
  // 操作方法（包含业务逻辑）
  startRegeneration: (chapterId: string) => void;
}

/**
 * 章节重生成控制器 Hook
 *
 * 职责：
 * - 提供 startRegeneration 方法触发生成
 * - 监听状态变化，自动发送 API 请求
 * - 提供取消和重置方法
 *
 * 不负责：
 * - 完成检测（由 useCompletionHandler 处理）
 * - 注水逻辑（由 useRehydrationOrchestrator 处理）
 */
export const useChapterRegeneration = (): UseChapterRegenerationReturn => {
  const { sendRPContentMsg, setMsgs } = useReportDetailContext();
  const dispatch = useRPDetailDispatch();

  // 从Redux获取状态
  const isRegenerating = useRPDetailSelector(selectIsChapterRegenerating);
  const currentChapterId = useRPDetailSelector(selectChapterRegenerationChapterId);
  const isGlobalBusy = useRPDetailSelector(selectIsGlobalBusy);
  const globalOperation = useRPDetailSelector((state) => state.reportContent.globalOp);
  const latestRequestedOperations = useRPDetailSelector(selectLatestRequestedOperations);
  const lastRequestedCorrelationRef = useRef<string | null>(null);

  /**
   * 开始章节重生成
   */
  const startRegeneration = useCallback(
    (chapterId: string) => {
      // 检查是否有其他操作正在进行
      if (isGlobalBusy) {
        return;
      }

      try {
        // 🔑 关键：先清空 Context 中的历史消息，避免 ChatSync 重新同步回来
        // 这样可以防止 useCompletionHandler 重复检测到历史完成消息
        setMsgs([]);
        // 触发共享的章节操作启动逻辑：负责锁定章节、清空 canonical 内容并生成 correlationId
        dispatch(
          rpDetailActions.startChapterOperation({
            mode: 'single',
            chapterIds: [chapterId],
          })
        );
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to start regeneration';

        dispatch(
          rpDetailActions.setChapterRegenerationError({
            code: 'START_FAILED',
            message: errorMessage,
          })
        );
      }
    },
    [dispatch, isGlobalBusy, setMsgs]
  );

  /**
   * 章节处于生成态时触发一次请求：
   * 1. 从 globalOperation.data 获取 correlationId
   * 2. 校验 latestRequestedOperations 中的记录是否准备就绪
   * 3. 发送请求并设置 requested=true，防止重复触发
   *
   * 说明：latestRequestedOperations 会在 reducer 初始化时置 requested=false，
   * 此处通过 lastRequestedCorrelationRef 保证同一 correlationId 仅发送一次。
   */
  useEffect(() => {
    if (!isRegenerating || !currentChapterId) {
      lastRequestedCorrelationRef.current = null;
      return;
    }

    const { data } = globalOperation;
    if (!data || data.type !== 'chapter_regeneration') {
      return;
    }

    const correlationId = data.correlationId;
    const latest = latestRequestedOperations[currentChapterId];

    if (!correlationId) {
      return;
    }

    if (lastRequestedCorrelationRef.current === correlationId) {
      return;
    }

    if (!latest || latest.correlationId !== correlationId || latest.requested) {
      if (!latest || latest.correlationId !== correlationId) {
        // 等待 Redux 对应请求记录创建或更新
        return;
      }
      return;
    }

    // 发送生成请求
    sendRPContentMsg({
      content: ChatPresetQuestion.GENERATE_FULL_TEXT,
      chapterId: currentChapterId,
    });

    lastRequestedCorrelationRef.current = correlationId;

    dispatch(
      rpDetailActions.markChapterOperationRequested({
        chapterId: currentChapterId,
        correlationId,
      })
    );
  }, [dispatch, isRegenerating, currentChapterId, globalOperation, latestRequestedOperations, sendRPContentMsg]);

  /**
   * 章节重生成结束或被取消时清理请求标记，允许后续重新生成。
   * 如果不清理，下一次启动会命中 requested=true 导致请求被静默跳过。
   */
  useEffect(() => {
    if (!isRegenerating && currentChapterId) {
      dispatch(
        rpDetailActions.clearChapterOperationRequest({
          chapterId: currentChapterId,
        })
      );
      lastRequestedCorrelationRef.current = null;
    }
  }, [dispatch, isRegenerating, currentChapterId]);

  return {
    startRegeneration,
  };
};
