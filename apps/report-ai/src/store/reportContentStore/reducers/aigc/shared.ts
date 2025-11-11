/**
 * AIGC 操作共享工具类
 *
 * 提供 AIGC 相关 reducer 的通用逻辑，避免重复代码
 * 使用静态类组织函数，提供清晰的命名空间
 */

import type { GlobalOperationKind } from '@/types/report';
import type { ReportContentState } from '../../types';

/**
 * 章节状态管理工具类
 */
export class ChapterStateHelper {
  /**
   * 解锁单个章节
   */
  static unlock(state: ReportContentState, chapterId: string): void {
    if (state.chapterStates[chapterId]) {
      state.chapterStates[chapterId].locked = false;
    }
  }

  /**
   * 解锁多个章节
   */
  static unlockMany(state: ReportContentState, chapterIds: string[]): void {
    chapterIds.forEach((id) => this.unlock(state, id));
  }

  /**
   * 锁定章节（确保 chapterStates 存在）
   */
  static lock(state: ReportContentState, chapterId: string): void {
    if (!state.chapterStates[chapterId]) {
      state.chapterStates[chapterId] = { chapterId };
    }
    state.chapterStates[chapterId].locked = true;
  }

  /**
   * 锁定多个章节
   */
  static lockMany(state: ReportContentState, chapterIds: string[]): void {
    chapterIds.forEach((id) => this.lock(state, id));
  }
}

/**
 * 章节请求管理工具类
 */
export class ChapterRequestHelper {
  /**
   * 清理章节的请求记录
   */
  static clear(state: ReportContentState, chapterId: string): void {
    delete state.hydration.latestRequestedOperations[chapterId];
  }

  /**
   * 清理多个章节的请求记录
   */
  static clearMany(state: ReportContentState, chapterIds: string[]): void {
    chapterIds.forEach((id) => this.clear(state, id));
  }

  /**
   * 初始化章节请求记录（幂等控制）
   */
  static init(state: ReportContentState, chapterId: string, correlationId: string): void {
    state.hydration.latestRequestedOperations[chapterId] = {
      correlationId,
      requested: false,
    };
  }

  /**
   * 标记章节请求已发送
   */
  static markRequested(state: ReportContentState, chapterId: string, correlationId: string): void {
    const latest = state.hydration.latestRequestedOperations[chapterId];
    if (latest && latest.correlationId === correlationId) {
      latest.requested = true;
    }
  }
}

/**
 * 章节操作管理工具类
 */
export class ChapterOperationHelper {
  /**
   * 创建章节操作记录
   */
  static create(state: ReportContentState, chapterId: string, correlationId: string, startTime: number): void {
    state.hydration.activeOperations[correlationId] = {
      correlationId,
      chapterId,
      startTime,
      status: 'pending',
    };
  }

  /**
   * 移除章节的旧操作记录
   */
  static removeOld(state: ReportContentState, chapterId: string): void {
    Object.entries(state.hydration.activeOperations).forEach(([existingCorrelationId, operation]) => {
      if (operation.chapterId === chapterId) {
        delete state.hydration.activeOperations[existingCorrelationId];
      }
    });
  }

  /**
   * 清理章节操作（解锁 + 清理请求记录）
   */
  static cleanup(state: ReportContentState, chapterId: string): void {
    ChapterStateHelper.unlock(state, chapterId);
    ChapterRequestHelper.clear(state, chapterId);
  }

  /**
   * 清理多个章节操作
   */
  static cleanupMany(state: ReportContentState, chapterIds: string[]): void {
    chapterIds.forEach((id) => this.cleanup(state, id));
  }
}

/**
 * GlobalOp 状态管理工具类
 */
export class GlobalOpHelper {
  /**
   * 设置 globalOp 为 idle 状态
   */
  static setIdle(state: ReportContentState): void {
    state.globalOp = {
      kind: 'idle',
      startedAt: null,
      operationId: undefined,
      data: null,
      error: null,
    };
  }

  /**
   * 设置 globalOp 为 error 状态（保留数据用于恢复）
   */
  static setError(state: ReportContentState, error: string): void {
    state.globalOp = {
      kind: 'error',
      startedAt: state.globalOp.startedAt,
      operationId: state.globalOp.operationId,
      data: state.globalOp.data,
      error,
    };
  }

  /**
   * 验证 globalOp 的类型
   */
  static validateKind(state: ReportContentState, expectedKind: GlobalOperationKind): boolean {
    return state.globalOp.kind === expectedKind;
  }

  /**
   * 验证 globalOp 的数据类型
   */
  static validateDataType<T extends string>(state: ReportContentState, expectedType: T): boolean {
    return state.globalOp.data?.type === expectedType;
  }

