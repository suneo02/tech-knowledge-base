import { MinusO, PlusO } from '@wind/icons';
import { Button } from '@wind/wind-ui';
import React from 'react';
import styles from './index.module.less';

/**
 * 缩放选择器组件属性
 */
interface ScaleSelectorProps {
  /** 缩放比例名称（如 "100%", "150%" 等） */
  scaleName: string;
  /** 放大回调 */
  onZoomIn?(): void;
  /** 缩小回调 */
  onZoomOut?(): void;
}

/**
 * 缩放选择器组件
 * 在 PDF 头部显示当前缩放比例，提供放大和缩小按钮
 *
 * @example
 * ```tsx
 * <ScaleSelector
 *   scaleName="100%"
 *   onZoomIn={handleZoomIn}
 *   onZoomOut={handleZoomOut}
 * />
 * ```
 */
export const ScaleSelector: React.FC<ScaleSelectorProps> = ({ scaleName, onZoomIn, onZoomOut }) => {
  return (
    <div className={styles['scale-selector']}>
      <Button type="text" onClick={onZoomOut} data-uc-id="jLbLJIPnkef" data-uc-ct="button">
        <MinusO
          data-uc-id="2KBP3yeyX7R"
          data-uc-ct="minuso"
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      </Button>
      <span>{scaleName}</span>
      <Button type="text" onClick={onZoomIn} data-uc-id="ikuvNBRv3yH" data-uc-ct="button">
        <PlusO
          data-uc-id="Wi_NLsSoM4G"
          data-uc-ct="pluso"
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      </Button>
    </div>
  );
};
