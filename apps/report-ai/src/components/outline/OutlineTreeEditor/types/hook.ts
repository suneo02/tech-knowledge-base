import { ReportOutlineData } from 'gel-api';
import { TreePath } from 'gel-util/common';
import { SaveOutlineResponse } from '../core';

export type SaveMode = 'manual' | 'auto' | 'immediate';

export interface UseOutlineOperationsReturn {
  rename: (path: TreePath, newTitle: string) => Promise<void>;
  updateThought: (path: TreePath, newThought: string, options?: { mode?: SaveMode }) => Promise<void>;
  updateKeywords: (path: TreePath, newKeywords: string[], options?: { mode?: SaveMode }) => Promise<void>;
  insertAfter: (
    path: TreePath,
    chapter?: Partial<{ title: string; writingThought: string }>
  ) => Promise<TreePath | null>;
  remove: (path: TreePath) => Promise<void>;
  indent: (path: TreePath) => Promise<TreePath | null>;
  unindent: (path: TreePath) => Promise<TreePath | null>;
  pauseThought: (path: TreePath) => void;
  markUnsaved: () => void;
  saving: boolean;
  hasUnsaved: boolean;
  lastSavedAt?: number;
  lastError: string | null;
  requestManualSave: <T>(executor: () => Promise<T>) => Promise<T>;
  requestAutoSave: <T>(executor: () => Promise<T>) => Promise<T>;
  requestImmediateSave: <T>(executor: () => Promise<T>) => Promise<T>;
}

export interface UseOutlineOperationsOptions {
  /** 覆盖默认保存实现（便于测试或自定义管道） */
  saveImpl?: (outline: ReportOutlineData) => Promise<SaveOutlineResponse>;
}
