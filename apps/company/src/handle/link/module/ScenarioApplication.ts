import { generateCommonLink } from '../handle'
import { LinksModule } from './linksModule'
import { GELSearchParam } from '../config'

/**
 * 场景应用
 */
export const ScenarioApplicationLinkEnum = {
  PARK: 'park',
  NEW_CORP: 'newcorp',
  CHAIN: 'chain',
  SUPPLY: 'supply',
  BATCH_OUTPUT: 'batchoutput',
}

/**
 * 拼接综合查询 url 根据 submodule
 */
export const getScenarioApplicationLinkBySubModule = ({ subModule, params = {}, env }) => {
  if (!subModule) {
    return null
  }

  return generateCommonLink({
    module: LinksModule.SCENARIO_APPLICATION,
    params: {
      target: subModule,
      [GELSearchParam.NoSearch]: 1,
      [GELSearchParam.IS_SEPARATE]: 1,
      ...params,
    },
    env,
  })
}
