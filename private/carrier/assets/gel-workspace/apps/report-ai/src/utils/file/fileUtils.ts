import { RPFileUnified } from '@/types';

/**
 * 支持的文件预览类型
 */
export type SupportedFileType = 'pdf' | 'image' | 'text' | 'word' | 'unsupported';

/**
 * 从文件名获取文件扩展名
 *
 * @param fileName 文件名
 * @returns 文件扩展名（小写）
 */
export const getFileExtension = (fileName: string): string => {
  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex === -1) return '';
  return fileName.substring(lastDotIndex + 1).toLowerCase();
};

/**
 * 根据文件扩展名判断文件类型
 *
 * @param extension 文件扩展名
 * @returns 支持的文件类型
 */
export const getFileTypeByExtension = (extension: string): SupportedFileType => {
  const ext = extension.toLowerCase();

  // PDF文件
  if (ext === 'pdf') {
    return 'pdf';
  }

  // Word文件
  if (ext === 'doc' || ext === 'docx') {
    return 'word';
  }

  // 图片文件
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(ext)) {
    return 'image';
  }

  // 文本文件
  if (['txt', 'md', 'json', 'xml', 'csv', 'log'].includes(ext)) {
    return 'text';
  }

  return 'unsupported';
};

/**
 * 检测文件类型
 *
 * @param file 文件数据
 * @returns 支持的文件类型
 */
export const detectFileType = (file: RPFileUnified): SupportedFileType => {
  if (!file.fileName) {
    return 'unsupported';
  }

  const extension = getFileExtension(file.fileName);
  return getFileTypeByExtension(extension);
};

/**
 * 格式化文件大小
 *
 * @param bytes 文件大小（字节）
 * @returns 格式化的文件大小字符串
 */
export const formatFileSize = (bytes?: number): string => {
  if (!bytes || bytes === 0) return '0 B';

  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

/**
 * 检查文件是否可以预览
 *
 * @param file 文件数据
 * @returns 是否可以预览
 */
export const isFilePreviewable = (file: RPFileUnified): boolean => {
  const fileType = detectFileType(file);
  return fileType !== 'unsupported';
};
