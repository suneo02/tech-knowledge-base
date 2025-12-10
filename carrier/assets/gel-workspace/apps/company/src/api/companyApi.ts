import { ApiResponse } from '@/api/types.ts'
import { CorpTag } from 'gel-api/*'
import { CorpCardInfo } from 'gel-types'
import axios from './index.ts'

/**
 * 获取企业详情头部信息
 * @deprecated
 * @param id
 * @returns {Promise<ResponseType>}
 */
export const getCorpHeaderInfo = (id): Promise<ApiResponse<CorpCardInfo>> => {
  return axios.request({
    method: 'post',
    cmd: 'detail/company/getcorpbasicinfo_card',
    data: {
      __primaryKey: id,
    },
  })
}

// 获取企业工商信息
export const getCorpInfo = (id) => {
  return axios.request({
    method: 'post',
    cmd: 'detail/company/getcorpbasicinfo_basic',
    data: {
      __primaryKey: id,
    },
  })
}

/**
 * @deprecated
 *
 * 企业统计数字basicnum
 * @param id
 * @returns {Promise<ResponseType>}
 */
export const getCompanyBasicNum = (id) => {
  return axios.request({
    method: 'post',
    cmd: 'getentbasicnum',
    data: {
      companycode: id,
    },
  })
}

export interface ICorpTagData {
  corpListTags: string[] // 企业列表标签
  industryTags: string[] // 产业分类 2025-05-21 added by Calin
  corporationTags: string[] // 企业性质和规模标签
  counterfeitNation: boolean // 是否为虚假国家标识
  enumTags: string[] // 枚举标签
  govSupport: string[] // 政府支持标签
  productWords: string[] // 产品或服务相关词汇
  riskTags: {
    bankruptcyevent_count: number // 破产事件次数
    breakpromise_num: number // 违约次数
    corp_consumption_num: number // 企业消费次数
    end_case_num: number // 结案次数
    illegal_num: number // 违法次数
    taxdebts_count: number // 税务债务次数
    taxillegal_count: number // 税务违法次数
    valid_abnormal: number // 有效异常次数
    violation_punish: number // 违规处罚次数
  } // 风险标签对象
}

/**
 * 企业标签tags
 * 表示一家企业的详细信息和相关标签。
 */
export const getCompanyTags = (id): Promise<ApiResponse<CorpTag[]>> => {
  return axios.request({
    method: 'post',
    cmd: 'detail/company/getcompanytagsv6',
    data: {
      __primaryKey: id,
      pageSize: 100,
      pageNo: 0,
    },
  })
}

// 获取业务数据统计数字
export const getIpoNum = (companyid) => {
  return axios.request({
    method: 'post',
    cmd: 'getcompbussinessdatanum',
    data: {
      Companycode: companyid,
    },
  })
}
//更多联系方式
export const getMoreContact = (data) => {
  return axios.request({
    method: 'post',
    cmd: `detail/company/getmorecontactinfo/${data.companycode}`,
    data: data,
  })
}

// 获取企业所属类型：医药、上市、公募基金、私募基金
export const getCorpCategory = (id) => {
  return axios.request({
    method: 'post',
    cmd: 'apigetallcorpcategory',
    data: {
      companycode: id,
      expoVer: 1,
    },
  })
}

// 获取企业详情内各模块数据
export const getCorpModuleInfo = (cmd, data) => {
  return axios.request({
    method: 'post',
    cmd: cmd,
    data,
  })
}

// 获取来自risk的企业详情内各模块数据
export const getCorpModuleInfoFromRisk = (cmd, data, apiSource) => {
  return axios.request({
    method: 'post',
    cmd: cmd,
    apiSource,
    data,
    formType: 'payload',
  })
}

// 导出企业详情内各模块数据
export const exportCorpModuleData = (cmd, data) => {
  return axios.request({
    method: 'post',
    cmd: cmd,
    data,
  })
}

/**
 * @deprecated
 * 移步 ts 版
 通用请求函数
 *
 */
export const myWfcAjax = (cmd, data) => {
  return axios.request({
    method: 'post',
    cmd: cmd,
    data,
  })
}

// 获取企业股东信息
export const pageShareholder = (data) => {
  return axios.request({
    url: '/api/search/corp/basicInfo/pageShareholder',
    method: 'post',
    data,
    cmd: 'xx',
  })
}

// 获取企业招投标信息
export const pageBiddingInfo = (data) => {
  return axios.request({
    url: '/api/search/corp/pageBiddingInfo',
    method: 'post',
    data,
  })
}

// 获取企业邮箱
export const pageMailInfo = (data) => {
  return axios.request({
    url: '/api/search/corp/contact/pageMailInfo',
    method: 'post',
    data,
  })
}

// 获取企业电话
export const pageTelInfo = (data) => {
  return axios.request({
    url: '/api/search/corp/contact/pageTelInfo',
    method: 'post',
    data,
  })
}

export const getCorpRelatedPerson = (code) => {
  return axios.request({
    method: 'post',
    cmd: 'getcorprelatedperson',
    data: {
      companycode: code,
    },
  })
}

// 获取企业分支机构
export const pageBranchInfo = (data) => {
  return axios.request({
    url: '/api/search/corp/contact/pageBranchInfo',
    method: 'post',
    data,
  })
}

// 获取功能地图
export const getConfigInfo = (corpId) => {
  return axios.request({
    url: `/api/search/corp/basicInfo/getIconInfo?corpId=${corpId}`,
    method: 'get',
  })
}

// 获取公告正文
export const getCompanyLogo = (url) => {
  return axios.request({
    url: `${url}`,
    method: 'get',
    responseType: 'blob',
    extra: true,
    noProdcutName: true,
  })
}

// 获取风险得分
export const getNewsScore = (_companyCode, data) => {
  return axios.request({
    cmd: '/detail/company/get_newsscore',
    method: 'post',
    data,
  })
}

// 获取股权穿透中展开当前详细信息
export const getshareholdertracedetail = (code, detailId) => {
  return axios.request({
    method: 'post',
    cmd: `detail/company/getshareholdertracedetail/${code}`,
    data: {
      pageNo: 0,
      pageSize: 50,
      detailId: detailId,
    },
  })
}

export const createFastCrawl = (companycode) => {
  return axios.request({
    method: 'post',
    cmd: 'fastcrawler',
    data: {
      companycode,
    },
  })
}

export const getCrawlStatus = () => {
  return axios.request({
    method: 'post',
    cmd: 'getcrawlstatus',
    data: {},
  })
}

export const getTechScore = (companyCode, data) => {
  return axios.request({
    method: 'post',
    cmd: `detail/company/technologicalScore/${companyCode}`,
    data: data,
  })
}

export const getTechRank = (companyCode, data) => {
  return axios.request({
    method: 'post',
    cmd: `detail/company/technologicalRank/${companyCode}`,
    data: data,
  })
}

export const downloadTechRankWord = (companyCode) => {
  return axios.request({
    method: 'post',
    cmd: `download/createtask/technologicalScore/${companyCode}`,
    data: { companyCode: companyCode },
  })
}
