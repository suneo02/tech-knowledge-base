import { useState } from 'react';

/**
 * PDF 分页管理 Hook
 * 用于管理 PDF 文档的当前页码和总页数，提供翻页功能
 */
export function usePage() {
  // 总页数
  const [totalPage, setTotalPage] = useState(0);
  // 当前页码
  const [currentPage, setCurrentPage] = useState(1);

  /**
   * 跳转到下一页
   * 如果已经是最后一页，则不变
   */
  function onNext() {
    setCurrentPage((pre) => {
      if (pre >= totalPage) {
        return totalPage;
      }
      return pre + 1;
    });
  }

  /**
   * 跳转到上一页
   * 如果已经是第一页，则不变
   */
  function onPrevious() {
    setCurrentPage((pre) => {
      if (pre <= 1) {
        return 1;
      }
      return pre - 1;
    });
  }

  return {
    totalPage,
    setTotalPage,
    currentPage,
    setCurrentPage,
    onPrevious,
    onNext,
  };
}
