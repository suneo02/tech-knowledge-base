import { OutlineFileItem } from '../../File/OutlineFileItem';
import { useChatSenderContext } from './context';
import styles from './header.module.less';

/**
 * ChatSender 头部组件
 * 使用 Context 获取文件管理状态，无需外部传递 props
 */
export const ChatSenderReportHeader = () => {
  const { files, handleFileRemove } = useChatSenderContext();

  const hasFiles = files.length > 0;

  // 如果没有文件，不渲染任何内容
  if (!hasFiles) {
    return null;
  }

  return (
    <div className={styles['chat-sender-report-header']}>
      {/* 文件展示区域 - 显示已上传的文件 */}
      <div className={styles['chat-sender-report-header-files']}>
        <div className={styles['chat-sender-report-header-files-list']}>
          {files.map((file) => (
            <OutlineFileItem key={file.fileId} file={file} onRemove={handleFileRemove} showRemoveButton={true} />
          ))}
        </div>
      </div>
    </div>
  );
};
