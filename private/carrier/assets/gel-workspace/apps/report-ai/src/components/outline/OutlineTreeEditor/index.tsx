// ===== 子组件导出 =====
// 这些组件可以用于自定义扩展或单独使用
export { HierarchicalNumber, HoverActions, OutlineEditorContainer, OutlineEditorItem } from './components';

// ===== Hooks 导出 =====
// 这些 Hooks 可以用于自定义状态管理
// (当前没有需要导出的 Hooks)

// ===== 工具函数导出 =====

// ===== 类型定义导出 =====
// 这些类型定义可以用于 TypeScript 类型检查
export type { OutlineEditorContainerProps, OutlineEditorItemProps } from './types/types';

import { isDev, isStaging } from '@/utils';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { ErrorBoundary } from 'gel-ui';
import React, { useMemo } from 'react';
import { OutlineEditorContainer } from './components';
import { OutlineStoreProvider, useOutlineState } from './context';
import { OutlineOperationsProvider, useOutlineOperationsContext } from './context/operations';
import styles from './index.module.less';
import { OutlineTreeEditorProps } from './types/types';

export type { OutlineTreeEditorProps };

/**
 * 大纲模版编辑器内部组件（需要在 Context 内使用）
 */
const OutlineTreeEditorInner: React.FC<OutlineTreeEditorProps> = ({ style, readonly = false }) => {
  // 内部默认值
  const placeholder = '请输入内容...';
  const ideaSummaryLines = 10;

  // 只读取状态，业务操作由子组件直接从 Operations Context 读取
  const state = useOutlineState();
  const { saving, hasUnsaved, lastSavedAt, lastError } = useOutlineOperationsContext();
  const status = useMemo(() => {
    if (saving) {
      return { type: 'saving' as const, text: '正在保存…' };
    }
    if (lastError) {
      return { type: 'error' as const, text: `保存失败：${lastError}` };
    }
    if (hasUnsaved) {
      return { type: 'unsaved' as const, text: '有未保存的更改' };
    }
    if (lastSavedAt) {
      return { type: 'saved' as const, text: `已保存于 ${dayjs(lastSavedAt).format('HH:mm:ss')}` };
    }
    return null;
  }, [saving, hasUnsaved, lastSavedAt, lastError]);

  // 计算是否显示空状态
  const isEmpty = useMemo(() => {
    return !state.data?.chapters || state.data?.chapters?.length === 0;
  }, [state.data?.chapters]);

  // 如果没有数据，返回空
  if (isEmpty) {
    return null;
  }

  return (
    <ErrorBoundary>
      <div className={styles.outlineEditor} style={style}>
        {isDev && isStaging && status && (
          <div
            className={classNames(styles.statusBar, {
              [styles.saving]: status.type === 'saving',
              [styles.unsaved]: status.type === 'unsaved',
              [styles.saved]: status.type === 'saved',
              [styles.error]: status.type === 'error',
            })}
            data-testid="outline-save-status"
          >
            <div>开发模式可见，调试用</div>
            <span className={styles.statusDot} />
            {status.text}
          </div>
        )}
        {/* 大纲内容区域 */}
        <div className={styles.content}>
          <OutlineEditorContainer
            items={state.data?.chapters}
            parentPath={[]}
            placeholder={placeholder}
            readonly={readonly}
            ideaSummaryLines={ideaSummaryLines}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
};

/**
 * 大纲模版编辑器主组件
 *
 * @description 包装了 Context Provider 的完整组件
 * @param props - 组件属性
 * @returns 大纲模版编辑器组件
 */
export const OutlineTreeEditor: React.FC<OutlineTreeEditorProps> = (props) => {
  return (
    <OutlineStoreProvider initialData={props.initialValue}>
      <OutlineOperationsProvider>
        <OutlineTreeEditorInner {...props} />
      </OutlineOperationsProvider>
    </OutlineStoreProvider>
  );
};
