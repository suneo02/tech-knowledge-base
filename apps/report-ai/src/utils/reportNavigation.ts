/**
 * 报告导航工具函数
 *
 * @description 统一管理报告相关的路由跳转逻辑
 * @since 1.0.0
 */

import { RP_SOURCE_VALUES, RP_URL_PARAMS } from '@/constants/urlParams';

/**
 * 构建报告详情页 URL
 *
 * @param reportId - 报告 ID
 * @param options - 可选参数
 * @returns 报告详情页路径
 */
export const buildReportDetailUrl = (
  reportId: string,
  options?: {
    /** 是否自动生成全文 */
    autoGenerate?: boolean;
    /** 来源标识 */
    source?: (typeof RP_SOURCE_VALUES)[keyof typeof RP_SOURCE_VALUES];
  }
): string => {
  const basePath = `/reportdetail/${reportId}`;

  if (!options?.autoGenerate) {
    return basePath;
  }

  const searchParams = new URLSearchParams();
  searchParams.set(RP_URL_PARAMS.AUTO_GENERATE, 'true');

  if (options.source) {
    searchParams.set(RP_URL_PARAMS.SOURCE, options.source);
  }

  return `${basePath}?${searchParams.toString()}`;
};

/**
 * 构建带自动生成标识的报告详情页 URL（从大纲会话）
 *
 * @param reportId - 报告 ID
 * @returns 报告详情页路径
 */
export const buildReportDetailUrlFromOutline = (reportId: string): string => {
  return buildReportDetailUrl(reportId, {
    autoGenerate: true,
    source: RP_SOURCE_VALUES.OUTLINE,
  });
};

/**
 * 构建带自动生成标识的报告详情页 URL（从模板）
 *
 * @param reportId - 报告 ID
 * @returns 报告详情页路径
 */
export const buildReportDetailUrlFromTemplate = (reportId: string): string => {
  return buildReportDetailUrl(reportId, {
    autoGenerate: true,
    source: RP_SOURCE_VALUES.TEMPLATE,
  });
};
