import { FileUploadSuccessCallback } from '@/components/File/UploadFileBtn';
import { RPFileUploaded } from '@/types';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useChatFileManager, useFileSuggestion, useSendMessage } from '../hooks';
import { RPOutlineChatSenderCB } from '../type';

/**
 * ChatSender 上下文状态接口
 */
export interface ChatSenderContextState {
  // 内容相关
  content: string;
  setContent: (content: string) => void;
  dynamicPlaceholder: string;

  // 建议菜单相关
  isSuggestionOpen: boolean;
  setIsSuggestionOpen: (open: boolean) => void;
  getSuggestionItems: () => any[];
  handleSelectSuggestion: (selectedFile: string, currentContent: string) => void;

  // 文件管理相关
  files: RPFileUploaded[];
  refFiles: RPFileUploaded[];
  canUploadMore: boolean;
  remainingFileCount: number;
  handleUploadSuccess: FileUploadSuccessCallback;
  handleFileRemove: (fileId: string) => void;
  handleClearFiles: () => void;
  addRefFile: (file: RPFileUploaded) => void;
  handleUploadStart: (fileName: string, fileType?: string) => string;
  handleUploadProgress: (fileId: string, progress: number) => void;
  handleUploadError: (fileId: string, error?: string) => void;

  // 消息发送相关
  handleSend: (message?: string) => void;
  handleSendMessage: (params: { message: string; files: RPFileUploaded[]; refFiles: RPFileUploaded[] }) => void;
}

/**
 * ChatSender 上下文配置接口
 */
export interface ChatSenderContextConfig {
  // 基础配置
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  isLoading?: boolean;
  maxFileCount?: number;

  // 回调函数
  sendMessage: RPOutlineChatSenderCB;
  onCancel?: () => void;
  onFileUploadSuccess?: FileUploadSuccessCallback;

  // 文件相关
  allFiles?: RPFileUploaded[];
}

/**
 * ChatSender 上下文
 */
const ChatSenderContext = createContext<ChatSenderContextState | null>(null);

/**
 * ChatSender 上下文提供者
 */
export const ChatSenderProvider: React.FC<{
  children: React.ReactNode;
  config: ChatSenderContextConfig;
}> = ({ children, config }) => {
  const {
    placeholder = '',
    defaultValue,
    value,
    onChange,
    isLoading = false,
    maxFileCount = 4,
    sendMessage,
    onCancel,
    onFileUploadSuccess,
    allFiles,
  } = config;

  /**
   * 内容状态管理
   * 使用标准的useState替代ahooks的useControllableValue
   */
  const [content, setInternalContent] = useState(defaultValue || '');

  /**
   * 建议菜单状态跟踪
   * 用于控制 '@' 文件引用建议菜单的显示状态
   */
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);

  // 同步外部传入的value
  useEffect(() => {
    if (value !== undefined) {
      setInternalContent(value);
    }
  }, [value]);

  // 包装setContent以调用外部onChange
  const setContent = (newValue: string) => {
    setInternalContent(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  // 文件管理 - 使用Facade模式
  const fileManager = useChatFileManager(onFileUploadSuccess, maxFileCount);

  // 消息发送逻辑
  const { handleSend: handleSendMessage } = useSendMessage({
    sendMessage,
    onCancel,
    isLoading,
  });

  // 文件建议逻辑
  const fileSuggestion = useFileSuggestion({
    files: allFiles || fileManager.files,
    onContentChange: setContent,
    onAddRefFile: fileManager.addRefFile,
  });

  // 动态占位符
  const dynamicPlaceholder = useMemo(() => {
    return fileManager.files.length > 0 ? '告诉我您的写作思路，根据文件内容为您生成报告' : placeholder;
  }, [fileManager.files.length, placeholder]);

  // 发送消息的包装函数
  const handleSend = (message?: string) => {
    const messageContent = message || content || '';
    handleSendMessage({
      message: messageContent,
      files: fileManager.files,
      refFiles: fileManager.refFiles,
    });

    // 发送成功后清理状态
    if (messageContent.trim()) {
      fileManager.handleClearFiles();
      setContent('');
    }
  };

  const contextValue: ChatSenderContextState = {
    // 内容相关
    content,
    setContent,
    dynamicPlaceholder,

    // 建议菜单相关
    isSuggestionOpen,
    setIsSuggestionOpen,
    getSuggestionItems: fileSuggestion.getSuggestionItems,
    handleSelectSuggestion: fileSuggestion.handleSelectSuggestion,

    // 文件管理相关
    files: fileManager.files,
    refFiles: fileManager.refFiles,
    canUploadMore: fileManager.canUploadMore,
    remainingFileCount: fileManager.remainingFileCount,
    handleUploadSuccess: fileManager.handleUploadSuccess,
    handleFileRemove: fileManager.handleFileRemove,
    handleClearFiles: fileManager.handleClearFiles,
    addRefFile: fileManager.addRefFile,
    handleUploadStart: fileManager.handleUploadStart,
    handleUploadProgress: fileManager.handleUploadProgress,
    handleUploadError: fileManager.handleUploadError,

    // 消息发送相关
    handleSend,
    handleSendMessage,
  };

  return <ChatSenderContext.Provider value={contextValue}>{children}</ChatSenderContext.Provider>;
};

/**
 * 使用 ChatSender 上下文的 Hook
 */
export const useChatSenderContext = (): ChatSenderContextState => {
  const context = useContext(ChatSenderContext);
  if (!context) {
    throw new Error('useChatSenderContext must be used within a ChatSenderProvider');
  }
  return context;
};
