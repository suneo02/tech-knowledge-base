import { useEffect, useRef } from 'react';

interface UseEditorInitialValueParams {
  loading: boolean;
  reportId?: string;
  canonicalHtml?: string | null;
}

interface InitialValueCache {
  cacheKey: string | null;
  value: string;
}

const EMPTY_REPORT_KEY = '__no-report__';

/**
 * 缓存首帧 Canonical HTML，避免保存成功后初始值重写 TinyMCE 内容。
 *
 * @see {@link ../../../../docs/RPDetail/ContentManagement/README.md#初始注水策略 | 内容管理 - 初始注水策略}
 */
export const useEditorInitialValue = (params: UseEditorInitialValueParams): string => {
  const { loading, reportId, canonicalHtml } = params;
  const cacheRef = useRef<InitialValueCache>({ cacheKey: null, value: '' });

  useEffect(() => {
    if (loading) {
      cacheRef.current = { cacheKey: null, value: '' };
    }
  }, [loading]);

  const cacheKey = reportId ?? EMPTY_REPORT_KEY;
  if (!loading) {
    const cached = cacheRef.current;
    if (cached.cacheKey !== cacheKey) {
      cacheRef.current = {
        cacheKey,
        value: canonicalHtml ?? '',
      };
    }
  }

  return !loading && cacheRef.current.cacheKey === cacheKey ? cacheRef.current.value : canonicalHtml ?? '';
};
