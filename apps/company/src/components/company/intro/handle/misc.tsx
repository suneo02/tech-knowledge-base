import { getRiskTagCfg } from 'gel-util/biz'
import React from 'react'
import intl from '../../../../utils/intl'
import { wftCommon } from '../../../../utils/utils'

export const allRiskTag = getRiskTagCfg(intl)

export const telTitle = [
  {
    title: '',
    dataIndex: '',
    align: 'left',
    width: '10%',
    render: (_txt, _row, idx) => {
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
    render: (_txt, _row, idx) => {
      return idx + 1
    },
  },
  {
    title: intl('91283', '电子邮箱'),
    dataIndex: 'contactValue',
    render: (txt) => {
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
    render: (_txt, _row, idx) => {
      return idx + 1
    },
  },
  {
    title: intl('138805', '网址'),
    dataIndex: 'contactValue',
    render: (txt) => {
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
