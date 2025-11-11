import { UploadFileBtn } from '@/components/File';
import { message } from '@wind/wind-ui';
import { ChatInputSendBtn } from 'gel-ui';
import { useChatSenderContext } from './context';
import styles from './footer.module.less';

interface ChatSenderFooterProps {
  isLoading?: boolean;
  maxFileCount?: number;
}

/**
 * ChatSender 底部组件
 * 使用 Context 获取状态，大大简化了 props 传递
 */
export const ChatSenderReportFooter = ({ isLoading = false, maxFileCount = 4 }: ChatSenderFooterProps) => {
  const {
    content,
    handleSend,
    canUploadMore,
    handleUploadSuccess,
    handleUploadStart,
    handleUploadProgress,
    handleUploadError,
  } = useChatSenderContext();

  // 处理上传按钮点击（当不能上传更多文件时）
  const handleUploadClick = () => {
    if (!canUploadMore) {
      message.warning(`最多可上传${maxFileCount}个文件`);
      return false; // 阻止文件选择
    }
    return true; // 允许文件选择
  };

  return (
    <div className={styles['chat-sender-report-footer']}>
      {/* 上传按钮区域 */}
      <div className={styles['chat-sender-report-footer-left']}>
        <UploadFileBtn
          label="上传文件"
          onUploadSuccess={handleUploadSuccess}
          disabled={isLoading}
          onUploadStart={handleUploadStart}
          onUploadProgress={handleUploadProgress}
          onUploadFailed={handleUploadError}
          onBeforeUpload={handleUploadClick}
        />
      </div>

      {/* 发送按钮区域 */}
      <div className={styles['chat-sender-report-footer-right']}>
        <ChatInputSendBtn
          className={styles['chat-sender-report-footer-send-btn']}
          style={{ cursor: content && !isLoading ? 'pointer' : isLoading ? 'default' : 'not-allowed' }}
          isLoading={isLoading}
          isActive={!!content}
          onClick={() => handleSend()}
        />
      </div>
    </div>
  );
};
