/**
 * Canonical Layer Reducers
 *
 * 管理已确认层的数据操作：
 * - 章节列表管理
 * - 章节CRUD操作
 * - 报告基本信息
 */

import { RPContentAgentMsg } from '@/types';
import { MessageInfo } from '@ant-design/x/es/use-x-chat';
import { PayloadAction } from '@reduxjs/toolkit';
import type { RPDetailChapter } from 'gel-api';
import { ReportContentState } from '../types';
import { processSingleChapterCompletion as processChapterCompletionUtil } from '../utils/chapterProcessing';

export const canonicalReducers = {
  /**
   * 设置报告 ID
   */
  setReportId: (state: ReportContentState, action: PayloadAction<string | undefined>) => {
    state.reportId = action.payload;
  },
  /**
   * 应用完整文档快照
   *
   * @description 保存接口返回的是完整章节树。我们直接用它覆盖 Canonical 层，
   * 保证 Redux 中的“事实层”与服务器确认的内容保持一致。
   */
  applyDocumentSnapshot: (state: ReportContentState, action: PayloadAction<{ chapters: RPDetailChapter[] }>) => {
    state.chapters = action.payload.chapters;
  },

  /**
   * 处理单个章节完成（统一入口）
   *
   * 整合消息合并、状态更新、重注水触发的完整流程
   * 用于替代重复的单章节处理逻辑
   */
  processSingleChapterCompletion: (
    state: ReportContentState,
    action: PayloadAction<{
      /** 目标章节ID */
      chapterId: string;
      /** Agent 消息列表（原始消息，包含 entity 和 traces） */
      messages: MessageInfo<RPContentAgentMsg>[];
      /** 关联ID（可选） */
      correlationId?: string;
      /** 是否提取引用数据 */
      extractRefData?: boolean;
      /** 是否覆盖现有内容 */
      overwriteExisting?: boolean;
      /** 调试模式 */
      debug?: boolean;
    }>
  ) => {
    // 调用工具函数处理
    processChapterCompletionUtil(state, action.payload);
  },
};
