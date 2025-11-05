import { localStorageManager } from '@/utils/storage'
import { wftCommon } from '@/utils/utils'
import { Empty } from 'antd'
import JSEncrypt from 'jsencrypt'
import React from 'react'
import nodataImg from '../assets/imgs/nodata.png'
import store from '../store/store'
import global from './global'

export function encrypt() {}

export function aesEncrypt(_params) {}

window.aesEncrypt = aesEncrypt

export function aesDecrypt(_text) {}

window.aesDecrypt = aesDecrypt

// 密码等级规范质检
export function passwordRuleCheck(pwd) {
  let lvl = 0 //默认是0级
  //密码中是否有数字,或者是字母,或者是特殊符号
  if (/[0-9]/.test(pwd)) {
    lvl++
  }
  //判断密码中有没有大写字母
  if (/[A-Z]/.test(pwd)) {
    lvl++
  }
  //判断密码中有没有小写字母
  if (/[a-z]/.test(pwd)) {
    lvl++
  }
  //判断密码中有没有特殊符号
  if (/[^0-9a-zA-Z_]/.test(pwd)) {
    lvl++
  }
  return lvl //1 3
}

// number或number string
// 千分位逗号
// 保留4位小数
// 是否补0
export function numberFormat(number, _toThousands = false, fixed = 4, add0 = false) {
  if (isNaN(Number(number))) {
    return ''
  }
  number = Number(number).toFixed(fixed)
  number = add0 ? number : Number(number) + ''
  const _arr = number.split('.')
  _arr[0] = _toThousands ? toThousands(_arr[0]) : _arr[0]
  // if(_arr[1]) {
  //     _arr[1] = (_arr[1] + "").substr(0,4);
  // }
  return _arr.join('.')
}

function toThousands(num) {
  let result = [],
    counter = 0
  num = (num || 0).toString().split('')
  for (let i = num.length - 1; i >= 0; i--) {
    counter++
    result.unshift(num[i])
    if (!(counter % 3) && i !== 0 && num[i - 1] !== '-') {
      result.unshift(',')
    }
  }
  return result.join('')
}

// 将数据转换为百分号
export function toTransPercent(number) {
  if (number === null || isNaN(Number(number))) {
    return ''
  }
  number = Number(number)
  return `${number}%`
}

// 检测是否邮件
export function isMail(mail) {
  if (!mail) {
    return false
  }
  const pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
  if (pattern.test(mail)) {
    return true
  }
  return false
}

// 企业详情跳转链接
export function getCompanyUrl(corpId) {
  return corpId ? `/superlist/companyDetail#id=${corpId}` : ''
}

// 数组转换成map
export const arrayToMap = (array, key, value) => {
  const obj = {}
  array.forEach((item) => {
    obj[item[key]] = item[value]
    item.node && Object.assign(obj, arrayToMap(item.node, key, value))
  })
  return obj
}

// 获取search中的参数
export const parseQueryString = function (current?: any): Record<string, any> {
  let fullUrl = window.location.href || (current?.location?.href ?? '')

  // 分割hash前后的部分
  const [beforeHash, afterHash = ''] = fullUrl.split('#')

  // 解析函数：从URL字符串中提取查询参数
  const extractParams = (urlPart: string): Record<string, string> => {
    const result: Record<string, string> = {}
    const queryIndex = urlPart.indexOf('?')
    if (queryIndex === -1) return result

    const queryPart = urlPart.slice(queryIndex + 1)
    const pairs = queryPart.split(/&(?=[^&]*?=)/)

    pairs.forEach((pair) => {
      const equalIndex = pair.indexOf('=')
      if (equalIndex !== -1) {
        const key = pair.substring(0, equalIndex)
        const value = pair.substring(equalIndex + 1)
        if (key) {
          result[decodeURIComponent(key)] = decodeURIComponent(value)
        }
      }
    })

    return result
  }

  // 分别解析hash前后的参数
  const beforeHashParams = extractParams(beforeHash)
  const afterHashParams = extractParams(afterHash)

  // 合并参数，hash后面的参数优先级更高
  return {
    ...beforeHashParams,
    ...afterHashParams,
  }
}

// 获取search中的参数key的值
export const parseQueryStringWithKey = (key) => {
  if (!key) return ''
  const searchObjs = parseQueryString()
  return searchObjs[key] ? searchObjs[key] : ''
}

// 获取地图host
export function getMapHost() {
  return global.PROD_ORIGINS.includes(window.location.origin) ? 'https://map.wind.com.cn' : window.location.origin
}

