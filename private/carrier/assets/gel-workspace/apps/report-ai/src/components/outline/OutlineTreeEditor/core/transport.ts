/**
 * Transport 层 - 全量保存
 *
 * 封装保存大纲的网络请求，保持 API 交互与 Hook 解耦。
 *
 * ## API 接口规范
 * - **接口路径**: `reportChapter/batchUpdateChapterTree`
 * - **请求方法**: POST
 * - **请求参数**:
 *   - `reportId`: string - 报告ID（从 ReportOutlineData.outlineId 转换）
 *   - `chapters`: RPChapter[] - 完整的章节树数组（全量保存）
 * - **响应格式**:
 *   - `ErrorCode`: string - 成功时为 ApiCodeForWfc.SUCCESS
 *   - `message`: string - 失败时的错误信息
 *
 * ## 约定
 * 后端仅返回成功/失败标识，不回传归一化后的章节结构，
 * 因此前端沿用乐观快照。若接口未来增加派生字段，需要在调用侧补充回写逻辑。
 *
 * @see packages/gel-api/src/chat/report/index.ts - API 类型定义
 * @see apps/report-ai/docs/RPOutline/OutlineEditor/outline-edit.md - 技术设计文档
 */

import { createSaveReport, type SaveReportResponse } from '@/domain/report/saveTransport';
import type { ReportOutlineData } from 'gel-api';

export type SaveOutlineResponse = SaveReportResponse;

export type SaveOutlineFn = (outline: ReportOutlineData) => Promise<SaveOutlineResponse>;

/**
 * 创建保存大纲的请求函数，便于在测试或特殊环境中注入自定义实现。
 */
export function createSaveOutline(): SaveOutlineFn {
  const saveReport = createSaveReport();
  return async (outline) =>
    saveReport({
      reportId: outline.reportId,
      chapters: outline.chapters,
    });
}

export const saveOutline = createSaveOutline();
