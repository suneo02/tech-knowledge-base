import { generateCommonLink } from '../../handle'
import { LinksModule } from '@/handle/link'

/**
 * 拼接特色企业 各类型企业列表的 url 根据 submodule
 */

export const getSpecialCompanyListLinkBySubModule = ({ subModule, params, env }) => {
  return generateCommonLink({
    module: LinksModule.SPECIAL_CORP,
    params: {
      ...params,
      pageType: subModule,
    },
    env,
  })
}
