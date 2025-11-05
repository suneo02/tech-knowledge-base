import intl from '../../../../utils/intl'
import { wftCommon } from '../../../../utils/utils'
import React from 'react'

export const allRiskTag = {
  bankruptcyevent_count: {
    name: intl('216410', '破产重整'),
    jumpType: 'showBankruptcy',
  },
  breakpromise_num: {
    name: intl('283600', '失信被执行人'),
    jumpType: 'getdishonesty',
  },
  corp_consumption_num: {
    name: intl('209064', '限制高消费'),
    jumpType: 'getcorpconsumption',
  },
  end_case_num: {
    name: intl('216398', '终本案件'),
    jumpType: 'getendcase',
  },
  illegal_num: {
    name: intl('138335', '严重违法'),
    jumpType: 'getillegal',
  },
  taxdebts_count: {
    name: intl('138424', '欠税信息'),
    jumpType: 'getowingtax',
  },
  taxillegal_count: {
    name: intl('138533', '税收违法'),
    jumpType: 'gettaxillegal',
  },
  valid_abnormal: {
    name: intl('138568', '经营异常'),
    jumpType: 'getoperationexception',
  },
  violation_punish: {
    name: intl('118780', '诚信信息'),
    jumpType: 'showViolationsPenalties',
  },
  suspectedShellCompany: {
    name: intl('413153', '疑似空壳企业'),
    // jumpType: 'showViolationsPenalties',// TODO: 浏览器没有加筛选项，所以先不跳
  },
  suspectedShellGroup: {
    name: intl('413173', '疑似空壳团伙'),
    // jumpType: 'showViolationsPenalties',// TODO: 浏览器没有加筛选项，所以先不跳
  },
}
export const telTitle = [
  {
    title: '',
    dataIndex: '',
    align: 'left',
    width: '10%',
    render: (txt, row, idx) => {
      return idx + 1
    },
  },
  {
    title: intl('4946', '电话号码'),
    dataIndex: 'contactValue',
  },
  {
    title: intl('9754', '来源'),
    dataIndex: 'contactFrom',
  },
]
export const mailTitle = [
  {
    title: '',
    dataIndex: '',
    align: 'left',
    width: '10%',
    render: (txt, row, idx) => {
      return idx + 1
    },
  },
  {
    title: intl('91283', '电子邮箱'),
    dataIndex: 'contactValue',
    render: (txt, row, idx) => {
      return <span>{wftCommon.formatWebsite(txt, 'email')}</span>
    },
  },
  {
    title: intl('9754', '来源'),
    dataIndex: 'contactFrom',
  },
]
export const webTitle = [
  {
    title: '',
    dataIndex: '',
    align: 'left',
    width: '30%',
    render: (txt, row, idx) => {
      return idx + 1
    },
  },
  {
    title: intl('138805', '网址'),
    dataIndex: 'contactValue',
    render: (txt, row, idx) => {
      return wftCommon.formatWebsite(txt)
    },
  },
]
export const pageinationProps = {
  hideOnSinglePage: true,
  pageSize: 500,
}
const compare = (property) => {
  return function (a, b) {
    var value1 = a[property].length
    var value2 = b[property].length
    return value1 - value2
  }
}
const compare1 = (property) => {
  return function (a, b) {
    var value1 = a[property].slice(0, 4)
    var value2 = b[property].slice(0, 4)
    return value2 - value1
  }
}
export const formatAdviceTime = (value) => {
  if (!value || value.toLowerCase() == 'null') {
    return '--'
  } else {
    var time = value.replace(/[TZ]/g, ' ')
    var timeArr = time.split(':')
    if (timeArr.length == 3) {
      time = timeArr[0] + ':' + timeArr[1]
    }
    return time
  }
}
export const sortData = (data) => {
  var a = data.sort(compare('contactFrom'))
  var b = a.sort(compare1('contactFrom'))
  var yearReport = []
  for (var i = 0; i < b.length; i++) {
    if (b[i].contactFrom.slice(5, 7) == '年报') {
      yearReport.push(b[i])
      b.splice(i, 1)
    }
  }
  b = yearReport.concat(b)
  b = b.sort(compare1('contactFrom'))
  return b
}
