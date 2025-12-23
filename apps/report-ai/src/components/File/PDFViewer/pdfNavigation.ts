import { RefObject } from 'react';
import { LocatePDFEventDetail } from './types';

/**
 * PDF 导航模块
 * 负责 PDF 页面的滚动、定位和导航功能
 */

/**
 * 滚动配置接口
 */
export interface ScrollConfig {
  /** 滚动行为，默认 'smooth' */
  behavior?: ScrollBehavior;
  /** 页面顶部偏移量，默认 12px */
  topOffset?: number;
  /** 滚动检测偏移量，默认 100px */
  detectOffset?: number;
}

/**
 * 默认滚动配置
 */
const DEFAULT_SCROLL_CONFIG: Required<ScrollConfig> = {
  behavior: 'smooth',
  topOffset: 12,
  detectOffset: 100,
};

/**
 * 根据滚动位置计算当前页码
 *
 * 遍历所有页面 DOM，找到当前滚动位置对应的页面
 *
 * @param scrollContainer - 滚动容器引用
 * @param config - 滚动配置
 * @returns 当前页码（从 1 开始），如果未找到返回 null
 */
export function calculateCurrentPage(scrollContainer: HTMLElement, config: ScrollConfig = {}): number | null {
  const { detectOffset } = { ...DEFAULT_SCROLL_CONFIG, ...config };

  const pageDoms = scrollContainer.querySelectorAll(`.react-pdf__Document>div`);

  for (let i = 0; i < pageDoms.length; i++) {
    const element = pageDoms[i] as HTMLElement;
    const start = element.offsetTop - detectOffset;
    const end = start + element.clientHeight;

    if (scrollContainer.scrollTop >= start && scrollContainer.scrollTop < end) {
      return i + 1;
    }
  }

  return null;
}

/**
 * 滚动到指定页面
 *
 * @param scrollContainer - 滚动容器引用
 * @param pageNumber - 目标页码（从 1 开始）
 * @param config - 滚动配置
 * @returns 是否成功滚动
 */
export function scrollToPage(
  scrollContainer: HTMLElement | null,
  pageNumber: number,
  config: ScrollConfig = {}
): boolean {
  if (!scrollContainer) return false;

  const { behavior, topOffset } = { ...DEFAULT_SCROLL_CONFIG, ...config };

  const pageDom = scrollContainer.querySelector(`[data-page="${pageNumber}"]`) as HTMLElement;

  if (!pageDom) {
    console.warn(`未找到页码 ${pageNumber} 对应的 DOM 元素`);
    return false;
  }

  const offsetTop = pageDom.offsetTop;
  const scrollTop = offsetTop - topOffset;

  scrollContainer.scrollTo({
    top: scrollTop,
    behavior,
  });

  return true;
}

/**
 * 滚动到指定 DOM 元素
 *
 * @param domId - 目标 DOM 元素的 ID
 * @param fallbackPage - 如果元素不存在，回退到的页码
 * @param scrollContainer - 滚动容器引用（用于回退）
 * @returns 是否成功滚动
 */
export function scrollToDomElement(
  domId: string,
  fallbackPage?: number,
  scrollContainer?: HTMLElement | null
): boolean {
  const dom = document.querySelector(`#${domId}`) as HTMLElement;

  if (dom) {
    dom.scrollIntoView({ behavior: 'smooth', block: 'center' });
    dom.classList.add('active');
    return true;
  }

  // 如果元素不存在且提供了回退页码，则滚动到该页
  if (fallbackPage && scrollContainer) {
    console.warn(`未找到 DOM 元素 #${domId}，回退到页码 ${fallbackPage}`);
    return scrollToPage(scrollContainer, fallbackPage);
  }

  return false;
}

/**
 * 创建 PDF 定位事件处理器
 *
 * 处理自定义的 'locatePDF' 事件，支持两种定位方式：
 * 1. 定位到指定页面
 * 2. 定位到指定页面的指定 DOM 元素
 *
 * @param scrollContainer - 滚动容器引用
 * @param config - 滚动配置
 * @returns 事件处理器工厂对象
 */
