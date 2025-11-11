/**
 * 文件管理 Domain 层统一导出
 *
 * @description
 * 提供文件管理相关的业务逻辑和数据聚合功能，包括文件状态判断和数据聚合。
 * 主要服务于文件管理页面和报告详情页的文件处理逻辑。
 *
 * @see [../../../apps/report-ai/docs/specs/file-management/spec-design-v1.md](../../../apps/report-ai/docs/specs/file-management/spec-design-v1.md) - 文件管理页面设计
 * @see [../../../apps/report-ai/docs/specs/file-management/spec-implementation-v1.md](../../../apps/report-ai/docs/specs/file-management/spec-implementation-v1.md) - 文件管理实施拆解
 */

// 文件数据聚合功能
export { aggregateFileData, mapToUnifiedList } from './aggregation';

// 文件状态判断功能
export { isReportFileStatusFinished, isReportFileStatusMutable } from './fileStatus';
