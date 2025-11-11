/**
 * 报告内容管理的 RTK Slice - 模块化版本
 *
 * 使用模块化的reducer组织结构：
 * - canonicalReducers: Canonical Layer操作
 * - ephemeralReducers: Ephemeral Layer操作
 * - hydrationReducers: 重注水控制
 * - generationReducers: AI生成管理
 * - uiControlReducers: UI控制层操作
 */

import { createSlice } from '@reduxjs/toolkit';
import { allReducers } from './reducers';
import { ReportContentState } from './types';

/**
 * 创建初始状态
 */
const createInitialState = (): ReportContentState => ({
  // === Canonical Layer - 已确认层 ===
  chapters: [],
  reportId: undefined,
  reportName: '',

  // === Draft Layer - 会话层 ===
  documentDraft: null,

  // === 重注水控制 ===
  hydration: {
    currentTask: { type: 'idle' },
    activeOperations: {},
    latestRequestedOperations: {},
  },

  // === UI Control Layer - 控制层 ===
  globalOp: {
    kind: 'idle',
    startedAt: null,
    operationId: undefined,
    data: null,
    error: null,
  },
  parsedRPContentMessages: [],
  chapterStates: {},

  // === 文件状态管理 ===
  // 报告级文件列表（统一存储 useReportRelatedFiles 的数据，包含实时状态）
  reportFiles: [],
});

/**
 * 模块化的reportContent Slice
 */
export const rpContentSlice = createSlice({
  name: 'reportContent',
  initialState: createInitialState(),
  reducers: allReducers,
});

export const { actions: rpContentActions, selectors: rpContentSelectors } = rpContentSlice;
