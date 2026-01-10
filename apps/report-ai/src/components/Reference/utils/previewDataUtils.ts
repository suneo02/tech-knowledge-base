import { getReferenceIdentifier, RPReferenceItem } from '@/domain/chat';
import { RefPreviewData, RefPreviewOptions } from '@/types';

/**
 * 从 RPReferenceItem 创建 RefPreviewData 的工具函数
 *
 * @description 将业务领域对象转换为UI状态对象，提取预览所需的信息
 * 支持通过 options 参数覆盖默认值和添加额外元数据
 *
 * @param rpRef 引用资料项目
 * @param options 可选的预览配置选项
 * @returns 预览数据对象
 */
export const createPreviewDataFromReference = (rpRef: RPReferenceItem, options?: RefPreviewOptions): RefPreviewData => {
  // 获取标识符
  const id = getReferenceIdentifier(rpRef);

  // 默认标题和元数据
  let title: string;
  let refChapter: number[];

  // 根据类型获取默认标题和章节ID
  if (rpRef.type === 'file') {
    title = rpRef.data.fileName || '未知文件';
    refChapter = rpRef.data.refChapter || [];
  } else if (rpRef.type === 'dpu') {
    title = rpRef.data.NewName || '数据表格';
    refChapter = rpRef.data.refChapter || [];
  } else {
    title = rpRef.data.chunk?.title || rpRef.data.content?.substring(0, 50) + '...' || '建议资料';
    refChapter = rpRef.data.refChapter || [];
  }

  // 构建基础预览数据
  const previewData: RefPreviewData = {
    type: rpRef.type,
    id,
    chapterId: options?.chapterId ? [options?.chapterId] : refChapter,
    title: options?.title || title,
    data: rpRef.data,
  };

  // 如果提供了页码选项（用于 PDF 文件预览跳转），添加到预览数据中
  if (options?.pageNumber !== undefined) {
    previewData.pageNumber = options.pageNumber;
  }

  return previewData;
};
