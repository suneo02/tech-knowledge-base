import { AxiosInstance } from 'axios'
import { AntRoleType, RolesTypeBase } from 'gel-ui'
import MarkdownIt from 'markdown-it'
import { AIHeaderRole, AIHeaderRoleEmpty, createAIRole } from '../AIMsg/role.tsx'
import { FileRole } from '../components/file.tsx'
import { UserRole } from '../components/user.tsx'
import { SubQuestionRole } from '../SubQuestion/index.tsx'
import { createSuggestionRole } from '../suggestion/role.tsx'
import { createChartRole } from './chart.tsx'
import { SimpleChartRole } from './SimpleChartRole.tsx'
import { SplTableRole } from './SplTableRole.tsx'

export * from '../AIMsg/role.tsx'
export * from '../suggestion/role.tsx'
export * from './chart'
export * from './SimpleChartRole'

type CreateRolesBaseProps = {
  isDev: boolean
  md: MarkdownIt
  wsid: string
  entWebAxiosInstance: AxiosInstance
  showAiHeader?: boolean // 是否显示AI头部，默认显示
}

// 移除角色配置中的avatar属性，保持类型安全
const removeAvatarFromRole = <T extends AntRoleType<any>>(role: T): Omit<T, 'avatar'> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  const baseRoles: RolesTypeBase = {
    aiHeader: showAiHeader ? AIHeaderRole : AIHeaderRoleEmpty,
    ai: createAIRole(isDev, md, wsid, entWebAxiosInstance, showAiHeader),
    user: UserRole,
    subQuestion: SubQuestionRole,
    suggestion: createSuggestionRole(isDev, wsid, entWebAxiosInstance),
    file: FileRole,
    chart: createChartRole(isDev, wsid, entWebAxiosInstance),
    simpleChart: SimpleChartRole,
    splTable: SplTableRole,
  }

  // 如果不需要显示AI头部，移除所有角色的avatar属性
  if (!showAiHeader) {
    return Object.fromEntries(
      Object.entries(baseRoles).map(([key, role]) => [key, removeAvatarFromRole(role)])
    ) as RolesTypeBase
  }

  return baseRoles
}
