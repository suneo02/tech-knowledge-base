import { RPFileUploaded } from '@/types';
import { useCallback } from 'react';

/**
 * 文件建议项
 */
export interface FileSuggestionItem {
  label: string;
  value: string;
}

/**
 * 文件建议Hook配置
 */
export interface UseFileSuggestionConfig {
  /** 可用文件列表 */
  files: RPFileUploaded[];
  /** 内容变更回调 */
  onContentChange: (content: string) => void;
  /** 添加引用文件回调 */
  onAddRefFile: (file: RPFileUploaded) => void;
}

/**
 * 文件建议Hook返回值
 */
export interface UseFileSuggestionResult {
  /** 获取建议项列表 */
  getSuggestionItems: () => FileSuggestionItem[];
  /** 处理选择建议项 */
  handleSelectSuggestion: (selectedFile: string, currentContent: string) => void;
}

/**
 * 文件建议Hook
 * 处理@文件引用的自动补全逻辑
 */
export const useFileSuggestion = ({
  files,
  onContentChange,
  onAddRefFile,
}: UseFileSuggestionConfig): UseFileSuggestionResult => {
  // 获取建议项列表 - 简化逻辑，因为触发条件由外部控制
  const getSuggestionItems = useCallback((): FileSuggestionItem[] => {
    try {
      // 如果没有文件，返回提示信息
      if (files.length === 0) {
        return [
          {
            label: '暂无可引用的文件，请先上传文件',
            value: '__no_files__', // 特殊值，不会被选中
          },
        ];
      }

      // 当被触发时，返回所有可用文件作为建议
      return files.map((file) => ({
        label: file.fileName || file.fileId,
        value: file.fileName || file.fileId,
      }));
    } catch (error) {
      console.error('Error getting suggestion items:', error);
      return [
        {
          label: '获取文件列表失败',
          value: '__error__',
        },
      ];
    }
  }, [files]);

  // 处理选择建议项
  const handleSelectSuggestion = useCallback(
    (selectedFile: string, currentContent: string) => {
      try {
        // 忽略特殊值选择
        if (selectedFile === '__no_files__' || selectedFile === '__error__') {
          // 移除末尾的'@'，恢复到输入前的状态
          const newContent = currentContent.replace(/@$/, '');
          onContentChange(newContent);
          return;
        }

        // 1. 更新文本内容
        const referenceText = `@[${selectedFile}]`;
        const newContent = currentContent.replace(/@$/, referenceText);
        onContentChange(newContent);

        // 2. 同时更新refFiles状态
        const selectedFileObj = files.find((f) => (f.fileName || f.fileId) === selectedFile);
        if (selectedFileObj) {
          onAddRefFile(selectedFileObj);
        }
      } catch (error) {
        console.error('Error selecting suggestion:', error);
      }
    },
    [files, onContentChange, onAddRefFile]
  );

  return {
    getSuggestionItems,
    handleSelectSuggestion,
  };
};
