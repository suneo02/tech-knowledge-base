import { RPFileUploaded } from '@/types';
import { RPOutlineSendInput } from '@/types/chat/RPOutline';

/**
 * 发送消息的回调函数类型
 * @param message - 消息内容
 * @param context - 附加选项
 */
export type RPOutlineChatSenderCB = (input: Pick<RPOutlineSendInput, 'content' | 'files' | 'refFiles'>) => void;

/**
 * 文件引用解析结果
 */
export interface FileReferenceParseResult {
  /** 解析出的文件ID列表 */
  fileIds: string[];
  /** 有效的引用文件列表 */
  validRefFiles: RPFileUploaded[];
  /** 无效的引用名称列表 */
  invalidReferences: string[];
}

/**
 * 文件移除回调
 */
export type FileRemoveCallback = (fileId: string) => void;

/**
 * 发送消息的附加数据
 */
export interface SendMessageData {
  /** 消息内容 */
  message: string;
  /** 上传的文件列表 */
  files: RPFileUploaded[];
  /** 引用的文件列表 */
  refFiles: RPFileUploaded[];
}
