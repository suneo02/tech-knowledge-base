import { MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * 保存触发模式。
 *
 * 我们只关心触发来源的语义差异，以便在上层埋点或提示时区分：
 * - `manual`：用户主动发起的保存，例如点击按钮、快捷键。
 * - `auto`：系统自动触发的保存，通常伴随去抖与最小间隔控制。
 * - `immediate`：需要马上执行的保存，不参与自动节流（例如页面关闭前的兜底保存）。
 */
type SaveMode = 'manual' | 'auto' | 'immediate';

/**
 * 手动/立即保存的排队任务结构。
 *
 * 保存控制器只允许一次网络请求在途。当处理保存的过程中又有新的保存需求时，
 * 会把请求塞到 queue 中，待当前请求结束后在下一微任务中继续执行。
 */
interface QueueItem {
  executor: () => Promise<unknown>;
  mode: SaveMode;
  resolve: (value: unknown) => void;
  reject: (error: unknown) => void;
}

/**
 * 自动保存待执行的函数及其等待者。
 *
 * 自动保存阶段只需要记住“最新一次的执行逻辑”和“所有等待该逻辑完成的调用方”，
 * 因此使用单个 executor + waiter 列表即可。
 */
interface AutoPendingState<T = unknown> {
  executor: (() => Promise<T>) | null;
  waiters: Array<{ resolve: (value: T | PromiseLike<T>) => void; reject: (error: unknown) => void }>;
}

interface DebouncedTrigger {
  schedule: (callback: () => void) => void;
  cancel: () => void;
}

/**
 * 创建带去抖 + 最小间隔能力的触发器。
 *
 * @param debounceMs       去抖时长，用户持续输入时会不断推迟触发。
 * @param minIntervalMs    两次真正触发之间的最小间隔，避免过于频繁请求。
 * @param lastTriggeredRef 由调用方提供的 `ref`，记录最近一次真实触发的时间戳。
 * @param timerRef          外部持有的定时器 `ref`，方便跨调用/卸载时清理。
 */
function createDebouncedTrigger(
  debounceMs: number,
  minIntervalMs: number,
  lastTriggeredRef: MutableRefObject<number | null>,
  timerRef: MutableRefObject<ReturnType<typeof setTimeout> | null>
): DebouncedTrigger {
  const cancel = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const schedule = (callback: () => void) => {
    // 内部函数：在满足最小间隔后执行回调。
    const ensureInterval = () => {
      const lastTriggered = lastTriggeredRef.current;
      if (minIntervalMs > 0 && lastTriggered) {
        const delta = lastTriggered + minIntervalMs - Date.now();
        if (delta > 0) {
          timerRef.current = setTimeout(ensureInterval, delta);
          return;
        }
      }

      timerRef.current = null;
      callback();
    };

    cancel();

    // 先应用去抖延迟，去抖完成后再检查最小间隔。
    if (debounceMs > 0) {
      timerRef.current = setTimeout(ensureInterval, debounceMs);
    } else {
      ensureInterval();
    }
  };

  return { schedule, cancel };
}

/**
 * useSaveController 配置项。
 *
 * 只暴露最小配置：提供“保存状态变化”回调，以及自动保存的去抖/最小间隔参数。
 */
export interface UseSaveControllerOptions {
  /**
   * 保存状态变化回调
   * @param saving 当前是否处于保存中
   * @param mode 触发保存的模式
   */
  onSavingChange?: (saving: boolean, mode: SaveMode) => void;

  /**
   * 保存失败时的回调，便于调用方统一弹出提示。
   */
  onError?: (errorMessage: string, mode: SaveMode) => void;

  /** 自动保存策略，可选 */
  autoSave?: {
    /** 用户停止输入后的延迟（ms），默认 0 */
    debounceMs?: number;
    /** 两次自动保存之间的最小间隔（ms），默认 0 表示不限制 */
    minIntervalMs?: number;
  };
}

/**
 * useSaveController 返回结果。
 *
 * 其中 `request*` 方法全部返回 Promise，方便调用方在完成后做额外处理
 * （例如提示用户、刷新快照）。所有方法都会保证单并发串行化。
 */
export interface UseSaveControllerResult {
  /** 当前是否有在途保存 */
  saving: boolean;
  /** 是否存在未保存变更 */
  hasUnsaved: boolean;
  /** 最近一次保存成功时间戳 */
  lastSavedAt?: number;
  /** 最近一次保存错误信息 */
  lastError: string | null;
  /** 手动标记为未保存，用于本地变更 */
  markUnsaved: () => void;
  /** 手动保存入口（按钮/快捷键） */
  requestManualSave: <T>(executor: () => Promise<T>) => Promise<T>;
  /** 自动保存入口（去抖/节流后触发） */
  requestAutoSave: <T>(executor: () => Promise<T>) => Promise<T>;
  /** 立即保存入口（无节流） */
  requestImmediateSave: <T>(executor: () => Promise<T>) => Promise<T>;
}

/**
 * 将未知错误统一转换成字符串，便于 UI 显示。
 */
const extractErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  try {
    return JSON.stringify(error);
  } catch (jsonError) {
    return '未知错误';
  }
};

/**
 * 通用保存控制器。
 *
 * 职责概览：
 * 1. **状态管理**：维护 `saving`、`hasUnsaved`、`lastSavedAt`、`lastError` 等核心状态。
 * 2. **单并发串行**：无论何种触发来源，只允许一个保存请求在途，其余请求排队尾随。
 * 3. **自动保存仲裁**：封装去抖与最小间隔逻辑，自动保存的调用方无需重复实现。
 */
