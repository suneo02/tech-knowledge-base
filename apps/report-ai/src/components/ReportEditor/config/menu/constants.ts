/**
 * 菜单常量和配置
 *
 * @see ../../../../docs/RPDetail/RPEditor/QuickToolbar.md Quick Toolbar 设计文档
 */

import { AI_TASK_DISPLAY_NAMES } from '@/domain/chat';
import type { AIMenuItemConfig, ShortcutConfig } from './types';

/**
 * Quick Toolbar 按钮配置
 *
 * 横向按钮组布局，使用 | 分隔符分组。
 * 选中文本时自动显示在选区上方。
 *
 * 按钮分组：
 * - AI 改写：AI 功能入口
 * - 编辑：撤销/重做、剪切/复制/粘贴
 * - 标题：H1/H2/H3、段落格式
 * - 格式：粗体/斜体/下划线/删除线/清除格式
 * - 颜色：前景色/背景色
 * - 字体：字体/字号
 * - 列表：无序/有序列表、缩进
 * - 对齐：左/中/右/两端对齐
 */
export const QUICK_TOOLBAR_BUTTONS = [
  'ai_rewrite_menu',
  '|',
  'undo redo',
  '|',
  'cut copy paste',
  '|',
  'h1 h2 h3 formatselect',
  '|',
  'bold italic underline strikethrough removeformat',
  '|',
  'forecolor backcolor',
  '|',
  'fontfamily fontsize',
  '|',
  'bullist numlist outdent indent',
  '|',
  'alignleft aligncenter alignright alignjustify',
].join(' ');

/**
 * AI 菜单配置
 *
 * text 字段使用统一的 AI_TASK_DISPLAY_NAMES
 */
export const AI_MENU_SECTIONS: Array<{ label: string; items: AIMenuItemConfig[] }> = [
  {
    label: '文本优化',
    items: [
      {
        name: 'ai_polish',
        text: AI_TASK_DISPLAY_NAMES.polish,
        icon: 'ai-polish',
        action: 'polish',
        requiresSelection: true,
        warning: '请先选中需要完善表达的文本',
      },
      {
        name: 'ai_translate',
        text: AI_TASK_DISPLAY_NAMES.translate,
        icon: 'ai-translate',
        action: 'translate',
        requiresSelection: true,
        warning: '请先选中需要翻译的文本',
      },
    ],
  },
  {
    label: '内容控制',
    items: [
      {
        name: 'ai_contract',
        text: AI_TASK_DISPLAY_NAMES.contract,
        icon: 'ai-contract',
        action: 'contract',
        requiresSelection: true,
        warning: '请先选中需要缩写内容的文本',
      },
      {
        name: 'ai_expand',
        text: AI_TASK_DISPLAY_NAMES.expand,
        icon: 'ai-longer',
        action: 'expand',
        requiresSelection: true,
        warning: '请先选中需要扩写内容的文本',
      },
      {
        name: 'ai_continue',
        text: AI_TASK_DISPLAY_NAMES.continue,
        icon: 'ai-continue',
        action: 'continue',
        requiresSelection: false,
      },
    ],
  },
  {
    label: '内容分析',
    items: [
      {
        name: 'ai_summarize_title',
        text: AI_TASK_DISPLAY_NAMES.summarize,
        icon: 'ai-summarize',
        action: 'summarize',
        requiresSelection: true,
        warning: '请先选中需要摘要的文本',
      },
      {
        name: 'ai_bullet_points',
        text: AI_TASK_DISPLAY_NAMES.bullet_points,
        icon: 'ai-bullet-points',
        action: 'bullet_points',
        requiresSelection: true,
        warning: '请先选中需要列举关键点的文本',
      },
      // TODO: 'table' 类型暂未在 AITaskType 中定义，待后续支持
      // {
      //   name: 'ai_table',
      //   text: '生成表格',
      //   icon: 'ai-gen-table',
      //   action: 'table' as AITaskType,
      //   requiresSelection: true,
      // },
    ],
  },
];

/**
 * 快捷键配置
 *
 * 使用 AI_TASK_DISPLAY_NAMES 统一管理显示名称
 */
export const AI_SHORTCUTS: ShortcutConfig[] = [
  { key: 'ctrl+1', action: 'polish', requiresSelection: true },
  { key: 'ctrl+2', action: 'translate', requiresSelection: true },
  { key: 'ctrl+3', action: 'expand', requiresSelection: true },
  { key: 'ctrl+4', action: 'contract', requiresSelection: true },
  { key: 'ctrl+5', action: 'continue', requiresSelection: false },
  { key: 'ctrl+6', action: 'summarize', requiresSelection: true },
  { key: 'ctrl+7', action: 'bullet_points', requiresSelection: true },
];
