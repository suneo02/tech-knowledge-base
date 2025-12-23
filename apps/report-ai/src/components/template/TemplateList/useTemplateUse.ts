import { createChatRequest } from '@/api';
import { isDev } from '@/utils/env';
import { message } from '@wind/wind-ui';
import type { ReportIdIdentifier, ReportTemplateItem } from 'gel-api';
import { generateUrlByModule, LinkModule } from 'gel-util/link';
import { useState } from 'react';

export const useTemplateUse = () => {
  const [useModalVisible, setUseModalVisible] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplateItem | null>(null);
  const [selectedCorpId, setSelectedCorpId] = useState<string>('');
  const [selectedCorpName, setSelectedCorpName] = useState<string>('');
  const [confirmLoading, setConfirmLoading] = useState(false);

  /**
   * 打开使用模板弹窗
   */
  const openUseModal = (template: ReportTemplateItem) => {
    setSelectedTemplate(template);
    setUseModalVisible(true);
  };

  /**
   * 关闭弹窗并清空状态
   */
  const closeUseModal = () => {
    setUseModalVisible(false);
    setSelectedTemplate(null);
    setSelectedCorpId('');
    setSelectedCorpName('');
  };

  /**
   * 公司选择变化回调
   */
  const handleCorpChange = (corpId: string, corpName: string) => {
    setSelectedCorpId(corpId);
    setSelectedCorpName(corpName);
  };

  /**
   * 调用模板使用接口
   */
  const callReportTemplateUse = async (
    templateId: number,
    entityCode: string,
    entityName: string
  ): Promise<ReportIdIdentifier | undefined> => {
    const request = createChatRequest('report/template/use');
    const res = await request({
      templateId,
      entityCode,
      entityName,
      entityType: 1,
    });
    return res?.Data;
  };

  /**
   * 确认使用模板
   */
  const handleConfirmUse = async () => {
    if (!selectedTemplate || !selectedCorpId) {
      return;
    }

    try {
      setConfirmLoading(true);
      const result = await callReportTemplateUse(selectedTemplate.id, selectedCorpId, selectedCorpName);
      message.success('模板使用成功');

      // 关闭弹窗并清空状态
      closeUseModal();

      if (result?.reportId) {
        // 跳转到报告详情页，使用API返回的reportId
        const url = generateUrlByModule({
          module: LinkModule.AI_REPORT_DETAIL,
          isDev,
          params: {
            reportId: result.reportId,
          },
        });

        if (url) {
          window.open(url, '_blank');
        }
      }
    } catch (error) {
      console.error('使用模板失败:', error);
      message.error('使用模板失败，请重试');
    } finally {
      setConfirmLoading(false);
    }
  };

  /**
   * 取消使用模板
   */
  const handleCancelUse = () => {
    closeUseModal();
  };

  return {
    // 状态
    useModalVisible,
    selectedTemplate,
    selectedCorpId,
    selectedCorpName,
    confirmLoading,
    // 方法
    openUseModal,
    handleCorpChange,
    handleConfirmUse,
    handleCancelUse,
  };
};
