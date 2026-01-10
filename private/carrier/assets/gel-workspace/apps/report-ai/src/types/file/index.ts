/**
 * 前端统一文件类型定义
 *
 * @description
 * 统一 RPFile 和 RPFileTraced 两种后端文件类型，为前端提供统一的数据接口
 *
 * @since 1.0.0
 * @author 开发团队
 */

import { RPFile, RPFileIdIdentifier, RPFileTraced } from 'gel-api';
import { RPContentRefChapterIdentifier } from '../chat/RPContent';

/**
 * 前端统一文件类型
 *
 * @description
 * 合并 RPFile 和 RPFileTraced 的所有字段，以 fileId 为唯一标识符
 *
 * 重要说明：
 * - position 和 refChapter 数组长度始终相同
 * - position[i] 对应 refChapter[i]，表示该文件在该章节中的位置
 * - 如果某个章节没有位置信息，对应的 position[i] 为 undefined
 */
export type RPFileUnified = RPFile &
  Omit<RPFileTraced, 'position'> &
  Partial<RPContentRefChapterIdentifier> & {
    /**
     * 文件位置数组，与 refChapter 一一对应
     * - position[i] 对应 refChapter[i]
     * - 如果某个章节没有位置信息，对应位置为 undefined
     * - position.length === refChapter.length
     */
    position?: Array<RPFileTraced['position']>;
  };

export interface RPFileUploaded extends RPFileIdIdentifier {
  fileName?: string;
  uploadTime?: string;
  /** 上传进度，0-100，100表示完成 */
  uploadProgress?: number;
}
