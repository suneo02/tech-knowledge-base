/**
 * AI 任务配置
 *
 * 管理 AI 任务类型与预设问题的映射关系、显示名称等配置
 *
 * @see apps/report-ai/docs/specs/text-ai-rewrite-implementation/spec-design-v1.md
 * @see packages/gel-api/src/chat/base/analysisEngine.ts - ChatPresetQuestion 枚举定义
 */

import { AITaskType, SelectionSnapshot } from '@/types/editor';
import { ChatPresetQuestion } from 'gel-api';

/**
 * AI 任务类型与预设问题的映射关系
 *
 * 确保每个任务类型都有对应的预设问题
 */
export const AI_TASK_TO_PRESET_QUESTION: Record<AITaskType, ChatPresetQuestion> = {
  polish: ChatPresetQuestion.IMPROVE_EXPRESSION,
  translate: ChatPresetQuestion.TRANSLATE_TEXT,
  expand: ChatPresetQuestion.EXPAND_CONTENT,
  contract: ChatPresetQuestion.CONTRACT_CONTENT,
  continue: ChatPresetQuestion.CONTINUE_CONTENT,
  summarize: ChatPresetQuestion.SUMMARIZE_TITLE,
  bullet_points: ChatPresetQuestion.LIST_KEY_POINTS,
};

/**
 * 获取任务类型对应的预设问题
 *
 * @param taskType - AI 任务类型
 * @returns 对应的预设问题枚举值
 */
export function getPresetQuestionByTaskType(taskType: AITaskType): ChatPresetQuestion {
  return AI_TASK_TO_PRESET_QUESTION[taskType];
}

/**
 * 任务类型的显示名称
 *
 * 以 menuRegistry.ts 中的 AI_MENU_SECTIONS 为准
 */
export const AI_TASK_DISPLAY_NAMES: Record<AITaskType, string> = {
  polish: '完善表达',
  translate: '翻译文字',
  expand: '扩写内容',
  contract: '缩写内容',
  continue: '续写内容',
  summarize: '总结标题',
  bullet_points: '列举关键点',
};

/**
 * 获取任务类型的显示名称
 *
 * @param taskType - AI 任务类型
 * @returns 显示名称
 */
export function getTaskDisplayName(taskType: AITaskType): string {
  return AI_TASK_DISPLAY_NAMES[taskType];
}

/**
 * 构造改写请求的内容
 * 将预设问题和实际文本内容拼接
 */
export function buildRewriteContent(taskType: AITaskType, snapshot: SelectionSnapshot): string {
  const presetQuestion = getPresetQuestionByTaskType(taskType);

  // 拼接预设问题和实际内容
  // 格式：[预设问题]\n\n[实际文本]
  return `${presetQuestion}:${snapshot.text}`;
}
