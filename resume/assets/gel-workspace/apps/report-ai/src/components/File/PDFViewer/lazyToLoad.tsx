import { Spin } from 'antd';
import cx from 'classnames';
import { OnRenderSuccess, PageCallback } from 'node_modules/react-pdf/dist/esm/shared/types';
import { HTMLAttributes, ReactNode, useEffect, useRef, useState } from 'react';
import styles from './lazyToLoad.module.less';
import { PDFSelectionModel } from './types';

/**
 * 懒加载容器组件属性
 */
interface LazyToLoadProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** 容器宽度（像素） */
  width: number;
  /** 容器高度（像素） */
  height: number;
  /** 页码（从 1 开始） */
  page: number;
  /** 缩放比例 */
  scale?: number;
  /** 旋转角度（度） */
  rotate?: number;
  /** 文本选区数组，用于高亮显示 */
  selectionText?: PDFSelectionModel[];
  /**
   * 子元素渲染函数
   * @param visible - 当前页面是否在可视区域内
   * @param isFirst - 是否是第一次进入可视区域
   * @param onRenderSuccess - 页面渲染成功回调
   */
  children?(visible: boolean, isFirst: boolean, onRenderSuccess: OnRenderSuccess): ReactNode;
}

/**
 * IntersectionObserver 配置
 * threshold: 当 10% 的元素可见时触发回调
 */
const INTERSECTION_THRESHOLD = 0.1;

/**
 * 创建 IntersectionObserver 实例
 * 用于监听元素是否进入可视区域
 *
 * @param onIntersect - 交叉状态变化回调
 * @returns IntersectionObserver 实例
 */
const createIntersectionObserver = (onIntersect: (isIntersecting: boolean) => void): IntersectionObserver => {
  return new IntersectionObserver(
    ([entry]) => {
      onIntersect(entry.isIntersecting);
    },
    { threshold: INTERSECTION_THRESHOLD }
  );
};

/**
 * 计算高亮区域的实际显示位置和尺寸
 *
 * @param selection - 选区模型（基于 PDF 原始坐标）
 * @param scale - 页面缩放比例
 * @returns 实际显示的位置和尺寸
 */
const calculateSelectionStyle = (
  selection: PDFSelectionModel,
  scale: number
): { left: number; top: number; width: number; height: number } => {
  // 计算宽度和高度
  const width = Math.abs((selection.endX - selection.startX) * scale);
  const height = Math.abs((selection.endY - selection.startY) * scale);

  // 确定左上角位置（处理反向选择的情况）
  const left = selection.startX * scale;
  const top = (selection.endY < selection.startY ? selection.endY : selection.startY) * scale;

  return { left, top, width, height };
};

/**
 * 懒加载容器组件
 *
 * @description
 * 使用 IntersectionObserver 实现 PDF 页面的懒加载和懒卸载
 * 只在页面进入可视区域时才渲染内容，离开可视区域时卸载，提升性能
 *
 * 主要功能：
 * 1. 懒加载：页面进入可视区域时才渲染 PDF 内容
 * 2. 懒卸载：页面离开可视区域时卸载内容（首次加载后除外）
 * 3. 文本高亮：在页面上叠加高亮选区层
 * 4. 动态高度：根据实际渲染结果调整容器高度
 *
 * @see 设计文档 {@link ../../../../docs/RPDetail/Reference/02-design.md}
 */
export function LazyToLoad({
  children,
  width,
  height,
  style,
  scale,
  className,
  selectionText,
  page,
  rotate = 0,
  ...restProps
}: LazyToLoadProps) {
  // 当前页面是否在可视区域内
  const [visible, setVisible] = useState(false);
  // 是否是第一次进入可视区域（用于判断是否显示加载状态）
  const [isFirst, setIsFirst] = useState(true);
  // 页面实际渲染后的缩放比例（可能与传入的 scale 不同）
  const [pageScale, setPageScale] = useState(scale);

  const containerRef = useRef<HTMLDivElement | null>(null);

  /**
   * 设置 IntersectionObserver 监听元素可见性
   * 当元素进入或离开可视区域时更新状态
   */
  useEffect(() => {
    const handleIntersect = (isIntersecting: boolean) => {
      if (isIntersecting) {
        // 首次进入可视区域，标记为已加载
        setIsFirst(false);
      }
      // 更新可见状态
      setVisible(isIntersecting);
    };

    const observer = createIntersectionObserver(handleIntersect);
    const currentRef = containerRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    // 清理：组件卸载时停止观察
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  /**
   * 页面渲染成功回调
   * 用于更新容器高度和实际缩放比例
   *
   * @param params - 页面回调参数，包含实际渲染尺寸
   */
  const onRenderSuccess = (params: PageCallback) => {
    if (params.height && containerRef.current) {
      // 更新容器高度为实际渲染高度
      containerRef.current.style.setProperty('height', `${params.height}px`);

      // 计算实际缩放比例（实际高度 / 原始高度）
      const actualScale = params.height / params.originalHeight;
      setPageScale(actualScale);
    }
  };

  return (
    <div
      className={cx(styles['lazy-container'], className)}
      {...restProps}
      style={{ ...style, width, height }}
      ref={containerRef}
      data-page={page}
    >
      {/* 渲染 PDF 页面内容 */}
      {children?.(visible, isFirst, onRenderSuccess)}

      {/* 首次加载时显示加载状态 */}
      {!visible && isFirst && (
        <div className={styles['lazy-container__loading']}>
          <Spin spinning />
        </div>
      )}

      {/* 文本高亮选区层 */}
      {pageScale && selectionText && selectionText.length > 0 && (
        <div className={styles['lazy-container__selection-layer']} style={{ transform: `rotate(${rotate}deg)` }}>
          {selectionText.map((selection) => {
            const { left, top, width, height } = calculateSelectionStyle(selection, pageScale);

            return (
              <div
                key={selection.dataId}
                className="pdf-selection"
                id={selection.dataId}
                style={{
                  position: 'absolute',
                  left,
                  top,
                  width,
                  height,
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

LazyToLoad.displayName = 'LazyToLoad';
