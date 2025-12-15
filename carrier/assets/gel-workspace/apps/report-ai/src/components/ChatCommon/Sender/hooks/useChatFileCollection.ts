import { RPFileUploaded } from '@/types';
import { message } from 'antd';
import { RPFileIdIdentifier } from 'gel-api';
import { useCallback, useReducer } from 'react';
import { detectFileType } from '../../../File/FileItem/utils';
import { FileUploadSuccessCallback } from '@/components/File/UploadFileBtn';

/** 最大文件上传数量 */
// 默认最大文件数量（可通过参数覆盖）
const DEFAULT_MAX_FILE_COUNT = 4;

/**
 * 上传管理器状态
 */
interface ChatFileCollectionState {
  /** 上传的文件列表 */
  files: RPFileUploaded[];
  /** 正在上传的文件ID映射：临时ID -> 文件名 */
  uploadingFiles: Map<string, string>;
}

/**
 * 上传管理器 Action 类型
 */
type ChatFileCollectionAction =
  | { type: 'UPLOAD_START'; payload: RPFileIdIdentifier & { fileName: string; fileType?: string } }
  | { type: 'UPLOAD_PROGRESS'; payload: RPFileIdIdentifier & { progress: number } }
  | { type: 'UPLOAD_SUCCESS'; payload: { file: RPFileUploaded; matchingFileId?: string } }
  | { type: 'UPLOAD_ERROR'; payload: RPFileIdIdentifier }
  | { type: 'FILE_REMOVE'; payload: RPFileIdIdentifier }
  | { type: 'FILES_CLEAR' };

/**
 * 上传管理器 Reducer
 */
const chatFileCollectionReducer = (
  state: ChatFileCollectionState,
  action: ChatFileCollectionAction
): ChatFileCollectionState => {
  switch (action.type) {
    case 'UPLOAD_START': {
      const { fileId, fileName, fileType } = action.payload;

      const uploadingFile: RPFileUploaded = {
        fileId,
        fileName,
        uploadTime: new Date().toISOString(),
        fileType: detectFileType(fileType, fileName),
        uploadProgress: 1, // 开始时设置为 1%，表示上传已开始
      };

      return {
        ...state,
        files: [...state.files, uploadingFile],
        uploadingFiles: new Map(state.uploadingFiles).set(fileId, fileName),
      };
    }

    case 'UPLOAD_PROGRESS': {
      const { fileId, progress } = action.payload;

      return {
        ...state,
        files: state.files.map((file) =>
          file.fileId === fileId ? { ...file, uploadProgress: Math.min(100, Math.max(0, progress)) } : file
        ),
      };
    }

    case 'UPLOAD_SUCCESS': {
      const { file, matchingFileId } = action.payload;

      if (matchingFileId) {
        // 查找匹配的上传中文件
        const existingFileIndex = state.files.findIndex((f) => f.fileId === matchingFileId);

        if (existingFileIndex !== -1) {
          // 文件仍存在，更新为完成状态并替换为真实ID
          const newUploadingFiles = new Map(state.uploadingFiles);
          newUploadingFiles.delete(matchingFileId);

          return {
            ...state,
            files: state.files.map((f, index) =>
              index === existingFileIndex
                ? {
                    ...file,
                    uploadProgress: 100,
                    uploadTime: f.uploadTime,
                    fileType: f.fileType,
                  }
                : f
            ),
            uploadingFiles: newUploadingFiles,
          };
        } else {
          // 文件已被删除，只清理上传记录
          const newUploadingFiles = new Map(state.uploadingFiles);
          newUploadingFiles.delete(matchingFileId);

          return {
            ...state,
            uploadingFiles: newUploadingFiles,
          };
        }
      } else {
        // 没有匹配的上传中文件，直接添加（兼容旧方式）
        // 注意：这里不能使用 maxFileCount，因为 reducer 无法访问外部变量
        // 这个检查应该在调用方进行

        return {
          ...state,
          files: [...state.files, { ...file, uploadProgress: 100 }],
        };
      }
    }

    case 'UPLOAD_ERROR': {
      const { fileId } = action.payload;

      const newUploadingFiles = new Map(state.uploadingFiles);
      newUploadingFiles.delete(fileId);

      return {
        ...state,
        files: state.files.filter((file) => file.fileId !== fileId),
        uploadingFiles: newUploadingFiles,
      };
    }

    case 'FILE_REMOVE': {
      const { fileId } = action.payload;

      const newUploadingFiles = new Map(state.uploadingFiles);
      newUploadingFiles.delete(fileId);

      return {
        ...state,
        files: state.files.filter((file) => file.fileId !== fileId),
        uploadingFiles: newUploadingFiles,
      };
    }

    case 'FILES_CLEAR': {
      return {
        files: [],
        uploadingFiles: new Map(),
      };
    }

    default:
      return state;
  }
};

