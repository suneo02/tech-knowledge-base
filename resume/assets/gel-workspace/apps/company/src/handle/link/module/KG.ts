import { generateCommonLink } from '../handle'
import { LinksModule } from './linksModule'

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
  const finalParams = subModule === KGLinkEnum.FRONT
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
