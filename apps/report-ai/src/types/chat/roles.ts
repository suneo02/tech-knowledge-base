import { AntRoleType, RolesTypeCore } from 'gel-ui';
import { OutlineEditorMessage, OutlinePreviewMessage } from './parsedMsg';
import { RPOutlineUserMsgParse } from './RPOutline';

/**
 * AI 报告大纲 角色配置集合
 */
export type RolesTypeReportOutline = Pick<RolesTypeCore, 'aiHeader' | 'ai' | 'subQuestion' | 'suggestion'> & {
  user: AntRoleType<RPOutlineUserMsgParse['content']>;
  outlineEditor: AntRoleType<OutlineEditorMessage['content']>;
  outlinePreview: AntRoleType<OutlinePreviewMessage['content']>;
};

/**
 * AI 报告 角色配置集合
 */
export type RolesTypeReport = Pick<RolesTypeCore, 'aiHeader' | 'ai' | 'user' | 'subQuestion' | 'suggestion'>;
