import { RPFileUploaded } from '@/types';
import { useCallback } from 'react';
import { useChatFileCollection } from './useChatFileCollection';
import { useFileReferenceManager } from './useFileReferenceManager';
import { FileUploadSuccessCallback } from '@/components/File/UploadFileBtn';
import { FileRemoveCallback } from '../type';

/**
 * 文件管理器Hook返回值
 */
export interface UseChatFileManagerResult {
  /** 上传的文件列表 */
  files: RPFileUploaded[];
  /** 引用的文件列表 */
  refFiles: RPFileUploaded[];
  /** 处理文件上传成功 */
  handleUploadSuccess: FileUploadSuccessCallback;
  /** 处理文件移除 */
  handleFileRemove: FileRemoveCallback;
  /** 清空所有文件 */
  handleClearFiles: () => void;
  /** 更新引用文件列表 */
  updateRefFiles: (newRefFiles: RPFileUploaded[]) => void;
  /** 添加引用文件 */
  addRefFile: (file: RPFileUploaded) => void;
  /** 根据文本内容同步引用文件 */
  syncRefFilesWithText: (text: string) => void;
  /** 检查是否可以上传更多文件 */
  canUploadMore: boolean;
  /** 剩余可上传文件数量 */
  remainingFileCount: number;
  /** 开始文件上传（添加上传中的文件项） */
  handleUploadStart: (fileName: string, fileType?: string) => string;
  /** 更新文件上传进度 */
  handleUploadProgress: (fileId: string, progress: number) => void;
  /** 处理文件上传失败 */
  handleUploadError: (fileId: string, error?: string) => void;
}

/**
 * 文件管理器Hook
 * 实现Facade模式，提供统一的文件管理接口
 * 将上传管理和引用文件管理的逻辑分离，保持接口的向后兼容性
 */
export const useChatFileManager = (
  onUploadSuccess?: FileUploadSuccessCallback,
  maxFileCount: number = 4
): UseChatFileManagerResult => {
  // 使用聊天文件集合处理文件上传相关逻辑
  const fileCollection = useChatFileCollection(onUploadSuccess, maxFileCount);

  // 使用文件引用管理器处理文件引用相关逻辑
  const referenceManager = useFileReferenceManager();

  // 统一的文件移除处理 - 同时从files和refFiles中移除
  const handleFileRemove = useCallback(
    (fileId: string) => {
      fileCollection.handleFileRemove(fileId);
      referenceManager.handleRefFileRemove(fileId);
    },
    [fileCollection, referenceManager]
  );

  // 统一的清空文件处理
  const handleClearFiles = useCallback(() => {
    fileCollection.handleClearFiles();
    referenceManager.handleClearRefFiles();
  }, [fileCollection, referenceManager]);

  // 包装 syncRefFilesWithText 以传递当前的 files
  const syncRefFilesWithText = useCallback(
    (text: string) => {
      referenceManager.syncRefFilesWithText(text, fileCollection.files);
    },
    [referenceManager, fileCollection.files]
  );

  return {
    // 聊天文件集合的接口
    files: fileCollection.files,
    canUploadMore: fileCollection.canUploadMore,
    remainingFileCount: fileCollection.remainingFileCount,
    handleUploadStart: fileCollection.handleUploadStart,
    handleUploadProgress: fileCollection.handleUploadProgress,
    handleUploadSuccess: fileCollection.handleUploadSuccess,
    handleUploadError: fileCollection.handleUploadError,

    // 文件引用管理器的接口
    refFiles: referenceManager.refFiles,
    updateRefFiles: referenceManager.updateRefFiles,
    addRefFile: referenceManager.addRefFile,
    syncRefFilesWithText,

    // 统一的文件操作接口
    handleFileRemove,
    handleClearFiles,
  };
};
