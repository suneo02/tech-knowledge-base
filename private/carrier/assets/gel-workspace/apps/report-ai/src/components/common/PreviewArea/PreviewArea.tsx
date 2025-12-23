import { Spin } from '@wind/wind-ui';
import classNames from 'classnames';
import { FC } from 'react';
import styles from './index.module.less';
import { PreviewAreaProps } from './types';

/**
 * 预览区域容器组件
 *
 * @description 支持列表视图和预览视图的切换，提供统一的预览容器布局
 * @since 1.0.0
 * @author 开发团队
 *
 * @example
 * ```tsx
 * import { PreviewArea } from '@/components/common/PreviewArea';
 *
 * <PreviewArea
 *   mode="list"
 *   listContent={<ChatRefList />}
 *   previewContent={<FilePreview />}
 * />
 * ```
 *
 * @param props - PreviewArea 组件属性
 * @returns JSX.Element 预览区域容器组件
 */
export const PreviewArea: FC<PreviewAreaProps> = ({ mode, listContent, previewContent, className, style }) => {
  // 构建容器类名
  const containerClassName = classNames(
    styles.previewArea,
    {
      [styles['previewArea--listMode']]: mode === 'list',
      [styles['previewArea--previewMode']]: mode === 'preview',
    },
    className
  );

  return (
    <div className={containerClassName} style={style}>
      <div className={styles.viewContainer}>
        {/* 列表视图 */}
        <div className={styles['viewContainer__list']}>{listContent}</div>

        {/* 预览视图 */}
        <div className={styles['viewContainer__preview']}>
          {mode === 'preview' && (
            <>
              {previewContent ? (
                previewContent
              ) : (
                <div className={styles.previewArea__loading}>
                  <Spin spinning={true} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

PreviewArea.displayName = 'PreviewArea';
