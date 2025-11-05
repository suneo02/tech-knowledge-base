import { entWebAxiosInstance } from '@/api/entWeb/index.ts'
import { md } from '@/components/markdown/index.tsx'
import { getWsidDevProd, isDev } from '@/utils/env.ts'
import { createRolesBase } from 'ai-ui'

// 默认角色配置
export const rolesBase = createRolesBase({
  isDev,
  md,
  wsid: getWsidDevProd(),
  entWebAxiosInstance,
})
