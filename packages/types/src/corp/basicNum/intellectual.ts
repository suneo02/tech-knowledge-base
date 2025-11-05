import { CorpBasicNumBoolFlag } from './common'

export interface CorpBasicNumIntellectual {
  project_info_num: number // 企业业务-项目信息
  tradelbl_num: number // 企业业务-品牌信息
  brand_combining_num: number // 企业业务-品牌加盟
  ecommerce_store_num: number // 企业业务-电商店铺

  product_num: number // APP产品
  hotel_num: number // 旗下酒店
  report_num: CorpBasicNumBoolFlag // 公司研报
  gov_major_project_num: number // 政府重大项目
  recruitt_num: number // 招聘

  landanns_num: number // 土地信息-土地公示
  landpurchase_num: number // 土地信息-拿地信息
  landtrans_num: number // 土地信息-土地转让

  fundpe_num: number // 私募基金

  customer_num: number // 客户和供应商-客户
  supplier_num: number // 客户和供应商-供应商

  relate_dparty_num: number // 业务关联方
  gov_support_num: number // 政府扶持

  technologicalInnovationCount: number // 科创分
  workcopyr_num: number // 作品著作权
  softwarecopyright_num: number // 软件著作权
  standardInfo: number // 标准信息
  domain_num: number // 网站备案
  webchat_public_num: number // 微信公众号
  micro_blog_num: number // 微博账号
  today_headline_num: number // 头条号
  ic_layout_num: number // 集成电路布图
}
