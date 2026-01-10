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
import { SmartTableRole } from './SmartTable.tsx'
import { SplTableRoleComp } from './SplTable/index.tsx'
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
  splTable: {
    placement: 'end',
    variant: 'borderless',
    style: {
      marginBlock: 12,
      backgroundColor: 'transparent',
      padding: 0,
    },
    messageRender: (content) => {
      return <SplTableRoleComp content={content} />
    },
  },
  smartTable: SmartTableRole,
  aiFooter: {
    placement: 'start',
    variant: 'borderless',
    style: {
      width: '100%',
      padding: 0,
      backgroundColor: 'transparent',
    },
  },
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
