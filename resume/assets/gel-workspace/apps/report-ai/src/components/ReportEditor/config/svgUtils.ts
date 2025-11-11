/**
 * SVG 工具函数
 * 用于动态导入 SVG 文件并转换为字符串
 */

// 从统一的导出文件导入 SVG 字符串
import {
  BulletPointRaw,
  ContinueContentRaw,
  ContractContentRaw,
  GenTableRaw,
  LongerContentRaw,
  PolishContentRaw,
  SummaryTitleRaw,
  TranslateRaw,
} from 'gel-ui';

/**
 * SVG 图标映射
 */
export const REPORT_SVG_ICON_MAP = {
  'ai-polish': PolishContentRaw,
  'ai-translate': TranslateRaw,
  'ai-contract': ContractContentRaw,
  'ai-longer': LongerContentRaw,
  'ai-continue': ContinueContentRaw,
  'ai-summarize': SummaryTitleRaw,
  'ai-bullet-points': BulletPointRaw,
  'ai-gen-table': GenTableRaw,
} as const;
