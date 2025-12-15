import { applyIdMapToChapters } from '@/domain/chapter';
import { useSaveController } from '@/hooks/useSaveController';
import { message } from '@wind/wind-ui';
import { useCallback, useEffect, useRef } from 'react';
import { OutlineAction, useOutlineDispatch, useOutlineState } from '../context';
import {
  executeOutlineEditAction,
  type OutlineEditAction,
  type SaveOutlineFn,
  type SaveOutlineResponse,
} from '../core';
import { SaveMode } from '../types/hook';

interface UseOutlinePersistenceOptions {
  saveImpl: SaveOutlineFn;
  autoSave?: {
    debounceMs?: number;
    minIntervalMs?: number;
  };
}

interface OptimisticOptions<A extends OutlineEditAction> {
  mode?: SaveMode;
  afterSuccess?: (executedAction: A, idMap?: Record<string, string>) => void | Promise<void>;
}

export interface OutlinePersistenceHelpers {
  persistOutline: (mode?: SaveMode) => Promise<SaveOutlineResponse>;
  applyOptimisticAction: <A extends OutlineEditAction>(
    createAction: () => A,
    options?: OptimisticOptions<A>
  ) => Promise<A>;
  saving: boolean;
  hasUnsaved: boolean;
  lastSavedAt?: number;
  lastError: string | null;
  markUnsaved: () => void;
  requestManualSave: <T>(executor: () => Promise<T>) => Promise<T>;
  requestAutoSave: <T>(executor: () => Promise<T>) => Promise<T>;
  requestImmediateSave: <T>(executor: () => Promise<T>) => Promise<T>;
}

export function useOutlinePersistence({ saveImpl, autoSave }: UseOutlinePersistenceOptions): OutlinePersistenceHelpers {
  /**
   * OutlineStore 提供最新的树形数据；该 hook 会在保存前做一次快照，确保
   * 乐观更新与真实请求 payload 一致。
   */
  const state = useOutlineState();
  const dispatch = useOutlineDispatch();

  const latestOutlineRef = useRef(state.data);
  useEffect(() => {
    latestOutlineRef.current = state.data;
  }, [state.data]);

  /**
   * SaveController 负责单并发、自动保存节流、错误状态等通用行为。这里直接
   * 在持久化层内部创建实例，向外暴露最小必需的状态和触发入口。
   */
  const controller = useSaveController({
    onSavingChange: (saving) => {
      dispatch({ type: saving ? OutlineAction.START_SYNC : OutlineAction.FINISH_SYNC, payload: saving });
    },
    onError: (errorMessage) => {
      if (errorMessage) {
        message.error(errorMessage);
      }
    },
    autoSave: {
      debounceMs: autoSave?.debounceMs ?? 1000,
      minIntervalMs: autoSave?.minIntervalMs ?? 1000,
    },
  });

  const persistOutline = useCallback(
    async (mode: SaveMode = 'manual') => {
      controller.markUnsaved();
      const snapshot = latestOutlineRef.current;

      const executor = async () => {
        // 保存 API 返回成功/失败和 idMap（临时 ID 映射）
        const response = await saveImpl(snapshot);
        if (!response.success) {
          throw new Error(response.error || 'Save outline failed');
        }

        // 如果后端返回了 idMap，应用到章节树中（将临时 ID 替换为正式 ID）
        if (response.idMap && Object.keys(response.idMap).length > 0) {
          const updatedChapters = applyIdMapToChapters(snapshot.chapters, response.idMap);
          const updatedData = { ...snapshot, chapters: updatedChapters };

          // 更新本地快照和状态
          latestOutlineRef.current = updatedData;
          dispatch({ type: OutlineAction.LOAD_OUTLINE, payload: updatedData });

          console.log('[useOutlinePersistence] 应用 ID 映射:', {
            idMap: response.idMap,
            mappedCount: Object.keys(response.idMap).length,
          });
        }

        return response;
      };

      switch (mode) {
        case 'auto':
          return controller.requestAutoSave(executor);
        case 'immediate':
          return controller.requestImmediateSave(executor);
        default:
          return controller.requestManualSave(executor);
      }
    },
    [controller, saveImpl, dispatch]
  );

  const applyOptimisticAction = useCallback(
    async <A extends OutlineEditAction>(createAction: () => A, options?: OptimisticOptions<A>): Promise<A> => {
      // 1. 在执行前记录旧快照，方便失败时回滚。
      const previous = latestOutlineRef.current;
      const action = createAction();
      const { data: optimisticData, action: executed } = executeOutlineEditAction(previous, action);

      latestOutlineRef.current = optimisticData;
      dispatch({ type: OutlineAction.LOAD_OUTLINE, payload: optimisticData });

      try {
        // 2. 根据触发模式串行调用保存；成功后执行额外回调（如 AI 思路生成）。
        const saveResponse = await persistOutline(options?.mode);
        if (options?.afterSuccess) {
          // 传递 idMap 给 afterSuccess,以便使用真实 ID
          await options.afterSuccess(executed as A, saveResponse.idMap);
        }
        return executed as A;
      } catch (error) {
        // 3. 保存失败则恢复旧快照，保持界面一致性。
        latestOutlineRef.current = previous;
        dispatch({ type: OutlineAction.LOAD_OUTLINE, payload: previous });
        throw error;
      }
    },
    [dispatch, persistOutline]
  );

  return {
    persistOutline,
    applyOptimisticAction,
    saving: controller.saving,
    hasUnsaved: controller.hasUnsaved,
    lastSavedAt: controller.lastSavedAt,
    lastError: controller.lastError,
    markUnsaved: controller.markUnsaved,
    requestManualSave: controller.requestManualSave,
    requestAutoSave: controller.requestAutoSave,
    requestImmediateSave: controller.requestImmediateSave,
  };
}
