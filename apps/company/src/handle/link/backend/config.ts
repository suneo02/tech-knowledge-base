import { LinksModule } from '../module'

/**
 * 后端传的 module 到前端的映射
 */
export const EBackendModuleMap: Record<string, LinksModule> = {
  company: LinksModule.COMPANY,
  person: LinksModule.CHARACTER,
  character: LinksModule.CHARACTER,
}
