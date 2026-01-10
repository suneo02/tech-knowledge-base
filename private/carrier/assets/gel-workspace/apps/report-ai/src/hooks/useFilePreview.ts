import { requestToChat } from '@/api';
import { RPFileUnified } from '@/types';
import { useRequest } from 'ahooks';
import { useMemo } from 'react';

/**
 * 文件预览 Hook
 * 通过 report/preview 接口加载文件内容并转换为可预览的 URL
 *
 * @param file 文件数据
 * @param reportId 报告 ID（必填）
 * @returns 预览 URL、加载状态和错误信息
 *
 * @example
 * ```tsx
 * const { previewUrl, loading, error } = useFilePreview(file, reportId);
 *
 * if (loading) return <Spin />;
 * if (error) return <Alert message={error} />;
 * if (previewUrl) return <PDFViewer source={{ url: previewUrl }} />;
 * ```
 */
export function useFilePreview(file: RPFileUnified | null) {
  // 只有当文件有 fileId 且没有 filePath 时才调用 API
  const shouldFetch = !!file?.fileId;

  const { data, loading, error } = useRequest(
    async () => {
      if (!file?.fileId) {
        throw new Error('缺少必要的文件信息');
      }

      const response = await requestToChat('report/filePreview', undefined, {
        params: {
          fileID: file.fileId,
          fileId: file.fileId,
        },
      });

      if (!response.Data) {
        throw new Error('文件预览数据为空');
      }

      return response.Data;
    },
    {
      ready: shouldFetch,
      refreshDeps: [file?.fileId],
    }
  );

  // 将 base64 字符串转换为 Blob URL
  const previewUrl = useMemo(() => {
    // 如果 API 返回了数据，转换为 Blob URL
    if (data?.fileByte) {
      try {
        // 将 base64 字符串转换为 Blob
        const byteCharacters = atob(data.fileByte);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        // 根据文件扩展名确定 MIME 类型
        const mimeType = getMimeType(data.fileName || file?.fileName || '');
        const blob = new Blob([byteArray], { type: mimeType });

        // 创建 Blob URL
        return URL.createObjectURL(blob);
      } catch (err) {
        console.error('转换文件数据失败:', err);
        return null;
      }
    }

    return null;
  }, [data, file?.fileName]);

  return {
    previewUrl,
    loading: shouldFetch && loading,
    error: error?.message || null,
    fileName: data?.fileName || file?.fileName || '未知文件',
  };
}

/**
 * 根据文件名获取 MIME 类型
 */
function getMimeType(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';

  const mimeTypes: Record<string, string> = {
    pdf: 'application/pdf',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    bmp: 'image/bmp',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    txt: 'text/plain',
    md: 'text/markdown',
    json: 'application/json',
    xml: 'application/xml',
    csv: 'text/csv',
  };

  return mimeTypes[extension] || 'application/octet-stream';
}
