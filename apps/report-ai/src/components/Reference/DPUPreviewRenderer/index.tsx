import classNames from 'classnames';
import { ChatDPUTable } from 'gel-ui';
import { FC } from 'react';
import styles from './index.module.less';
import { DPUPreviewRendererProps } from './types';
export type { DPUPreviewRendererProps } from './types';

/**
 * 表格预览渲染器组件
 *
 * @description 适配内联预览的表格渲染器，基于 ChatDPUTableViewer 实现，去除了模态框限制
 *
 * @example
 * ```tsx
 * <DPUPreviewRenderer
 *   tableData={tableData}
 * />
 * ```
 */
export const DPUPreviewRenderer: FC<DPUPreviewRendererProps> = ({ tableData, style, className }) => {
  return (
    <div className={classNames(styles['dpu-preview-renderer'], className)} style={style}>
      {/* 表格内容 */}
      <div className={styles['dpu-preview-renderer__content']}>
        <ChatDPUTable data={tableData} />
      </div>
    </div>
  );
};

DPUPreviewRenderer.displayName = 'DPUPreviewRenderer';
