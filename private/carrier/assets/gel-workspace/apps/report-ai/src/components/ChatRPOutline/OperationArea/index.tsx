/**
 * RPOutline 操作区组件
 *
 * @description 承载返回、重新生成大纲、生成全文等关键操作按钮
 * @since 1.0.0
 */

import { Button } from '@wind/wind-ui';
import { FC } from 'react';
import { useOperationActions } from './hooks/useOperationActions';
import styles from './index.module.less';

/**
 * 操作区组件属性
 */
export interface OperationAreaProps {
  /** 自定义类名 */
  className?: string;
}

/**
 * 操作区主组件
 *
 * @description 承载返回、重新生成大纲、生成全文等关键操作按钮
 */
export const OperationArea: FC<OperationAreaProps> = ({ className }) => {
  // 获取操作方法和状态
  const {
    handleBack,
    handleRegenerate,
    handleGenerateFullText,
    isGeneratingFullText,
    isBackDisabled,
    isRegenerateDisabled,
    isGenerateFullTextDisabled,
  } = useOperationActions();

  return (
    <div className={`${styles['operation-area']} ${className || ''}`.trim()}>
      <div className={styles['button-group']}>
        <Button size="large" onClick={handleBack} disabled={isBackDisabled} className={styles['back-button']}>
          返回
        </Button>

        <Button
          size="large"
          onClick={handleRegenerate}
          disabled={isRegenerateDisabled}
          className={styles['regenerate-button']}
        >
          重新生成大纲
        </Button>

        <Button
          type="primary"
          size="large"
          onClick={handleGenerateFullText}
          disabled={isGenerateFullTextDisabled}
          loading={isGeneratingFullText}
          className={styles['generate-button']}
        >
          生成全文
        </Button>
      </div>
    </div>
  );
};
