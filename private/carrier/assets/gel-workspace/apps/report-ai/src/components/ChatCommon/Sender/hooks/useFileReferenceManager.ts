import { RPFileUploaded } from '@/types';
import { useCallback, useState } from 'react';
import { useFileReferenceParser } from './useFileReferenceParser';

/**
 * 引用文件管理器Hook返回值
 */
export interface UseFileReferenceManagerResult {
  /** 引用的文件列表 */
  refFiles: RPFileUploaded[];
  /** 更新引用文件列表 */
  updateRefFiles: (newRefFiles: RPFileUploaded[]) => void;
  /** 添加引用文件 */
  addRefFile: (file: RPFileUploaded) => void;
  /** 根据文本内容同步引用文件 */
  syncRefFilesWithText: (text: string, files: RPFileUploaded[]) => void;
  /** 处理引用文件移除 */
  handleRefFileRemove: (fileId: string) => void;
  /** 清空所有引用文件 */
  handleClearRefFiles: () => void;
}

/**
 * 引用文件管理器Hook
 * 专门处理文件引用相关的逻辑，包括@文件引用、文本解析等
 */
export const useFileReferenceManager = (): UseFileReferenceManagerResult => {
  const [refFiles, setRefFiles] = useState<RPFileUploaded[]>([]);

  const { validateFileReferences } = useFileReferenceParser();

  // 更新引用文件列表
  const updateRefFiles = useCallback((newRefFiles: RPFileUploaded[]) => {
    setRefFiles(newRefFiles);
  }, []);

  // 添加引用文件（避免重复）
  const addRefFile = useCallback((file: RPFileUploaded) => {
    try {
      setRefFiles((prev) => {
        const exists = prev.some((rf) => rf.fileId === file.fileId);
        if (exists) return prev;
        return [...prev, file];
      });
    } catch (error) {
      console.error('Error adding ref file:', error);
    }
  }, []);

  // 根据文本内容同步引用文件
  const syncRefFilesWithText = useCallback(
    (text: string, files: RPFileUploaded[]) => {
      try {
        const validRefFiles = validateFileReferences(text, files, refFiles);
        setRefFiles(validRefFiles);
      } catch (error) {
        console.error('Error syncing ref files with text:', error);
      }
    },
    [refFiles, validateFileReferences]
  );

  // 处理引用文件移除
  const handleRefFileRemove = useCallback((fileId: string) => {
    try {
      setRefFiles((prev) => prev.filter((rf) => rf.fileId !== fileId));
    } catch (error) {
      console.error('Error removing ref file:', error);
    }
  }, []);

  // 清空所有引用文件
  const handleClearRefFiles = useCallback(() => {
    try {
      setRefFiles([]);
    } catch (error) {
      console.error('Error clearing ref files:', error);
    }
  }, []);

  return {
    refFiles,
    updateRefFiles,
    addRefFile,
    syncRefFilesWithText,
    handleRefFileRemove,
    handleClearRefFiles,
  };
};
