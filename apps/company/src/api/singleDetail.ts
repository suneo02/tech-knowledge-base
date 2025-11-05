import axios from './index'

export const patentDetailApi = (data) => {
  return axios.request({
    url: '/gel/detail/company/getpatentdetail' + data.detailId,
    method: 'post',
    cmd: 'detail/company/getpatentdetail',
    data: data,
  })
}

export const getPatentDetailPdf = (data) => {
  return axios.request({
    url: '/Wind.WFC.Enterprise.Web/Enterprise/WindSecureApi.aspx?cmd=getpatentdetailpdf',
    method: 'post',
    data,
    cmd: 'getpatentdetailpdf',
  })
}

export const getPatentDetailRight = (data) => {
  return axios.request({
    url: '/Wind.WFC.Enterprise.Web/Enterprise/WindSecureApi.aspx?cmd=getpatentdetailright',
    method: 'post',
    data,
    cmd: 'getpatentdetailright',
  })
}

export const getPatentDetailInstruction = (data) => {
  return axios.request({
    url: '/Wind.WFC.Enterprise.Web/Enterprise/WindSecureApi.aspx?cmd=getpatentdetailinstruction',
    method: 'post',
    data,
    cmd: 'getpatentdetailinstruction',
  })
}

export const getPatentDetailIndustry = (data) => {
  return axios.request({
    method: 'post',
    data,
    cmd: `detail/patentDetail/patentDetailIndustry/${data?.detailId}`,
  })
}

export const getEvaluationDetail = (data) => {
  return axios.request({
    url: '/Wind.WFC.Enterprise.Web/Enterprise/gel/detail/risk/getLegalDetail',
    method: 'post',
    data,
    cmd: 'detail/risk/getLegalDetail',
  })
}

export const geLogoDetail = (data) => {
  return axios.request({
    url: '/Wind.WFC.Enterprise.Web/Enterprise/WindSecureApi.aspx?cmd=getbranddetail',
    method: 'post',
    data,
    cmd: 'getbranddetail',
  })
}

// 产品详情
export const getAPPDetail = (data) => {
  return axios.request({
    url: '/Wind.WFC.Enterprise.Web/Enterprise/WindSecureApi.aspx?cmd=getproductdetail',
    method: 'post',
    data,
    cmd: 'getproductdetail',
  })
}

// 职位详情
export const geJobDetail = (data) => {
  return axios.request({
    cmd: `detail/company/getrecruimentbydetailid/${data?.detailId}`,
    method: 'post',
    data,
  })
}

// 企业热招的职位
export const geJobHots = (data) => {
  return axios.request({
    cmd: `detail/company/getrecruimentbycompcode/${data?.companyCode}`,
    method: 'post',
    data,
  })
}

export const getAnnualDetailBaseInfo = (data) => {
  return axios.request({
    url: '/gel/detail/company/getannualdetail_basic',
    method: 'post',
    data,
    cmd: 'detail/company/getannualdetail_basic',
  })
}

export const getAnnualDetailWebsites = (data) => {
  return axios.request({
    url: '/gel/detail/company/getannualdetail_websites',
    method: 'post',
    data,
    cmd: 'detail/company/getannualdetail_websites',
  })
}

export const getAnnualDetailShareholders = (data) => {
  return axios.request({
    url: '/gel/detail/company/getannualdetail_shareholders',
    method: 'post',
    data,
    cmd: 'detail/company/getannualdetail_shareholders',
  })
}

export const getAnnualDetail = (data) => {
  return getAnnualDetailBaseInfo(data)
}

export const downloadPdf = (data) => {
  return axios.request({
    method: 'post',
    data,
    cmd: 'createannualreportpdf',
  })
}

//  myWfcAjax('/operation/',{restfulApi:'/detail/company/getannualdetail_basic/'+ yearReport.companyCode,"year": yearReport.reportYear},function(data) {
//getbranddetail
