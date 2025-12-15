import { RotateRightO } from '@wind/icons';
import { Button } from '@wind/wind-ui';
import React from 'react';

/**
 * 旋转按钮组件属性
 */
interface RotateProps {
  /** 点击事件回调 */
  onClick?: React.FormEventHandler<Button>;
}

/**
 * 旋转按钮组件
 * 提供向右旋转 90 度的功能
 *
 * @example
 * ```tsx
 * <Rotate onClick={handleRotate} />
 * ```
 */
export const Rotate: React.FC<RotateProps> = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      // @ts-expect-error - Button 组件的 title 属性类型定义问题
      title="向右旋转90度"
      type="text"
      icon={
        <RotateRightO
          data-uc-id="HkAA8bTTNK6"
          data-uc-ct="rotaterighto"
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      }
      data-uc-id="gndZX1iDUaD"
      data-uc-ct="button"
    ></Button>
  );
};
