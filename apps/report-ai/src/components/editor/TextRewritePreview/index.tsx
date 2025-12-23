/**
 * 文本改写预览组件
 *
 * @description 悬浮预览组件，用于展示文本改写的实时结果
 * - 显示 Markdown 格式的预览内容
 * - 提供"应用"和"取消"操作按钮
 * - AIGC 完成后才启用按钮
 *
 * @see apps/report-ai/docs/specs/text-ai-rewrite-preview-floating/spec-preview-floating-v1.md
 */

import { entWebAxiosInstance } from '@/api/entWeb';
import { md } from '@/libs/markdown';
import { getWsid, isDev } from '@/utils';
import { Button } from '@wind/wind-ui';
import { AIAnswerMarkdownViewer } from 'ai-ui';
import styles from './index.module.less';

/**
 * 预览组件属性
 */
export interface TextRewritePreviewProps {
  /** 预览内容 */
  content: string;
  /** 是否已完成生成 */
  isCompleted: boolean;
  /** 应用按钮点击回调 */
  onApply: () => void;
  /** 取消按钮点击回调 */
  onCancel: () => void;
}

/**
 * 文本改写预览组件
 */
export function TextRewritePreview({ content, isCompleted, onApply, onCancel }: TextRewritePreviewProps) {
  return (
    <div className={styles.preview}>
      <div className={styles.preview__content}>
        <AIAnswerMarkdownViewer
          content={content}
          md={md}
          isDev={isDev}
          wsid={getWsid()}
          entWebAxiosInstance={entWebAxiosInstance}
        />
      </div>
      <div className={styles.preview__actions}>
        <Button type="primary" onClick={onApply} disabled={!isCompleted}>
          应用
        </Button>
        <Button onClick={onCancel} disabled={!isCompleted}>
          取消
        </Button>
      </div>
    </div>
  );
}
