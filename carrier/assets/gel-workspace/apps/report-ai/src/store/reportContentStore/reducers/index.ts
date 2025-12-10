/**
 * Reducers 统一导出
 *
 * 将所有拆分的reducer模块合并，供主slice使用
 */

import { aigcReducers } from './aigc';
import { canonicalReducers } from './canonicalReducers';
import { chapterStateReducers } from './chapterStateReducers';
import { draftTreeReducers } from './draftTreeReducers';
import { globalOpReducers } from './globalOp';
import { hydrationReducers } from './hydrationReducers';
import { reportFilesReducers } from './reportFilesReducers';
import { uiControlReducers } from './uiControlReducers';

/**
 * 合并所有reducer模块
 */
export const allReducers = {
  // Canonical Layer - 已确认层操作
  ...canonicalReducers,

  // Chapter State - 章节前端状态管理
  ...chapterStateReducers,

  // Draft Tree - 树结构草稿管理（新架构）
  ...draftTreeReducers,

  // Report Files - 报告级文件列表与状态管理
  ...reportFilesReducers,

  // Hydration - 重注水控制
  ...hydrationReducers,

  // GlobalOp - 全局操作状态管理
  ...globalOpReducers,

  // AIGC - AI 生成与改写（统一管理）
  ...aigcReducers,

  // UI Control - 控制层操作
  ...uiControlReducers,
};

// 导出各个模块便于单独使用
export {
  aigcReducers,
  canonicalReducers,
  chapterStateReducers,
  draftTreeReducers,
  globalOpReducers,
  hydrationReducers,
  reportFilesReducers,
  uiControlReducers,
};

/**
 * 模块说明
 */
export const reducerModules = {
  canonical: {
    name: 'Canonical Layer',
    description: '管理已确认层数据：章节列表、报告信息等',
    reducers: Object.keys(canonicalReducers),
  },
  draftTree: {
    name: 'Draft Tree Layer',
    description: '管理树结构草稿数据：文档级状态、章节树等',
    reducers: Object.keys(draftTreeReducers),
  },
  reportFiles: {
    name: 'Report Files',
    description: '管理报告级文件：文件列表、文件解析状态等',
    reducers: Object.keys(reportFilesReducers),
  },
  hydration: {
    name: 'Hydration Control',
    description: '管理重注水机制：水合状态、epoch管理等',
    reducers: Object.keys(hydrationReducers),
  },
  globalOp: {
    name: 'GlobalOp State',
    description: '管理全局操作状态：服务器加载等',
    reducers: Object.keys(globalOpReducers),
  },
  aigc: {
    name: 'AIGC Operations',
    description: '管理 AI 生成与改写：全文生成、多章节生成、单章节重生成、文本改写',
    reducers: Object.keys(aigcReducers),
  },
  uiControl: {
    name: 'UI Control Layer',
    description: '管理UI控制层：编辑器状态、消息等',
    reducers: Object.keys(uiControlReducers),
  },
} as const;
