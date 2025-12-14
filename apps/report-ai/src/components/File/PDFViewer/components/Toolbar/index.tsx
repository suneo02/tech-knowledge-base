import { MinusO, PlusO, RotateRightO } from '@wind/icons';
import React from 'react';
import styles from './index.module.less';

/**
 * PDF 工具栏组件属性
 */
interface PDFToolbarProps {
  /** 旋转回调 */
  onRotate?(): void;
  /** 放大回调 */
  onZoomIn?(): void;
  /** 缩小回调 */
  onZoomOut?(): void;
}

/**
 * PDF 工具栏组件
 * 提供放大、缩小、旋转三个操作按钮
 * 工具栏固定定位在页面右下角
 *
 * @example
 * ```tsx
 * <PDFToolbar
 *   onZoomIn={handleZoomIn}
 *   onZoomOut={handleZoomOut}
 *   onRotate={handleRotate}
 * />
 * ```
 */
export const PDFToolbar: React.FC<PDFToolbarProps> = ({ onRotate, onZoomIn, onZoomOut }) => {
  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbar__item} onClick={onZoomIn} title="放大" data-uc-id="pe-pZe6X9ap" data-uc-ct="div">
        <PlusO
          data-uc-id="eA_CpjKboHW"
          data-uc-ct="pluso"
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      </div>
      <div className={styles.toolbar__item} onClick={onZoomOut} title="缩小" data-uc-id="c1n5dsO64Pf" data-uc-ct="div">
        <MinusO
          data-uc-id="0WcwV-bZFlt"
          data-uc-ct="minuso"
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      </div>
      <div
        className={styles.toolbar__item}
        onClick={onRotate}
        title="向右旋转90度"
        data-uc-id="QeYLrrv3XOG"
        data-uc-ct="div"
      >
        <RotateRightO
          data-uc-id="zcXAiUOPUc9"
          data-uc-ct="rotaterighto"
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      </div>
    </div>
  );
};
