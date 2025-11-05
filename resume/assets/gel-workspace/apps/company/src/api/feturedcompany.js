import axios from './index'

export const ranklisttitle = (data) => {
  return axios.request({
    cmd: `rankinglist/rankListTitleV2`,
    method: 'post',
    data,
  })
}

export const getCorpListOfLists = (data) => {
  return axios.request({
    cmd: `rankinglist/getCorpListOfListsV2`,
    method: 'post',
    data,
  })
}

export const getCorpListOfRanks = (data) => {
  return axios.request({
    cmd: `rankinglist/getCorpListOfRanksV2`,
    method: 'post',
    data,
  })
}

// 地区分布
export const corplistarea = (data, type = 'list') => {
  if (type == 'rank') {
    return axios.request({
      cmd: `corplistarea`,
      method: 'post',
      data,
    })
  }

  return axios.request({
    cmd: `rankinglist/rankListAggSelectV2`,
    method: 'post',
    data: {
      queryType: 'areaList',
      ...data,
    },
  })
}

// 行业分析
export const corplistindustry = (data, type) => {
  if (type == 'rank') {
    return axios.request({
      cmd: `corplistindustry`,
      method: 'post',
      data,
    })
  }
  return axios.request({
    cmd: `rankinglist/rankListAggSelectV2`,
    method: 'post',
    data: {
      queryType: 'industryList',
      ...data,
    },
  })
}

export const corplistaggtable = (data) => {
  return axios.request({
    cmd: `corplistaggtable`,
    method: 'post',
    data,
  })
}

// 上市状态
export const ranklistaggselect = (data, type) => {
  if (type == 'rank') {
    return axios.request({
      cmd: `rankinglist/ranklistaggselect`,

      method: 'post',
      data,
    })
  }
  return axios.request({
    cmd: `rankinglist/rankListAggSelectV2`,
    method: 'post',
    data: {
      queryType: 'listedStatus',
      ...data,
    },
  })
}

//企业类型
export const corpliststatistictype = (data, type) => {
  if (type == 'rank') {
    return axios.request({
      cmd: `corpliststatistictype`,
      method: 'post',
      data,
    })
  }
  return axios.request({
    cmd: `rankinglist/rankListAggSelectV2`,
    method: 'post',
    data: {
      queryType: 'companyType',
      ...data,
    },
  })
}

//注册资本分布
export const corpliststatisticcapital = (data, type) => {
  if (type == 'rank') {
    return axios.request({
      cmd: `corpliststatisticcapital`,
      method: 'post',
      data,
    })
  }
  return axios.request({
    cmd: `rankinglist/rankListAggSelectV2`,
    method: 'post',
    data: {
      queryType: 'registerCapital',
      ...data,
    },
  })
}
// 企业人员规模
export const corpliststatisticinsured = (data, type) => {
  if (type == 'rank') {
    return axios.request({
      cmd: `corpliststatisticinsured`,
      method: 'post',
      data,
    })
  }
  return axios.request({
    cmd: `rankinglist/rankListAggSelectV2`,
    method: 'post',
    data: {
      queryType: 'personnelScale',
      ...data,
    },
  })
}

// 榜单导出
export const createtaskRank = (data) => {
  return axios.request({
    cmd: `download/createtask/rank`,
    method: 'post',
    data,
  })
}

// 名录导出
export const createtaskList = (data) => {
  return axios.request({
    cmd: `download/createtask/corpList`,
    method: 'post',
    data,
  })
}
