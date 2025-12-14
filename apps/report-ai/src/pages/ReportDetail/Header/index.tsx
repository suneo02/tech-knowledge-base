import { createChatRequest } from '@/api';
import { useReportDetailContext } from '@/context/ReportDetail';
import {
  selectIsServerLoading,
  selectReportId,
  selectReportName,
  useReportContentSelector,
} from '@/store/reportContentStore';
import { isDev } from '@/utils';
import { Button, message, Spin } from '@wind/wind-ui';
import { useRequest } from 'ahooks';
import { ApiCodeForWfc, TRequestToChat } from 'gel-api';
import { generateUrlByModule, LinkModule, UserLinkParamEnum } from 'gel-util/link';
import { FC, lazy, Suspense } from 'react';
import { useTemplateSave } from './hooks/useTemplateSave';
import styles from './index.module.less';

// 懒加载模板保存弹窗
const TemplateSaveModal = lazy(() =>
  import('./components/TemplateSaveModal').then((module) => ({
    default: module.TemplateSaveModal,
  }))
);

type Props = {
  onShare?: () => void;
};

type FuncExportReport = TRequestToChat<'report/createReportFile'>;

export const ReportDetailHeader: FC<Props> = ({ onShare }) => {
  const reportId = useReportContentSelector(selectReportId);
  const reportName = useReportContentSelector(selectReportName);
  const { reportEditorRef } = useReportDetailContext();
  const isServerLoading = useReportContentSelector(selectIsServerLoading);

  // 模板保存逻辑
  const templateSave = useTemplateSave({
    reportId: reportId || undefined,
  });
  const { run: exportReport, loading: exportReportLoading } = useRequest<
    Awaited<ReturnType<FuncExportReport>>,
    Parameters<FuncExportReport>
  >(createChatRequest('report/createReportFile'), {
    manual: true,
    onSuccess: (data) => {
      if (data.ErrorCode === ApiCodeForWfc.SUCCESS) {
        message.success('导出报告成功');
        const url = generateUrlByModule({
          module: LinkModule.USER_CENTER,
          isDev,
          params: {
            type: UserLinkParamEnum.MyData,
          },
        });
        window.open(url, '_blank');
      } else {
        message.error('导出报告失败');
      }
    },
    onError: (error) => {
      console.error(error);
      message.error('导出报告失败');
    },
  });

  const handleExportReport = () => {
    if (reportId) {
      const html = reportEditorRef?.current?.getContent();
      exportReport({
        html: html || '',
        reportId,
      });
    } else {
      message.error('报告ID不存在' + reportId);
    }
  };
  return (
    <>
      <div className={styles.header}>
        <div className={styles.title}>
          全球企业库报告平台 {reportName}
          {isServerLoading && (
            <span className={styles.status}>
              <Spin size="small" />
              <span>正在获取报告大纲...</span>
            </span>
          )}
        </div>
        <div className={styles.actions}>
          <Button onClick={templateSave.openModal} loading={templateSave.isLoading}>
            存为模板
          </Button>
          <Button onClick={handleExportReport} loading={exportReportLoading}>
            导出报告
          </Button>
          <Button onClick={onShare}>分享报告</Button>
        </div>
      </div>

      {/* 懒加载的模板保存弹窗 */}
      {templateSave.isModalVisible && (
        <Suspense fallback={null}>
          <TemplateSaveModal
            visible={templateSave.isModalVisible}
            templateName={templateSave.templateName}
            loading={templateSave.isLoading}
            onTemplateNameChange={templateSave.setTemplateName}
            onConfirm={templateSave.confirmSave}
            onCancel={templateSave.closeModal}
          />
        </Suspense>
      )}
    </>
  );
};
