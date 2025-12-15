import { message } from '@wind/wind-ui';
import { useState } from 'react';
import { ScaleItems, ScaleModel } from '../utils';

/**
 * PDF 缩放管理 Hook
 * 用于管理 PDF 文档的缩放比例，提供放大和缩小功能
 * 缩放比例从预定义的 ScaleItems 数组中选择
 */
export function useScale() {
  // 当前缩放比例，默认为 ScaleItems[3]
  const [currentScale, setCurrentScale] = useState<ScaleModel>(ScaleItems[3]);

  /**
   * 放大 PDF
   * 切换到下一个更大的缩放比例
   */
  function zoomIn() {
    const findIndex = ScaleItems.findIndex((v) => v.value === currentScale.value);

    if (findIndex === -1) {
      setCurrentScale(ScaleItems[3]);
      return;
    }

    if (findIndex === ScaleItems.length - 1) {
      message.warning(`已经放到最大了！！！`);
      return;
    }

    setCurrentScale(ScaleItems[findIndex + 1]);
  }

  /**
   * 缩小 PDF
   * 切换到上一个更小的缩放比例
   */
  function zoomOut() {
    const findIndex = ScaleItems.findIndex((v) => v.value === currentScale.value);

    if (findIndex === -1) {
      setCurrentScale(ScaleItems[3]);
      return;
    }

    if (findIndex === 0) {
      message.warning(`已经放到最小了！！！`);
      return;
    }

    setCurrentScale(ScaleItems[findIndex - 1]);
  }

  return {
    currentScale,
    setCurrentScale,
    zoomIn,
    zoomOut,
  };
}
