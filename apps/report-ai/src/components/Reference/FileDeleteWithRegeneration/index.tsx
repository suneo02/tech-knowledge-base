/**
 * 文件删除与重新生成组件
 *
 * @description
 * 封装文件删除的完整流程：
 * 1. 删除前确认，显示关联章节
 * 2. 调用删除 API
 * 3. 删除成功后通知外部（用于刷新列表等）
 * 4. 询问是否重新生成关联章节
 *
 * @see {@link ../ReportFileUpload/index.tsx | ReportFileUpload 组件} - 参考的封装模式
 */

import { requestToChat } from '@/api';
import { RPChapterEnriched } from '@/types';
import { RPFileUnified } from '@/types/file';
import { Button, message, Popover } from '@wind/wind-ui';
import { isNil } from 'lodash-es';
import { FC, ReactElement, useCallback, useMemo, useRef, useState } from 'react';

export interface FileDeleteWithRegenerationProps {
  /** 文件信息 */
  file: RPFileUnified;
  /** 删除成功后的回调（用于刷新列表等） */
  onDeleteSuccess?: (fileId: string) => void;
  /** 章节ID到章节对象的映射 */
  chapterMap?: Map<string, RPChapterEnriched>;
  /** 确认重新生成关联章节的回调 */
  onRegenerateChapters?: (chapterIds: string[]) => void;
  /** 触发删除的子元素（通常是删除按钮） */
  children: ReactElement;
}

/**
 * 文件删除与重新生成组件
 *
 * 使用示例：
 * ```tsx
 * <FileDeleteWithRegeneration
 *   file={file}
 *   onDeleteSuccess={handleDeleteSuccess}
 *   chapterMap={chapterMap}
 *   onRegenerateChapters={handleRegenerate}
 * >
 *   <Button icon={<DeleteO />} />
 * </FileDeleteWithRegeneration>
 * ```
 */
export const FileDeleteWithRegeneration: FC<FileDeleteWithRegenerationProps> = ({
  file,
  onDeleteSuccess,
  chapterMap,
  onRegenerateChapters,
  children,
}) => {
  // Popover 状态管理
  const [deletePopoverOpen, setDeletePopoverOpen] = useState(false);
  const [regeneratePopoverOpen, setRegeneratePopoverOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 用于共享定位参考点的 ref
  const triggerRef = useRef<HTMLDivElement>(null);

  // 获取关联的章节信息
  const relatedChapters = useMemo(() => {
    if (!file.refChapter || file.refChapter.length === 0) {
      return [];
    }

    return file.refChapter
      .map((chapterId) => {
        const chapterIdStr = String(chapterId);
        const chapter = chapterMap?.get(chapterIdStr);
        if (!chapter) {
          console.error('chapter not found', file, chapterId);
          return null;
        }
        return chapter;
      })
      .filter((ch) => !isNil(ch));
  }, [file.refChapter, chapterMap]);

  // 生成章节列表文本
  const chapterListText = useMemo(() => {
    return relatedChapters.map((ch) => `${ch.hierarchicalNumber} ${ch.title}`).join('、');
  }, [relatedChapters]);

  // 确认删除
  const handleConfirmDelete = useCallback(async () => {
    if (!file.fileId) {
      return;
    }

    setIsDeleting(true);
    setDeletePopoverOpen(false);

    try {
      // 调用删除 API
      await requestToChat('report/fileDelete', {
        fileId: file.fileId,
      });

      message.success('文件删除成功');

      // 通知外部删除成功（用于刷新列表等）
      onDeleteSuccess?.(file.fileId);

      // 如果有关联章节，询问是否重新生成
      if (relatedChapters.length > 0 && onRegenerateChapters) {
        setRegeneratePopoverOpen(true);
      }
    } catch (error) {
      console.error('[FileDeleteWithRegeneration] 删除文件失败:', error);
      message.error('文件删除失败');
    } finally {
      setIsDeleting(false);
    }
  }, [file.fileId, onDeleteSuccess, relatedChapters, onRegenerateChapters]);

  // 取消删除
  const handleCancelDelete = useCallback(() => {
    setDeletePopoverOpen(false);
  }, []);

  // 确认重新生成
  const handleConfirmRegenerate = useCallback(() => {
    setRegeneratePopoverOpen(false);
    const chapterIds = relatedChapters.map((ch) => String(ch.chapterId));
    onRegenerateChapters?.(chapterIds);
  }, [relatedChapters, onRegenerateChapters]);

  // 取消重新生成
  const handleCancelRegenerate = useCallback(() => {
    setRegeneratePopoverOpen(false);
  }, []);

  // 构造删除确认的 Popover 内容
  const deletePopoverContent = useMemo(() => {
    let description: React.ReactNode;

    if (relatedChapters.length === 0) {
      description = `确定要删除文件"${file.fileName}"吗？`;
    } else {
      description = (
        <div>
          <div>文件"{file.fileName}"被以下章节引用：</div>
          <div style={{ marginTop: 8, marginBottom: 8, color: '#666' }}>{chapterListText}</div>
          <div>确定要删除该文件吗？</div>
        </div>
      );
    }

    return (
      <div style={{ width: 300, minWidth: 300 }}>
        <div style={{ marginBottom: 12 }}>{description}</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button size="small" onClick={handleCancelDelete}>
            取消
          </Button>
          <Button type="primary" size="small" loading={isDeleting} onClick={handleConfirmDelete}>
            删除
          </Button>
        </div>
      </div>
    );
  }, [file.fileName, relatedChapters.length, chapterListText, isDeleting, handleCancelDelete, handleConfirmDelete]);

  // 构造重新生成确认的 Popover 内容
  const regeneratePopoverContent = useMemo(() => {
    if (relatedChapters.length === 0) {
      return null;
    }

    const description = `文件"${file.fileName}"已删除，是否重新生成以下关联章节：${chapterListText}？`;

    return (
      <div style={{ width: 300, minWidth: 300 }}>
        <div style={{ marginBottom: 12 }}>{description}</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button size="small" onClick={handleCancelRegenerate}>
            暂不生成
          </Button>
          <Button type="primary" size="small" onClick={handleConfirmRegenerate}>
            重新生成
          </Button>
        </div>
      </div>
    );
  }, [file.fileName, relatedChapters.length, chapterListText, handleCancelRegenerate, handleConfirmRegenerate]);

  return (
    <>
      {/* 删除确认弹窗 */}
      <Popover
        visible={deletePopoverOpen}
        content={deletePopoverContent}
        title="删除文件"
        trigger="click"
        onVisibleChange={setDeletePopoverOpen}
      >
        <div ref={triggerRef}>{children}</div>
      </Popover>

      {/* 重新生成确认弹窗 - 使用 getPopupContainer 共享定位参考点 */}
      <Popover
        visible={regeneratePopoverOpen}
        content={regeneratePopoverContent}
        title="重新生成章节"
        trigger="click"
        placement="left"
        onVisibleChange={setRegeneratePopoverOpen}
        getPopupContainer={() => triggerRef.current || document.body}
      >
        <span />
      </Popover>
    </>
  );
};
