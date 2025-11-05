import { AxiosInstance } from 'axios'
import MarkdownIt from 'markdown-it'
import { FileRole } from '../components/file.tsx'
import { UserRole } from '../components/user.tsx'
import { AIHeaderRole, AIHeaderRoleEmpty, createAIRole } from './AI.tsx'
import { createChartRole } from './chart.tsx'
import { SimpleChartRole } from './SimpleChartRole.tsx'
import { SubQuestionRole } from './SubQuestion.tsx'
import { createSuggestionRole } from './Suggestion.tsx'
import { RolesTypeBase, RoleTypeBase } from './type.ts'

export * from './AI'
export * from './chart'
export * from './SimpleChartRole'
export * from './SubQuestion'
export * from './Suggestion'
export * from './type'

type CreateRolesBaseProps = {
  isDev: boolean
  md: MarkdownIt
  wsid: string
  entWebAxiosInstance: AxiosInstance
  showAiHeader?: boolean // 是否显示AI头部，默认显示
}

// 移除角色配置中的avatar属性，保持类型安全
const removeAvatarFromRole = <T extends RoleTypeBase>(role: T): Omit<T, 'avatar'> => {
  const { avatar, ...roleWithoutAvatar } = role
  return roleWithoutAvatar
}

// 默认角色配置
export const createRolesBase: (props: CreateRolesBaseProps) => RolesTypeBase = ({
  isDev,
  md,
  wsid,
  entWebAxiosInstance,
  showAiHeader = true,
}) => {
  const baseRoles = {
    aiHeader: showAiHeader ? AIHeaderRole : AIHeaderRoleEmpty,
    ai: createAIRole(isDev, md, wsid, entWebAxiosInstance, showAiHeader),
    user: UserRole,
    subQuestion: SubQuestionRole,
    suggestion: createSuggestionRole(isDev, wsid, entWebAxiosInstance),
    file: FileRole,
    chart: createChartRole(isDev, wsid, entWebAxiosInstance),
    simpleChart: SimpleChartRole,
  }

  // 如果不需要显示AI头部，移除所有角色的avatar属性
  if (!showAiHeader) {
    return Object.fromEntries(
      Object.entries(baseRoles).map(([key, role]) => [key, removeAvatarFromRole(role)])
    ) as RolesTypeBase
  }

  return baseRoles
}