export function useSaveController(options: UseSaveControllerOptions = {}): UseSaveControllerResult {
  const { onSavingChange, onError } = options;
  const autoDebounceMs = options.autoSave?.debounceMs ?? 0;
  const autoMinIntervalMs = options.autoSave?.minIntervalMs ?? 0;

  const savingRef = useRef(false);
  const [saving, setSaving] = useState(false);
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<number | undefined>(undefined);
  const [lastError, setLastError] = useState<string | null>(null);

  // 手动/立即保存的排队任务。
  const queueRef = useRef<QueueItem | null>(null);
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastAutoSaveAtRef = useRef<number | null>(null);
  const autoPendingRef = useRef<AutoPendingState>({ executor: null, waiters: [] });

  const debouncedTrigger = useMemo(
    () => createDebouncedTrigger(autoDebounceMs, autoMinIntervalMs, lastAutoSaveAtRef, autoTimerRef),
    [autoDebounceMs, autoMinIntervalMs]
  );

  /**
   * 执行保存请求。
   *
   * 包含几个关键步骤：
   * 1. 标记为保存中并回调 onSavingChange。
   * 2. 真正执行调用方提供的保存逻辑。
   * 3. 捕获异常，记录错误信息并保持未保存状态。
   * 4. 请求结束后检查是否有排队任务，有则在下一微任务继续执行。
   */
  const runExecutor = useCallback(
    async <T>(mode: SaveMode, executor: () => Promise<T>): Promise<T> => {
      savingRef.current = true;
      setSaving(true);
      onSavingChange?.(true, mode);
      setLastError(null);

      let didError = false;
      try {
        const result = await executor();
        setLastSavedAt(Date.now());
        return result;
      } catch (error) {
        didError = true;
        const message = extractErrorMessage(error);
        setLastError(message);
        setHasUnsaved(true);
        onError?.(message, mode);
        throw error;
      } finally {
        savingRef.current = false;
        setSaving(false);
        onSavingChange?.(false, mode);

        const queued = queueRef.current;
        if (queued) {
          // 在下一微任务中执行排队保存，保持调用方的 Promise 链条。
          queueRef.current = null;
          Promise.resolve()
            .then(() => runExecutor<unknown>(queued.mode, queued.executor as () => Promise<unknown>))
            .then((value) => queued.resolve(value))
            .catch(queued.reject);
        } else if (!didError) {
          // 成功且没有排队任务时，可以安全清除“未保存”标记。
          setHasUnsaved(false);
        }
      }
    },
    [onSavingChange]
  );

  /**
   * 根据触发模式执行保存。
   *
   * 若当前已有请求在途，则将新的请求加入 queue，待前一次请求完成后执行；
   * 否则直接调用 `runExecutor`。
   */
  const requestSave = useCallback(
    <T>(mode: SaveMode, executor: () => Promise<T>): Promise<T> => {
      setHasUnsaved(true);

      if (savingRef.current) {
        return new Promise<T>((resolve, reject) => {
          queueRef.current = {
            executor: executor as () => Promise<unknown>,
            mode,
            resolve: resolve as (value: unknown) => void,
            reject,
          };
        });
      }

      return runExecutor(mode, executor);
    },
    [runExecutor]
  );

  /**
   * 启动或重置自动保存定时器。
   *
   * - 自动保存的请求会被折叠成 *单个* executor，等待用户输入稳定后统一提交。
   * - `debounceMs` 用于吸收持续输入，`minIntervalMs` 用于限制连续自动保存的频率。
   * - 所有等待者共用同一次执行结果，避免重复请求。
   */
  const scheduleAutoExecution = useCallback(() => {
    debouncedTrigger.schedule(() => {
      const pending = autoPendingRef.current;
      if (!pending.executor) {
        return;
      }

      const executor = pending.executor;
      const waiters = pending.waiters.slice();
      autoPendingRef.current = { executor: null, waiters: [] };

      requestSave('auto', executor)
        .then((result) => {
          lastAutoSaveAtRef.current = Date.now();
          waiters.forEach((w) => w.resolve(result));
        })
        .catch((error) => {
          lastAutoSaveAtRef.current = Date.now();
          waiters.forEach((w) => w.reject(error));
        });
    });
  }, [debouncedTrigger, requestSave]);

  /**
   * 自动保存入口。
   *
   * 允许多次调用，最终会折叠成“最近一次 executor”并在合适的时机统一执行，
   * 所有等待者共享同一 Promise 结果。
   */
  const requestAutoSave = useCallback(
    <T>(executor: () => Promise<T>): Promise<T> => {
      setHasUnsaved(true);

      return new Promise<T>((resolve, reject) => {
        const pending = autoPendingRef.current as AutoPendingState<T>;
        pending.executor = executor;
        pending.waiters.push({ resolve, reject });
        scheduleAutoExecution();
      });
    },
    [scheduleAutoExecution]
  );

  /**
   * 手动标记“未保存”状态，常用于本地编辑行为。
   */
  const markUnsaved = useCallback(() => {
    setHasUnsaved(true);
  }, []);

  // 组件卸载或配置变化时清理自动保存定时器，防止悬挂。
  useEffect(() => {
    return () => {
      debouncedTrigger.cancel();
    };
  }, [debouncedTrigger]);

  /**
   * 返回保存控制器的只读状态与触发入口。
   */
  return useMemo(
    () => ({
      saving,
      hasUnsaved,
      lastSavedAt,
      lastError,
      markUnsaved,
      requestManualSave: <T>(executor: () => Promise<T>) => requestSave('manual', executor),
      requestAutoSave,
      requestImmediateSave: <T>(executor: () => Promise<T>) => requestSave('immediate', executor),
    }),
    [saving, hasUnsaved, lastSavedAt, lastError, markUnsaved, requestAutoSave, requestSave]
  );
}
