import { isDev, isStaging } from '@/utils';
import { Modal } from '@wind/wind-ui';
import { BaiFenSites } from 'gel-util/link';
import { FC, useEffect, useMemo } from 'react';
import styles from './index.module.less';

export interface FinancialReportIframeModalProps {
  /** Modal 是否可见 */
  visible: boolean;
  /** 关闭 Modal 的回调 */
  onClose: () => void;
  /** 财报文件 docId */
  docId?: string;
}

/**
 * 财报文件 iframe Modal 组件
 *
 * @description 展示财报分析流程的 Modal，监听 GEL_GENERATE_REPORT 消息自动关闭
 */
export const FinancialReportIframeModal: FC<FinancialReportIframeModalProps> = ({ visible, onClose, docId }) => {
  // 根据 docId 生成 iframe URL
  const iframeUrl = useMemo(() => {
    return docId ? BaiFenSites({ isStaging, isDev }).getReportAnalysisProcessForGel({ id: docId }) : '';
  }, [docId]);

  // 监听 iframe 发送的 GEL_GENERATE_REPORT 消息
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'GEL_GENERATE_REPORT') {
        console.log('收到 GEL_GENERATE_REPORT 事件，关闭 modal', event.data);
        onClose();
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [onClose]);

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={null}
      width="98vw"
      className={styles['financial-report-iframe-modal']}
      style={{ top: 10, maxWidth: 'none' }}
      bodyStyle={{ height: 'calc(98vh - 60px)', padding: 0 }}
      destroyOnClose
    >
      {iframeUrl && (
        <iframe src={iframeUrl} className={styles['financial-report-iframe-modal__iframe']} title="智能财报诊断" />
      )}
    </Modal>
  );
};
