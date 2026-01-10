// AI 任务配置
export {
  AI_TASK_DISPLAY_NAMES,
  AI_TASK_TO_PRESET_QUESTION,
  getPresetQuestionByTaskType,
  getTaskDisplayName,
} from './aiTask';

// 消息位置判断
export { hasCompanyList, isLastAgentMsgAI } from './messagePosition';

// 大纲数据提取
export { createUserMessageWithFiles } from './userMessage';

// 大纲状态检测
export { getIsOutlineConfirmed, hasOutlineInMessages } from './outlineStatus';


export {
  buildSortedReferencesFromChapters,
  getReferenceIdentifier,
  ReferenceMap,
  type RPReferenceItem,
  type RPReferenceType,
} from './ref';
