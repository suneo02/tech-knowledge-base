import { Alert, Modal } from '@wind/wind-ui';
import Form from '@wind/wind-ui-form';
import { CorpPresearch } from 'gel-ui';
import styles from './TemplateUseModal.module.less';
import { searchCompanies } from '@/api/service';

interface TemplateUseModalProps {
  visible: boolean;
  loading: boolean;
  disabled: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  onCorpChange: (corpId: string, corpName: string) => void;
}

/**
 * 模板使用弹窗组件
 * 用于选择公司并使用模板
 * @see apps/report-ai/docs/specs/template-use-with-corp-selection/spec-design-v1.md
 */
export const TemplateUseModal = ({
  visible,
  loading,
  disabled,
  onConfirm,
  onCancel,
  onCorpChange,
}: TemplateUseModalProps) => {
  return (
    <Modal
      title="使用模板"
      visible={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      confirmLoading={loading}
      okText="确认"
      cancelText="取消"
      okButtonProps={{ disabled }}
      className={styles.templateUseModal}
    >
      <div className={styles.templateUseModal__content}>
        <Alert
          message="温馨提示"
          description="请输入公司名称，我们将使用该模板为您生成新报告"
          type="info"
          showIcon
          className={styles.templateUseModal__alert}
        />

        <Form layout="vertical" className={styles.templateUseModal__form}>
          <Form.Item label="公司名称" required>
            <div className={styles.templateUseModal__corpSearch}>
              <CorpPresearch
                placeholder="请输入公司名称"
                onChange={onCorpChange}
                requestAction={searchCompanies}
                needHistory={false}
                withClear={true}
                widthAuto={true}
                debounceTime={500}
                minWidth={400}
              />
            </div>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};
