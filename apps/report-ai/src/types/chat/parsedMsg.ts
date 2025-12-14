import { ReportOutlineData } from 'gel-api';
import { BaseMessageFields, OtherMessageStatus } from 'gel-ui';

/** 大纲编辑器消息 */
export type OutlineEditorMessage = BaseMessageFields & {
  role: 'outlineEditor';
  status: OtherMessageStatus;
  /** 现在是 rawsentenc id，根据此 id 查询大纲 */
  content?: ReportOutlineData;
};

/** 大纲预览消息 */
export type OutlinePreviewMessage = BaseMessageFields & {
  role: 'outlinePreview';
  status: OtherMessageStatus;
  /** 现在是 rawsentenc id，根据此 id 查询大纲 */
  content?: ReportOutlineData;
};
