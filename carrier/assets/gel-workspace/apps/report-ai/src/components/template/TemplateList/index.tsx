import { createChatRequest } from '@/api';
import { message, Modal, Spin } from '@wind/wind-ui';
import { useRequest } from 'ahooks';
import classNames from 'classnames';
import type { ReportTemplateItem } from 'gel-api';
import { TemplateCard } from '../TemplateCard';
import { TemplateUseModal } from '../TemplateUseModal/TemplateUseModal';
import styles from './index.module.less';
import { useTemplateUse } from './useTemplateUse';

interface ReportTemplateListProps {
  className?: string;
  onPreview?: (tpl: ReportTemplateItem) => void;
}

export async function fetchReportTemplates(): Promise<ReportTemplateItem[]> {
  const request = createChatRequest('report/template/list');
  const res = await request({});
  const list = res?.Data;
  return Array.isArray(list) ? list : [];
}

/**
 * 删除报告模板
 * @param id 模板ID
 */
export async function deleteReportTemplate(id: number): Promise<void> {
  const request = createChatRequest('report/template/delete');
  await request({}, { appendUrl: `/${id}` });
}

export const ReportTemplateList = ({ className, onPreview }: ReportTemplateListProps) => {
  const { data: templates = [], loading, refresh } = useRequest(fetchReportTemplates);

  const {
    useModalVisible,
    selectedCorpId,
    confirmLoading,
    openUseModal,
    handleCorpChange,
    handleConfirmUse,
    handleCancelUse,
  } = useTemplateUse();

  const onDelete = (tpl: ReportTemplateItem) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除模板"${tpl.name}"吗？此操作不可恢复。`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteReportTemplate(tpl.id);
          message.success('删除成功');
          refresh(); // 刷新列表
        } catch (error) {
          console.log('🚀 ~ onDelete ~ error:', error);
          message.error('删除失败');
        }
      },
    });
  };
  const onUse = (tpl: ReportTemplateItem) => {
    openUseModal(tpl);
  };

  return (
    <div className={classNames(styles.container, className)}>
      <div className={styles.container__header}>
        <div className={styles.container__sectionTitle}>报告模板</div>
      </div>

      <TemplateUseModal
        visible={useModalVisible}
        loading={confirmLoading}
        disabled={!selectedCorpId}
        onConfirm={handleConfirmUse}
        onCancel={handleCancelUse}
        onCorpChange={handleCorpChange}
      />

      <div className={styles.container__list}>
        {loading && (
          <div className={styles.container__empty}>
            <Spin />
          </div>
        )}
        {!loading && templates.length === 0 && <div className={styles.container__empty}>暂无模板</div>}
        {!loading &&
          templates.map((tpl) => (
            <TemplateCard key={tpl.id} template={tpl} onDelete={onDelete} onUse={onUse} onPreview={onPreview} />
          ))}
      </div>
    </div>
  );
};
