import { useCallback } from 'react';

interface UsePDFNavigationOptions {
  currentPage: number;
  totalPage: number;
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
  scrollToPage: (page: number) => void;
}

/**
 * PDF 导航管理 Hook
 * 处理页面跳转、上一页、下一页等导航操作
 *
 * @see 需求文档 {@link ../../../../../docs/RPDetail/Reference/01-requirement.md}
 * @see 设计文档 {@link ../../../../../docs/RPDetail/Reference/02-design.md}
 */
export function usePDFNavigation({ currentPage, totalPage, setCurrentPage, scrollToPage }: UsePDFNavigationOptions) {
  /**
   * 跳转到指定页面
   */
  const onJumpPage = useCallback(
    (page: number) => {
      setCurrentPage(page);
      scrollToPage(page);
    },
    [setCurrentPage, scrollToPage]
  );

  /**
   * 跳转到下一页
   */
  const onNextPage = useCallback(() => {
    setCurrentPage((prev) => {
      const nextPage = Math.min(prev + 1, totalPage);
      scrollToPage(nextPage);
      return nextPage;
    });
  }, [setCurrentPage, scrollToPage, totalPage]);

  /**
   * 跳转到上一页
   */
  const onPreviousPage = useCallback(() => {
    setCurrentPage((prev) => {
      const prevPage = Math.max(prev - 1, 1);
      scrollToPage(prevPage);
      return prevPage;
    });
  }, [setCurrentPage, scrollToPage]);

  return {
    onJumpPage,
    onNextPage,
    onPreviousPage,
  };
}
