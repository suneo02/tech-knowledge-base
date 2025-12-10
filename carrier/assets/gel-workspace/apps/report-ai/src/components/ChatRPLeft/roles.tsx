import { md } from '@/libs/markdown';
import { RolesTypeReport } from '@/types';
import { getWsid, isDev } from '@/utils';
import { AIHeaderRole, createAIRole, createSuggestionRole, SubQuestionRole, UserRole } from 'ai-ui';
import { entWebAxiosInstance } from '../../api/entWeb';

// 报告角色配置
export const rolesReport: RolesTypeReport = {
  aiHeader: AIHeaderRole,
  ai: createAIRole(isDev, md, getWsid(), entWebAxiosInstance),
  user: UserRole,
  subQuestion: SubQuestionRole,
  suggestion: createSuggestionRole(isDev, getWsid(), entWebAxiosInstance),
};
