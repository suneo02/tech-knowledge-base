import classNames from 'classnames';
import { FC } from 'react';
import styles from './index.module.less';

export interface LeftPanelToggleProps {
  /** 是否处于收起状态 */
  isCollapsed: boolean;
  /** 点击展开的回调函数 */
  onExpand: () => void;
  /** 自定义类名 */
  className?: string;
}

/**
 * 左侧面板切换按钮组件
 *
 * @description 在左侧面板收起时显示的纵向展开按钮
 * @since 1.0.0
 */
export const LeftPanelToggle: FC<LeftPanelToggleProps> = ({ isCollapsed, onExpand, className }) => {
  if (!isCollapsed) {
    return null;
  }

  return (
    <div
      className={classNames(styles['left-panel-toggle'], className)}
      onClick={onExpand}
      data-component="left-panel-toggle"
    >
      <div className={styles['toggle-button']}>
        <span className={styles['toggle-icon']}>›</span>
        <span className={styles['toggle-text']}>展开</span>
      </div>
    </div>
  );
};

LeftPanelToggle.displayName = 'LeftPanelToggle';
