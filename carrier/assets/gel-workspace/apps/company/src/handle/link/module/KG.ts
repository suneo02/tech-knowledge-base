import { generateCommonLink } from '../handle'
import { LinksModule } from './linksModule'
import { TGelEnv, getEnvParams } from '@/utils/env/index.ts'
import { getPrefixUrl } from '@/handle/link/handle/prefixUrl.ts'
import { handleAppendUrlPath } from '@/handle/link/handle/common.ts'
import { COMMON_PARAM_KEYS, EIsSeparate, ENoSearch } from 'gel-util/link'
import { AIGRAPH_PARAM_KEYS } from '@/views/AICharts/contansts'

/**
 * @description AI图谱hash key
 */
export const AIGRAPH_HASH_KEY = 'aigraph'

/**
 * 图谱平台 各子页面
 *
 *
 */
export const KGLinkEnum = {
  FRONT: 'front', // 首页
  chart_gqct: 'chart_gqct', // 股权穿透
  chart_newtzct: 'chart_newtzct', // 对外投资
  chart_yskzr: 'chart_yskzr', // 实控人
  chart_qysyr: 'chart_qysyr', // 受益人
  chart_glgx: 'chart_glgx', // 关联方
  chart_qytp: 'chart_qytp', // 企业图谱
  chart_ysgx: 'chart_ysgx', // 意思关系
  chart_rztp: 'chart_rztp', // 融资图谱
  chart_rzlc: 'chart_rzlc', // 融资历程
  chart_cgx: 'chart_cgx', // 查关系
  chart_ddycd: 'chart_ddycd', // 多对一触达
  chart_cglj: 'chart_cglj', // 持股路径
}

/**
 * 拼接图谱平台的 url 根据 submodule
 */
export const getKgLinkBySubModule = ({ subModule, params = {}, env }) => {
  const finalParams =
    subModule === KGLinkEnum.FRONT
      ? params
      : {
          activeKey: subModule,
          ...params,
        }

  return generateCommonLink({
    module: LinksModule.KG,
    params: finalParams,
    env,
  })
}

/**
 * 获取 iframe 嵌套的 WebAI 聊天链接 包含header头
 * @param param0
 * @returns
 */
export const getAIGraphLink = ({
  env: envParam,
  params,
}: { env?: TGelEnv; params?: Record<string, string | number> } = {}) => {
  try {
    const env = envParam || getEnvParams().env
    return generateCommonLink({
      module: LinksModule.GRAPH_AI,
      params: {
        [COMMON_PARAM_KEYS.NOSEARCH]: ENoSearch.True.toString(),
        [COMMON_PARAM_KEYS.ISSEPARATE]: EIsSeparate.True.toString(),
        ...params,
      },
      env,
    })
  } catch (e) {
    console.error(e)
  }
}
