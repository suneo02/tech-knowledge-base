/**
 * 报告合成器类型定义
 *
 * 重构说明：去除对中间类型 ReportChapterComposedContent 的依赖，
 * 直接使用章节级别的数据结构
 */

import { ChapterMap } from '@/domain/chapter';
import type { ReportBusinessStats } from '@/domain/shared';
import { MessageParsedReportContent } from '@/types';
import { MessageInfo } from '@ant-design/x/es/use-x-chat';
import { RPDetailChapter } from 'gel-api';
import { TreeLevelMap } from 'gel-util/common';

/**
 * 合成进度信息
 */
export interface CompositionProgress {
  /** 当前处理的章节索引 */
  current: number;
  /** 总章节数 */
  total: number;
  /** 当前处理的章节ID */
  currentChapterId?: string;
  /** 当前处理的章节标题 */
  currentChapterTitle?: string;
  /** 完成百分比 */
  percentage: number;
}

/**
 * 合成配置选项
 */
export interface ReportComposerOptions {
  /** 是否包含报告标题 */
  includeReportTitle?: boolean;
  /** 章节间分隔符 */
  sectionSeparator?: string;
  /** 是否启用调试模式 */
  debug?: boolean;
  /** 是否启用缓存 */
  useCache?: boolean;
  /** 缓存键前缀 */
  cacheKeyPrefix?: string;
  /** 合成进度回调 */
  onProgress?: (progress: CompositionProgress) => void;
  /** 章节合成完成回调 */
  onSectionComposed?: (chapterId: string, html: string) => void;
}

/**
 * 合成结果
 */
export interface CompositionResult {
  /** 合成的完整HTML */
  html: string;
  /** 章节HTML映射表 */
  htmlMap: Record<string, string>;
  /** 章节状态映射表 */
  statusMap: Record<string, 'not_started' | 'pending' | 'receiving' | 'finish'>;
  /** 章节映射表 */
  chapterMap: ChapterMap;
  /** 层级映射表 */
  levelMap: TreeLevelMap;
  /** 合成统计信息 */
  stats: CompositionStats;
}

/**
 * 合成统计信息（扩展基础统计）
 */
export interface CompositionStats extends ReportBusinessStats {
  /** 已处理章节数 */
  processedChapters: number;
  /** 空章节数 */
  emptyChapters: number;
  /** 错误章节数 */
  errorChapters: number;
  /** 处理时长（毫秒） */
  duration: number;
  /** 是否来自缓存 */
  fromCache: boolean;
}

/**
 * 合成输入数据
 */
export interface CompositionInput {
  chapters: RPDetailChapter[];
  messages: MessageInfo<MessageParsedReportContent>[];
  chapterMap: ChapterMap;
  levelMap: TreeLevelMap;
}

/**
 * 章节合成上下文
 */
export interface ChapterCompositionContext {
  chapter: RPDetailChapter;
  chapterId: string;
  message?: MessageInfo<MessageParsedReportContent>;
  level: number;
  index: number;
  total: number;
}