/**
 * 初始状态
 */
const initialState: ChatFileCollectionState = {
  files: [],
  uploadingFiles: new Map(),
};

/**
 * 上传管理器Hook返回值
 */
export interface UseChatFileCollectionResult {
  /** 上传的文件列表 */
  files: RPFileUploaded[];
  /** 检查是否可以上传更多文件 */
  canUploadMore: boolean;
  /** 剩余可上传文件数量 */
  remainingFileCount: number;
  /** 开始文件上传（添加上传中的文件项） */
  handleUploadStart: (fileName: string, fileType?: string) => string;
  /** 更新文件上传进度 */
  handleUploadProgress: (fileId: string, progress: number) => void;
  /** 处理文件上传成功 */
  handleUploadSuccess: FileUploadSuccessCallback;
  /** 处理文件上传失败 */
  handleUploadError: (fileId: string, error?: string) => void;
  /** 处理文件移除 */
  handleFileRemove: (fileId: string) => void;
  /** 清空所有文件 */
  handleClearFiles: () => void;
}

/**
 * 上传管理器Hook (useReducer 版本)
 * 使用 useReducer 来管理复杂的上传状态，确保状态更新的原子性和一致性
 */
export const useChatFileCollection = (
  onUploadSuccess?: FileUploadSuccessCallback,
  maxFileCount: number = DEFAULT_MAX_FILE_COUNT
): UseChatFileCollectionResult => {
  const [state, dispatch] = useReducer(chatFileCollectionReducer, initialState);

  // 开始文件上传 - 添加上传中的文件项
  const handleUploadStart = useCallback(
    (fileName: string, fileType?: string) => {
      // 检查文件数量限制
      if (state.files.length >= maxFileCount) {
        message.warning(`最多可上传${maxFileCount}个文件`);
        return '';
      }

      const fileId = `uploading-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      dispatch({
        type: 'UPLOAD_START',
        payload: { fileId, fileName, fileType },
      });

      return fileId;
    },
    [state.files.length, maxFileCount]
  );

  // 更新文件上传进度
  const handleUploadProgress = useCallback((fileId: string, progress: number) => {
    dispatch({
      type: 'UPLOAD_PROGRESS',
      payload: { fileId, progress },
    });
  }, []);

  // 处理文件上传成功
  const handleUploadSuccess = useCallback(
    (file: RPFileUploaded) => {
      // 查找对应的正在上传的文件
      let matchingUploadingFileId: string | null = null;
      state.uploadingFiles.forEach((uploadingFileName, uploadingFileID) => {
        if (uploadingFileName === file.fileName && !matchingUploadingFileId) {
          matchingUploadingFileId = uploadingFileID;
        }
      });

      dispatch({
        type: 'UPLOAD_SUCCESS',
        payload: { file, matchingFileId: matchingUploadingFileId || undefined },
      });

      // 只有当文件仍然存在时才调用回调
      if (matchingUploadingFileId && state.files.some((f) => f.fileId === matchingUploadingFileId)) {
        onUploadSuccess?.(file);
      } else if (!matchingUploadingFileId) {
        // 兼容旧的上传方式
        onUploadSuccess?.(file);
      }
    },
    [state.files, state.uploadingFiles, onUploadSuccess]
  );

  // 处理文件上传失败
  const handleUploadError = useCallback((fileId: string, error?: string) => {
    dispatch({
      type: 'UPLOAD_ERROR',
      payload: { fileId },
    });
    message.error(error || '文件上传失败');
  }, []);

  // 处理文件移除
  const handleFileRemove = useCallback((fileId: string) => {
    dispatch({
      type: 'FILE_REMOVE',
      payload: { fileId },
    });
  }, []);

  // 清空所有文件
  const handleClearFiles = useCallback(() => {
    dispatch({ type: 'FILES_CLEAR' });
  }, []);

  // 计算文件上传状态
  const canUploadMore = state.files.length < maxFileCount;
  const remainingFileCount = maxFileCount - state.files.length;

  return {
    files: state.files,
    canUploadMore,
    remainingFileCount,
    handleUploadStart,
    handleUploadProgress,
    handleUploadSuccess,
    handleUploadError,
    handleFileRemove,
    handleClearFiles,
  };
};
