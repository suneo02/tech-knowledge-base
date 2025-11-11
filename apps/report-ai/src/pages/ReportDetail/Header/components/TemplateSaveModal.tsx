/**
 * 模板保存弹窗组件
 *
 * @description 用于输入模板名称的弹窗组件
 * @since 1.0.0
 */

import { Input, Modal } from '@wind/wind-ui';
import { FC } from 'react';

export interface TemplateSaveModalProps {
  /** 是否显示弹窗 */
  visible: boolean;
  /** 模板名称 */
  templateName: string;
  /** 是否正在保存 */
  loading: boolean;
  /** 模板名称变化回调 */
  onTemplateNameChange: (name: string) => void;
  /** 确认保存回调 */
  onConfirm: () => void;
  /** 取消回调 */
  onCancel: () => void;
}

/**
 * 模板保存弹窗组件
 */
export const TemplateSaveModal: FC<TemplateSaveModalProps> = ({
  visible,
  templateName,
  loading,
  onTemplateNameChange,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      title="存为模板"
      visible={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      confirmLoading={loading}
      okText="确认"
      cancelText="取消"
    >
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>模板名称：</label>
        <Input
          placeholder="请输入模板名称"
          value={templateName}
          onChange={(e) => onTemplateNameChange(e.target.value)}
          autoFocus
        />
      </div>
    </Modal>
  );
};
