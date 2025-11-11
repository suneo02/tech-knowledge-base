import { KGLinkEnum, LinksModule } from '@/handle/link'

/**
 * @typedef KGPageDataItem 图谱平台的链接
 * @property {string} title - 链接的标题
 * @property {string} utl - 跳转链接
 * @property {LinksModule} module - 链接所属的模块
 * 来源 src\components\HeaderHasUser.js allFunMenus
 */

export const KGPageData = [
  {
    title: '图谱平台首页',
    subModule: KGLinkEnum.FRONT,
  },
  {
    title: '股权穿透',
    subModule: KGLinkEnum.chart_gqct,
  },
  {
    title: '对外投资',
    subModule: KGLinkEnum.chart_newtzct,
  },
  {
    title: '实控人',
    subModule: KGLinkEnum.chart_yskzr,
  },
  {
    title: '受益人',
    subModule: KGLinkEnum.chart_qysyr,
  },
  {
    title: '关联方',
    subModule: KGLinkEnum.chart_glgx,
  },
  {
    title: '企业图谱',
    subModule: KGLinkEnum.chart_qytp,
  },
  {
    title: '疑似关系',
    subModule: KGLinkEnum.chart_ysgx,
  },
  // TODO 竞争关系页面有问题 链接是错误的
  {
    title: '融资图谱',
    subModule: KGLinkEnum.chart_rztp,
  },
  {
    title: '融资历程',
    subModule: KGLinkEnum.chart_rzlc,
  },
  {
    title: '查关系',
    subModule: KGLinkEnum.chart_cgx,
  },
  {
    title: '多对一触达',
    subModule: KGLinkEnum.chart_ddycd,
  },
  {
    title: '持股路径',
    subModule: KGLinkEnum.chart_cglj,
  },
].map((item) => ({ ...item, module: LinksModule.KG }))
