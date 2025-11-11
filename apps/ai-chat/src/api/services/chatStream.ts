import { getApiPrefix } from '@/services/request'
import { getWsidDevProd } from '@/utils/env'
import { createConfiguredXRequest as createConfiguredXRequestGelUi } from 'gel-ui'

/**
 * 创建配置了基础设置的 XRequest 实例
 */
export const createConfiguredXRequest = (signal: AbortSignal | undefined) =>
  createConfiguredXRequestGelUi(signal, getWsidDevProd(), getApiPrefix())
