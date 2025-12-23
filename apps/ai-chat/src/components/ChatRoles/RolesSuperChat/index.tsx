import { entWebAxiosInstance } from '@/api/entWeb/index.ts'
import { md } from '@/components/markdown/index.tsx'
import { getWsidDevProd, isDev } from '@/utils/env.ts'
import {
  AIHeaderRoleEmpty,
  createAIRole,
  createChartRole,
  createSuggestionRole,
  FileRole,
  SubQuestionRole,
  UserRole,
} from 'ai-ui'
import { QuestionGuideRole } from './questionGuide.tsx'
import { SmartTableRole } from './SmartTable.tsx'
import { RolesTypeSuper } from './type.ts'
// 默认角色配置
export const rolesSuper: Partial<RolesTypeSuper> = {
  aiHeader: AIHeaderRoleEmpty,
  ai: createAIRole(isDev, md, getWsidDevProd(), entWebAxiosInstance),
  user: UserRole,
  subQuestion: SubQuestionRole,
  file: FileRole,
  chart: createChartRole(isDev, getWsidDevProd(), entWebAxiosInstance),
  suggestion: createSuggestionRole(isDev, getWsidDevProd(), entWebAxiosInstance),
  questionGuide: QuestionGuideRole,
  smartTable: SmartTableRole,
}

// 不显示头像的超级名单角色配置
export const rolesSuperNoAvatar: Partial<RolesTypeSuper> = {
  ...Object.keys(rolesSuper).reduce((acc, key) => {
    acc[key] = {
      ...rolesSuper[key],
      avatar: undefined,
      style: { ...rolesSuper[key]?.style, marginInlineEnd: 0 },
    }

    return acc
  }, {} as Partial<RolesTypeSuper>),
}