// 自动登录，刷新visa信息
export const autoLogin = () => {
  const userInfo = localStorage.userInfo
  if (!userInfo) {
    return false
  }
  const { visaToken, visaAccountId } = JSON.parse(userInfo)
}

// 根据行业获取企业logo背景
export const calcLogoColor = function (t) {
  const industryStr = {
    '农、林、牧、渔服务业': '农、林、牧、渔业',
    渔业: '农、林、牧、渔业',
    畜牧业: '农、林、牧、渔业',
    林业: '农、林、牧、渔业',
    其他采矿业: '采矿业',
    开采辅助活动: '采矿业',
    非金属矿采选业: '采矿业',
    有色金属矿采选业: '采矿业',
    黑色金属矿采选业: '采矿业',
    石油和天然气开采业: '采矿业',
    煤炭开采和洗选业: '采矿业',
    '金属制品、机械和设备修理业': '制造业',
    废弃资源综合利用业: '制造业',
    其他制造业: '制造业',
    仪器仪表制造业: '制造业',
    '计算机、通信和其他电子设备制造业': '制造业',
    电气机械及器材制造业: '制造业',
    '铁路、船舶、航空航天和其他运输设备制造业': '制造业',
    汽车制造业: '制造业',
    专用设备制造业: '制造业',
    通用设备制造业: '制造业',
    金属制品业: '制造业',
    有色金属冶炼和压延加工业: '制造业',
    黑色金属冶炼和压延加工业: '制造业',
    非金属矿物制品业: '制造业',
    橡胶和塑料制品业: '制造业',
    化学纤维制造业: '制造业',
    医药制造业: '制造业',
    化学原料和化学制品制造业: '制造业',
    '石油加工、炼焦和核燃料加工业': '制造业',
    '文教、工美、体育和娱乐用品制造业': '制造业',
    印刷和记录媒介复制业: '制造业',
    造纸和纸制品业: '制造业',
    家具制造业: '制造业',
    '木材加工及木、竹、藤、棕、草制品业': '制造业',
    '皮革、毛皮、羽毛及其制品和制鞋业': '制造业',
    '纺织服装、服饰业': '制造业',
    纺织业: '制造业',
    烟草制品业: '制造业',
    '酒、饮料和精制茶制造业': '制造业',
    食品制造业: '制造业',
    农副食品加工业: '制造业',
    水的生产和供应业: '电力、热力、燃气及水生产和供应业',
    燃气生产和供应业: '电力、热力、燃气及水生产和供应业',
    '电力、热力生产和供应业': '电力、热力、燃气及水生产和供应业',
    建筑装饰和其他建筑业: '建筑业',
    建筑安装业: '建筑业',
    土木工程建筑业: '建筑业',
    房屋建筑业: '建筑业',
    零售业: '批发和零售业',
    批发业: '批发和零售业',
    邮政业: '交通运输、仓储和邮政业',
    仓储业: '交通运输、仓储和邮政业',
    管道运输业: '交通运输、仓储和邮政业',
    航空运输业: '交通运输、仓储和邮政业',
    水上运输业: '交通运输、仓储和邮政业',
    道路运输业: '交通运输、仓储和邮政业',
    铁路运输业: '交通运输、仓储和邮政业',
    餐饮业: '住宿和餐饮业',
    住宿业: '住宿和餐饮业',
    软件和信息技术服务业: '信息传输、软件和信息技术服务业',
    互联网和相关服务: '信息传输、软件和信息技术服务业',
    '电信、广播电视和卫星传输服务': '信息传输、软件和信息技术服务业',
    其他金融业: '金融业',
    保险业: '金融业',
    资本市场服务: '金融业',
    货币金融服务: '金融业',
    房地产业: '房地产业',
    商务服务业: '租赁和商务服务业',
    租赁业: '租赁和商务服务业',
    科技推广和应用服务业: '科学研究和技术服务业',
    专业技术服务业: '科学研究和技术服务业',
    研究和试验发展: '科学研究和技术服务业',
    公共设施管理业: '水利、环境和公共设施管理业',
    生态保护和环境治理业: '水利、环境和公共设施管理业',
    水利管理业: '水利、环境和公共设施管理业',
    其他服务业: '居民服务、修理和其他服务业',
    '机动车、电子产品和日用产品修理业': '居民服务、修理和其他服务业',
    居民服务业: '居民服务、修理和其他服务业',
    教育: '教育',
    社会工作: '卫生和社会工作',
    卫生: '卫生和社会工作',
    娱乐业: '文化、体育和娱乐业',
    体育: '文化、体育和娱乐业',
    文化艺术业: '文化、体育和娱乐业',
    '广播、电视、电影和影视录音制作业': '文化、体育和娱乐业',
    新闻和出版业: '文化、体育和娱乐业',
    综合: '综合',
  }

  const colors = {
    房地产业: '#FFECB3',
    建筑业: '#FFE0B2',
    '电力、热力、燃气及水生产和供应业': '#FFCCBC',
    金融业: '#FFCDD2',
    住宿和餐饮业: '#E1BEE7',
    科学研究和技术服务业: '#D1C4E9',
    租赁和商务服务业: '#C5CAE9',
    '信息传输、软件和信息技术服务业': '#BBDEFB',
    '交通运输、仓储和邮政业': '#B3E5FC',
    '水利、环境和公共设施管理业': '#B2DFDB',
    '农、林、牧、渔业': '#C8E6C9',
    批发和零售业: '#CFD8DC',
    采矿业: '#D7CCC8',
    卫生和社会工作: '#F0F4C3',
    教育: '#DCEDC8',
    综合: '#CCCCCC',
    '文化、体育和娱乐业': '#FFBCAF',
    制造业: '#EFDCD5',
    '居民服务、修理和其他服务业': '#D1D9FF',
  }
  let color = null
  if (!t) return colors['居民服务、修理和其他服务业']
  if (industryStr[t]) {
    t = industryStr[t]
  }
  for (const k in colors) {
    if (k.indexOf(t) > -1) {
      color = colors[k]
    }
  }

  return color ? color : colors['居民服务、修理和其他服务业']
}

