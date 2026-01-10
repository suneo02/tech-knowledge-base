import { md } from '@/libs/markdown';
import { RolesTypeReportOutline } from '@/types';
import { getWsid, isDev } from '@/utils';
import { AIHeaderRole, SubQuestionRole, createAIRole, createSuggestionRole } from 'ai-ui';
import { entWebAxiosInstance } from '../../../api/entWeb';
import { reportOutlineRole } from '../../ChatCommon/ChatRoles/outline';
import { reportProgressRole } from '../../ChatCommon/ChatRoles/progress';
import { UserRoleRPOutline } from './user';

// 报告大纲角色配置
export const rolesReportOutline: RolesTypeReportOutline = {
  aiHeader: AIHeaderRole,
  ai: createAIRole(isDev, md, getWsid(), entWebAxiosInstance),
  user: UserRoleRPOutline,
  subQuestion: SubQuestionRole,
  progress: reportProgressRole,
  suggestion: createSuggestionRole(isDev, getWsid(), entWebAxiosInstance),
  outline: reportOutlineRole,
};
