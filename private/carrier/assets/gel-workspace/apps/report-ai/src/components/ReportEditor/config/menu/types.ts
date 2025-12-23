/**
 * 菜单相关类型定义
 *
 * @see ../../../../docs/RPDetail/RPEditor/QuickToolbar.md Quick Toolbar 设计文档
 */

import { EditorFacade } from '@/domain/reportEditor';
import type { AIActionData, AITaskType } from '@/types/editor';

/**
 * AI 菜单注册选项
 */
export interface AIMenuRegistryOptions {
  /** AI 操作回调 */
  onAIAction: (data: AIActionData) => void;
  /** 编辑器门面 */
  facade: EditorFacade;
}

/**
 * AI 菜单项配置
 */
export interface AIMenuItemConfig {
  /** 菜单项名称 */
  name: string;
  /** 显示文本 */
  text: string;
  /** 图标名称 */
  icon: string;
  /** 对应的 AI 操作类型 */
  action: AITaskType;
  /** 是否需要选中文本 */
  requiresSelection: boolean;
  /** 警告信息（当需要选区时） */
  warning?: string;
}

/**
 * 快捷键配置
 */
export interface ShortcutConfig {
  /** 快捷键组合 */
  key: string;
  /** 对应的 AI 操作类型 */
  action: AITaskType;
  /** 是否需要选中文本 */
  requiresSelection: boolean;
}
