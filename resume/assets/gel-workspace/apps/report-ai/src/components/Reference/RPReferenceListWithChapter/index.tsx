import { getReferenceIdentifier, RPReferenceItem } from '@/domain/chat';
import { getReferenceUniqueKey } from '@/domain/chat/ref/referenceUtils';
import { ReportReferenceOrdinalMap } from '@/domain/reportReference';
import { RPChapterEnriched } from '@/types';
import { RPFileUnified } from '@/types/file';
import { Empty, Spin } from '@wind/wind-ui';
import classNames from 'classnames';
import { useIntl } from 'gel-ui';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { ReferenceItemFile } from '../ReferenceItemFile';
import { ReferenceItemSuggest } from '../ReferenceItemSuggest';
import { ReferenceItemTable } from '../ReferenceItemTable';
import { RefItemNumber } from '../RefItemNumber';
import { TopFilesSection } from '../TopFilesSection';
import { PreviewData } from '../type';
import { createPreviewDataFromReference } from '../utils/previewDataUtils';
import styles from './index.module.less';

export interface RPReferenceListWithChapterProps {
  className?: string;
  style?: React.CSSProperties;
  loading?: boolean;
  refList: RPReferenceItem[];
  ordinalMap?: ReportReferenceOrdinalMap;
  topFiles?: RPFileUnified[];
  onModalClose?: () => void;
  onModalOpen?: () => void;
  /** 删除成功后的回调（用于刷新列表等） */
  onDeleteSuccess?: (fileId: string) => void;
  onPreviewStart?: (previewData: PreviewData) => void;
  /** 章节ID到章节对象的映射 */
  chapterMap?: Map<string, RPChapterEnriched>;
  /** 确认重新生成关联章节的回调 */
  onRegenerateChapters?: (chapterIds: string[]) => void;
}

/**
 * 命令式句柄接口
 */
export interface RPReferenceListWithChapterHandle {
  /**
   * 聚焦到指定 ID 的引用项
   */
  focusById: (id: string) => void;
}

export const RPReferenceListWithChapter = forwardRef<RPReferenceListWithChapterHandle, RPReferenceListWithChapterProps>(
  (
    {
      className,
      style,
      loading = false,
      refList,
      onModalClose,
      onModalOpen,
      onDeleteSuccess,
      onPreviewStart,
      ordinalMap,
      topFiles,
      chapterMap,
      onRegenerateChapters,
    },
    ref
  ) => {
    const t = useIntl();

    // 存储每个引用项的 ref，用于滚动定位
    const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

    /**
     * 聚焦到指定 ID 的引用项
     */
    const focusById = (id: string) => {
      const element = itemRefs.current.get(id);
      if (element) {
        // 平滑滚动到目标元素，居中显示
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });

        // 添加高亮效果，2秒后自动移除
        element.classList.add(styles['rp-reference-list-with-chapter__item-wrapper--highlighted']);
        setTimeout(() => {
          element.classList.remove(styles['rp-reference-list-with-chapter__item-wrapper--highlighted']);
        }, 2000);
      } else {
        console.warn(`[RPReferenceListWithChapter] 未找到引用项: id=${id}`);
      }
    };

    // 暴露命令式 API
    useImperativeHandle(ref, () => ({
      focusById,
    }));

    // 处理加载状态
    if (loading) {
      return <Spin spinning={loading} />;
    }

    // 处理空状态
    if (!refList.length && !(topFiles && topFiles.length)) {
      return <Empty description={t('暂无参考资料')} />;
    }

    const renderReferenceItem = (reference: RPReferenceItem) => {
      const key = getReferenceUniqueKey(reference);

      const refId = getReferenceIdentifier(reference);

      // 处理预览点击事件
      const handlePreviewClick = () => {
        if (onPreviewStart && (reference.type === 'file' || reference.type === 'dpu')) {
          const previewData = createPreviewDataFromReference(reference);
          onPreviewStart(previewData);
        }
      };

      /**
       * 处理 rag 类型的点击事件
       * 不进入预览模式，而是在列表中聚焦到对应项并高亮显示
       */
      const handleRagClick = () => {
        const element = itemRefs.current.get(key);
        if (element) {
          // 平滑滚动到目标元素，居中显示
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });

          // 添加高亮效果，2秒后自动移除
          element.classList.add(styles['rp-reference-list-with-chapter__item-wrapper--highlighted']);
          setTimeout(() => {
            element.classList.remove(styles['rp-reference-list-with-chapter__item-wrapper--highlighted']);
          }, 2000);
        }
      };

      const itemContent = (() => {
        if (reference.type === 'file') {
          return (
            <ReferenceItemFile
              key={key}
              file={reference.data}
              onDeleteSuccess={onDeleteSuccess}
              onClick={handlePreviewClick}
              chapterMap={chapterMap}
              onRegenerateChapters={onRegenerateChapters}
            />
          );
        }

        if (reference.type === 'dpu') {
          return (
            <ReferenceItemTable
              key={key}
              data={reference.data}
              onModalClose={onModalClose}
              onModalOpen={onModalOpen}
              onClick={handlePreviewClick}
            />
          );
        }

        if (reference.type === 'rag') {
          return <ReferenceItemSuggest key={key} data={reference.data} onClick={handleRagClick} />;
        }

        // 这里不应该到达，但为了类型安全
        return null;
      })();

      return (
        <div
          key={key}
          ref={(el) => {
            if (el) {
              itemRefs.current.set(key, el);
            } else {
              itemRefs.current.delete(key);
            }
          }}
          className={styles['rp-reference-list-with-chapter__item-wrapper']}
        >
          <RefItemNumber refId={refId} ordinalMap={ordinalMap} />
          <div className={styles['rp-reference-list-with-chapter__item-content']}>{itemContent}</div>
        </div>
      );
    };

    return (
      <div className={classNames(styles['rp-reference-list-with-chapter'], className)} style={style}>
        {topFiles && topFiles.length > 0 && (
          <TopFilesSection
            files={topFiles}
            onPreviewStart={onPreviewStart}
            onDeleteSuccess={onDeleteSuccess}
            chapterMap={chapterMap}
            onRegenerateChapters={onRegenerateChapters}
          />
        )}
        {refList.map(renderReferenceItem)}
      </div>
    );
  }
);

RPReferenceListWithChapter.displayName = 'RPReferenceListWithChapter';
