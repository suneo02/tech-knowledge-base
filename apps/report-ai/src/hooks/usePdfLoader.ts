import { revokePdfUrl } from '@/components/File/PDFViewer/pdfLoader';
import { useEffect, useState } from 'react';

/**
 * PDF 加载源配置
 */
export interface PDFSource {
  /** 直接提供 PDF 文件 URL（优先级最高） */
  url?: string;
  /** 提供 PDF 文件 Blob 对象 */
  file?: Blob;
  /** 提供 PDF 加载函数，返回 URL 或 Blob */
  loader?: () => Promise<string | Blob | null>;
}

/**
 * PDF 加载状态
 */
export type PDFLoadState = 'idle' | 'loading' | 'loaded' | 'error';

/**
 * PDF 加载结果
 */
export interface PDFLoadResult {
  /** PDF URL（如果是 URL 方式） */
  url: string;
  /** PDF Blob（如果是 Blob 方式） */
  file: Blob | undefined;
  /** 加载状态 */
  state: PDFLoadState;
  /** 错误信息 */
  error: Error | null;
}

/**
 * PDF 加载器 Hook
 *
 * 项目级别的通用 Hook，用于处理各种 PDF 加载场景
 *
 * 功能：
 * - 支持多种加载方式（URL、Blob、自定义加载函数）
 * - 自动管理加载状态
 * - 自动清理对象 URL，避免内存泄漏
 * - 处理组件卸载时的清理逻辑
 *
 * @param source - PDF 加载源配置
 * @param onStateChange - 状态变化回调（可选）
 * @returns PDF 加载结果
 *
 * @example
 * ```tsx
 * // 方式1: 直接 URL
 * const { url, file, state } = usePdfLoader({ url: '/document.pdf' });
 *
 * // 方式2: Blob 对象
 * const { url, file, state } = usePdfLoader({ file: pdfBlob });
 *
 * // 方式3: 自定义加载函数
 * const { url, file, state } = usePdfLoader({
 *   loader: async () => {
 *     return await pdfService.loadPdfFromGFS('path', 'file.pdf');
 *   }
 * });
 *
 * // 监听状态变化
 * const result = usePdfLoader(source, (state) => {
 *   if (state === 'loaded') console.log('加载完成');
 * });
 * ```
 */
export function usePdfLoader(source: PDFSource, onStateChange?: (state: PDFLoadState) => void): PDFLoadResult {
  // PDF URL 状态
  const [pdfURL, setPdfURL] = useState('');
  // PDF Blob 状态
  const [pdfFile, setPdfFile] = useState<Blob | undefined>();
  // 加载状态
  const [loadState, setLoadState] = useState<PDFLoadState>('idle');
  // 错误状态
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    let objectUrl: string | null = null;

    /**
     * 执行 PDF 加载
     */
    const loadPDF = async () => {
      try {
        // 重置错误状态
        setError(null);

        // 设置加载状态
        setLoadState('loading');
        onStateChange?.('loading');

        // 优先级1: 直接提供的 URL
        if (source.url) {
          if (isMounted) {
            setPdfURL(source.url);
            setPdfFile(undefined);
            setLoadState('loaded');
            onStateChange?.('loaded');
          }
          return;
        }

        // 优先级2: 直接提供的 Blob 对象
        if (source.file) {
          if (isMounted) {
            setPdfFile(source.file);
            setPdfURL('');
            setLoadState('loaded');
            onStateChange?.('loaded');
          }
          return;
        }

        // 优先级3: 自定义加载函数
        if (source.loader) {
          const result = await source.loader();
          if (!isMounted) return;

          if (typeof result === 'string') {
            // 返回的是 URL，需要记录以便清理
            objectUrl = result;
            setPdfURL(result);
            setPdfFile(undefined);
          } else if (result instanceof Blob) {
            // 返回的是 Blob
            setPdfFile(result);
            setPdfURL('');
          } else if (result === null) {
            // 加载失败
            throw new Error('加载函数返回 null');
          } else {
            throw new Error('加载函数返回值无效');
          }

          setLoadState('loaded');
          onStateChange?.('loaded');
          return;
        }

        // 没有提供任何有效的加载源
        throw new Error('未提供有效的 PDF 加载源');
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        console.error('PDF 加载失败:', error);

        if (isMounted) {
          setError(error);
          setLoadState('error');
          onStateChange?.('error');
        }
      }
    };

    loadPDF();

    // 清理函数：释放对象 URL
    return () => {
      isMounted = false;
      if (objectUrl) {
        revokePdfUrl(objectUrl);
      }
    };
  }, [source, onStateChange]);

  return {
    url: pdfURL,
    file: pdfFile,
    state: loadState,
    error,
  };
}

/**
 * 简化版的 PDF 加载器 Hook
 * 只返回 URL 或 Blob，不关心加载状态
 *
 * @param source - PDF 加载源配置
 * @returns [url, file] - PDF URL 和 Blob
 *
 * @example
 * ```tsx
 * const [url, file] = useSimplePdfLoader({ url: '/document.pdf' });
 * ```
 */
export function useSimplePdfLoader(source: PDFSource): [string, Blob | undefined] {
  const { url, file } = usePdfLoader(source);
  return [url, file];
}
