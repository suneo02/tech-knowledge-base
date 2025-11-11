import { useState } from 'react';

/**
 * PDF 旋转管理 Hook
 * 用于管理 PDF 文档的旋转角度
 * 每次旋转 90 度，支持 0°、90°、180°、270° 四个方向
 */
export function useRotate() {
  // 当前旋转角度（度）
  const [rotate, setRotate] = useState(0);

  /**
   * 向右旋转 90 度
   * 角度会在 0-360 之间循环
   */
  function onRotate() {
    setRotate((pre) => {
      return (pre + 90) % 360;
    });
  }

  return {
    rotate,
    setRotate,
    onRotate,
  };
}
