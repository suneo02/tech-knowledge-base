import { message } from '@wind/wind-ui';

/**
 * PDF 加载器模块
 * 负责 PDF 文件的加载、URL 创建和错误处理
 */

/**
 * PDF 加载配置接口
 */
export interface PDFLoaderConfig {
  /** PDF 文件 URL */
  url: string;
  /** 加载超时时间（毫秒），默认 30000ms */
  timeout?: number;
  /** 错误回调 */
  onError?: (error: Error) => void;
}

/**
 * PDF 加载结果接口
 */
export interface PDFLoadResult {
  /** 本地对象 URL */
  url: string | null;
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
 * 从远程 URL 获取 PDF 文件并创建本地对象 URL
 *
 * 工作流程：
 * 1. 使用 fetch 下载 PDF 文件
 * 2. 将响应转换为 Blob
 * 3. 尝试解析为 JSON（检测是否为错误响应）
 * 4. 如果是 PDF 文件，创建本地对象 URL
 * 5. 如果是错误响应，显示错误信息
 *
 * @param pdfUrl - PDF 文件的远程 URL
 * @returns Promise<string | null> - 成功返回本地对象 URL，失败返回 null
 *
 * @example
 * ```ts
 * const url = await fetchPdfAndCreateLocalUrl('/api/pdf/document.pdf');
 * if (url) {
 *   // 使用 URL 加载 PDF
 * }
 * ```
 */
export async function fetchPdfAndCreateLocalUrl(pdfUrl: string): Promise<string | null> {
  try {
    // @ts-expect-error baifenFetch 是全局方法，用于带认证的请求
    const response = await baifenFetch(pdfUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 将响应内容读取为 Blob
    const blob = await response.blob();

    try {
      // 尝试将 Blob 解析为 JSON，如果成功说明是错误响应
      const json = await blobToJson(blob);
      message.error(json.message || `读取文件失败！`);
      return null;
    } catch (error) {
      // 解析失败说明是 PDF 文件，创建对象 URL
      const localUrl = URL.createObjectURL(blob);
      console.log('PDF 本地 URL 创建成功:', localUrl);
      return localUrl;
    }
  } catch (error) {
    console.error('PDF 加载失败:', error);
    message.error('PDF 文件加载失败，请稍后重试');
    return null;
  }
}

/**
 * 从 GFS（分布式文件系统）加载 PDF 文件
 *
 * @param gfsPath - GFS 文件路径
 * @param gfsName - GFS 文件名
 * @param apiPrefix - API 前缀
 * @returns Promise<string | null> - 成功返回本地对象 URL，失败返回 null
 *
 * @example
 * ```ts
 * const url = await loadPdfFromGFS('path/to/file', 'document.pdf', '/api');
 * ```
 */
export async function loadPdfFromGFS(gfsPath: string, gfsName: string, apiPrefix: string): Promise<string | null> {
  const url = `${apiPrefix}/bankcomp/api/file/gfs/download/${gfsPath}/${gfsName}`;
  return fetchPdfAndCreateLocalUrl(url);
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

/**
 * 使用 Hook 管理 PDF URL 的生命周期
 *
 * @param gfsPath - GFS 文件路径
 * @param gfsName - GFS 文件名
 * @param apiPrefix - API 前缀
 * @returns [pdfUrl, isLoading, error] - PDF URL、加载状态、错误信息
 *
 * @example
 * ```tsx
 * const [pdfUrl, isLoading, error] = usePdfLoader(gfsPath, gfsName, apiPrefix);
 *
 * if (isLoading) return <Spin />;
 * if (error) return <Error message={error.message} />;
 * return <PDFDocument url={pdfUrl} />;
 * ```
 */
export function createPdfLoader(
  gfsPath: string | undefined,
  gfsName: string | undefined,
  apiPrefix: string
): {
  load: () => Promise<string | null>;
  shouldLoad: boolean;
} {
  const shouldLoad = Boolean(gfsPath && gfsName);

  const load = async (): Promise<string | null> => {
    if (!shouldLoad) return null;
    return loadPdfFromGFS(gfsPath!, gfsName!, apiPrefix);
  };

  return { load, shouldLoad };
}
