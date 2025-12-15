import axios from './index'

/**
 * This is the main type for the search results object.
 * @typedef {Object} SearchResObj
 * @property {boolean} AI_trans_flag - The flag indicating if the result is translated by AI.
 * @property {string} artificial_person_name - The name of the artificial person.
 * @property {string} biz_reg_no - The business registration number.
 * @property {string} capital_unit - The unit of the capital.
 * @property {string} corp_id - The ID of the corporation.
 * @property {string} corp_name - The name of the corporation.
 * @property {string} corp_old_id - The old ID of the corporation.
 * @property {string[]} corporation_tags3 - The array of corporation tags.
 * @property {string} establish_date - The establishment date of the corporation.
 * @property {Object} highlight - The object containing highlighted information.
 * @property {string} industry_name - The name of the industry.
 * @property {boolean} is_mycustomer - The flag indicating if the corporation is a mycustomer.
 * @property {string} logo - The URL of the logo.
 * @property {string} registerCapital - The registered capital of the corporation.
 * @property {string} register_address - The registered address of the corporation.
 * @property {string} status_after - The status of the corporation after a certain event.
 */

/**
 * This is the main type for the search response object.
 * @typedef {Object} SearchResponse
 * @property {SearchResObj[]} search - The array of search results.
 * @property {number} total - The total number of search results.
 */
export const getCompanySearchList = (data) => {
  return axios.request({
    method: 'post',
    data,
    cmd: 'search/company/getclassifycompanynew',
  })
}

export const getCompanyView = (data) => {
  return axios.request({
    method: 'post',
    data,
    cmd: 'getcorpdetailhis',
  })
}
export const getCompanyHotView = (data?) => {
  return axios.request({
    method: 'post',
    data: data ? data : [],
    cmd: 'operation/get/getHotCompany',
  })
}

export const clearCompanyView = (data) => {
  return axios.request({
    method: 'post',
    data,
    cmd: 'clearhistorykey',
  })
}

export const delCompanyView = (data) => {
  return axios.request({
    method: 'post',
    data,
    cmd: 'clearhistorykey',
  })
}

export const getPersonList = (data) => {
  return axios.request({
    method: 'post',
    data: data ? data : [],
    cmd: 'search/person/getclassifyperson',
  })
}

export const getOverSeaList = (data) => {
  return axios.request({
    method: 'post',
    data: data ? data : [],
    cmd: 'search/company/getglobalcompanysearch',
  })
}

export const getPersonView = (data) => {
  return axios.request({
    method: 'post',
    data: data ? data : [],
    cmd: 'operation/get/personbrowsehistorylist',
  })
}

export const addPersonView = (data) => {
  return axios.request({
    method: 'post',
    data: data ? data : [],
    cmd: 'operation/insert/personbrowsehistoryadd',
  })
}

export const delPersonViewOne = (data) => {
  return axios.request({
    method: 'post',
    data: data ? data : [],
    cmd: 'operation/delete/personbrowsehistorydeleteone',
  })
}

export const delPersonViewAll = (data) => {
  return axios.request({
    method: 'post',
    data: data ? data : [],
    cmd: 'operation/delete/personbrowsehistorydeleteall',
  })
}

export const getGroupList = (data) => {
  return axios.request({
    method: 'post',
    data: data ? data : [],
    cmd: 'search/group/getgroupsystemsearch',
  })
}

export const getGroupHotView = (data) => {
  return axios.request({
    method: 'post',
    data: data ? data : [],
    cmd: 'search/group/getgrouprecommendcards',
  })
}

export const getJobView = (data) => {
  return axios.request({
    method: 'post',
    data,
    cmd: 'gethistorykey',
  })
}

export const getJobHotView = (data) => {
  return axios.request({
    method: 'post',
    data,
    cmd: 'getmostviewedbytype',
  })
}

export const getIntellectualList = (data) => {
  return axios.request({
    method: 'post',
    data,
    cmd: data.type == 'intellectual_property_merge_search' ? 'search/intellectual/getintellectual' : 'getintellectual',
  })
}

export const getPatentList = (data) => {
  return axios.request({
    method: 'post',
    data: data ? data : [],
    cmd: 'search/intellectual/getintellectual_patent',
  })
}

export const getIntellectualViewList = (data) => {
  return axios.request({
    method: 'post',
    data,
    cmd: 'getintellectualhistory',
  })
}

