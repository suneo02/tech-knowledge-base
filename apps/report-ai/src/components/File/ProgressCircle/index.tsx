import { FC } from 'react';
import styles from './index.module.less';

export interface ProgressCircleProps {
  /** 进度百分比 (0-100) */
  progress: number;
  /** 圆圈大小 */
  size?: number;
  /** 圆圈半径 */
  radius?: number;
  /** 进度条宽度 */
  strokeWidth?: number;
  /** 进度条颜色 */
  strokeColor?: string;
  /** 背景圆圈颜色 */
  backgroundColor?: string;
  /** 是否显示动画过渡 */
  animated?: boolean;
  /** 自定义类名 */
  className?: string;
}

/**
 * SVG 进度圆圈组件
 * 用于显示文件上传进度或其他进度指示
 */
export const ProgressCircle: FC<ProgressCircleProps> = ({
  progress,
  size = 24,
  radius = 10,
  strokeWidth = 2,
  strokeColor = 'white',
  backgroundColor = 'rgba(255, 255, 255, 0.3)',
  animated = true,
  className,
}) => {
  // 计算 SVG 圆圈的进度参数
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - Math.max(0, Math.min(100, progress)) / 100);

  return (
    <svg
      className={`${styles['progress-circle']} ${className || ''}`}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
    >
      {/* 背景圆圈 */}
      <circle
        className={styles['progress-circle-bg']}
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={backgroundColor}
        strokeWidth={strokeWidth}
      />
      {/* 进度圆圈 */}
      <circle
        className={styles['progress-circle-fill']}
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{
          transition: animated ? 'stroke-dashoffset 0.3s ease' : 'none',
        }}
      />
    </svg>
  );
};
