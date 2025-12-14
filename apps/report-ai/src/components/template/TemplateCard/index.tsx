import { DeleteO } from '@wind/icons';
import { Button, Tag } from '@wind/wind-ui';
import dayjs from 'dayjs';
import type { ReportTemplateItem } from 'gel-api';
import styles from './index.module.less';

interface TemplateCardProps {
  template: ReportTemplateItem;
  onDelete?: (template: ReportTemplateItem) => void;
  onUse?: (template: ReportTemplateItem) => void;
  onPreview?: (template: ReportTemplateItem) => void;
}

/**
 * 模版卡片组件
 * 展示单个报告模版的信息和操作按钮
 */
export const TemplateCard = ({ template, onDelete, onUse, onPreview }: TemplateCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.card__titleRow}>
        <span className={styles.card__title} title={template.name}>
          {template.name}
        </span>
        <Tag className={styles.card__tag} color="color-3" type="secondary">
          {template.isSystemTemplate ? '标准模板' : '自定义模板'}
        </Tag>
      </div>
      <div className={styles.card__metaRow}>上次使用：{dayjs(template.createTime).format('YYYY-MM-DD HH:mm')}</div>
      <div className={styles.card__actions}>
        {template.isSystemTemplate ? (
          <Button size="small" onClick={() => onPreview?.(template)}>
            查看样例
          </Button>
        ) : (
          <Button
            icon={<DeleteO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
            size="small"
            onClick={() => onDelete?.(template)}
          />
        )}

        <Button size="small" onClick={() => onUse?.(template)}>
          开始使用
        </Button>
      </div>
    </div>
  );
};