export const getBidViewList = (data) => {
  return axios.request({
    method: 'post',
    data: data ? data : [],
    cmd: 'search/bid/getbiddingsearchadvance',
  })
}

export const getBidSearchList = (data) => {
  return axios.request({
    method: 'post',
    data: data ? data : [],
    cmd: 'search/bid/getbiddingsearchadvance',
  })
}

export const getCollectlist = (data) => {
  return axios.request({
    method: 'post',
    data,
    cmd: 'GetCustomerCountGroup',
  })
}

export const addCollect = (data) => {
  return axios.request({
    method: 'post',
    data,
    cmd: 'addtomycustomer',
  })
}

export const deleteCollect = (data) => {
  return axios.request({
    method: 'post',
    data,
    cmd: 'DeleteCustomer',
  })
}

export const createDownload = (data) => {
  return axios.request({
    method: 'post',
    data,
    cmd: 'download/createtask/corpSearch',
  })
}

export const getOutCompanySearch = (data) => {
  return axios.request({
    method: 'post',
    data,
    cmd: 'search/company/getglobalcompanysearch',
  })
}

export const getOutCompanyView = (data) => {
  return axios.request({
    method: 'post',
    data,
    cmd: 'gethistorykey',
  })
}

export const getJobHistory = (data) => {
  return axios.request({
    url: '/gel/operation/get/gethistoryinfo',
    method: 'post',
    cmd: 'operation/get/gethistoryinfo',
    data,
  })
}
export const getBidHistory = (data?) => {
  return axios.request({
    method: 'post',
    data,
    cmd: 'getuserbiddinghistory',
  })
}
export const getJobSearch = (data) => {
  return axios.request({
    method: 'post',
    cmd: 'search/recruit/getrecruitmentsearch',
    data,
  })
}
export const getCompanyName = (data) => {
  return axios.request({
    method: 'post',
    data,
    cmd: 'detail/company/getcorpbasicname/' + data.companycode,
  })
}
export const deleteSingleHis = (data) => {
  return axios.request({
    method: 'post',
    data,
    cmd: 'clearhistorykey',
  })
}
export const deleteBidSingleHis = (data) => {
  return axios.request({
    method: 'post',
    data,
    cmd: 'clearuserbiddinghistory',
  })
}
export const downloadBid = (data) => {
  return axios.request({
    method: 'post',
    data,
    cmd: 'download/createtask/bidTenderSearch',
  })
}
export const getBidSearchNew = (data) => {
  return axios.request({
    method: 'post',
    cmd: 'search/bid/getbiddingsearchadvance',
    data,
  })
}
export const deleteSingleJobHis = (data) => {
  return axios.request({
    method: 'post',
    cmd: 'operation/get/deleteonehistory',
    data: data ? data : [],
  })
}
export const deleteAllJobHis = (data) => {
  return axios.request({
    method: 'post',
    cmd: 'operation/get/deleteallhistory',
    data: data ? data : [],
  })
}
export const getAllBidSubscribe = (data) => {
  return axios.request({
    method: 'post',
    cmd: 'operation/get/selectConditionByUserId',
    data: data ? data : [],
  })
}

export const getBidSubscribeDetail = (data) => {
  return axios.request({
    method: 'post',
    cmd: 'operation/get/selectConditionById',
    data,
  })
}

export const getBidSubscribeEmail = (data?) => {
  return axios.request({
    method: 'post',
    cmd: 'operation/get/selectReceiversByUserId',
    data: data ? data : [],
  })
}

export const addBidSubscribe = (data) => {
  return axios.request({
    method: 'post',
    cmd: 'operation/insert/addCondition',
    data,
  })
}

export const deleteSingleSubscribe = (data) => {
  return axios.request({
    method: 'post',
    cmd: 'operation/get/deleteConditionById',
    data,
  })
}
export const deleteAllSubscribe = (data) => {
  return axios.request({
    method: 'post',
    cmd: 'operation/get/deleteAllConditions',
    data: data ? data : [],
  })
}

// 专利查询、商标查询、海外企业查询、榜单名录、集团系
export const getQueryCommonList = ({ url, cmd, data }: { url: string; cmd?: string; data: any }) => {
  return axios.request({
    url,
    cmd,
    method: 'post',
    data: { ...data },
  })
}
