import { RPFileUploaded } from '@/types';
import { useCallback } from 'react';
import { FileReferenceParseResult } from '../type';

/**
 * 文件引用解析器Hook
 * 实现策略模式，将文件引用解析逻辑独立出来
 */
export const useFileReferenceParser = () => {
  /**
   * 解析文本中的@引用，返回引用的文件ID列表
   * @param text - 要解析的文本
   * @param files - 可用的文件列表
   * @returns 解析结果
   */
  const parseFileReferences = useCallback((text: string, files: RPFileUploaded[]): FileReferenceParseResult => {
    try {
      const referenceRegex = /@\[([^\]]+)\]/g;
      const matches = Array.from(text.matchAll(referenceRegex));
      const referencedNames = matches.map((match) => match[1]);

      // 找到有效的文件
      const validFiles = files.filter((file) => referencedNames.includes(file.fileName || file.fileId));
      const validFileNames = validFiles.map((file) => file.fileName || file.fileId);

      // 找到无效的引用
      const invalidReferences = referencedNames.filter((name) => !validFileNames.includes(name));

      // 获取文件ID列表
      const fileIds = validFiles.map((file) => file.fileId);

      return {
        fileIds,
        validRefFiles: validFiles,
        invalidReferences,
      };
    } catch (error) {
      console.error('Error parsing file references:', error);
      return {
        fileIds: [],
        validRefFiles: [],
        invalidReferences: [],
      };
    }
  }, []);

  /**
   * 验证引用文件与文本内容的一致性
   * @param text - 文本内容
   * @param files - 可用文件列表
   * @param refFiles - 当前引用文件列表
   * @returns 验证后的引用文件列表
   */
  const validateFileReferences = useCallback(
    (text: string, files: RPFileUploaded[], refFiles: RPFileUploaded[]): RPFileUploaded[] => {
      try {
        const { fileIds } = parseFileReferences(text, files);
        return refFiles.filter((rf) => fileIds.includes(rf.fileId));
      } catch (error) {
        console.error('Error validating file references:', error);
        return [];
      }
    },
    [parseFileReferences]
  );

  return {
    parseFileReferences,
    validateFileReferences,
  };
};
