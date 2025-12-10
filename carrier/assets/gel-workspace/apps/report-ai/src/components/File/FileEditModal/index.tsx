import { requestToChat } from '@/api';
import { searchCompanies } from '@/api/service';
import { Checkbox, Input, message, Modal } from '@wind/wind-ui';
import Form from '@wind/wind-ui-form';
import { useRequest } from 'ahooks';
import { RPFileListItem, RPFileTag } from 'gel-api';
import { CorpPresearch } from 'gel-ui';
import React, { useEffect, useState } from 'react';
import { FILE_TAG_OPTIONS } from '../config';
import styles from './index.module.less';

interface FileEditModalProps {
  visible: boolean;
  file: RPFileListItem | null;
  onClose: () => void;
  onSuccess: () => void;
}

// 表单数据类型
interface FileEditFormData {
  companyId?: string;
}

// API 错误类型
interface ApiError {
  message?: string;
  code?: number | string;
}

export const FileEditModal: React.FC<FileEditModalProps> = ({ visible, file, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [tags, setTags] = useState<RPFileTag[]>(file?.tags || []);
  const [, setSelectedCorpId] = useState<string>(file?.fileRelateCode || '');

  // 处理企业选择
  const handleCorpChange = (corpId: string) => {
    setSelectedCorpId(corpId);
    form.setFieldsValue({ companyId: corpId });
  };

  // 更新文件信息
  const { loading: updateLoading, run: updateFile } = useRequest(
    async (values: FileEditFormData) => {
      if (!file?.fileID) {
        console.error('文件ID不存在');
        return;
      }
      const response = await requestToChat('report/fileUpdate', {
        fileID: file?.fileID,
        fileRelateCode: values.companyId,
        fileTags: tags,
      });
      return response;
    },
    {
      manual: true,
      onSuccess: () => {
        message.success('文件信息更新成功');
        onSuccess();
        onClose();
      },
      onError: (error: ApiError) => {
        message.error(`更新失败: ${error.message || '未知错误'}`);
      },
    }
  );

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      updateFile(values);
    } catch (error) {
      console.error('Form validation error:', error);
    }
  };

  // 处理标签变化
  const handleTagsChange = (checkedValues: string[]) => {
    setTags(checkedValues as RPFileTag[]);
  };

  // 当文件变化时，更新表单和标签
  useEffect(() => {
    if (file && visible) {
      form.setFieldsValue({
        companyId: file.fileRelateCode,
      });
      setTags(file.tags || []);
      setSelectedCorpId(file.fileRelateCode || '');
    }
  }, [file, visible, form]);

  return (
    <Modal
      title="编辑文件信息"
      visible={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={updateLoading}
      width={600}
      destroyOnClose
    >
      <Form form={form} layout="vertical" className={styles['file-edit-form']}>
        <Form.Item label="文件名">
          <Input value={file?.fileName} disabled />
        </Form.Item>

        <Form.Item label="关联企业" name="companyId">
          <CorpPresearch
            placeholder="请输入企业名称"
            onChange={handleCorpChange}
            requestAction={searchCompanies}
            needHistory={false}
            withClear={true}
            widthAuto={true}
            debounceTime={500}
            minWidth={200}
          />
        </Form.Item>

        <Form.Item label="标签">
          <Checkbox.Group options={FILE_TAG_OPTIONS} value={tags} onChange={handleTagsChange} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
