import { RPFileUnified } from '@/types/file';
import { RPFileTraced } from 'gel-api';
import { getDPUId, getRAGId } from 'gel-util/biz';
import { RPReferenceItem, RPReferenceType } from './type';

/**
 * 获取文件引用资料的唯一标识符
 * @param file 文件数据
 * @returns 唯一标识符
 */
export const getFileReferenceId = (file: RPFileTraced | RPFileTraced | RPFileUnified): string => {
  return file.fileId || '';
};

/**
 * 通用的引用资料标识符获取函数
 */
export function getReferenceIdentifier(item: RPReferenceItem): string {
  const { type, data } = item;
  switch (type) {
    case 'dpu':
      return getDPUId(data);
    case 'rag':
      return getRAGId(data);
    case 'file':
      return getFileReferenceId(data);
    default:
      return '';
  }
}

export function generateChatRefKey(type: RPReferenceType, id: string): string {
  return `${type}:${id}`;
}

export function getReferenceUniqueKey(item: RPReferenceItem): string {
  const { type } = item;
  const id = getReferenceIdentifier(item);
  return generateChatRefKey(type, id);
}
