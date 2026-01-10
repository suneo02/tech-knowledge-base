import { ChatRawSentenceIdIdentifier, ReportOutlineData } from 'gel-api';
import { OtherMessageStatus } from 'gel-ui';

/** 大纲消息（统一类型，通过 context 判断是否为最后一条来决定编辑/预览模式） */
/** 关联的 agent 消息 ID，用于判断是否为最后一条 */
export interface OutlineMessage {
  role: 'outline';
  status: OtherMessageStatus;
  /** 大纲数据 */
  content?: ReportOutlineData & Partial<ChatRawSentenceIdIdentifier>;
}
