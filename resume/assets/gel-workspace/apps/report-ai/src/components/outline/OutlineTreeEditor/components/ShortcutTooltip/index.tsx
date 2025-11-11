/**
 * 快捷键提示Tooltip组件
 *
 * @description 显示大纲编辑器的快捷键操作提示
 */

import { Tooltip } from '@wind/wind-ui';
import { useIntl } from 'gel-ui';
import React from 'react';
import styles from './index.module.less';

export interface ShortcutTooltipProps {
  /** 子元素 */
  children: React.ReactNode;
}

/**
 * 快捷键提示内容组件
 */
const TooltipContent: React.FC = () => {
  const t = useIntl();

  return (
    <div className={styles['shortcut-tooltip']}>
      <p className={styles['shortcut-tooltip__title']}>{t('快捷操作指示：')}</p>
      <div className={styles['shortcut-tooltip__shortcuts']}>
        <p className={styles['shortcut-tooltip__item']}>
          <kbd className={styles['shortcut-tooltip__key']}>Enter</kbd>: {t('保存编辑')}
        </p>
        <p className={styles['shortcut-tooltip__item']}>
          <kbd className={styles['shortcut-tooltip__key']}>Shift+Enter</kbd>: {t('保存并新增同级')}
        </p>
        <p className={styles['shortcut-tooltip__item']}>
          <kbd className={styles['shortcut-tooltip__key']}>Tab</kbd>: {t('当前标题降一级')}
        </p>
        <p className={styles['shortcut-tooltip__item']}>
          <kbd className={styles['shortcut-tooltip__key']}>Shift+Tab</kbd>: {t('当前标题升一级')}
        </p>
        <p className={styles['shortcut-tooltip__item']}>
          <kbd className={styles['shortcut-tooltip__key']}>↓</kbd>: {t('修改下一标题')}
        </p>
        <p className={styles['shortcut-tooltip__item']}>
          <kbd className={styles['shortcut-tooltip__key']}>↑</kbd>: {t('修改上一标题')}
        </p>
        <p className={styles['shortcut-tooltip__item']}>
          <kbd className={styles['shortcut-tooltip__key']}>Esc</kbd>: {t('取消编辑')}
        </p>
      </div>
    </div>
  );
};

/**
 * 快捷键提示Tooltip组件
 */
export const ShortcutTooltip: React.FC<ShortcutTooltipProps> = ({ children }) => {
  return (
    <Tooltip
      title={<TooltipContent />}
      placement="bottomLeft"
      mouseEnterDelay={0.5}
      mouseLeaveDelay={0.1}
      overlayClassName={styles['shortcut-tooltip-overlay']}
    >
      {children}
    </Tooltip>
  );
};
