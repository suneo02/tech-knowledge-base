import { useIntl } from 'gel-ui';
import { FC } from 'react';
import { DPUPreviewRenderer } from '../DPUPreviewRenderer';
import { FilePreviewRenderer } from '../FilePreviewRenderer';
import { DPUPreviewData, FilePreviewData, PreviewData } from '../type';
import styles from './index.module.less';

export interface ReferencePreviewContentProps {
  previewData: PreviewData | null;
  onBackToList: () => void;
}

/**
 * 引用资料预览内容组件
 * 根据资料类型渲染对应的预览器（表格预览、文件预览、建议资料详情）
 *
 * @see 设计文档 {@link ../../../../docs/RPDetail/Reference/02-design.md}
 *
 * @description 负责渲染引用资料的预览内容，包括预览工具栏和预览区域
 * @since 1.0.0
 * @author 开发团队
 */
// 类型守卫函数
const isFilePreviewData = (data: PreviewData): data is FilePreviewData => {
  return data.type === 'file';
};

const isDPUPreviewData = (data: PreviewData): data is DPUPreviewData => {
  return data.type === 'dpu';
};

export const ReferencePreviewContent: FC<ReferencePreviewContentProps> = ({ previewData, onBackToList }) => {
  const t = useIntl();

  if (!previewData) {
    return null;
  }

  return (
    <div className={styles['preview-content']}>
      <div className={styles['preview-content__toolbar']}>
        <button onClick={onBackToList} className={styles['preview-content__back-button']}>
          ← {t('返回列表')}
        </button>
        <span className={styles['preview-content__title']}>{previewData.title}</span>
      </div>
      <div className={styles['preview-content__body']}>
        {isFilePreviewData(previewData) && (
          <FilePreviewRenderer
            file={previewData.data}
            onLoad={() => console.log(`文件预览加载完成: ${previewData.title}`)}
            onError={(error) => console.error(`文件预览加载失败: ${previewData.title}`, error)}
          />
        )}

        {isDPUPreviewData(previewData) && <DPUPreviewRenderer tableData={previewData.data} />}
      </div>
    </div>
  );
};
