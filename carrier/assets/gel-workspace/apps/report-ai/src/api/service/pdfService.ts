/**
 * PDF 服务模块
 * 提供项目级别的 PDF 文件加载、处理和管理功能
 */

/**
 * PDF 加载配置接口
 */
export interface PDFLoadConfig {
  /** 请求超时时间（毫秒），默认 30000ms */
  timeout?: number;
  /** 自定义请求头 */
  headers?: Record<string, string>;
  /** 错误回调 */
  onError?: (error: Error) => void;
}

/**
 * PDF 加载结果接口
 */
export interface PDFLoadResult {
  /** 本地对象 URL 或 Blob */
  data: string | Blob | null;
  /** 是否加载成功 */
  success: boolean;
  /** 错误信息 */
  error?: Error;
}

/**
 * 将 Blob 转换为 JSON 对象
 * 用于检测响应是否为错误信息（JSON 格式）而非 PDF 文件
 *
 * @param blob - 要转换的 Blob 对象
 * @returns Promise<any> - 解析后的 JSON 对象
 * @throws 如果 Blob 不是有效的 JSON 格式
 */
async function blobToJson(blob: Blob): Promise<any> {
  const arrayBuffer = await blob.arrayBuffer();
  const decoder = new TextDecoder('utf-8');
  const jsonString = decoder.decode(arrayBuffer);
  return JSON.parse(jsonString);
}

/**
 * 释放对象 URL，避免内存泄漏
 *
 * 当 PDF 组件卸载或 URL 不再使用时，应该调用此方法释放资源
 *
 * @param url - 要释放的对象 URL
 *
 * @example
 * ```ts
 * useEffect(() => {
 *   return () => {
 *     if (pdfUrl) {
 *       revokePdfUrl(pdfUrl);
 *     }
 *   };
 * }, [pdfUrl]);
 * ```
 */
export function revokePdfUrl(url: string): void {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
    console.log('PDF URL 已释放:', url);
  }
}
