import { getReferenceIdentifier, RPReferenceItem } from '@/domain/chat';
import { PreviewData, PreviewMetadata, PreviewOptions } from '../type';

/**
 * 从 RPReferenceItem 创建 PreviewData 的工具函数
 *
 * @description 将业务领域对象转换为UI状态对象，提取预览所需的信息
 * 支持通过 options 参数覆盖默认值和添加额外元数据
 *
 * @param rpRef 引用资料项目
 * @param options 可选的预览配置选项
 * @returns 预览数据对象
 */
export const createPreviewDataFromReference = (
  rpRef: RPReferenceItem,
  options?: PreviewOptions
): PreviewData => {
  // 获取标识符
  const id = getReferenceIdentifier(rpRef);

  // 默认标题和元数据
  let title: string;
  let refChapter: number[];
  let metadata: PreviewMetadata = {};

  // 根据类型获取默认标题和章节ID
  if (rpRef.type === 'file') {
    title = rpRef.data.fileName || '未知文件';
    refChapter = rpRef.data.refChapter || [];

    // 提取文件扩展名
    const fileName = rpRef.data.fileName || '';
    const fileExtension = fileName.includes('.') ? fileName.split('.').pop() : undefined;
    metadata = {
      fileExtension,
      // fileSize: rpRef.data.fileSize, // 暂时注释，因为类型中可能没有这个属性
    };
  } else if (rpRef.type === 'dpu') {
    title = rpRef.data.NewName || '数据表格';
    refChapter = rpRef.data.refChapter || [];
    metadata = {
      rowCount: rpRef.data.Total,
    };
  } else {
    title = rpRef.data.chunk?.title || rpRef.data.content?.substring(0, 50) + '...' || '建议资料';
    refChapter = rpRef.data.refChapter || [];
  }

  // 合并选项中的元数据
  if (options?.metadata) {
    metadata = { ...metadata, ...options.metadata };
  }

  // 应用选项覆盖
  return {
    type: rpRef.type,
    id,
    chapterId: options?.chapterId ? [options?.chapterId] : refChapter,
    title: options?.title || title,
    data: rpRef.data,
    metadata,
  };
};