// 生成hash id
export function getGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// 生成hash id
export function getFakePwd() {
  return 'Wixxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// 按width截取字符串长度，加...返回
export const cutStringByWidth = (string, width, fontSize = 14) => {
  // 防止换行，获取宽度不准，暂定10000px
  const p = document.createElement('p')
  p.style.width = '10000px'
  const span = document.createElement('span')
  span.innerText = string
  span.style.fontSize = `${fontSize}px`
  document.body.append(p)
  p.appendChild(span)
  let spanWidth = span.offsetWidth
  let _string = ''
  if (spanWidth < width) {
    // 无需...
    _string = string
  } else {
    for (let i = string.length; i > 0; i--) {
      span.innerText = string.substring(0, i)
      spanWidth = span.offsetWidth + 10
      if (spanWidth < width) {
        _string = string.substring(0, i) + '...'
        break
      }
    }
  }
  document.body.removeChild(p)
  // console.log(_string, spanWidth, width)
  return _string
}

// 获取系统版本
export const browserRedirect = () => {
  const { userAgent, platform } = window.navigator
  const isWin = ['Win32', 'Wondows'].includes(platform)
  const isMac = ['Mac68K', 'Macppc', 'Macintosh', 'MacIntel'].includes(platform)
  const isUnix = ['X11'].includes(platform) && !isWin && !isMac
  const isLinux = String(platform).indexOf('Linux') > -1
  if (isMac) {
    return 'Mac'
  }
  if (isUnix) {
    return 'Unix'
  }
  if (isLinux) {
    return 'Linux'
  }
  if (isWin) {
    if (userAgent.indexOf('Windows NT 5.0') > -1 || userAgent.indexOf('Windows 2000') > -1) {
      return 'Win2000'
    } else if (userAgent.indexOf('Windows NT 5.1') > -1 || userAgent.indexOf('Windows XP') > -1) {
      return 'WinXP'
    } else if (userAgent.indexOf('Windows NT 5.2') > -1 || userAgent.indexOf('Windows 2003') > -1) {
      return 'Win2003'
    } else if (userAgent.indexOf('Windows NT 6.0') > -1 || userAgent.indexOf('Windows Vista') > -1) {
      return 'WinVista'
    } else if (userAgent.indexOf('Windows NT 6.1') > -1 || userAgent.indexOf('Windows 7') > -1) {
      return 'Win7'
    } else if (userAgent.indexOf('Windows NT 10') > -1 || userAgent.indexOf('Windows 10') > -1) {
      return 'Win10'
    }
  }
  return 'other'
}

// 获取屏幕分辨率
export const getScreenSize = () => {
  const { width, height } = window.screen
  return `${width}*${height}`
}

// 统一组件-暂无数据
export const renderEmptyData = (height = 0, translation, description) => {
  return (
    <Empty
      image={nodataImg}
      style={{ margin: Math.max((height - 350) / 2, 0) + 'px 0' }}
      description={description || <span>{translation(17235)}</span>}
      // description={description ? <span>查看已达上限</span> : <span>{translation(17235)}</span>}
    ></Empty>
  )
}

export const jumperTranslation = () => {
  const dom = document.getElementsByClassName('ant-pagination-options-quick-jumper')[0]
  // @ts-expect-error ttt
  if (dom && store.getState().global.language === 'en') {
    dom.childNodes[0].nodeValue = 'Skip to '
    dom.childNodes[2].nodeValue = ''
  }
}

// 地区根据code获取所有上级code，在Cascader中显示
export const getAreaCodes = (code) => {
  const codeArr = []
  const spec = ['03010101', '03020101', '03030101', '03030201', '03040801', '03040901']
  const spec2 = ['030407']
  if (code === '0000') {
    // 全国
    codeArr.push('0000')
  } else if (spec.includes(code.substr(0, 8))) {
    // 直辖市及香港澳门，一级8位，二级10位
    code.length >= 8 && codeArr.push(code.substr(0, 8))
    code.length >= 10 && codeArr.push(code.substr(0, 10))
  } else if (spec2.includes(code.substr(0, 6))) {
    // 台湾，一级6位，二级10位
    code.length >= 6 && codeArr.push(code.substr(0, 6))
    code.length >= 6 && codeArr.push(code.substr(0, 10))
  } else {
    // 一级6位，二级8位，三级10位
    code.length >= 6 && codeArr.push(code.substr(0, 6))
    code.length >= 8 && codeArr.push(code.substr(0, 8))
    code.length >= 10 && codeArr.push(code.substr(0, 10))
  }
  return codeArr
}

// 行业根据code获取所有上级code，在Cascader中显示
export const getIndustryCodes = (code, labels4see?) => {
  const codeArr = []

  if (labels4see) {
    // 通用逻辑
    codeArr.push(labels4see)
    return codeArr
  }

  if (code === '0000') {
    // 全部
    codeArr.push('0000')
  } else {
    code.length >= 4 && codeArr.push(code.substr(0, 4))
    code.length >= 6 && codeArr.push(code.substr(0, 6))
    code.length >= 8 && codeArr.push(code.substr(0, 8))
    code.length >= 10 && codeArr.push(code.substr(0, 10))
  }
  return codeArr
}

export const getVipInfo = () => {
  return {
    isSvip: wftCommon.is_svip_config ? true : false,
    isVip: wftCommon.is_vip_config ? true : false,
    level: wftCommon.is_svip_config ? 2 : 0,
  }
}

// 格式化，不允许小数
export const limitNumber = (value) => {
  if (typeof value === 'string') {
    return !isNaN(Number(value)) ? Math.ceil(Number(value)) || '' : ''
  } else if (typeof value === 'number') {
    return !isNaN(Number(value)) ? Math.ceil(Number(value)) || '' : ''
  } else {
    return ''
  }
}

// 删除string中的特殊字符
export const deleteMatch = (string) => {
  if (!string) {
    return ''
  }
  const patten = /[`~!@#$^\-&*()=|{}':;',\\\[\].<>\/?~！@#￥……&*（）——|{}【】'；：""'。，、？\s]/g
  return string.replace(patten, '')
}

// 匹配文字高亮
export const showHighLight = (sentence, keyword) => {
  if (!sentence || !keyword) {
    return sentence
  }
  const start = sentence.indexOf(keyword)
  if (start < 0) {
    return sentence
  }
  return (
    <>
      {sentence.substring(0, start)}
      <span style={{ color: '#35f' }}>{keyword}</span>
      {sentence.substring(start + keyword.length, sentence.length)}
    </>
  )
}

export const getToken = () => {
  return localStorage.getItem(global.LOCALSTORAGE_KEYS.TOKEN)
}

export const setToken = (token?) => {
  // 不传值就是清空
  if (!token) {
    localStorage.removeItem(global.LOCALSTORAGE_KEYS.TOKEN)
    return
  }
  localStorage.setItem(global.LOCALSTORAGE_KEYS.TOKEN, token)
}

export const clearAndLogout = () => {
  setToken()
  localStorageManager.remove('USERINFO')
  window.location.href = '/superlist/introduction'
}



export function encryptData(json, publicKey) {
  const encrypt = new JSEncrypt()
  encrypt.setPublicKey(publicKey)
  const data = encrypt.encrypt(JSON.stringify(json))
  return data
}
