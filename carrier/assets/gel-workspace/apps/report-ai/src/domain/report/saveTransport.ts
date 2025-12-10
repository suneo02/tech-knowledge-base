/**
 * 通用报告保存 Transport 层
 *
 * 把 `reportChapter/batchUpdateChapterTree` API 的调用封装为可复用的工具，
 * 供大纲与正文内容等模块共享，避免各自重复实现错误处理逻辑。
 *
 * @see apps/report-ai/docs/RPOutline/OutlineEditor/outline-edit.md
 * @see apps/report-ai/docs/RPDetail/RPEditor/design.md
 */

import { requestToChat } from '@/api';
import { ApiCodeForWfc, RPChapterSavePayload } from 'gel-api';

export interface SaveReportPayload {
  reportId: string | number;
  chapters: RPChapterSavePayload[];
}

export interface SaveReportResponse {
  success: boolean;
  error?: string;
  idMap?: Record<string, string>;
}

export type SaveReportFn = (payload: SaveReportPayload) => Promise<SaveReportResponse>;

/**
 * 创建保存报告的网络请求函数。
 *
 * @param requestFn 可注入的请求实现，默认使用 `requestToChat`
 */
export function createSaveReport(): SaveReportFn {
  return async ({ reportId, chapters }) => {
    try {
      const res = await requestToChat('reportChapter/batchUpdateChapterTree', {
        reportId: String(reportId),
        chapterTree: chapters,
      });

      const errorCode = res?.ErrorCode ? String(res.ErrorCode) : ApiCodeForWfc.SUCCESS;
      if (errorCode === ApiCodeForWfc.SUCCESS) {
        // @ts-expect-error TODO 兼容处理，后续去除
        const idMap = res.Data?.tempIdMapping || res.Data?.data.tempIdMapping;
        return { success: true, idMap };
      }

      return { success: false, error: '保存失败' };
    } catch (error) {
      console.warn('[Transport] saveReport 请求失败:', error);
      const message = error instanceof Error ? error.message : String(error ?? '保存失败');
      return {
        success: false,
        error: message,
      };
    }
  };
}

/**
 * 默认导出的保存函数，便于直接使用。
 */
export const saveReport = createSaveReport();
