import { RPFileUploaded } from '@/types';
import { Sender, Suggestion } from '@ant-design/x';
import classNames from 'classnames';
import { ChatSenderProvider, useChatSenderContext } from './context';
import { DragUpload } from './DragUpload';
import { ChatSenderReportFooter } from './Footer';
import { ChatSenderReportHeader } from './Header';
import styles from './index.module.less';
import { FileUploadSuccessCallback } from '@/components/File/UploadFileBtn';
import { RPOutlineChatSenderCB } from './type';

/**
 * ChatSenderReport组件属性接口
 */
export interface ChatSenderReportProps {
  /** 容器样式类名 */
  className?: string;
  /** Sender组件样式类名 */
  senderClassName?: string;
  /** 是否加载中 */
  isLoading?: boolean;
  /** 受控输入值 */
  value?: string;
  /** 默认输入值 */
  defaultValue?: string;
  /** 输入变化回调 */
  onChange?: (value: string) => void;
  /** 占位符文本 */
  placeholder?: string;
  /** 取消回调 */
  onCancel?: () => void;
  /** 发送消息回调 */
  sendMessage: RPOutlineChatSenderCB;
  /** 文件上传成功回调 */
  onFileUploadSuccess?: FileUploadSuccessCallback;
  /** 所有可以 '@' 的文件列表 */
  allFiles?: RPFileUploaded[];
  /** 最大文件上传数量 */
  maxFileCount?: number;
}

/**
 * 内部 Sender 组件，使用 Context 获取状态
 */
const ChatSenderReportInner: React.FC<{
  senderClassName?: string;
  className?: string;
  isLoading?: boolean;
  onCancel?: () => void;
}> = ({ senderClassName, className, isLoading, onCancel }) => {
  const {
    handleSend,
    content,
    setContent,
    dynamicPlaceholder,
    isSuggestionOpen,
    setIsSuggestionOpen,
    getSuggestionItems,
    handleSelectSuggestion,
  } = useChatSenderContext();

  return (
    <div className={classNames(styles['chat-actions'], className)}>
      <Suggestion<string>
        open={isSuggestionOpen}
        onOpenChange={setIsSuggestionOpen}
        items={getSuggestionItems}
        onSelect={(selectedFile) => {
          handleSelectSuggestion(selectedFile, content || '');
        }}
      >
        {({ onTrigger, onKeyDown }) => (
          <Sender
            /**
             * 动态调整发送快捷键行为：
             * - 建议菜单关闭时：Enter 发送消息（常规模式）
             * - 建议菜单打开时：Shift+Enter 发送消息，Enter 选择建议项
             */
            submitType={isSuggestionOpen ? 'shiftEnter' : 'enter'}
            value={content || ''}
            disabled={isLoading}
            placeholder={dynamicPlaceholder}
            loading={isLoading}
            onCancel={onCancel}
            onChange={(nextVal) => {
              // 检测'@'触发建议菜单
              if (nextVal.endsWith('@')) {
                onTrigger('@'); // 触发建议菜单显示
              } else if (!nextVal.includes('@')) {
                onTrigger(false); // 取消建议菜单
              }

              setContent(nextVal);
            }}
            onKeyDown={onKeyDown}
            onSubmit={handleSend}
            className={classNames(styles['sender'], senderClassName)}
            actions={false}
            header={<ChatSenderReportHeader />}
            footer={<ChatSenderReportFooter isLoading={isLoading} />}
          />
        )}
      </Suggestion>
    </div>
  );
};

/**
 * ChatSenderReport组件
 * 使用 Context 重构，大大简化了组件逻辑
 */
export const ChatSenderReport: React.FC<ChatSenderReportProps> = ({
  senderClassName,
  isLoading,
  value,
  defaultValue,
  onChange,
  placeholder = '告诉我您的写作思路，您也可以直接在下方上传报告模版或者需要引用内容的素材文档，为您自动生成报告',
  className,
  onCancel,
  sendMessage,
  onFileUploadSuccess,
  allFiles,
  maxFileCount = 4,
}) => {
  const contextConfig = {
    placeholder,
    defaultValue,
    value,
    onChange,
    isLoading,
    maxFileCount,
    sendMessage,
    onCancel,
    onFileUploadSuccess,
    allFiles,
  };

  return (
    <ChatSenderProvider config={contextConfig}>
      <DragUpload>
        <ChatSenderReportInner
          senderClassName={senderClassName}
          className={className}
          isLoading={isLoading}
          onCancel={onCancel}
        />
      </DragUpload>
    </ChatSenderProvider>
  );
};