export function createPdfNavigator(scrollContainer: RefObject<HTMLElement | null>, config: ScrollConfig = {}) {
  /**
   * 根据定位事件详情执行滚动
   *
   * @param detail - 定位事件详情
   */
  const navigateByEvent = (detail: LocatePDFEventDetail): void => {
    if (!detail?.page) return;

    if (detail.domId) {
      // 定位到指定 DOM 元素
      scrollToDomElement(detail.domId, detail.page, scrollContainer.current);
    } else {
      // 定位到指定页面
      scrollToPage(scrollContainer.current, detail.page, config);
    }
  };

  /**
   * 创建防抖的导航函数
   *
   * @param delay - 防抖延迟时间（毫秒）
   * @returns 防抖后的导航函数
   */
  const createDebouncedNavigate = (delay: number = 100) => {
    let timer: NodeJS.Timeout | null = null;

    return (detail: LocatePDFEventDetail, onComplete?: () => void): void => {
      if (timer) clearTimeout(timer);

      timer = setTimeout(() => {
        navigateByEvent(detail);
        onComplete?.();
        timer = null;
      }, delay);
    };

    // 返回清理函数
    return {
      navigate: (detail: LocatePDFEventDetail, onComplete?: () => void) => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          navigateByEvent(detail);
          onComplete?.();
          timer = null;
        }, delay);
      },
      cleanup: () => {
        if (timer) clearTimeout(timer);
      },
    };
  };

  return {
    navigateByEvent,
    createDebouncedNavigate,
    scrollToPage: (page: number) => scrollToPage(scrollContainer.current, page, config),
    scrollToDomElement: (domId: string, fallbackPage?: number) =>
      scrollToDomElement(domId, fallbackPage, scrollContainer.current),
  };
}

/**
 * 创建页面导航控制器
 *
 * 提供上一页、下一页、跳转到指定页等功能
 *
 * @param currentPage - 当前页码
 * @param totalPage - 总页数
 * @param setCurrentPage - 设置当前页码的函数
 * @param scrollToPageFn - 滚动到指定页面的函数
 * @returns 页面导航控制器
 */
export function createPageNavigator(
  currentPage: number,
  totalPage: number,
  setCurrentPage: (page: number | ((prev: number) => number)) => void,
  scrollToPageFn: (page: number) => boolean
) {
  /**
   * 跳转到指定页面
   */
  const jumpToPage = (page: number): void => {
    if (page < 1 || page > totalPage) {
      console.warn(`页码 ${page} 超出范围 [1, ${totalPage}]`);
      return;
    }
    setCurrentPage(page);
    scrollToPageFn(page);
  };

  /**
   * 跳转到下一页
   */
  const nextPage = (): void => {
    setCurrentPage((prev) => {
      const next = Math.min(prev + 1, totalPage);
      scrollToPageFn(next);
      return next;
    });
  };

  /**
   * 跳转到上一页
   */
  const previousPage = (): void => {
    setCurrentPage((prev) => {
      const previous = Math.max(prev - 1, 1);
      scrollToPageFn(previous);
      return previous;
    });
  };

  /**
   * 是否可以跳转到下一页
   */
  const canGoNext = currentPage < totalPage;

  /**
   * 是否可以跳转到上一页
   */
  const canGoPrevious = currentPage > 1;

  return {
    jumpToPage,
    nextPage,
    previousPage,
    canGoNext,
    canGoPrevious,
  };
}

/**
 * 创建滚动监听处理器
 *
 * @param scrollContainer - 滚动容器引用
 * @param onPageChange - 页码变化回调
 * @param config - 滚动配置
 * @returns 滚动处理函数
 */
export function createScrollHandler(
  scrollContainer: RefObject<HTMLElement | null>,
  onPageChange: (page: number) => void,
  config: ScrollConfig = {}
): () => void {
  return () => {
    if (!scrollContainer.current) return;

    const page = calculateCurrentPage(scrollContainer.current, config);
    if (page !== null) {
      onPageChange(page);
    }
  };
}
