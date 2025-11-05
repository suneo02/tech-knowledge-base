import { WindSessionHeader } from '@/env'
import { LinkModule } from '@/link/config/linkModule'
import { CommonLinkParams } from './common'

/**
 * 对外提供的图谱页面通用参数
 */
type KGLinkExternalParamsCommon = {
  companycode: string
  snapshot: '1'
  linksource: 'pcai'
  notoolbar: '1'
  [WindSessionHeader]: string
} & Partial<CommonLinkParams>

/**
 * 图谱平台 各子页面
 *
 *
 */
export enum KGLinkActiveKeyEnum {
  FRONT = '', // 首页
  chart_gqct = 'chart_gqct', // 股权穿透
  chart_newtzct = 'chart_newtzct', // 对外投资
  chart_yskzr = 'chart_yskzr', // 实控人
  chart_qysyr = 'chart_qysyr', // 受益人
  chart_glgx = 'chart_glgx', // 关联方
  chart_qytp = 'chart_qytp', // 企业图谱
  chart_ysgx = 'chart_ysgx', // 意思关系
  chart_rztp = 'chart_rztp', // 融资图谱
  chart_rzlc = 'chart_rzlc', // 融资历程
  chart_cgx = 'chart_cgx', // 查关系
  chart_ddycd = 'chart_ddycd', // 多对一触达
  chart_cglj = 'chart_cglj', // 持股路径
}

// 定义每个模块的参数接口
export interface KGLinkParams {
  [LinkModule.GQCT_CHART]: {
    companycode: string
    snapshot: '1'
    linksource: 'pcai'
    notoolbar: '1'
    onlyChart?: '1'
    noslide?: '1'
    disableExportExcel?: '1'
    [WindSessionHeader]: string
  } & KGLinkExternalParamsCommon

  [LinkModule.ACTUAL_CONTROLLER_CHART]: KGLinkExternalParamsCommon
  [LinkModule.BENEFICIAL_CHART]: KGLinkExternalParamsCommon
  [LinkModule.CORRELATION_CHART]: KGLinkExternalParamsCommon

  [LinkModule.KG_PLATFORM]: {
    activeKey: KGLinkActiveKeyEnum
  } & CommonLinkParams
}