  /**
   * 验证 globalOp 的类型和数据类型（组合验证）
   */
  static validate<T extends string>(
    state: ReportContentState,
    expectedKind: GlobalOperationKind,
    expectedDataType: T
  ): boolean {
    return this.validateKind(state, expectedKind) && this.validateDataType(state, expectedDataType);
  }

  /**
   * 从 globalOp 中提取章节 ID 列表
   */
  static extractChapterIds(state: ReportContentState): string[] {
    const { data } = state.globalOp;

    if (!data) return [];

    switch (data.type) {
      case 'full_generation':
      case 'multi_chapter_generation':
        return data.queue;
      case 'chapter_regeneration':
        return [data.chapterId];
      case 'text_rewrite':
        return [data.chapterId];
      default:
        return [];
    }
  }

  /**
   * 获取队列数据（用于批量操作）
   */
  static getQueueData(state: ReportContentState): { queue: string[]; currentIndex: number } | null {
    const { data } = state.globalOp;
    if (!data) return null;

    if (data.type === 'full_generation' || data.type === 'multi_chapter_generation') {
      return { queue: data.queue, currentIndex: data.currentIndex };
    }

    return null;
  }
}

/**
 * 批量章节生成工具类
 */
export class BatchChapterGenHelper {
  /**
   * 推进队列到下一章节（通用逻辑）
   *
   * @returns 是否成功推进（false 表示已到队列末尾）
   */
  static progressToNext(state: ReportContentState): boolean {
    const queueData = GlobalOpHelper.getQueueData(state);
    if (!queueData) return false;

    const nextIndex = queueData.currentIndex + 1;
    if (nextIndex < queueData.queue.length) {
      // 直接修改 state.globalOp.data（已通过类型守卫验证）
      const { data } = state.globalOp;
      if (data && (data.type === 'full_generation' || data.type === 'multi_chapter_generation')) {
        data.currentIndex = nextIndex;
        return true;
      }
    }

    return false;
  }

  /**
   * 完成批量章节生成操作
   */
  static complete(
    state: ReportContentState,
    chapterIds: string[],
    options: {
      success: boolean;
      error?: string;
      preserveData?: boolean;
    }
  ): void {
    const { success, error, preserveData = false } = options;

    // 清理章节操作
    ChapterOperationHelper.cleanupMany(state, chapterIds);

    // 设置 globalOp 状态
    if (error || !success) {
      GlobalOpHelper.setError(state, error || 'Operation failed');
    } else {
      if (preserveData) {
        // 保留数据但标记为 idle（用于中断场景）
        state.globalOp.kind = 'idle';
      } else {
        GlobalOpHelper.setIdle(state);
      }
    }
  }

  /**
   * 取消批量章节生成操作
   */
  static cancel(state: ReportContentState, chapterIds: string[]): void {
    ChapterOperationHelper.cleanupMany(state, chapterIds);
    GlobalOpHelper.setIdle(state);
  }

  /**
   * 重置批量章节生成操作
   */
  static reset(state: ReportContentState, chapterIds: string[]): void {
    ChapterOperationHelper.cleanupMany(state, chapterIds);
    GlobalOpHelper.setIdle(state);
  }

  /**
   * 通用重置逻辑（从 globalOp 提取队列）
   */
  static resetFromGlobalOp(
    state: ReportContentState,
    expectedDataType: 'full_generation' | 'multi_chapter_generation'
  ): void {
    const { data } = state.globalOp;
    if (!data || data.type !== expectedDataType) return;

    this.reset(state, data.queue);
  }
}

/**
 * 单章节操作工具类
 */
export class SingleChapterOpHelper {
  /**
   * 完成单章节操作
   */
  static complete(state: ReportContentState, chapterId: string, correlationId: string, success: boolean): void {
    ChapterOperationHelper.cleanup(state, chapterId);

    if (state.hydration.activeOperations[correlationId]) {
      state.hydration.activeOperations[correlationId].status = success ? 'completed' : 'failed';
      if (!success) {
        delete state.hydration.activeOperations[correlationId];
      }
    }

    if (success) {
      GlobalOpHelper.setIdle(state);
    }
  }

  /**
   * 取消单章节操作
   */
  static cancel(state: ReportContentState, chapterId: string, correlationId: string): void {
    ChapterOperationHelper.cleanup(state, chapterId);

    if (state.hydration.activeOperations[correlationId]) {
      state.hydration.activeOperations[correlationId].status = 'failed';
      delete state.hydration.activeOperations[correlationId];
    }

    GlobalOpHelper.setIdle(state);
  }
}
