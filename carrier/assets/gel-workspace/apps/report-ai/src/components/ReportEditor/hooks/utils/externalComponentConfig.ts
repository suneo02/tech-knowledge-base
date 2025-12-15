/**
 * 外部组件配置常量
 *
 * @description
 * 统一管理所有外部组件的渲染器配置，包括：
 * - 组件 ID
 * - z-index 层级
 * - 容器配置
 *
 * 这样可以：
 * - 避免魔法数字
 * - 统一管理 z-index 层级
 * - 易于调整和维护
 *
 * @see apps/report-ai/src/components/ReportEditor/hooks/utils/externalComponentRenderer.ts
 */

import { createGlobalContainerConfig, type GlobalContainerConfig } from './externalComponentRenderer';

/**
 * 外部组件 z-index 层级定义
 *
 * @description
 * 统一管理所有外部组件的 z-index，确保正确的层叠顺序。
 *
 * 层级规则：
 * - 10000: 基础浮层（AIGC 按钮、Loading 指示器）
 * - 10100: 文本改写预览（需要在基础浮层之上）
 * - 10200: 保留给未来的更高层级组件
 */
export const EXTERNAL_COMPONENT_Z_INDEX = {
  /** AIGC 按钮 */
  AIGC_BUTTON: 10000,
  /** 章节 Loading 指示器 */
  CHAPTER_LOADING: 10000,
  /** 文本改写预览 */
  TEXT_REWRITE_PREVIEW: 10100,
} as const;

/**
 * 外部组件 ID 定义
 *
 * @description
 * 统一管理所有外部组件的唯一标识符。
 */
export const EXTERNAL_COMPONENT_IDS = {
  /** AIGC 按钮 */
  AIGC_BUTTON: 'aigc-button',
  /** 章节 Loading 指示器 */
  CHAPTER_LOADING: 'chapter-loading',
  /** 文本改写预览 */
  TEXT_REWRITE_PREVIEW: 'text-rewrite-preview',
} as const;

/**
 * 外部组件渲染器配置
 *
 * @description
 * 预定义的渲染器配置，可直接用于创建 ExternalComponentRenderer。
 *
 * @example
 * ```typescript
 * const rendererRef = useRef(
 *   createExternalComponentRenderer<string>(
 *     EXTERNAL_COMPONENT_CONFIGS.AIGC_BUTTON
 *   )
 * );
 * ```
 */
export const EXTERNAL_COMPONENT_CONFIGS = {
  /** AIGC 按钮配置 */
  AIGC_BUTTON: createGlobalContainerConfig(EXTERNAL_COMPONENT_IDS.AIGC_BUTTON, EXTERNAL_COMPONENT_Z_INDEX.AIGC_BUTTON),

  /** 章节 Loading 指示器配置 */
  CHAPTER_LOADING: createGlobalContainerConfig(
    EXTERNAL_COMPONENT_IDS.CHAPTER_LOADING,
    EXTERNAL_COMPONENT_Z_INDEX.CHAPTER_LOADING
  ),

  /** 文本改写预览配置 */
  TEXT_REWRITE_PREVIEW: createGlobalContainerConfig(
    EXTERNAL_COMPONENT_IDS.TEXT_REWRITE_PREVIEW,
    EXTERNAL_COMPONENT_Z_INDEX.TEXT_REWRITE_PREVIEW
  ),
} as const satisfies Record<string, GlobalContainerConfig>;

/**
 * 外部组件配置类型
 */
export type ExternalComponentConfigKey = keyof typeof EXTERNAL_COMPONENT_CONFIGS;
