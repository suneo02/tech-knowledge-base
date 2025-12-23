/**
 * RPOutline 进度相关类型定义
 *
 * @description 定义大纲生成过程中的四个步骤状态和进度跟踪
 */

/**
 * 进度步骤枚举
 *
 * @description 大纲生成的四个核心步骤
 */
export enum RPOutlineProgressStep {
  /** 分析问题 */
  ANALYZE_PROBLEM = 'analyze_problem',
  /** 文件解析 */
  FILE_PARSING = 'file_parsing',
  /** 深度思考 */
  DEEP_THINKING = 'deep_thinking',
  /** 生成大纲 */
  GENERATE_OUTLINE = 'generate_outline',
}

/**
 * 步骤状态枚举
 *
 * @description 每个步骤的执行状态
 */
export enum RPOutlineStepStatus {
  /** 未开始 */
  NOT_STARTED = 'not_started',
  /** 进行中 */
  IN_PROGRESS = 'in_progress',
  /** 已完成 */
  COMPLETED = 'completed',
  /** 失败 */
  FAILED = 'failed',
}

/**
 * 单个步骤的状态信息
 *
 * @description 包含步骤的执行状态、时间戳和错误信息
 */
export interface RPOutlineStepInfo {
  /** 步骤类型 */
  step: RPOutlineProgressStep;
  /** 当前状态 */
  status: RPOutlineStepStatus;
  /** 步骤开始时间 */
  startedAt?: Date;
  /** 步骤完成时间 */
  completedAt?: Date;
  /** 错误信息（如果失败） */
  error?: string;
  /** 步骤进度百分比 (0-100) */
  progress?: number;
}

/**
 * 整体进度状态
 *
 * @description 包含所有步骤的状态信息和整体进度
 */
export interface RPOutlineProgressState {
  /** 各步骤的状态信息 */
  steps: Record<RPOutlineProgressStep, RPOutlineStepInfo>;
  /** 当前正在执行的步骤 */
  currentStep?: RPOutlineProgressStep;
  /** 整体进度百分比 (0-100) */
  overallProgress: number;
  /** 是否全部完成 */
  isCompleted: boolean;
  /** 是否有失败的步骤 */
  hasFailed: boolean;
}

/**
 * 文件解析状态
 *
 * @description 单个文件的解析进度和状态
 */
export interface RPOutlineFileParsingStatus {
  /** 文件ID */
  fileId: string;
  /** 文件名 */
  fileName: string;
  /** 解析状态 */
  status: RPOutlineStepStatus;
  /** 解析进度 (0-100) */
  progress: number;
  /** 解析开始时间 */
  startedAt?: Date;
  /** 解析完成时间 */
  completedAt?: Date;
  /** 错误信息 */
  error?: string;
}

/**
 * 进度更新事件
 *
 * @description 用于进度状态变更的事件类型
 */
export interface RPOutlineProgressUpdateEvent {
  /** 更新的步骤 */
  step: RPOutlineProgressStep;
  /** 新的状态 */
  status: RPOutlineStepStatus;
  /** 进度百分比 */
  progress?: number;
  /** 错误信息 */
  error?: string;
  /** 文件解析状态（仅文件解析步骤） */
  fileStatuses?: RPOutlineFileParsingStatus[];
}
