import { entWebAxiosInstance } from '@/api/entWeb/index.ts'
import { md } from '@/components/markdown/index.tsx'
import { getWsidDevProd, isDev } from '@/utils/env.ts'
import {
  AIHeaderRole,
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
  aiHeader: AIHeaderRole,
  ai: createAIRole(isDev, md, getWsidDevProd(), entWebAxiosInstance),
  user: UserRole,
  subQuestion: SubQuestionRole,
  file: FileRole,
  chart: createChartRole(isDev, getWsidDevProd(), entWebAxiosInstance),
  suggestion: createSuggestionRole(isDev, getWsidDevProd(), entWebAxiosInstance),
  questionGuide: QuestionGuideRole,
  smartTable: SmartTableRole,
}
