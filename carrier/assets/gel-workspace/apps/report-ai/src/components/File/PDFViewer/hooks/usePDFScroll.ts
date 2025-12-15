import { useDebouncedScroll } from '@/hooks/useDebouncedScroll';
import { useCallback, useRef } from 'react';

interface UsePDFScrollOptions {
  onPageChange: (page: number) => void;
}

const PAGE_OFFSET = 100;

/**
 * PDF 滚动管理 Hook
 * 处理 PDF 页面滚动和页码计算
 */
export function usePDFScroll({ onPageChange }: UsePDFScrollOptions) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * 根据滚动位置计算当前页码
   */
  const scrollHandler = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const pageDoms = container.querySelectorAll('.react-pdf__Document>div');

    for (let i = 0; i < pageDoms.length; i++) {
      const element = pageDoms[i] as HTMLElement;
      const start = element.offsetTop - PAGE_OFFSET;
      const end = start + element.clientHeight;

      if (container.scrollTop >= start && container.scrollTop < end) {
        onPageChange(i + 1);
        return;
      }
    }
  }, [onPageChange]);

  const scrollRef = useDebouncedScroll({
    onScroll: scrollHandler,
    wait: 100,
  });

  /**
   * 滚动到指定页面
   */
  const scrollToPage = useCallback((page: number) => {
    const container = scrollRef.current;
    if (!container) return;

    const pageDom = container.querySelector(`[data-page="${page}"]`) as HTMLElement;

    if (pageDom) {
      const scrollTop = pageDom.offsetTop - 12;
      container.scrollTo({
        top: scrollTop,
        behavior: 'smooth',
      });
    }
  }, []);

  /**
   * 滚动到指定 DOM 元素
   */
  const scrollToDom = useCallback(
    (domId: string, fallbackPage?: number) => {
      timerRef.current && clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        const dom = document.querySelector(`#${domId}`) as HTMLElement;

        if (dom) {
          dom.scrollIntoView({ behavior: 'smooth', block: 'center' });
          dom.classList.add('active');
        } else if (fallbackPage) {
          scrollToPage(fallbackPage);
        }

        timerRef.current = null;
      }, 100);
    },
    [scrollToPage]
  );

  return {
    scrollRef,
    scrollToPage,
    scrollToDom,
    timerRef,
  };
}
