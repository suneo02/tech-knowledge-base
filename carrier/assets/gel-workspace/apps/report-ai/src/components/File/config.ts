import { PresetColorType } from '@wind/wind-ui/lib/_util/colors';
import { RPFileTag } from 'gel-api';

interface RPFileTagConfig {
  text: string;
  color: PresetColorType;
}

/**
 * 文件标签配置映射
 */
export const RP_FILE_TAG_CONFIG: Record<RPFileTag, RPFileTagConfig> = {
  [RPFileTag.FINANCIAL_REPORT]: {
    text: '财务报告',
    color: 'color-1', // Wind UI 预设颜色
  },
  [RPFileTag.OTHER_FINANCIAL]: {
    text: '其他财务',
    color: 'color-2',
  },
  [RPFileTag.LEGAL_COMPLIANCE]: {
    text: '法律合规',
    color: 'color-3',
  },
  [RPFileTag.MARKET_RESEARCH]: {
    text: '市场研究',
    color: 'color-4',
  },
  [RPFileTag.PRODUCT_SERVICE]: {
    text: '产品服务',
    color: 'color-5',
  },
  [RPFileTag.OPERATION]: {
    text: '运营文件',
    color: 'color-6',
  },
  [RPFileTag.STRATEGIC_PLANNING]: {
    text: '战略规划',
    color: 'color-7',
  },
  [RPFileTag.PROJECT]: {
    text: '项目文件',
    color: 'color-8',
  },
  [RPFileTag.OTHER]: {
    text: '其他',
    color: 'color-9',
  },
} as const;

/**
 * 获取文件标签配置
 */
export const getFileTagConfig = (tagKey: string): RPFileTagConfig => {
  return RP_FILE_TAG_CONFIG[tagKey as RPFileTag] || RP_FILE_TAG_CONFIG[RPFileTag.OTHER];
};

/**
 * 获取文件标签显示文本
 */
export const getFileTagText = (tagKey: string): string => {
  return getFileTagConfig(tagKey).text;
};

/**
 * 获取文件标签颜色
 */
export const getFileTagColor = (tagKey: string): string => {
  return getFileTagConfig(tagKey).color;
};

/**
 * 文件标签选项（用于编辑，不包含"全部"）
 */
export const FILE_TAG_OPTIONS = [
  { label: '财务报告', value: RPFileTag.FINANCIAL_REPORT },
  { label: '其他财务文件', value: RPFileTag.OTHER_FINANCIAL },
  { label: '法律合规', value: RPFileTag.LEGAL_COMPLIANCE },
  { label: '市场研究', value: RPFileTag.MARKET_RESEARCH },
  { label: '产品服务', value: RPFileTag.PRODUCT_SERVICE },
  { label: '运营文件', value: RPFileTag.OPERATION },
  { label: '战略规划', value: RPFileTag.STRATEGIC_PLANNING },
  { label: '项目文件', value: RPFileTag.PROJECT },
  { label: '其他', value: RPFileTag.OTHER },
] as const;

/**
 * 文件标签筛选选项（包含"全部"）
 */
export const FILE_TAG_FILTER_OPTIONS = [{ label: '全部', value: 'all' }, ...FILE_TAG_OPTIONS] as const;
