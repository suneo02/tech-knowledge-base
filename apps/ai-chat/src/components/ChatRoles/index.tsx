import { entWebAxiosInstance } from '@/api/entWeb'
import { getWsidDevProd, isDev } from '@/utils/env'
import { createDefaultRoles } from 'ai-ui'
import { md } from '../markdown'

// 默认角色配置
export const defaultRoles = createDefaultRoles(isDev, md, getWsidDevProd(), entWebAxiosInstance)
