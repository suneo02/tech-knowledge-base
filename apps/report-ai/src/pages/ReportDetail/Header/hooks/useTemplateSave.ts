/**
 * 模板保存相关的业务逻辑Hook
 *
 * @description 处理模板保存的状态管理和API调用
 * @since 1.0.0
 */

import { message } from '@wind/wind-ui';
import { useRequest } from 'ahooks';
import { ApiCodeForWfc, TRequestToChat } from 'gel-api';
import { useCallback, useState } from 'react';
import { createChatRequest } from '../../../../api';

type FuncSaveAsTemplate = TRequestToChat<'report/template/save'>;

export interface UseTemplateSaveOptions {
  /** 报告ID */
  reportId?: string;
  /** 默认模板名称 */
  defaultTemplateName?: string;
}

export interface UseTemplateSaveReturn {
  /** 是否显示弹窗 */
  isModalVisible: boolean;
  /** 模板名称 */
  templateName: string;
  /** 是否正在保存 */
  isLoading: boolean;
  /** 设置模板名称 */
  setTemplateName: (name: string) => void;
  /** 打开弹窗 */
  openModal: () => void;
  /** 关闭弹窗 */
  closeModal: () => void;
  /** 确认保存模板 */
  confirmSave: () => void;
}

/**
 * 模板保存Hook
 */
export const useTemplateSave = (options: UseTemplateSaveOptions): UseTemplateSaveReturn => {
  const { reportId, defaultTemplateName = '' } = options;

  // 弹窗状态
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [templateName, setTemplateName] = useState('');

  // 保存模板请求
  const { run: saveAsTemplate, loading: isLoading } = useRequest<
    Awaited<ReturnType<FuncSaveAsTemplate>>,
    Parameters<FuncSaveAsTemplate>
  >(createChatRequest('report/template/save'), {
    manual: true,
    onSuccess: (data) => {
      if (data.ErrorCode === ApiCodeForWfc.SUCCESS) {
        message.success('存为模板成功');
        closeModal();
      } else {
        message.error('存为模板失败');
      }
    },
    onError: (error) => {
      console.error(error);
      message.error('存为模板失败');
    },
  });

  /**
   * 打开弹窗
   */
  const openModal = useCallback(() => {
    if (!reportId) {
      message.error('报告ID不存在');
      return;
    }
    setTemplateName(defaultTemplateName);
    setIsModalVisible(true);
  }, [reportId, defaultTemplateName]);

  /**
   * 关闭弹窗
   */
  const closeModal = useCallback(() => {
    setIsModalVisible(false);
    setTemplateName('');
  }, []);

  /**
   * 确认保存模板
   */
  const confirmSave = useCallback(() => {
    if (!templateName.trim()) {
      message.error('请输入模板名称');
      return;
    }

    if (!reportId) {
      message.error('报告ID不存在');
      return;
    }

    saveAsTemplate({
      reportId,
      templateName: templateName.trim(),
    } as Parameters<FuncSaveAsTemplate>[0]);
  }, [templateName, reportId, saveAsTemplate]);

  return {
    isModalVisible,
    templateName,
    isLoading,
    setTemplateName,
    openModal,
    closeModal,
    confirmSave,
  };
};
