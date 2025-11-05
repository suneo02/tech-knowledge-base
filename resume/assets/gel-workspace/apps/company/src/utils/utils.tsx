import { IUltimateBeneficiaryShareRoute } from '@/handle/corpModuleCfg/base/ultimateBeneficiary'
import { wftCommonType } from '@/utils/WFTCommonWithType'
import { formatTime } from '@/utils/format/time.ts'
import { translateService } from '@/utils/intl/translateService.ts'
import { message, Modal, Tooltip } from '@wind/wind-ui'
import axios from 'axios'
import { formatMoneyFromWftCommon, formatMoneyTempFromWftCommon } from 'gel-util/format'
import { default as React, ReactNode } from 'react'
import * as globalActions from '../actions/global'
import { getCorpModuleInfo } from '../api/companyApi'
import defaultCompanyImg from '../assets/imgs/default_company.png'
import brand120 from '../assets/imgs/logo/brand120.png'
import no_photo_list from '../assets/imgs/no_photo_list.png'
import CompanyLink from '../components/company/CompanyLink'
import { overseaTipsSimple, tryVip, VipPopup } from '../lib/globalModal'
import store from '../store/store'
import axiosRequest from './../api/index'
import { getWsid } from './env'
import { isBaiFenTerminal, isBaiFenTerminalOrWeb } from './env/baifen'
import { isDev, isDevDebugger, isWebTest, usedInClient } from './env/misc'
import intl from './intl'
import { wftCommonGetUrlSearch } from './links/url'
import { localStorageManager, sessionStorageManager } from './storage'

/**
 * 创建一个防抖函数，该函数在一定时间内只会执行一次，并且在该时间段内再次触发时，会重新计算时间。
 * @param {Function} func - 需要防抖的函数
 * @param {Number} wait - 延迟执行的时间（毫秒）
 * @param {Boolean} immediate - 是否立即执行，true 表示在延迟时间内第一次触发时立即执行，false 表示在延迟时间结束后才执行
 * @returns {Function} 返回防抖函数
 */
export function debounce(func, wait, immediate?) {
  let timeout

  function debounceFunc(...args) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this
    // https://fb.me/react-event-pooling
    if (args[0] && args[0].persist) {
      args[0].persist()
    }
    const later = () => {
      timeout && clearTimeout(timeout)
      timeout = null
      if (!immediate) {
        return func.apply(context, args)
      }
    }
    const callNow = immediate && !timeout
    timeout && clearTimeout(timeout)
    timeout = null
    timeout = setTimeout(later, wait)
    if (callNow) {
      return func.apply(context, args)
    }
  }

  debounceFunc.cancel = function cancel() {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
  }
  return debounceFunc
}

// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time. Normally, the throttled function will run
// as much as it can, without ever going more than once per `wait` duration;
// but if you'd like to disable the execution on the leading edge, pass
// `{leading: false}`. To disable execution on the trailing edge, ditto.
export function throttle(func, wait, options) {
  let timeout, context, args, result
  let previous = 0
  if (!options) options = {}

  const later = function () {
    previous = options.leading === false ? 0 : Date.now()
    timeout = null
    result = func.apply(context, args)
    if (!timeout) context = args = null
  }

  const throttled = function () {
    const now = Date.now()
    if (!previous && options.leading === false) previous = now
    const remaining = wait - (now - previous)
    context = this
    args = arguments
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      result = func.apply(context, args)
      if (!timeout) context = args = null
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining)
    }
    return result
  }

  throttled.cancel = function () {
    clearTimeout(timeout)
    previous = 0
    timeout = context = args = null
  }

  return throttled
}

function processResult(result) {
  try {
    if (typeof result === 'string') {
      return JSON.parse(result)
    }
  } catch (e) {
    // do nothing
  }
  return result
}

/**
 * 下载文件到本地。
 *
 * @param {string} url - 要下载文件的URL地址。
 * @param {string} fileName - 下载文件时的保存文件名。

 */
export function downloadFile(url, fileName) {
  // 验证URL是否为有效的字符串
  if (typeof url !== 'string' || !url.trim()) {
    console.error('提供的URL不合法')
    return
  }

  // 验证文件名是否为有效的字符串
  if (typeof fileName !== 'string' || !fileName.trim()) {
    console.error('提供的文件名不合法')
    return
  }

  // 使用fetch API获取文件数据
  fetch(url)
    .then((response) => {
      // 检查响应状态是否为成功
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.blob()
    })
    .then((blob) => {
      // 创建一个新的URL对象表示指定的Blob对象
      const blobUrl = window.URL.createObjectURL(blob)
      // 创建一个隐藏的a标签用于下载
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = fileName || 'download'
      document.body.appendChild(a)
      a.click()
      // 释放创建的URL对象
      window.URL.revokeObjectURL(blobUrl)
      document.body.removeChild(a)
    })
    .catch((error) => {
      // 错误处理
      console.error('下载文件失败:', error)
      // alert('下载文件失败，请稍后再试。');
    })
}

/*
  不传 onReturn 为同步方式，为避免出现中断卡死问题，应尽量使用异步方式
*/
export function doFunc(param, onReturn?) {
  // 只考虑webkit内核(包括cosmos)
  const callback =
    typeof onReturn === 'function'
      ? (ret) => {
          if (typeof onReturn === 'function') {
            onReturn(processResult(ret))
          }
        }
      : null
  if (window.external && typeof window.external.ClientFunc === 'function') {
    const ret = window.external.ClientFunc(typeof param === 'string' ? param : JSON.stringify(param), callback)
    if (callback == null) {
      console.log(`您的程序使用了同步方式调用ClientFunc(${param && param.func})，推荐使用异步方式!`)
      return processResult(ret)
    }
  }
  console.log('不支持ClientFunc!')
  return null
}

export function getSyscfg() {
  const ret = doFunc({ func: 'querydata', name: 'syscfg', isGlobal: '1' })
  if (ret && ret.result && ret.result.length) {
    return JSON.parse(ret.result)
  }
  return null
}

export const wftCommon = {
  unNormalStatus: [
    '撤销',
    '吊销',
    '迁出',
    '停业',
    '吊销,未注销',
    '吊销,已注销',
    '注销',
    '非正常户',
    '已告解散',
    '解散',
    '廢止',
    '已废止',
    '歇業',
    '破產',
    '破產程序終結(終止)',
    '合併解散',
    '撤銷',
    '已终止',
    '解散已清算完結',
    '该单位已注销',
    '核准設立，但已命令解散',
  ],
  /**
   * 格式化时间
   */
  formatTime: formatTime,
  formatCompanyCode: (code) => (code.length > 10 ? code.slice(2, 12) : code),
  /** 针对 11212元 这种的货币格式补充 */
  formatCurrency: (amount) => {
    // 解析金额和货币单位
    let [_, numericAmount, currencyUnit] = amount.trim().split(/(\d+(?:\.\d+)?)/)
    numericAmount = parseFloat(numericAmount.trim())
    currencyUnit = currencyUnit.trim()

    // 根据货币单位选择格式化选项
    const options = {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      currency: 'CNY',
    }

    const formattedAmount = numericAmount.toLocaleString('zh-CN', options)
    return `${formattedAmount}${currencyUnit}`
  },
  formatNumberWithLocale(num, toFixed = 0, locale = 'en-US') {
    try {
      if (isNaN(num)) {
        console.error(`not a number ${num}`)
        return
      }
      // @ts-expect-error ttt
      return Number(num)?.toFixed(toFixed)?.toLocaleString(locale)
    } catch (e) {
      console.error(` ~ 格式化失败：${e?.message}`)
      return '--'
    }
  },
  formatDate: (data) => {
    if (!data) return '--'
    // 对筛选条件的时间戳进行转换
    const time = new Date(data)
    const y = time.getFullYear()
    const m = time.getMonth() + 1
    const d = time.getDate()
    return `${y.toString()}-${m}-${d}`
  },
  formatUTCDate: (data) => {
    // 对筛选条件的时间戳进行转换
    const time = new Date(data)
    const y = time.getFullYear()
    const m = time.getMonth() + 1
    const d = time.getDate()
    const h = time.getHours()
    const min = time.getMinutes()
    const s = time.getSeconds()
    return `${y.toString()}-${m}-${d} ${h}:${min}:${s}`
  },
  formatTimeChinese: (data) => {
    if (data) {
      const time = wftCommon.formatTime(data).split('-')
      return time[0] + '年' + time[1] + '月' + time[2] + '日'
    } else {
      return '--'
    }
  },

  formatZoneTime: (data) => {
    if (!data) return '--'
    // 对筛选条件的时间戳进行转换
    const time = new Date(parseInt(data))
    const y = time.getFullYear()
    const m = time.getMonth() + 1
    const d = time.getDate()
    return `${y.toString()}-${m}-${d}`
  },
  /**
   *
   * @param money 金额
   * @param arr 单位
   *  •	这是一个数组，用于传递一些单位和标志。具体来说，arr 可能包含以下信息：
   *  •	arr[0] 是标志，可能是 'All2'，此时将会设置 k = 1。
   *  •	arr[k] 是用于控制小数点位数的值，默认情况下是 4。
   *  •	arr[k+1] 是用于表示单位的字符串，默认情况下是 '万'。
   *  •	arr[k+2] 是一个值，用于决定是否对金额进行除以1000的操作，默认是 1。
   *  •	arr[k+3] 是一个自定义的数量级，可能是 1000，用于控制格式化的数量级（例如，*10000）。
   *  •	arr[k+4] 如果存在，表示不要附加单位。
   *
   * @param data 最长截止几位小数
   * 可能包含 InvestRegUnit 属性。它的存在会覆盖默认单位 '万'，并将其替换为 '万' + data.InvestRegUnit。
   *
   * @param nounit
   * 用来决定是否在结果中附加单位。如果为 true，则返回格式化后的金额字符串，不带单位。
   *
   * @deprecated 异步 ts 版 suneo
   * @returns {string}
   */
  formatMoney: formatMoneyFromWftCommon,
  formatMoneyTemp: formatMoneyTempFromWftCommon, // 带千分位金额展示
  formatMoneyComma: (txt) => {
    return wftCommon.formatMoney(txt, [4, ' '])
  },
  /**
   * 格式化百分比
   */
  formatPercent: (str, num?) => {
    if (str === '0' || str === 0) {
      return '0%'
    }
    if (typeof num == 'number' || typeof num == 'string') {
      num = num
    } else {
      num = 2
    }
    if (parseFloat(str)) {
      let perc = String(parseFloat(parseFloat(str).toFixed(num)))
      perc = String(parseFloat(perc).toFixed(num))
      return perc + '%'
    }
    return '--'
  },
  formatCont: function (str) {
    str = str + ''
    if (str && str.toLowerCase() != 'null' && str.toLowerCase() != 'undefined') {
      return str
    } else {
      return '--'
    }
  },
  getPinyinMaps: function (_successFun, _errorFun) {
    const is_terminal = wftCommon.usedInClient()
    const is_dev = wftCommon.isDevDebugger()
    const sessionid = getWsid()
    const oUrl = '/wmap/api/areainfo/simple/tree'
    // if (!is_terminal) {
    //   oUrl = window.location.protocol + '//map.wind.com.cn' + oUrl
    // }
    const data = {
      version: 'latest',
      code: '156000000', // 中国
      fillChinese: true,
      lang: 'en',
    }
    if (is_dev) {
      // oUrl = global_site + oUrl;
      return axios
        .request({
          url: oUrl,
          headers: {
            'wind.sessionid': sessionid,
            'Content-Type': 'application/json;charset=UTF-8',
          },
          params: data,
          method: 'GET',
          timeout: 30000,
        })
        .then((res) => res.data)
    } else {
      if (!is_terminal) {
        return axios
          .request({
            url: oUrl,
            headers: {
              'wind.sessionid': sessionStorageManager.get('GEL-wsid'),
              'Content-Type': 'application/json;charset=UTF-8',
            },
            params: data,
            method: 'GET',
            timeout: 30000,
          })
          .then((res) => res.data)
      } else {
        return axios
          .request({
            url: oUrl,
            headers: {
              'Content-Type': 'application/json;charset=UTF-8',
            },
            params: data,
            method: 'GET',
            timeout: 30000,
          })
          .then((res) => res.data)
      }
    }
  },
  setPinyinMap: function (data) {
    const china = data.resultData.subArea
    // 将地图组数据结构处理至与企业库一致
    const chinaMap = {
      citylist: [],
    }
    const zhixiashi = ['北京', '上海', '重庆', '天津']
    for (let i = 0; i < china.length; i++) {
      if (typeof china[i].pinyin !== 'undefined') {
        chinaMap.citylist.push({
          p: china[i].cnName + (zhixiashi.indexOf(china[i].cnName) > -1 ? '市' : ''),
          pinyin: china[i].pinyin,
          p_en: china[i].abbreviationName,
        })
        if (china[i].subArea) {
          chinaMap.citylist[i].c = []
          for (let j = 0; j < china[i].subArea.length; j++) {
            if (typeof china[i].subArea[j] !== 'undefined' && typeof china[i].subArea[j].pinyin !== 'undefined') {
              chinaMap.citylist[i].c.push({
                n: china[i].subArea[j].cnName,
                pinyin: china[i].subArea[j].pinyin,
              })
              if (china[i].subArea[j].subArea) {
                chinaMap.citylist[i].c[j].a = []
                for (let k = 0; k < china[i].subArea[j].subArea.length; k++) {
                  if (
                    typeof china[i].subArea[j].subArea[k] !== 'undefined' &&
                    typeof china[i].subArea[j].subArea[k].pinyin !== 'undefined'
                  ) {
                    chinaMap.citylist[i].c[j].a.push({
                      s: china[i].subArea[j].subArea[k].cnName,
                      pinyin: china[i].subArea[j].subArea[k].pinyin,
                    })
                  }
                }
              }
            }
          }
        }
      }
    }
    chinaMap.citylist = wftCommon.sortCityByPinyin(chinaMap.citylist)
    window.localStorage.setItem('ChinaMapWithPinyin', JSON.stringify(chinaMap))
  },
  sortCityByPinyin: function (list) {
    for (let i = 0; i < list.length; i++) {
      if (list[i].c) {
        wftCommon.sortCityByPinyin(list[i].c)
      }
      if (list[i].a) {
        wftCommon.sortCityByPinyin(list[i].a)
      }
    }
    list.sort(function (a, b) {
      return Number(a.pinyin > b.pinyin) - 1
    })
    return list
  },
  linkMarker: (code, name, tag, moreCompany) => {
    //增加对一行出现多个公司或人物的情况的兼容处理 moreCompany=1为多个 0为1个
    tag = tag || 'span'
    if (code && code !== 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX') {
      if (moreCompany == '1') {
        return `<${tag} class="wi-link-color" style='padding-right:0.26667rem' data-code="${code}" data-name="${name}">${wftCommon.formatCont(name)}</${tag}>`
      }
      // <span class="wi-link-color" data-code="${id}" data-name="${name}">${wftCommon.formatCont(name)}</span>;
      else {
        return `<${tag} class="wi-link-color" data-code="${code}" data-name="${name}">${wftCommon.formatCont(name)}</${tag}>`
      }
    } else {
      if (moreCompany == '1') {
        return `<${tag} style='padding-right:0.26667rem'>${wftCommon.formatCont(name)}</${tag}>`
      } else {
        return wftCommon.formatCont(name)
      }
    }
  },
  getlogoAccess: (logoStr, type, num) => {
    let result = type == 'title' ? '../assets/imgs/company_logo.png' : defaultCompanyImg
    if (logoStr) {
      const linkhead = 'http://news.windin.com/ns/imagebase/'
      const tbRowkey = logoStr.split('.')
      if (logoStr.indexOf('http') != -1) {
        result = logoStr
      }
      if (tbRowkey.length == 2) {
        const tb_name = tbRowkey[0].match(/\d+/g)[0]
        const rowkey = tbRowkey[1]
        result = linkhead + tb_name + '/' + rowkey
      } else {
        result = 'http://news.windin.com/ns/imagebase/' + num + '/' + logoStr
      }
      return wftCommon.addWsidForImg(result)
    } else {
      return result
    }
  },
  addWsidForImg: (str) => {
    const wsidStr = sessionStorageManager.get('GEL-wsid')
    if (str && wsidStr) {
      if ((str + '').indexOf('sessionid') > -1) {
        //如果处理过了，就不要再处理
        return str
      } else {
        //没处理过的要分成多种格式处理
        if (str.indexOf('?') > -1) {
          return str + '&wind.sessionid=' + wsidStr
        } else {
          return str + '?wind.sessionid=' + wsidStr
        }
      }
    }
    return str
  },
  jumpMap: (code) => {
    if (wftCommon.is_overseas_config) return ''
    const wsidStr = sessionStorageManager.get('GEL-wsid')
    if (code) {
      return (
        'http://dgov.wind.com.cn/govmap/index.html?mode=2&pureMode&title=万寻地图 &right=4C203DE15&companyId=' +
        code +
        '&wind.sessionid=' +
        wsidStr
      )
    }
  },
  /**
   * 企业来源 映射
   */
  corpFroms: {
    298010000: '企业',
    298020000: '农民专业合作社',
    298030000: '个体工商户',
    298040000: '其他机构',
    298050000: '海外上市公司',
    298060000: '香港注册企业',
    298070000: '美国',
    298080000: '英国',
    2980890000: '海外公司',
    160100000: '党',
    160200000: '军',
    160300000: '政府机构',
    160400000: '人大',
    160500000: '政协',
    160600000: '法院',
    160700000: '检察院',
    160800000: '共青团',
    160900000: '社会组织',
    161000000: '主席',
    161100000: '民主党派',
    161600000: '人民团体',
    1609020100: '社会团体',
    1609020200: '民办非企业单位',
    1609020300: '基金会',
    1609020400: '境外基金会代表机构',
    1609020500: '国际性社团',
    1609020600: '外国商会',
    1609020700: '涉外基金会',
    1609010100: '社会团体',
    1609010200: '民办非企业单位',
    1609010300: '基金会',
    1609010400: '境外基金会代表机构',
    1609010500: '国际性社团',
    1609010600: '外国商会',
    1609010700: '涉外基金会',
    160307000: '事业单位',
    912034101: '律所',
  },
  /**
   * 企业类型映射
   */
  corpState: {
    298010000: '企业',
    298020000: '农民专业合作社',
    298030000: '个体工商户',
    298040000: '其他机构',
    298050000: '海外上市公司',
    298060000: '香港注册企业',
    298070000: '美国',
    298080000: '英国',
    2980890000: '海外公司',
    160100000: '党',
    160200000: '军',
    160300000: '政府机构',
    160400000: '人大',
    160500000: '政协',
    160600000: '法院',
    160700000: '检察院',
    160800000: '共青团',
    160900000: '社会组织',
    161000000: '主席',
    161100000: '民主党派',
    161600000: '人民团体',
    1609020100: '社会团体',
    1609020200: '民办非企业单位',
    1609020300: '基金会',
    1609020400: '境外基金会代表机构',
    1609020500: '国际性社团',
    1609020600: '外国商会',
    1609020700: '涉外基金会',
    1609010100: '社会团体',
    1609010200: '民办非企业单位',
    1609010300: '基金会',
    1609010400: '境外基金会代表机构',
    1609010500: '国际性社团',
    1609010600: '外国商会',
    1609010700: '涉外基金会',
    160307000: '事业单位',
    912034101: '律所',
  },
  /**
   * 政府组织映射列表
   */
  corpState_zfList: [
    '党',
    '军',
    '政府机构',
    '人大',
    '政协',
    '法院',
    '检察院',
    '共青团',
    '主席',
    '民主党派',
    '人民团体',
  ],
  corpState_shList: [
    '社会组织',
    '社会团体',
    '民办非企业单位',
    '基金会',
    '境外基金会代表机构',
    '国际性社团',
    '外国商会',
    '涉外基金会',
    '社会团体',
    '民办非企业单位',
    '基金会',
    '境外基金会代表机构',
    '国际性社团',
    '外国商会',
    '涉外基金会',
  ],

  /**
   * 机构类型映射
   * **/
  corpOrgType: {},

  initcorpOrgType: () => {
    wftCommon.corpOrgType = {
      '': intl('138649', '不限'),
      cn: intl('145815', '境内企业'),
      hongkong: intl('145882', '中国香港企业'),
      taiwan: intl('224478', '中国台湾企业'),
      adminiOrg: intl('228611', '政府机关'),
      socialOrg: intl('207783', '社会组织'),
      pubInstitution: intl('207767', '事业单位'),
      lawFirm: intl('213164', '律所'),
    }
  }, // 搜索高亮词
  searchHighLightKeys: {},
  initsearchHighLightKeys: () => {
    wftCommon.searchHighLightKeys = {
      corp_name: intl('138677', '企业名称'),
      artificial_person: intl('138733', '法人'),
      stockname: intl('451227', '股票简称'),
      stockcode: intl('6440', '股票代码'),
      bond_name: intl('437741', '债券名称'),
      bond_code: intl('437814', '债券代码'),
      bond_wind_code: intl('437742', '债券万得代码'),
      fund_name: intl('7996', '基金名称'),
      fund_code: intl('20591', '基金代码'),
      fund_wind_code: intl('437743', '基金万得代码'),
      brand_name2: intl('437733', '品牌'),
      brand_name2_english: intl('437757', '品牌英文名'),
      financing_institution: intl('14391', '投资方'),
      project_name: intl('34886', '项目名称'),
      beneficiaries: intl('138180', '最终受益人'),
      corp_members: intl('437729', '主要成员'),
      stockholder_people: intl('32959', '股东'),
      eng_name: intl('315688', '企业英文名'),
      tel: intl('4944', '电话'),
      mail: intl('93833', '邮箱'),
      brand_name: intl('138798', '商标名称'),
      product_name: intl('2485', '产品名称'),
      main_business: intl('138753', '主营构成'),
      software_copyright: intl('138788', '软件著作权'),
      park_name: intl('437758', '园区名'),
      wechat_name: intl('261927', '微信公众号名称'),
      wechat_code: intl('437759', '微信公众号号码'),
      website_name: intl('138578', '网站名称'),
      goods: intl('138669', '商品/服务项目'),
      online_load_product: '网贷产品名',
      patent: intl('138749', '专利'),
      former_name: intl('416849', '企业曾用名'),
      corp_short_name: intl('437731', '公司简称'),
      register_address: intl('35776', '注册地址'),
    }
  },

  // 词条初始化
  initIntl: () => {
    wftCommon.initcorpOrgType() // 初始化机构类型映射
    wftCommon.initsearchHighLightKeys() // 初始化搜索高亮词
  },
  /**
   * logo 格式化 logo = '6683.c88fba936959ecb7f5e157f19fb10a33';
   */
  formatLogo: (_logo, _notCorp) => {},
  /**
   * 获取字符串字节长度
   */
  getByteLen: function (val) {
    let len = 0
    for (let i = 0; i < val.length; i++) {
      const length = val.charCodeAt(i)
      if (length >= 0 && length <= 128) {
        len += 1
      } else {
        len += 2
      }
    }
    return len
  },

  /**
   * 埋点名单, 注: key小写
   */
  buryStack: {
    wft: 'Wind金融终端',
    gel: '万得企业库',
    windhome: '万得之家',
    datacomponent: '金融信息组件',
    wx: '终端微信分享',
    superlist: '超级名单',
    bfqy: '百分企业',
  },
  /**
   * 对传入的字符串进行解码
   */
  decodeStr: function (data) {
    if (data && data.indexOf && data.indexOf('%u') == 0) {
      try {
        data = window.unescape(data)
      } catch (e) {
        try {
          if (data.indexOf('%') == 0) {
            data = window.decodeURIComponent(data)
          }
        } catch (e) {
          data = ''
        }
      }
    }
    try {
      data = window.decodeURIComponent(data)
    } catch (e) {}
    return data
  },
  /**
   * 用来解析url参数a=x&b=X情况
   */
  decodeParam: function (data) {
    if (data == '') {
      return null
    }
    const urlParDic = {}
    const paramArray = data.split('&')
    for (const pl in paramArray) {
      const item = paramArray[pl].split('=')
      if (item.length != 2) {
        continue
      }
      urlParDic[item[0].toLowerCase()] = wftCommon.decodeStr(item[1])
    }
    return urlParDic
  },
  /**
   * 获取页面信息以及id以及实体信息
   */
  getPageInfo: function (urlStr) {
    if (urlStr && urlStr.indexOf('3000/map') != -1) {
      //用于处理图谱的url
      urlStr = urlStr.replace('3000/map', '3000/#/map')
    }
    const urlHash = urlStr ? urlStr.split('#/')[1] || 'home' : 'home'
    const urlParam = urlHash != 'home' ? wftCommon.decodeParam(urlHash.split('?')[1] || '') : null
    const pageStr = urlHash != 'home' ? urlHash.split('?')[0] : 'home'
    const urlEntity = urlParam ? urlParam['title'] || null : null
    return { pageStr, urlEntity, urlParam }
  },
  /**
   * 获取埋点实体id
   */
  getId: function (data) {
    if (data && data['detailid'] != undefined) {
      return data['detailid'] //详情id
    } else if (data && data['time'] != undefined) {
      return data['time'] //财报年份
    } else if (data && data['year'] != undefined) {
      return data['year'] //年报年份
    } else if (data && data['companycode'] != undefined) {
      return data['companycode'] //企业id
    } else if (data && data['id'] != undefined) {
      return data['id'] //人物id
    }
    return null
  },
  /**
   * 获取当前实体，这里需要处理从不同tab点进来的实体
   */
  getEntity: function (urlEntity, page, type) {
    let entityInfo = urlEntity
    const entityDic = {
      companyDetail: '企业',
      searchList: '企业',
      searchPersonList: '人物',
      person: '人物',
      home: '首页',
      Home: '首页',
      'buss/searchbuss': '商机',
      MyFavor: '我的收藏',
    }
    entityInfo = entityDic[page] || entityInfo
    if (entityInfo == '人物' && urlEntity == '合作伙伴') {
      entityInfo = '合作伙伴'
    }
    if (entityInfo == null && type == 'curr') {
      // 当没有从url中获取到实体，且为当前页面url时
      entityInfo = page
    }
    return entityInfo
  } /*
   * 针对微信分享，调整对应的api，key：原api，val：微信分享使用的api
   */,
  apisToWx: {
    appgetcorpinfo: 'sharegetcorpinfo', // 企业详情
    getintellectual: {
      paramKey: 'type', // 针对调用同一个接口的不同页面，通过 paramKey确定不参数，再使用apis来指定对应的新的api
      apis: {
        patent_corp: 'appgetpatentlist', // 专利列表, type: patent_corp
        trademark_corp: 'appgettrademarklist', // 商标列表, type: trademark_corp
        production_corp: 'appgetproductionlist', // 产品著作权列表, type: production_corp
      },
    },
    getsoftwarecopyright: 'appgetsoftwarelist', // 软件著作权列表
  },
  deviceIsIPhoneX: () => {
    const ratio = window.devicePixelRatio,
      width = window.screen.width,
      height = window.screen.height
    if (ratio === 3 && width === 375 && height === 812) {
      return true
    } else {
      if (ratio === 3 && width === 414 && height === 896) {
        return true
      } else {
        if (ratio === 2 && width === 414 && height === 896) {
          return true
        } else {
          return false
        }
      }
    }
  },
  regWord: (val) => {
    const pattern = new RegExp("[`~!@#$^&*()（）=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？%]", 'g')
    let t = val ? val.replace(pattern, '') : ''
    return (t = t
      ? t.replace(/[\（\）\(\)\[\]\【\】\<\>\《\》\、\.\。\;\:\；\：\{\}\!\~\`\@\#\$\%\^\&\*\-\+\=+]/g, '')
      : '')
  },
  getImageBlob: (url, img) => {
    const xhr = new window.XMLHttpRequest()
    xhr.open('get', url, true)
    xhr.responseType = 'blob'
    xhr.onload = function () {
      if (this.status == 200) {
        const imgres = this.response
        const src = window.URL.createObjectURL(imgres)
        img.src = src
      }
    }
    xhr.send()
  },
  storage: {
    setItem(key, item) {
      localStorage.setItem(key, JSON.stringify(item))
    },
    getItem(key) {
      return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : null
    },
    removeItem(key) {
      localStorage.removeItem(key)
    },
    clear() {
      localStorage.clear()
    },
  },
  deepClone: (obj) => {
    const objClone = Array.isArray(obj) ? [] : {}
    if (obj && typeof obj === 'object') {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          // 判断ojb子元素是否为对象，如果是，递归复制
          if (obj[key] && typeof obj[key] === 'object') {
            objClone[key] = wftCommon.deepClone(obj[key])
          } else {
            // 如果不是，简单复制
            objClone[key] = obj[key]
          }
        }
      }
    }
    return objClone
  },
  getQueryString: (name) => {
    const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
    const r = window.location.href.split('?')[1] ? window.location.href.split('?')[1].match(reg) : null
    const r2 = window.location.href.split('?')[2] ? window.location.href.split('?')[2].match(reg) : null
    if (r != null) return decodeURI(r[2])
    if (r2 != null) return decodeURI(r2[2])
    return null
  }, // 获取search中的参数
  parseQueryString: (key, str) => {
    if (!key) return ''
    var str = str ? str : window.location.search
    const objURL = {}
    str.replace(new RegExp('([^?=&]+)(=([^&]*))?', 'g'), function (_$0, $1, _$2, $3) {
      objURL[$1] = $3
    })
    return objURL[key] ? decodeURI(objURL[key]) : ''
  },
  calcLogoColor: (t) => {
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
      '居民服务、修理和其他服务业': '#D1D9FF', // "default": '#e3e3e3'
      default: '#D1D9FF',
    }
    let color = null
    if (!t) return colors['default']
    if (industryStr[t]) {
      t = industryStr[t]
    }
    for (const k in colors) {
      if (k.indexOf(t) > -1) {
        color = colors[k]
      }
    }

    return color ? color : colors['default']
  },
  limitMsg: '很抱歉，当前数据请求超出访问限制。',
  maxAccessMsg: '抱歉，您今日查看次数已超限',
  overseaframecount: 0, // 海外企业限制页面打开数量
  checkIfOverSea: () => {
    if (!wftCommon.is_overseas_config) return false
    const str = (
      <React.Fragment>
        <div className="cnlay-msg">
          <div className="">
            According to relevant laws and regulations, this access is not available in your area. If you have any
            questions, please contact the official customer service or your account manager.{' '}
          </div>
          <div>根据相关法律法规，您所在的地区暂不支持访问这些数据。如有疑问，请联系官方客服或您的专属客户经理。</div>
          <br />
          TEL: 400-820-9463 <br />
          E-mail: GELSupport@wind.com.cn
        </div>
      </React.Fragment>
    )
    Modal.warning({ title: intl('107460', '温馨提示'), content: str, width: 560 })
  },
  en_access_config: false,

  showRoute: async (route: IUltimateBeneficiaryShareRoute[], header: any = {}, apiParams: any = {}) => {
    const { api, params } = apiParams
    const { left, right } = header
    if (params) {
      const { Data } = await getCorpModuleInfo(api, params)
      if (Data.name) {
        header = { ...header, ...Data }
      }
      if (Data.shareRoute) {
        route = Data.shareRoute
      }
    }
    const Header =
      header.left && header.name ? (
        <div
          style={{
            display: 'flex',
            paddingBlockEnd: 12,
            marginBlockEnd: 12,
            borderBlockEnd: '1px dashed #ededed',
          }}
        >
          <div style={{ flex: 1 }}>
            <label>{left}：</label>
            <span style={{ color: '#00aec7' }}>{header.name}</span>
          </div>
          <div style={{ flex: 1 }}>
            <label>{right}：</label>
            <span style={{ color: '#00aec7' }}> {wftCommonType.displayPercent(header.shareRate)}</span>
          </div>
        </div>
      ) : null
    const c = route
    let vCount = 0
    const a = c.map((x, _y) => {
      let item = null
      let rate = 0
      item = x.route
      const nameL = item[0]['nodeName'] ? item[0]['nodeName'] : '--'
      const title = item?.some((r) => r.typeName)
        ? intl('272901', '决定路径')
        : `${intl('231780', '持股路径')}${++vCount}：（${intl('138459', '占比约')} ${wftCommonType.displayPercentWithTwoDecimalWhenZero(x.ratio)}）`
      let way
      for (var j = 0; j < item.length - 1; j++) {
        if (item[j].directRatioValue && item[j].directRatioValue !== -1 && item[j].directRatioValue !== -2) {
          rate = rate ? (rate * item[j].directRatioValue) / 100 : item[j].directRatioValue
        }
        if (item[j].directRatioValue < 0) {
          console.log(item[j].directRatioValue)
        }
      }

      if (item[0]['nodeId']) {
        // let buryParam = pingParam + item[0]['nodeId']; //bury
        if (item[0]['nodeId'].length < 15) {
          way = (
            <span
              className="td-span-route-left underline wi-secondary-color wi-link-color"
              onClick={() => {
                item[0]['nodeId'] && wftCommon.linkCompany('Bu3', item[0]['nodeId'])
              }}
            >
              {nameL}
            </span>
          )
        } else {
          way = <span className="td-span-route-left">{nameL}</span>
        }
      } else {
        way = nameL ? <span className="td-span-route-left">{nameL}</span> : ''
      }
      const f = []
      for (var j = 1; j < item.length; j++) {
        const nameR = item[j]['nodeName'] ? item[j]['nodeName'] : '--'
        const sRate = item[j - 1]['directRatioValue'] ? item[j - 1]['directRatioValue'] : ''
        const nodeId1 = item[j]['nodeId'] ? item[j]['nodeId'] : ''

        const name = item[j - 1]?.['typeName']

        f.push(
          <span>
            <span className="td-span-route-right">
              <b style={{ textAlign: 'center' }}>{name || wftCommon.formatPercent(sRate)}</b>
              <i></i>
            </span>
            <span
              className="wi-secondary-color underline ctrlright wi-link-color"
              data-val={nodeId1}
              onClick={(_e) => {
                nodeId1 && wftCommon.linkCompany('Bu3', nodeId1)
              }}
            >
              {nameR}
            </span>
          </span>
        )
      }
      return (
        <div style={{ marginBottom: '10px' }}>
          {title}
          <br />
          {way}
          {f}
        </div>
      )
    })
    store.dispatch(
      globalActions.setGolbalModal({
        className: 'companyIntroductionTagModal',
        width: 560,
        visible: true,
        onCancel: () => store.dispatch(globalActions.clearGolbalModal()),
        title: intl('451209', '股权链'),
        content: (
          <>
            {Header}
            {a}
          </>
        ),
        footer: [
          //   <Button type="grey" onClick={() => store.dispatch(globalActions.clearGolbalModal()) }>{'222'}</Button>,
        ],
      })
    )
  }, // 是否终端内使用
  usedInClient: usedInClient, // 是否开发模式、还是生产模式
  isDevDebugger: isDevDebugger,
  // 是否时独立web测试站
  isWebTest: isWebTest,
  linkF5: function (name, data, arr) {
    //跳转到f5
    const code = arr && arr[1] ? data[arr[1]] : data['F16_1090']
    let str = ''
    const usedInClient = wftCommon.usedInClient()
    let linkStr: ReactNode = ''
    if (usedInClient) {
      str = '!Page[Minute,' + code + ']'
      linkStr = (
        <a className="go2f5 underline wi-secondary-color wi-link-color" href={str}>
          {name}
        </a>
      )
    } else {
      linkStr = name
    }
    return linkStr
  },
  linkINF: function (name, code) {
    //跳转到保险产品
    let str = `//114.80.154.45/FundStaticWeb/newF9/Insurance/#/Introduct/?fundCode=${code}` //TODO zlpei 域名修改为保险产品域名
    const usedInClient = wftCommon.usedInClient()
    let linkStr: ReactNode = ''
    if (usedInClient) {
      str = `!COMMANDPARAM[155,url=https://fundresearchserver/FundStaticWeb/newF9/Insurance/#/Introduct/?fundCode=${code}&lan=cn,IsSingleton=true,disableuppercase=true]`
      linkStr = (
        <a className="go2inf underline wi-secondary-color wi-link-color" href={str}>
          {name}
        </a>
      )
    } else {
      linkStr = name
    }
    return linkStr
  },
  linkF9: function (name, data, arr) {
    //跳转到f9
    const code = arr && arr[1] ? data[arr[1]] : data['BondCode']
    let str = ''
    const usedInClient = wftCommon.usedInClient()
    let linkStr: ReactNode = ''
    if (usedInClient) {
      str = '!CommandParam[1400,windcode=' + code + ']'
      linkStr = (
        <a className="go2f9 underline wi-secondary-color wi-link-color" href={str}>
          {name}
        </a>
      )
    } else {
      linkStr = name
    }
    return linkStr
  }, // 用于 dangeroushtml中的a标签跳转企业详情
  getCompanyUrlForF9: function (companyCode) {
    const wclient = wftCommon.usedInClient()
    let url = ''
    let tmpCode = companyCode
    if (!companyCode || !companyCode.length) return ''
    if (tmpCode.length == 15) {
      tmpCode = tmpCode.substr(2, 10)
    }
    if (wclient) {
      url = `!CommandParam[8514,CompanyCode=${tmpCode},SubjectID=4778]`
    } else {
      if (window.location.href.indexOf('/Company/') > -1) {
        url = `Company.html?companycode=${tmpCode}`
      } else {
        url = `../Company/Company.html?companycode=${tmpCode}`
      }
    }
    return url
  },
  linkCompany: function (dept, companyCode, companyId?, windCode?, buryParam?, country?) {
    if (wftCommon.fromPage_shfic == wftCommon.fromPage()) return
    // 开发环境跳转
    if (isDev) {
      return window.open(`#/?needtoolbar=1&companycode=${companyCode}`)
    }
    let tmpCode = companyCode && windCode ? '' : companyCode
    let webAppsite = '/Wind.WFC.Enterprise.Web/PC.Front'
    const countryStr = country ? '&country=' + window.encodeURIComponent(country) : ''
    const wclient = wftCommon.usedInClient()
    if (tmpCode.length == 15) {
      tmpCode = tmpCode.substr(2, 10)
    }
    if (!wclient) {
      if (!wftCommon.isDevDebugger()) {
        webAppsite = '/web'
      }
    }
    // var otherBuryParam = wftCommon.buryFromParam();
    // buryParam = buryParam ? buryParam + otherBuryParam : otherBuryParam;
    // if (buryParam.indexOf('fromPageUId') == -1) {
    //     buryParam = buryParam + '&fromPageUId=' + buryFCode.getPageUId();
    // }
    try {
      const url =
        window.location.protocol +
        '//' +
        window.location.host +
        webAppsite +
        '/Company/Company.html?companyid={CompanyId}&companycode={CompanyCode}&windCode={windCode}&from=open' +
        dept +
        buryParam +
        countryStr
      window.external.ClientFunc(
        JSON.stringify({
          isGlobal: 1,
          func: 'opencompanyf9',
          companyId: companyId,
          companyCode: tmpCode,
          windCode: windCode,
          SubjectID: 4778,
          URL: url,
        }),
        function (ret) {
          const obj = JSON.parse(ret)
          //中台按DELPHI约定，obj.result不为0，代表成功，这点要特别注意
          if (obj && obj.result && obj.result != 0) {
          } else {
            //obj.result等于0，代表未找到企业，现在的模块不会走这条路
            wftCommon.f9Jump(dept, companyCode, buryParam)
          }
          if (obj && obj.windCode === null) {
            // 非上市企业
            if (obj && obj.result && (obj.result == 1400 || obj.result == '1400')) {
              //代表进入终端F9
              // var otherParam = buryFCode.paramBuryJson('jumpf9', buryParam);
              // buryFCode.buryFunJumpOther('loading', 'detailView', 'company', otherParam);
            }
          } else {
            //代表进入上市企业终端F9模块
            // var otherParam = buryFCode.paramBuryJson('jumpf9', buryParam);
            // buryFCode.buryFunJumpOther('loading', 'detailView', 'company', otherParam);
          }
        }
      )
    } catch (e) {
      //如果终端版本过老，通过调用funcError自行处理
      wftCommon.f9Jump(dept, companyCode, buryParam, country)
    }
    return false
  },
  f9Jump: function (dept, companyCode, buryParam, country) {
    buryParam = buryParam ? buryParam : ''
    const countryStr = country ? '&country=' + window.encodeURIComponent(country) : ''
    let webAppsite = '/Wind.WFC.Enterprise.Web/PC.Front'
    const wclient = wftCommon.usedInClient()
    if (!wclient) {
      if (!wftCommon.isDevDebugger()) {
        webAppsite = '/web'
      }
    }
    if (companyCode) {
      const url =
        window.location.protocol +
        '//' +
        window.location.host +
        webAppsite +
        '/Company/Company.html?companycode=' +
        companyCode +
        '&from=open' +
        dept +
        buryParam +
        countryStr
      window.open(url)
    } else {
      window.alert('未找到企业')
    }
  },
  f9JumpfromTw: function (dept, companyCode, country, buryParam) {
    buryParam = buryParam ? buryParam : ''
    if (companyCode) {
      this.linkCompany(dept, companyCode, null, null, buryParam, country)
    } else {
      window.alert('未找到企业')
    }
  },
  formatWebsite: function (website, type) {
    //格式化网址，去掉http://或https://,加上链接。
    if (website) {
      if (wftCommon.fromPage_shfic == wftCommon.fromPage()) {
        // 工商联 不需要跳转
        return website
      }
      const newstr = website.replace(/http(s)?(:)?(\/)*|,/g, '')
      const returnStr =
        '<a class="underline wi-secondary-color wi-link-color" href="' +
        (type == 'email' ? 'mailto://' : 'http://') +
        newstr +
        '" target="_blank">' +
        (type == 'email' ? (website.length > 30 ? website.slice(0, 31) + '...' : website) : website) +
        '</a>'
      return <span dangerouslySetInnerHTML={{ __html: returnStr }}></span>
    } else {
      return '--'
    }
  },
  getwsd: getWsid,

  popupSvip: () => {
    window.parent.postMessage('opensvip')
  },
  overLimitModal: () => {
    window.parent.postMessage('overlimit')
  },
  getUrlSearch: wftCommonGetUrlSearch,
  fromPageTag: '',
  fromPage: (other?) => {
    if (other) {
      wftCommon.fromPageTag = other
    }
    return wftCommon.fromPageTag
  },
  fromPage_shfic: 'shfic', // 上海工商联
  fromPage_f9: 'f9', // f9 企业库资料
  is_svip_config: false,
  is_vip_config: false,
  is_bs_config: true,
  is_trail_config: false,
  is_staff_config: false,
  is_trailed: false,
  hasCompGeAcc: true,
  terminalType: '',
  terminalName: '万得金融终端',
  is_buy_config: false,
  is_overseas_config: false,
  forbiddenTerminalSales: ['1', '304'], // 1-个人股票windows，304-个人股票mac 不支持付费购买高级权限

  /**
   * 没有 toolbar 的终端类型
   */
  notoolbarTerminal: ['S35', 'S37', 'S38', 'S43', 'S67'],

  listPayGoods: {},
  commodityUrl: '//CommodityWebServer/jcommodityweb/dist/gp/#/buypage?id=178b3435b357448db5eba48ca081812b', // 海外用户申请开通SVIP，调用三方提供的通用页面处理
  commodityUrlWeb: '/jcommodityweb/dist/gp/#/buypage?id=178b3435b357448db5eba48ca081812b',
  payGoodsSet: (data) => {
    data &&
      data.length &&
      data.map(function (t) {
        if (t.permission == 'EQ_APL_GEL_VIP') {
          wftCommon.listPayGoods['vip'] = t
        }
        if (t.permission == 'EQ_APL_GEL_SVIP') {
          wftCommon.listPayGoods['svip'] = t
        }
      })
  },
  userPackageConfigSet: (packageName, expireDate, data) => {
    const is_terminal = wftCommon.usedInClient()
    wftCommon.hasCompGeAcc = data.hasCompGeAcc
    wftCommon.terminalType = data.terminalType ? data.terminalType : 'S'
    if (wftCommon.terminalType == 'S6') {
      wftCommon.terminalName = window.en_access_config ? 'WFC' : '万得投顾终端'
    } else {
      wftCommon.terminalName = window.en_access_config ? 'WFT' : wftCommon.terminalName
    }
    // 是否是终端正式账号

    wftCommon.is_buy_config = data.isBuy || false // 终端正式账号
    wftCommon.is_overseas_config = data.isForeign || false //是否是海外用户
    if (Number(data.region) !== 0) {
      // ip 境外
      wftCommon.is_overseas_config = true
    }
    if (wftCommon.is_overseas_config) {
      if (!window.document.body.className || window.document.body.className.indexOf('wind-global-oversea') == -1) {
        window.document.body.className = window.document.body.className + ' wind-global-oversea '
      }
    }
    const isTrailed = data.isTrailed || false
    if (isTrailed) {
      wftCommon.is_trailed = true // 已经开通过试用
    }

    if (packageName == 'EQ_APL_GEL_FORTRAIL') {
      // 试用SVIP
      if (wftCommon.is_overseas_config) {
        // 2023-10-03 海外试用账号不显示试用截止时间等信息
        expireDate = wftCommon.formatTime(expireDate)
        var expireDateStamp = new Date(expireDate).getTime()
        var todayTime = new Date()
        // @ts-expect-error ttt
        todayTime = todayTime.toLocaleDateString()
        var todayTimestamp = new Date(todayTime).getTime()
        var times = expireDateStamp - todayTimestamp + 24 * 1000 * 3600 // 记录的是到期日24点，所以这边要再加一天日期
        times = times / 1000 / 24 / 3600
        if (times > 0) {
          wftCommon.is_vip_config = true
          wftCommon.is_svip_config = true
          wftCommon.is_trail_config = true
        }
      } else if (expireDate) {
        expireDate = wftCommon.formatTime(expireDate)
        var expireDateStamp = new Date(expireDate).getTime()
        var todayTime = new Date()
        // @ts-expect-error ttt
        todayTime = todayTime.toLocaleDateString()
        var todayTimestamp = new Date(todayTime).getTime()
        var times = expireDateStamp - todayTimestamp + 24 * 1000 * 3600 // 记录的是到期日24点，所以这边要再加一天日期
        times = times / 1000 / 24 / 3600
        if (times > 0) {
          wftCommon.is_vip_config = true
          wftCommon.is_svip_config = true
          wftCommon.is_trail_config = true
        }
        times = Math.floor(times)
        var lastTimestamp = localStorageManager.get('wind-gel-exp-user-tips')
        if (!lastTimestamp || todayTimestamp - (lastTimestamp - 0) > 1000 * 24 * 3600) {
          var ele = document.createElement('div')
          if (times > 0) {
            if (window.en_access_config) {
              ele.innerHTML =
                'The SVIP trial of Wind Global Enterprise Library will expired after' +
                times +
                ' days, you can <span class="wind-gel-exp-buy">click here</span> buy now.<span class="wind-gel-exp-close">x</span>'
            } else {
              ele.innerHTML =
                '您正在试用万得全球企业库SVIP会员，将于' +
                times +
                '天后到期，部分功能将受到限制，现购买会员每日低至1元起，<span class="wind-gel-exp-buy">点此</span>立即购买<span class="wind-gel-exp-close">x</span>'
            }
          } else {
            if (window.en_access_config) {
              ele.innerHTML =
                'The SVIP trial of Wind Global Enterprise Library was expired, You can <span class="wind-gel-exp-buy">click here</span> buy now.<span class="wind-gel-exp-close">x</span>'
            } else {
              ele.innerHTML =
                '您的万得全球企业库SVIP会员试用权益已到期，部分功能将受到限制，现购买正式会员每日低至1元起，<span class="wind-gel-exp-buy">点此</span>立即购买<span class="wind-gel-exp-close">x</span>'
            }
          }
          ele.className = 'wind-gel-exp-user'
          document.body.appendChild(ele)
          document.body.classList.add('wind-global-exp')
        }
      }
    }

    if (packageName === 'EQ_APL_GEL_SVIP') {
      wftCommon.is_svip_config = true
      wftCommon.is_vip_config = true
    }
    if (packageName === 'EQ_APL_GEL_FORSTAFF') {
      wftCommon.is_svip_config = true
      wftCommon.is_vip_config = true
      wftCommon.is_staff_config = true
    }
    if (packageName === 'EQ_APL_GEL_VIP') {
      wftCommon.is_vip_config = true
    }
    if (packageName == 'EQ_APL_GEL_EP') {
      wftCommon.is_ep_config = true
      wftCommon.is_vip_config = true
    }
    if (packageName == 'EQ_APL_GEL_BS') {
      wftCommon.is_bs_config = true
      // 终端 非Vip 非SVIP账号 提示其可以申请一次svip试用
      if (is_terminal) {
        // if (!wftCommon.hasCompGeAcc || (wftCommon.forbiddenTerminalSales.indexOf(wftCommon.terminalType) > -1)) {
        //     // 禁止用户
        // }
        if (wftCommon.forbiddenTerminalSales.indexOf(wftCommon.terminalType) > -1) {
          // 禁止用户
        }
        // 该逻辑2023.10.03去除！！（海外数据出境新版改造）
        // else if (wftCommon.is_overseas_config || window.en_access_config) {
        //     // 海外用户直接返回 不允许试用 此处使用上述条件判定 1. 海外账号  2. 用户使用英文版终端
        // }
        else {
          if (!isTrailed) {
            if (wftCommon.is_overseas_config) {
              // 该逻辑2023.10.03添加！！（海外数据出境新版改造）
              const overseaTips =
                'Dear customer, <a class="wind-gel-exp-oversea underline">click here</a> to apply for SVIP membership free trail of Wind Global Enterprise Database (GEL) 尊敬的客户，<a class="wind-gel-exp-oversea underline">点击此处</a> 即可免费申请开通企业库SVIP试用账号。'
              var ele = document.createElement('div')
              ele.innerHTML = overseaTips + '<span class="wind-gel-exp-close">x</span>'
              ele.className = 'wind-gel-exp-user-oversea'
              document.body.appendChild(ele)
              document.body.classList.add('wind-global-exp')
            } else if (!wftCommon.hasCompGeAcc) {
              // hasCompGeAcc 判断逻辑排在海外试用之后
            } else if (!wftCommon.is_buy_config) {
              // 终端的试用w账号，需要联系客户经理才能开通试用，属于线下开通行为
              var ele = document.createElement('div')
              if (window.en_access_config) {
                ele.innerHTML =
                  'As a user of ' +
                  wftCommon.terminalName +
                  ' trial, you can get the SVIP of Wind Global Enterprise Library by contact with account manager. or <a class="wind-gel-exp-buy-underline underline">click here</a> buy now.<span class="wind-gel-exp-close">x</span>'
              } else {
                ele.innerHTML =
                  '作为' +
                  wftCommon.terminalName +
                  '的试用用户，您可联系客户经理开通万得全球企业库SVIP会员试用，或点此 <a class="wind-gel-exp-buy-underline underline">直接购买 </a>。<span class="wind-gel-exp-close">x</span>'
              }
              ele.className = 'wind-gel-exp-user-nobuy'
              document.body.appendChild(ele)
              document.body.classList.add('wind-global-exp')
              // $(document.body).addClass('wind-global-exp');
              // $(document.body).append('<div class="wind-gel-exp-user-nobuy">作为' + wftCommon.terminalName + '的试用用户，您可联系客户经理开通万得全球企业库SVIP会员试用，或点此 <a class="wind-gel-exp-buy-underline underline">直接购买 </a>。<span class="wind-gel-exp-close">x</span></div>');
            } else {
              // 试用账号埋点 场景1 没有开通
              // if (typeof(buryCenter) !== "undefined" && buryCenter) {
              //     buryCenter.onAllHandle('noTrail')
              // }
              var todayTime = new Date()
              // @ts-expect-error ttt
              todayTime = todayTime.toLocaleDateString()
              var todayTimestamp = new Date(todayTime).getTime()
              var lastTimestamp = localStorageManager.get('wind-gel-exp-user-tips')
              if (!lastTimestamp || todayTimestamp - (lastTimestamp - 0) > 1000 * 24 * 3600) {
                var ele = document.createElement('div')
                if (window.en_access_config) {
                  ele.innerHTML =
                    'As a user of ' +
                    wftCommon.terminalName +
                    ', you have obtained a 3-month trial opportunity for SVIP of Wind Global Enterprise Library. <a class="wind-gel-exp-link">click here</a>for a free trial.<span class="wind-gel-exp-close">x</span>'
                } else {
                  ele.innerHTML =
                    '作为' +
                    wftCommon.terminalName +
                    '的用户，您获得了一次万得全球企业库SVIP会员的试用机会，为期3个月，<span class="wind-gel-exp-link">点此</span>免费体验<span class="wind-gel-exp-close">x</span>'
                }
                ele.className = 'wind-gel-exp-user'
                document.body.appendChild(ele)
                document.body.classList.add('wind-global-exp')
              }
            }
          } else {
            // 已经试用过并已到期 提示用户购买账号
            var ele = document.createElement('div')
            if (window.en_access_config) {
              ele.innerHTML =
                'You can get the SVIP of Wind Global Enterprise Library right now, <span class="wind-gel-exp-buy">click here</span> for buy.<span class="wind-gel-exp-close">x</span>'
            } else {
              ele.innerHTML =
                '您还未购买全球企业库正式会员套餐，部分功能将受到限制，现购买正式套餐每月低至33元，<span class="wind-gel-exp-buy">点此</span>购买套餐<span class="wind-gel-exp-close">x</span>'
            }
            ele.className = 'wind-gel-exp-user'
            document.body.appendChild(ele)
            document.body.classList.add('wind-global-exp')
          }
        }
      }
    }

    window.document.querySelector('.wind-gel-exp-close') &&
      window.document.querySelector('.wind-gel-exp-close').addEventListener('click', (e) => {
        // 关闭逻辑
        window.document.querySelector('.wind-global-exp .wind-gel-exp-user') &&
          window.document.querySelector('.wind-global-exp .wind-gel-exp-user').remove()
        window.document.querySelector('.wind-global-exp .wind-gel-exp-user-nobuy') &&
          window.document.querySelector('.wind-global-exp .wind-gel-exp-user-nobuy').remove()
        window.document.querySelector('.wind-global-exp .wind-gel-exp-user-oversea') &&
          window.document.querySelector('.wind-global-exp .wind-gel-exp-user-oversea').remove()
        window.document.querySelector('.wind-global-exp') &&
          window.document.querySelector('.wind-global-exp').classList.remove('wind-global-exp')
        let todayTime = new Date()
        // @ts-expect-error ttt
        todayTime = todayTime.toLocaleDateString()
        const todayTimestamp = new Date(todayTime).getTime()
        localStorageManager.set('wind-gel-exp-user-tips', todayTimestamp)
        e.stopPropagation()
        return
      })

    window.document.querySelector('.wind-gel-exp-buy') &&
      window.document.querySelector('.wind-gel-exp-buy').addEventListener('click', (e) => {
        // 申请开通vip
        VipPopup()
        e.stopPropagation()
      })

    window.document.querySelector('.wind-gel-exp-user-nobuy') &&
      window.document.querySelector('.wind-gel-exp-user-nobuy').addEventListener('click', (e) => {
        // 申请开通vip
        VipPopup()
        e.stopPropagation()
      })

    window.document.querySelector('.wind-gel-exp-user') &&
      window.document.querySelector('.wind-gel-exp-user').addEventListener('click', (e) => {
        // 试用账号埋点 场景2 头部
        // if (typeof(buryCenter) !== "undefined" && buryCenter) {
        //     buryCenter.onAllHandle('topBarApplication4Probation')
        // }
        const target = e.target
        // @ts-expect-error ttt
        if (target.querySelector('.wind-gel-exp-buy').length) {
          // 开通svip
          VipPopup()
          return
        }
        // 开通试用
        const tips =
          '每人仅限一次试用机会，试用期为三个月，到期后可选择是否正式购买。点击确认后系统将自动开通SVIP会员权益，立即生效，并视为您已阅读并同意全球企业库用户协议和隐私政策。'
        tryVip(tips)
        e.stopPropagation()
      })

    window.document.querySelector('.wind-gel-exp-link') &&
      window.document.querySelector('.wind-gel-exp-link').addEventListener('click', (e) => {
        // 开通试用
        //  点击开通申请埋点 场景2 头部
        // if (typeof(buryCenter) !== "undefined" && buryCenter) {
        //     buryCenter.onAllHandle('topBarApplication4Probation')
        // }
        // 开通试用
        const tips =
          '每人仅限一次试用机会，试用期为三个月，到期后可选择是否正式购买。点击确认后系统将自动开通SVIP会员权益，立即生效，并视为您已阅读并同意全球企业库用户协议和隐私政策。'
        tryVip(tips)
        e.stopPropagation()
      })

    window.document.querySelector('.wind-gel-exp-user-oversea') &&
      window.document.querySelector('.wind-gel-exp-user-oversea').addEventListener('click', (e) => {
        // 2023-10-03  海外使用申请
        const is_terminal = wftCommon.usedInClient()
        const no_Access = is_terminal ? '' : '&noPermission=1'
        const lang = wftCommon.getUrlSearch('lang') == 'en' ? 2 : 1
        let ip = is_terminal ? 'UnitedWebServer' : 'wx.wind.com.cn'
        if (window.location.host.indexOf('.8.173') > -1) {
          ip = window.location.host
        }
        const url =
          window.location.protocol +
          '//' +
          ip +
          '/junitedweb/sea/index.html?languageType=' +
          lang +
          '&module=gelpc&noClose=1' +
          no_Access +
          '&terminalType=' +
          wftCommon.terminalType
        const ele = document.createElement('iframe')
        ele.setAttribute('id', 'over-sea-users-data-tip')
        ele.setAttribute('src', url)
        document.body.appendChild(ele)
        window.addEventListener(
          'message',
          (e) => {
            if (e.data.type == 'seaDataLimit') {
              const paramsObj = e.data.params
              if (paramsObj.action === 'changeSize') {
                const myIframeDom = document.getElementById('over-sea-users-data-tip')
                myIframeDom.style.width = paramsObj.width + 'px'
                myIframeDom.style.height = paramsObj.height + 'px'
              }
              if (paramsObj.action === 'doApply') {
                // 返回操作
                if (paramsObj.result === 0) {
                  if (!is_terminal) {
                    //如果不是终端直接注销
                    const gelLastUrl = window.location.href.replace(window.location.origin, '')
                    localStorage.setItem('gelLastUrl', gelLastUrl)
                    window.location.href = window.location.origin + '/wind.ent.web/windLogin?logout'
                    return
                  }
                }
                if (paramsObj.result === 2) {
                  //result为0，未提交申请 result为1提交申请成功
                  setTimeout(function () {
                    window.location.reload()
                  }, 2000)
                } else if (paramsObj.result === 0) {
                  overseaTipsSimple()
                }
              }
            }
          },
          false
        )
        e.stopPropagation()
      })
  },
  downExcelfile: (id, name) => {
    if (!id) return
    const a = document.createElement('a')
    a.href = `/Wind.WFC.Enterprise.Web/Enterprise/ExcelDownload.aspx?taskId=${id}&filename=${name ? name.replace('.', '') : 'excel_gel'}`
    a.click()
  },

  /**
   * 判断是否是百分企业终端 或者是 baifen web
   * @returns {boolean}
   */
  isBaiFenTerminal: isBaiFenTerminal,

  /**
   * 判断是否是百分企业终端 或者是 baifen web, baifen web，即 iframe 内嵌了
   * @returns {boolean}
   */
  isBaiFenTerminalOrWeb: isBaiFenTerminalOrWeb,

  /**
   * 处理百分企业终端的URL,为URL添加百分来源标识
   * @author 陆一新<yxlu.calvin@wind.com.cn>
   * @since 2024-03-20
   *
   * @param {string} url - 需要处理的URL
   * @returns {string} 处理后的URL
   *
   * @example
   * // 非百分终端
   * handleUrl('https://example.com') // returns 'https://example.com'
   * handleUrl('example.com?a=1') // returns 'example.com?a=1'
   *
   * // 百分终端
   * handleUrl('https://example.com?a=1') // returns 'https://example.com?a=1&from=baifen'
   * handleUrl('example.com?a=1') // returns 'example.com?a=1&from=baifen'
   */
  handleUrl: (url: string): string => {
    // 如果不是百分终端直接返回原URL
    if (!wftCommon.isBaiFenTerminalOrWeb()) return url

    // 检查URL是否为空
    if (!url?.trim()) {
      console.warn('handleUrl: Empty URL provided')
      return url
    }

    try {
      // 判断是否是完整的URL
      const isFullUrl = url.startsWith('http://') || url.startsWith('https://')
      const baseUrl = isFullUrl ? url : `http://${url}`

      // 解析URL
      const _url = new URL(baseUrl)
      const _urlSearchParams = new URLSearchParams(_url.search)

      // 添加百分来源标识
      _urlSearchParams.set('from', 'baifen')

      // 重建URL
      _url.search = _urlSearchParams.toString()

      // 如果原URL不是完整URL，去掉添加的协议部分
      const resultUrl = isFullUrl ? _url.toString() : _url.toString().replace(/^http:\/\//, '')

      console.log('handleUrl', {
        original: url,
        result: resultUrl,
      })

      return resultUrl
    } catch (error) {
      // URL 解析失败，尝试简单拼接
      console.warn('handleUrl: Failed to parse URL', error)
      const separator = url.includes('?') ? '&' : '?'
      return `${url}${separator}from=baifen`
    }
  },

  /**
   * 跳转原gel页面
   */
  jumpJqueryPage: function (url, self?, noCompany?) {
    const usedInClient = wftCommon.usedInClient()
    const is_dev = wftCommon.isDevDebugger()
    let webAppsite = '/Wind.WFC.Enterprise.Web/PC.Front'
    const loc = window.location.href?.toLocaleLowerCase() || ''
    if (!url) return
    if (wftCommon.fromPage_shfic == wftCommon.fromPage()) return
    if (!is_dev && !usedInClient) {
      // 如果当前包含pc.front路径 走上述终端路由方案, 测试部用互联网访问方式做日常巡检用， 否则当成web端访问路径
      if (!/pc\.front/i.test(loc)) {
        if (loc.indexOf('/wind.ent.web/gel') > -1) {
          webAppsite = '/wind.ent.web/gel'
        } else {
          webAppsite = '/web'
        }
      }
    }
    let turl =
      url.indexOf('//') > -1
        ? url
        : window.location.protocol + '//' + window.location.host + webAppsite + (noCompany ? '' : '/Company/') + url
    if (is_dev) {
      turl = url
    }

    // 百分终端中企业库的下载跳百分的链接
    const isbaifen = wftCommon.isBaiFenTerminalOrWeb()
    if (url.indexOf('#/customer?type=mylist') > -1 && isbaifen) {
      return window.open('//GOVWebSite/govbusiness/#/myenterprise/download')
    }
    if (isbaifen) turl = wftCommon.handleUrl(turl)
    if (self) {
      // 当前页面打开
      window.open(turl, '_self')
    } else {
      window.open(turl)
    }
  },

  /**
   * 跳转百分企业页面页面
   */
  jumpBaifen: function (url, self, payload) {
    const usedInClient = wftCommon.usedInClient()
    const session = getWsid()
    let website = ''
    const host = usedInClient ? 'govwebsite' : 'dgov.wind.com.cn'
    let search = new URLSearchParams()
    for (const i in payload) {
      search.append(i, payload[i])
    }
    // @ts-expect-error ttt
    search = search.toString()
    if (!usedInClient) {
      website = `//${host}/${url}${search ? '?' + search : ''}${usedInClient ? '' : session ? '&wind.sessionid=' + session : ''}`
    } else {
      website = `//${host}/${url}${search ? '?' + search : ''}`
    }
    window.open(website, self)
  },
  namePrivate: function (name) {
    let newName = ''
    newName = name.substring(0, 1) + new Array(name.length).join('*')
    return newName
  },
  splitParties: function (arrDataArr, nameKey?, idKey?) {
    const arrData = []
    arrDataArr.map((item) => {
      if (item.roleType === '原告') {
        arrData.unshift(item)
      } else {
        arrData.push(item)
      }
    })
    nameKey = nameKey || 'name'
    idKey = idKey || 'id'
    const newArr = []
    if (arrData && arrData.length && arrData[0].$ref) {
      return '--'
    }
    arrData.forEach &&
      arrData.forEach((item) => {
        const parent = newArr.find((c) => c.roleType === item.roleType)
        if (parent) {
          parent.childs.push(item)
        } else {
          const obj = {
            roleType: item.roleType,
            childs: [item],
          }
          newArr.push(obj)
        }
      })
    const htmlArr = []
    for (let i = 0; i < newArr.length; i++) {
      const childs = newArr[i].childs
      htmlArr.push(
        <div>
          {' '}
          {newArr[i].roleType + ':'}{' '}
          {childs.map((t, idx) => {
            return (
              <span className="content-inline">
                {' '}
                {idx ? '、' : null} <CompanyLink name={t[nameKey]} id={t[idKey]}></CompanyLink>{' '}
              </span>
            )
          })}{' '}
        </div>
      )
    }
    return htmlArr.map((t) => {
      return t
    })
  },
  splitParties2: function (arrData) {
    const newArr = []
    arrData.forEach &&
      arrData.forEach((item) => {
        const parent = newArr.find((c) => c.roleType === item.roleType)
        if (parent) {
          parent.childs.push(item)
        } else {
          const obj = {
            roleType: item.roleType,
            childs: [item],
          }
          newArr.push(obj)
        }
      })
    const htmlArr = []
    for (let i = 0; i < newArr.length; i++) {
      let htmlArr1 = newArr[i].roleType + ':'
      const childs = newArr[i].childs
      for (let j = 0; j < childs.length; j++) {
        if (childs[j].entityType == '人物') {
          htmlArr1 = htmlArr1 + wftCommon.namePrivate(childs[j].name) + (j < childs.length - 1 ? '，' : '')
        } else {
          htmlArr1 = htmlArr1 + childs[j].name + (j < childs.length - 1 ? '，' : '')
        }
      }
      htmlArr.push(htmlArr1)
      htmlArr.push('\n')
    }
    return htmlArr.join('')
  },
  relativeType: function (data) {
    switch (data) {
      case '1':
        return intl('74323', '本公司')
      case '2':
        return intl('204320', '分支机构')
      case '3':
        return intl('451208', '控股企业')
      case '4':
        return intl('138724', '对外投资')
    }
  },
  imageBaseCorp: (tableId, srcId, css, isEnlarge) => {
    return wftCommon.imageBase(tableId, srcId, css, isEnlarge, '', 'corp')
  },
  imageBaseBrand: (tableId, srcId, css, isEnlarge) => {
    return wftCommon.imageBase(tableId, srcId, css, isEnlarge, '', 'brand')
  }, // tableId：图片数据库表id
  imageBase: (tableId, srcId, css?, isEnlarge?, defaultWidth?, imgType?) => {
    let url = window.location.protocol + '//news.windin.com/ns/imagebase/' + tableId + '/' + srcId
    let defaultImg = no_photo_list
    if (!tableId) {
      url = srcId
    }
    if (srcId?.indexOf('http') > -1) {
      // 兼容后端给的是完整互联网地址
      url = srcId
      url = url.replace(/https|http/, window.location.protocol.split(':')[0])
    }
    if (imgType == 'corp') {
      defaultImg = defaultCompanyImg
    } else if (imgType == 'brand') {
      defaultImg = brand120
    }
    if (!wftCommon.usedInClient()) {
      url = url + '?wind.sessionid=' + getWsid()
    }
    return isEnlarge ? (
      <Tooltip
        key={srcId}
        title={
          <img
            width="140"
            src={url}
            onError={(e) => {
              // @ts-expect-error ttt
              e.target.src = defaultImg
            }}
          />
        }
      >
        <img
          src={url}
          width={defaultWidth ? defaultWidth : 'auto'}
          className={` ${css ? css : 'company-table-logo'}`}
          onError={(e) => {
            // @ts-expect-error ttt
            e.target.src = defaultImg
          }}
        />
      </Tooltip>
    ) : (
      <img
        src={url}
        width={defaultWidth ? defaultWidth : 'auto'}
        className={` ${css ? css : 'company-table-logo'}`}
        onError={(e) => {
          // @ts-expect-error ttt
          e.target.src = defaultImg
        }}
      />
    )
  },
  ultimateBeneficialShares: function (shareRoute) {
    const c = shareRoute
    let vCount = 0

    for (let i = 0; i < c.length; i++) {
      let item = null
      let rate = 0
      item = c[i].route
      // var nameL = item[0]['nodeName'] ? item[0]['nodeName'] : '--';
      for (let j = 0; j < item.length - 1; j++) {
        if (item[j].directRatioValue && item[j].directRatioValue !== -1 && item[j].directRatioValue !== -2) {
          if (rate) {
            rate = (rate * item[j].directRatioValue) / 100
          } else {
            rate = item[j].directRatioValue
          }
          // rate = rate ? (rate * item[j].directRatioValue) : item[j].directRatioValue;
        }
      }
      vCount += rate
    }
    return wftCommon.formatPercent(vCount)
  },
  importExternalScript: (src) => {
    return new Promise<void>((resolve, reject) => {
      if (document.querySelector(`[src="${src}"]`)) {
        resolve()
      } else {
        const script = document.createElement('script')
        script.src = src
        script.onload = () => resolve()
        script.onerror = () => reject()
        document.body.appendChild(script)
      }
    })
  },
  /**
   * canvas、d3 svg保存图片
   * selector：目标元素
   * name：图片名称前缀
   * dType：1,2,3 1-canvas类型 2-d3 svg类型 3-cytoscape类型
   * sData: 原始img数据
   */
  saveCanvasImg: function (selector, name, dType, sData, pwidth, pheight) {
    const $ = window.$,
      d3 = window.d3
    var name = name || '全球企业库'
    let originalImage = null // 目标img
    let targetEle = null // 目标画布元素
    let targetImageData = null // 目标画布图片数据
    let svgXml = null // svg xml信息

    // 水印
    const shuiying = new Image()
    if (window.localStorage.nologoconfig) {
      shuiying.src = '../resource/images/Company/blank.png?t=' + Date.now().toString()
      shuiying.width = 200
      shuiying.height = 200
    } else {
      shuiying.src = '../resource/images/Company/sy2.png?t=' + Date.now().toString()
      shuiying.width = 200
      shuiying.height = 200
    }

    originalImage = new Image()

    // 移除已有jietu遮罩
    if ($('[data-id="jietuMask"]')) {
      $('[data-id="jietuMask"]').remove()
    }
    const jietuMask = document.createElement('div')
    $(jietuMask).attr('data-id', 'jietuMask')
    $(jietuMask).attr(
      'style',
      'position: fixed; background: #fff; z-index: 3000; top: 0px; bottom: 0px; left: 0px; right: 0px;'
    )

    if (dType === 3) {
      if (sData) {
        originalImage.onload = function (_e) {
          const canvas = document.createElement('canvas') //准备空画布
          canvas.width = originalImage.width
          canvas.height = originalImage.height
          const context = canvas.getContext('2d') //取得画布的2d绘图上下文
          context.fillStyle = '#fff'
          context.fillRect(0, 0, canvas.width, canvas.height)
          $(jietuMask).css('display', 'none')
          context.drawImage(originalImage, 0, 0)
          setTimeout(function () {
            let wlen = canvas.width / 8
            let hlen = canvas.height / 8
            wlen = wlen < 238 ? 238 : wlen
            hlen = hlen < 238 ? 238 : hlen
            for (let x = 10; x < canvas.width; x += wlen) {
              for (let y = 10; y < canvas.height; y += hlen) {
                context.drawImage(shuiying, x, y, 200, 200) // x,y,w,h
              }
            }
            // context.drawImage(shuiying, canvas.width / 2 - 100, canvas.height / 2 - 57, 200, 57); // x,y,w,h
            const marker = intl('232624', '基于公开信息和第三方数据利用大数据技术独家计算生成!')
            context.font = '14px 微软雅黑'
            context.fillStyle = '#aaaaaa'
            context.fillText(marker, canvas.width / 2 - context.measureText(marker).width / 2, canvas.height - 20)
            downloadimg(name, canvas)
          }, 100)
        }
        document.body.appendChild(jietuMask)
        originalImage.src = sData
      }
      return
    } else if (dType === 2) {
      var svgWidth = d3.select(selector + ' svg').attr('width')
      var svgHeight = d3.select(selector + ' svg').attr('height')
      var svgScale = window._CompanyChart.zoom.scale()
      var svgTranslate = window._CompanyChart.zoom.translate()

      if (pwidth && pheight) {
        window._CompanyChart.zoom.translate([20, 20])
        window._CompanyChart.container.attr(
          'transform',
          'translate(' + window._CompanyChart.zoom.translate() + ')scale(' + window._CompanyChart.zoom.scale() + ')'
        )
        d3.select('svg').attr('width', pwidth)
        d3.select('svg').attr('height', pheight)
      } else {
        window._CompanyChart.zoom.scale(1)
        window._CompanyChart.zoom.translate([3600 / 2, 3000 / 2])
        window._CompanyChart.container.attr(
          'transform',
          'translate(' + window._CompanyChart.zoom.translate() + ')scale(' + window._CompanyChart.zoom.scale() + ')'
        )
        d3.select('svg').attr('width', 3600)
        d3.select('svg').attr('height', 3600)
      }

      // d3 svg 图形
      targetEle = d3.select(selector + ' svg') // 要保存的图片元素
      svgXml = $(selector).html()
      originalImage.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svgXml)))
    } else {
      // canvas
      targetEle = $(selector) // 要保存的图片元素
      targetImageData = $(selector)[0].toDataURL()
      originalImage.src = sData || targetImageData

      originalImage.onload = function (_e) {
        document.body.appendChild(jietuMask)
        const canvas = document.createElement('canvas') //准备空画布
        canvas.width = originalImage.width
        canvas.height = originalImage.height
        const context = canvas.getContext('2d') //取得画布的2d绘图上下文
        context.fillStyle = '#fff'
        context.fillRect(0, 0, canvas.width, canvas.height)
        $(jietuMask).css('display', 'none')
        context.drawImage(originalImage, 0, 0)
        setTimeout(function () {
          let wlen = canvas.width / 8
          let hlen = canvas.height / 8
          wlen = wlen < 238 ? 238 : wlen
          hlen = hlen < 238 ? 238 : hlen
          for (let x = 10; x < canvas.width; x += wlen) {
            for (let y = 10; y < canvas.height; y += hlen) {
              context.drawImage(shuiying, x, y, 200, 200) // x,y,w,h
            }
          }
          // context.drawImage(shuiying, canvas.width / 2 - 100, canvas.height / 2 - 57, 200, 57); // x,y,w,h
          const marker = '基于公开信息和第三方数据利用大数据技术独家计算生成!'
          context.font = '14px 微软雅黑'
          context.fillStyle = '#aaaaaa'
          context.fillText(marker, canvas.width / 2 - context.measureText(marker).width / 2, canvas.height - 20)
          downloadimg(name, canvas)
        })
      }

      return
    }

    /**
     * 生成img
     *
     * @param {any} _selector , canvas元素选择符
     * @param {any} dType , dType
     */
    function saveImg(_selector, dType) {
      document.body.appendChild(jietuMask)

      setTimeout(function () {
        const canvas = document.createElement('canvas') //准备空画布
        canvas.width = pwidth || targetEle.attr('width')
        canvas.height = pheight || targetEle.attr('height')

        if (dType === 2) {
          window._CompanyChart.zoom.scale(svgScale)
          window._CompanyChart.zoom.translate(svgTranslate)
          window._CompanyChart.container.attr(
            'transform',
            'translate(' + window._CompanyChart.zoom.translate() + ')scale(' + window._CompanyChart.zoom.scale() + ')'
          )
          d3.select('svg').attr('width', svgWidth)
          d3.select('svg').attr('height', svgHeight)
        }

        $(jietuMask).css('display', 'none')
        const context = canvas.getContext('2d') //取得画布的2d绘图上下文
        context.fillStyle = '#fff'
        context.fillRect(0, 0, canvas.width, canvas.height)

        // 水印
        try {
          context.drawImage(originalImage, 0, 0)
          // if (dType === 2) {
          //     context.drawImage(shuiying, canvas.width / 2 - 100, canvas.height / 2 - 28, 200, 57); // x,y,w,h
          // } else {
          //     context.drawImage(shuiying, canvas.width / 2 - 100, canvas.height / 2 - 57, 200, 57); // x,y,w,h
          // }
          let wlen = canvas.width / 8
          let hlen = canvas.height / 8
          wlen = wlen < 238 ? 238 : wlen
          hlen = hlen < 238 ? 238 : hlen
          for (let x = 10; x < canvas.width; x += wlen) {
            for (let y = 10; y < canvas.height; y += hlen) {
              context.drawImage(shuiying, x, y, 200, 200) // x,y,w,h
            }
          }
          var marker = '基于公开信息和第三方数据利用大数据技术独家计算生成!'
          context.font = '14px 微软雅黑'
          context.fillText(marker, canvas.width / 2 - context.measureText(marker).width / 2, canvas.height - 20)
          downloadimg(name, canvas)
        } catch (e) {
          context.drawImage(originalImage, 0, 0)
          var marker = '基于公开信息和第三方数据利用大数据技术独家计算生成!'
          context.font = '14px 微软雅黑'
          context.fillText(marker, canvas.width / 2 - context.measureText(marker).width / 2, canvas.height - 20)
          downloadimg(name, canvas)
        }
      }, 10)
    }

    /**
     * 将canvas保存本地img
     *
     * @param {any} name , img前缀
     * @param {any} canvas , canvas对象
     */
    function downloadimg(name, canvas) {
      let qual = 0.8 // 图片质量
      if (canvas.width > 5000) {
        qual = 0.4
      } else if (canvas.width > 3000) {
        qual = 0.5
      } else if (canvas.width > 2000) {
        qual = 0.6
      }
      if (canvas.height > 20000) {
        qual = 0.1
      } else if (canvas.height > 10000) {
        qual = 0.2
      } else if (canvas.height > 5000) {
        qual = 0.4
      } else if (canvas.height > 2000) {
        qual = qual < 0.5 ? qual : 0.5
      } else if (canvas.height > 1000) {
        qual = qual < 0.6 ? qual : 0.6
      }
      //设置保存图片的类型
      const imgdata = canvas.toDataURL('image/jpeg', qual)
      const filename = name + '_' + new Date().toLocaleDateString() + '.jpeg'
      const a = document.createElement('a')
      const event = new MouseEvent('click')
      a.download = filename
      a.href = imgdata
      a.dispatchEvent(event)
    }

    saveImg(selector, dType)
  },
  isEmpty: (obj) => {
    if (typeof obj === 'undefined' || obj === null || obj === '' || obj === '[]') {
      return true
    }
    return false
  },
  preProcessData: (formData) => {
    Object.keys(formData).forEach((item) => {
      if (wftCommon.isEmpty(formData[item])) {
        delete formData[item]
      } else {
        if (formData[item].length === 0) {
          delete formData[item]
        }
      }
    })
    return formData
  },
  type2enStage: (type) => {
    switch (type) {
      case '资格预审公告':
        return intl('228621', '资格预审公告')
      case '公开招标公告':
        return intl('228622', '公开招标公告')
      case '询价公告':
        return intl('228623', '询价公告')
      case '竞争性谈判公告':
        return intl('228624', '竞争性谈判公告')
      case '单一来源公告':
        return intl('228625', '单一来源公告')
      case '邀请招标公告':
        return intl('228626', '邀请招标公告')
      case '竞争性磋商公告':
        return intl('228627', '竞争性磋商公告')
      case '竞价招标公告':
        return intl('228628', '竞价招标公告')
      case '中标公告':
        return intl('228629', '中标公告')
      case '成交公告':
        return intl('228630', '成交公告')
      case '竞价结果公告':
        return intl('228631', '竞价结果公告')
      case '废标流标公告':
        return intl('228632', '废标流标公告')
      case '更正公告':
        return intl('271972', '更正公告')
      case '开标公告':
        return intl('333033', '开标公告')
      case '意向公告':
        return intl('333034', '意向公告')
      case '合同及验收公告':
        return intl('336673', '合同及验收')
      default:
        return ''
    }
  },
  type2Stage: (type) => {
    switch (type) {
      case '资格预审公告':
        return ' | ' + intl('257809', '预审')
      case '公开招标公告':
        return ' | ' + intl('100969', '招标')
      case '询价公告':
        return ' | ' + intl('100969', '招标')
      case '竞争性谈判公告':
        return ' | ' + intl('100969', '招标')
      case '单一来源公告':
        return ' | ' + intl('100969', '招标')
      case '邀请招标公告':
        return ' | ' + intl('100969', '招标')
      case '竞争性磋商公告':
        return ' | ' + intl('100969', '招标')
      case '竞价招标公告':
        return ' | ' + intl('100969', '招标')
      case '意向公告':
        return ' | ' + intl('100969', '招标')
      case '中标公告':
        return ' | ' + intl('315493', '结果')
      case '成交公告':
        return ' | ' + intl('315493', '结果')
      case '竞价结果公告':
        return ' | ' + intl('315493', '结果')
      case '废标流标公告':
        return ' | ' + intl('315493', '结果')
      case '更正公告':
        return ''
      case '开标公告':
        return ' | ' + intl('315493', '结果')
      case '合同及验收公告':
        return ' | ' + intl('315493', '结果')
      default:
        return ''
    }
  },
  validateEmail: (email) => {
    const reg = /^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-]+)*\.[a-zA-Z0-9_-]+$/
    return reg.test(email)
  },
  emailHide: (email) => {
    const atIndex = email.indexOf('@')
    if (atIndex < 0) {
      return email
    } else {
      const username = email.substring(0, atIndex)
      const domain = email.substring(atIndex + 1)
      const maskUsername = wftCommon.maskString(username)
      return maskUsername + '@' + domain
    }
  },
  maskString: (str) => {
    if (str.length <= 3) {
      return str
    } else {
      const firstTwoChars = str.substring(0, 2)
      const lastChar = str.charAt(str.length - 1)
      return firstTwoChars + '*'.repeat(str.length - 3) + lastChar
    }
  },
  bidDownloadUserSize: (type) => {
    switch (type) {
      case 'svip':
        return 1000
      case 'vip':
        return 500
      default:
        return 0
    }
  },
  getArrDifference: (arr1, arr2) => {
    return arr1.concat(arr2).filter((v, _i, arr) => {
      return arr.indexOf(v) === arr.lastIndexOf(v)
    })
  },
  getPathByKey: (curkey, key, data) => {
    let result = []
    const traverse = (curkey, path, data) => {
      if (data.length === 0) {
        return
      }
      for (const item of data) {
        path.push(item)
        if (item[key] === curkey) {
          result = JSON.parse(JSON.stringify(path))
          return
        }
        const children = Array.isArray(item.node) ? item.node : []
        traverse(curkey, path, children)
        path.pop()
      }
    }
    traverse(curkey, [], data)
    return result
  },
  translateDivHtml: function (id, dom, successFun?) {
    const params = {}
    const translated = []
    let flag = true
    for (let i = 0; i < dom.length; i++) {
      if (window.$(dom[i]).children().length) {
        wftCommon.translateDivHtml(id, window.$(dom[i]).children(), successFun)
        flag = false
      } else {
        const txt = window.$(dom[i])[0].innerText
        params[i] = txt
        translated.push(i)
      }
    }
    wftCommon.translateService(params, function (data) {
      for (let i = 0; i < dom.length; i++) {
        if (translated.indexOf(i) > -1 && window.$(dom[i])[0].innerText) {
          window.$(dom[i]).text(data[i])
        }
      }
      if (flag) {
        successFun && successFun()
        const tbody = window.$(id).find('tbody')
        window.$(tbody).closest('table').find('.translate-loading').remove()
        window.$(tbody).show()
      }
    })
  },
  translateTabHtml: function (id, successFun, noNeedLoading) {
    const tbody = window.$(id).find('tbody')
    const tds = window.$(tbody).find('td')
    const params = {}
    for (let i = 0; i < tds.length; i++) {
      let txt = window.$(tds[i])[0].innerText
      if (window.$(tds[i]).find('a').length) {
        txt = window.$(tds[i]).find('a')[0].innerText
      }
      params[i] = txt
    }
    if (!noNeedLoading) {
      // 不需要loading样式
      if (!window.$(tbody).closest('table').find('.translate-loading').length) {
        window.$(tbody).closest('table').append('<div class="translate-loading">loading</div>')
        window.$(tbody).hide()
      } else {
        // 如果正在翻译，直接返回
        return
      }
    }
    wftCommon.translateService(params, function (data) {
      for (let i = 0; i < tds.length; i++) {
        if (window.$(tds[i]).find('a').length) {
          window.$(tds[i]).find('a').text(data[i])
        } else {
          if (window.$(tds[i])[0].innerText) {
            window.$(tds[i]).text(data[i])
          }
        }
      }
      successFun && successFun()
      window.$(tbody).closest('table').find('.translate-loading').remove()
      window.$(tbody).show()
    })
  },
  translateTable: function ($sel, force) {
    if (!window.en_access_config) return // 中文模式不翻译，直接返回
    try {
      let id = window.$($sel).attr('href') ? window.$($sel).attr('href') : '' // 来源左侧目录树
      if (!id) {
        // 单独的模块
        id = window.$($sel).attr('id') || ''
        id = id ? '#' + id : ''
      }
      if (id) {
        if (id == '#showCompanyInfo') {
          window.$($sel).attr('wi-lang-use', 'en')
        }
        if (!force) {
          // 强制翻译
          if (window.$($sel).attr('wi-lang-use')) return
        }
        if (['#showFinalBeneficiary', '#showShareSearch'].indexOf(id) > -1) {
          wftCommon.translateDivHtml(id, window.$(id).find('tbody').find('td'), function () {
            window.$($sel).attr('wi-lang-use', 'en')
          })
        } else {
          wftCommon.translateTabHtml(id, function () {
            window.$($sel).attr('wi-lang-use', 'en')
          })
        }
      }
    } catch (e) {}
  },
  translateHTML: async (htmlStr) => {
    if (!htmlStr || !window.en_access_config) return htmlStr || ''
    let matchedlist = htmlStr.match(/[\u4e00-\u9fff]+/g)
    if (matchedlist && matchedlist.length) {
      matchedlist = matchedlist.sort((a, b) => b.length - a.length)
    }
    wftCommon.addLoadTask(htmlStr)

    const result = await axiosRequest
      .request({
        method: 'post',
        cmd: 'apitranslates',
        data: {
          transText: `{x:'${matchedlist.join('|')}'}`,
          sourceLang: 1,
          targetLang: 2,
          source: 'gel',
        },
      })
      .finally(() => {
        wftCommon.removeLoadTask(htmlStr)
      })
    let transText = htmlStr
    if (result?.Data?.translateResult?.x) {
      const translatedList = result.Data.translateResult.x.split('|')
      translatedList.map((res, index) => (transText = transText.replace(matchedlist[index], res)))
    }
    return transText
  },
  globalTranslating: new Map(),
  loadMsgCB: null,
  isLoading: false,

  addLoadTask: (data) => {
    if (!wftCommon.globalTranslating.size && wftCommon.loadMsgCB == null && !wftCommon.isLoading) {
      wftCommon.isLoading = true
      wftCommon.loadMsgCB = message.loading('Translate in progress', 0)
    }
    wftCommon.globalTranslating.set(data, true)
  },
  removeLoadTask: (data) => {
    wftCommon.globalTranslating.delete(data)
    if (!wftCommon.globalTranslating.size) {
      wftCommon.loadMsgCB && wftCommon.loadMsgCB()
      wftCommon.loadMsgCB = null
      wftCommon.isLoading = false
    }
  },

  translateService: translateService, // 纯函数 深拷贝后翻译， 不改变原对象
  pureTranslateService: function (param, successFun) {
    function errCallback() {
      if (successFun) {
        return successFun(param)
      }
      return param
    }

    if (!param) return
    if (!window.en_access_config || window.$.isEmptyObject(param)) {
      // 中文模式不翻译，直接返回
      errCallback()
      return
    }
    const newpPram = wftCommon.deepClone(param)
    wftCommon.translateService(newpPram, successFun)
  } /*
   * 中文翻译为英文
   * zhWords，中文词条 arr格式； successCallback，翻译成功后的回调，参数中返回了英文词条arr， extraFun，需要对中文词条做的一些额外处理方法
   */,
  zh2enFlattened: function (vrParam, obj, parentKey) {
    for (const k in obj) {
      if (obj[k] && typeof obj[k] === 'object') {
        wftCommon.zh2enFlattened(vrParam, obj[k], parentKey + '$$' + k + '$$')
      } else {
        if (wftCommon.checkCh(obj[k])) {
          vrParam[parentKey + '$$' + k] = obj[k]
        }
      }
    }
    return vrParam
  },
  checkCh: function (str) {
    const reg = /[\u4e00-\u9fa5]+/
    return reg.test(str)
  },
  zh2enResult: function (vrParam, obj, parentKey) {
    for (const k in obj) {
      if (obj[k] && typeof obj[k] === 'object') {
        wftCommon.zh2enResult(vrParam, obj[k], parentKey + '$$' + k + '$$')
      } else {
        if (vrParam[parentKey + '$$' + k]) {
          obj[k] = vrParam[parentKey + '$$' + k]
        }
      }
    }
    return obj
  },
  zh2enNestedPart: function (zhWords, successCallback, extraFun) {
    if (!zhWords || !zhWords.length) return []
    let vrData = []
    let vrParam = {}
    if (extraFun) {
      vrData = extraFun(zhWords)
    } else {
      vrData = zhWords
    }
    vrParam = wftCommon.zh2enFlattened(vrParam, vrData, '')
    wftCommon.translateService(vrParam, function (newData) {
      let newRes = []
      newRes = wftCommon.zh2enResult(newData, vrData, '')
      successCallback(newRes)
    })
  },

  zh2enAlwaysCallback: function (zhWords, successCallback, extraFun, errorCallback, unfoldField) {
    if (!zhWords || !zhWords.length || !window.en_access_config) {
      if (successCallback) successCallback(zhWords)
      return []
    }
    let vrData = []
    const vrParam = {}
    if (extraFun) {
      vrData = extraFun(zhWords)
    } else {
      vrData = zhWords
    }
    if (unfoldField) {
      vrData.forEach(function (t, idx) {
        unfoldField.forEach(function (k) {
          vrParam[idx + '$$' + k] = t[k]
          if (t[k] === 0) {
            vrParam[idx + '$$' + k] = 0
          } else if (t[k] === '0') {
            vrParam[idx + '$$' + k] = '0'
          } else if (!t[k]) {
            vrParam[idx + '$$' + k] = ''
          } else if (t[k] === true) {
            vrParam[idx + '$$' + k] = 1
          }
        })
      })
    } else {
      vrData.forEach(function (t, idx) {
        for (const k in t) {
          vrParam[idx + '$$' + k] = t[k]
          if (t[k] === 0) {
            vrParam[idx + '$$' + k] = 0
          } else if (t[k] === '0') {
            vrParam[idx + '$$' + k] = '0'
          } else if (!t[k]) {
            vrParam[idx + '$$' + k] = ''
          } else if (t[k] === true) {
            vrParam[idx + '$$' + k] = 1
          }
        }
      })
    }
    wftCommon.translateService(
      vrParam,
      function (newData) {
        let newRes = []
        const resObj = {}
        if (unfoldField) {
          newRes = zhWords
          for (var k in newData) {
            var t = k.split('$$')[0]
            resObj[t] = resObj[t] || {}
            var key = k.split('$$')[1]
            newRes[t][key] = newData[k]
          }
        } else {
          for (var k in newData) {
            var t = k.split('$$')[0]
            resObj[t] = resObj[t] || {}
            var key = k.split('$$')[1]
            resObj[t][key] = newData[k]
          }
          for (var k in resObj) {
            newRes.push(resObj[k])
          }
        }
        successCallback(newRes)
      },
      function () {
        errorCallback && errorCallback()
      }
    )
  },

  /**
   * 处理 zh2en 翻译后的数组对象格式转换
   * @author Calvin<yxlu.calvin@wind.com.cn>
   * @description
   * 1. 针对 zh2en 翻译后，数组对象的 key 变成了 key##arrobj##index##field 格式的问题
   * 2. 例如：原数据格式为 { highlight: [{ label: '值', value: '值' }] }
   * 3. 翻译后变成了 { 'highlight##arrobj##0##label': '值', 'highlight##arrobj##0##value': '值' }
   * 4. 此方法将转换回原来的数组对象格式
   *
   * @param {Array} dataArray - 需要转换的数据数组
   * @example
   * // 输入数据
   * [{
   *   'highlight##arrobj##0##label': '企业名称',
   *   'highlight##arrobj##0##value': '测试公司',
   *   otherField: 'value'
   * }]
   *
   * // 输出数据
   * [{
   *   highlight: [{
   *     label: '企业名称',
   *     value: '测试公司'
   *   }],
   *   otherField: 'value'
   * }]
   *
   * @returns {Array} 转换后的数据数组，保持原有的数组结构，同时将特殊格式的 key 转换回数组对象格式
   */
  convertArrayObjectKeys(dataArray) {
    if (!Array.isArray(dataArray)) return dataArray
    return dataArray.map((data) => {
      const result = { ...data }
      const arrayObjPattern = /^(.+)##arrobj##(\d+)##(.+)$/ // 匹配 key##arrobj##index##field 格式
      const keysToConvert = new Map()

      // 第一步：收集所有需要转换的信息
      Object.keys(data).forEach((key) => {
        const match = key.match(arrayObjPattern)
        if (match) {
          const [, baseKey, index, field] = match
          if (!keysToConvert.has(baseKey)) {
            keysToConvert.set(baseKey, { indexes: new Set(), fields: new Set() })
          }
          const info = keysToConvert.get(baseKey)
          info.indexes.add(Number(index))
          info.fields.add(field)
          // 删除原始的 key
          delete result[key]
        }
      })

      // 第二步：转换为数组对象格式
      keysToConvert.forEach((info, baseKey) => {
        const arrayResult = Array.from(info.indexes)
          // @ts-expect-error ttt
          .sort((a, b) => a - b)
          .map((index) => {
            const obj = {}
            info.fields.forEach((field) => {
              const originalKey = `${baseKey}##arrobj##${index}##${field}`
              obj[field] = data[originalKey]
            })
            return obj
          })
        result[baseKey] = arrayResult
      })

      return result
    })
  },
  zh2en: function (zhWords, successCallback, extraFun?, errorCallback?, unfoldField?) {
    if (!zhWords || !Array.isArray(zhWords) || !zhWords.length) {
      if (errorCallback) errorCallback('🚀 ~ zh2en zh words is null or not an array')
      return []
    }
    let vrData = []
    const vrParam = {}
    if (extraFun) {
      vrData = extraFun(zhWords)
    } else {
      vrData = zhWords
    }
    if (unfoldField) {
      vrData.forEach(function (t, idx) {
        unfoldField.forEach(function (k) {
          vrParam[idx + '$$' + k] = t[k]
          if (t[k] === 0) {
            vrParam[idx + '$$' + k] = 0
          } else if (t[k] === '0') {
            vrParam[idx + '$$' + k] = '0'
          } else if (!t[k]) {
            vrParam[idx + '$$' + k] = ''
          } else if (t[k] === true) {
            vrParam[idx + '$$' + k] = 1
          }
        })
      })
    } else {
      vrData.forEach(function (t, idx) {
        for (const k in t) {
          vrParam[idx + '$$' + k] = t[k]
          if (t[k] === 0) {
            vrParam[idx + '$$' + k] = 0
          } else if (t[k] === '0') {
            vrParam[idx + '$$' + k] = '0'
          } else if (!t[k]) {
            vrParam[idx + '$$' + k] = ''
          } else if (t[k] === true) {
            vrParam[idx + '$$' + k] = 1
          }
        }
      })
    }
    wftCommon.translateService(
      vrParam,
      function (newData) {
        let newRes = []
        const resObj = {}
        if (unfoldField) {
          newRes = zhWords
          for (var k in newData) {
            var t = k.split('$$')[0]
            resObj[t] = resObj[t] || {}
            var key = k.split('$$')[1]
            newRes[t][key] = newData[k]
          }
        } else {
          for (var k in newData) {
            var t = k.split('$$')[0]
            resObj[t] = resObj[t] || {}
            var key = k.split('$$')[1]
            resObj[t][key] = newData[k]
          }
          for (var k in resObj) {
            newRes.push(resObj[k])
          }
        }
        // 这里添加针对数组的优化
        const result = wftCommon.convertArrayObjectKeys(newRes)
        successCallback(result)
      },
      function () {
        errorCallback && errorCallback()
      }
    )
  },

  replaceScript: (str) => {
    if (str) {
      str = str.replace(/\<script>/gi, '')
      str = str.replace(/\<\/script>/gi, '')
      str = str.replace(/\<a>/gi, '')
      str = str.replace(/\<\/a>/gi, '')
      str = str.replace(/\<iframe>/gi, '')
      str = str.replace(/\<\/iframe>/gi, '')
      str = str.replace(/\<form>/gi, '')
      str = str.replace(/\<\/form>/gi, '')
      str = str.replace(/\<object>/gi, '')
      str = str.replace(/\<\/object>/gi, '')
      str = str.replace(/\<embed>/gi, '')
      str = str.replace(/\<\/embed>/gi, '')
      str = str.replace(/onclick|onerror|onfocus|onload|onmouse|onkey|ontoggle|javascript|eva|document/gi, '') // 部分xss事件绕过  eva
    }
    return str
  },
  showPevcMoney: function (abstract, describe) {
    const data = abstract.amount
    if (data) {
      const unitStr = abstract.unit ? abstract.unit : ''
      if (!describe.confidence || describe.confidence == '精确值') {
        if (abstract.unit) {
          return wftCommon.formatMoney(data, [4, '万']) + unitStr
        } else {
          return wftCommon.formatMoney(data, [4, '万'])
        }
      } else if (describe.confidence == '数百万') {
        return describe.confidence + unitStr
      } else if (describe.confidence == '数') {
        const numStr = (data + '').split('.')[0] //去掉可能存在的小数后面的数字
        switch (numStr.length) {
          case 7:
            return '数百亿' + unitStr
          case 6:
            return '数十亿' + unitStr
          case 5:
            return '数亿' + unitStr
          case 4:
            return '数千万' + unitStr
          case 3:
            return '数百万' + unitStr
          case 2:
            return '数十万' + unitStr
          case 1:
            return '数万' + unitStr
          default:
            return wftCommon.formatMoney(data, [4, '万']) + unitStr
        }
      } else {
        return describe.confidence + wftCommon.formatMoney(data, [4, '万']) + unitStr
      }
    } else {
      return '--'
    }
  },
  getPageUId: function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  },
  format: function name() {
    const now = new Date()
    const year = now.getFullYear()
    const month = (now.getMonth() + 1).toString().padStart(2, '0')
    const day = now.getDate().toString().padStart(2, '0')
    return `${year}${month}${day}`
  },
  isNoToolbar: function () {
    const notoolbar = wftCommon.getUrlSearch('notoolbar')
    let parentNoToolBar = ''
    if (wftCommon.notoolbarTerminal.indexOf(wftCommon.terminalType) > -1) {
      wftCommon.isNoToolbar = function () {
        return '&notoolbar=1'
      }
      return '&notoolbar=1'
    }
    try {
      parentNoToolBar = wftCommon.getUrlSearch('notoolbar', window.opener ? window.opener.location.href : '')
    } catch (e) {
      parentNoToolBar = ''
    }
    // @ts-expect-error ttt
    if (notoolbar == 1 || parentNoToolBar == 1) {
      // 如果确定含有参数, 替换原方法
      wftCommon.isNoToolbar = function () {
        return '&notoolbar=1'
      }
      return '&notoolbar=1'
    }
    return ''
  },
  /**
   * 图谱：路径数据结构变化
   * @param 原始paths
   * @return 变更后数据结构：节点对应的path对象、关联关系路径对象、所有path对象、企业状态path对象
   */
  chartPathChange: function (paths) {
    const pathObj = {} // 所有的点对应的path对象，key为节点id
    const filterPathObj = {} // 所有的label obj,key为label, 关联关系
    const allPathObj = {} // 所有的path obj,key为pathid
    const statePathObj = {} // 所有的state obj,key为state, 企业状态

    const txtObj = {
      actctrl: '控制',
      branch: '分支机构',
      invest: '投资',
      legalrep: '法人',
      member: '高管',
      investctrl: '控股',
      relativeperson: '亲属',
      classmate: '同学',
    }

    let shortPath = []
    let shortPathRouteLength = 10000

    let pathIdx = 0
    for (var j = 0; j < paths.length; j++) {
      const nodes = paths[j].nodes
      const node = nodes[nodes.length - 1]
      const routes = paths[j].routes

      if (routes.length < shortPathRouteLength) {
        shortPathRouteLength = routes.length
        shortPath = []
        shortPath.push(paths[j])
      } else if (routes.length == shortPathRouteLength) {
        shortPath.push(paths[j])
      }

      let _p = ''
      var _rate = ''
      for (let m = 0; m < nodes.length; m++) {
        _p = _p ? _p + '|' + nodes[m].windId : nodes[m].windId
      }

      if (!allPathObj[_p]) {
        paths[j]._pathId = _p
        allPathObj[_p] = paths[j]
        paths[j]._idx = pathIdx
        pathIdx++
      }

      if (!pathObj[node.windId]) {
        pathObj[node.windId] = { arr: [], obj: {} }
        pathObj[node.windId].arr.push(nodes)
        pathObj[node.windId].obj[_p] = nodes
        pathObj[node.windId].obj[_p]._path = routes
      } else {
        pathObj[node.windId].arr.push(nodes)
        pathObj[node.windId].obj[_p] = nodes
        pathObj[node.windId].obj[_p]._path = routes
      }

      routes.forEach(function (t) {
        if (!t.startId) return
        const _routeId = t.startId + '_' + t.endId
        t._routeId = _routeId
        const types = t.relType.split('|') // invest|member

        t.filters = {}
        t.filtersWithPercent = {} // 带投资、控股比例的字段
        t.withRate = 0

        types.forEach(function (type) {
          filterPathObj[type] = filterPathObj[type] || []
          filterPathObj[type].push(paths[j])
          let txt = txtObj[type] || ''
          if (type === 'member') {
            txt = t.props.member_props.position
          }
          t.filters[type] = { show: true, txt: txt }
          t.filtersWithPercent[type] = { show: true, txt: txt }
          if (type === 'invest' || type === 'actctrl' || type === 'investctrl') {
            let p = t.props[type + '_props'].rate || ''
            t.withRate = p ? Number(p) : 0
            p = p ? wftCommon.formatPercent(p) : ''
            t.filtersWithPercent[type] = {
              show: true,
              txt: p ? txt + '(' + p + ')' : txt,
            }
          }
        })
        _rate = _rate ? _rate + '_' + t.withRate : t.withRate
      })

      nodes.forEach(function (t) {
        const id = t.windId
        if (t.nodeType !== 'company') {
          return
        }
        if (!statePathObj[id]) {
          statePathObj[id] = []
          statePathObj[id].push(paths[j])
        } else {
          statePathObj[id].push(paths[j])
        }
      })

      paths[j]._rate = _rate
    }

    let shortPathRate = null
    let shortPathFinal = null
    if (shortPath.length) {
      shortPath.forEach(function (t) {
        const r = t._rate.split ? t._rate.split('_') : ['0']
        let s = 1
        r.forEach(function (x) {
          if (x == 0) {
            s = s * 1
          } else {
            s = (s * x) / 100
          }
        })
        if (!shortPathFinal) {
          shortPathFinal = t
          shortPathRate = s
        } else {
          if (shortPathRate < s) {
            shortPathFinal = t
            shortPathRate = s
          }
        }
      })
    }
    if (shortPathFinal) {
      const sRoutes = shortPathFinal.routes
      sRoutes.forEach(function (t) {
        shortPathFinal._highPath = shortPathFinal._highPath ? shortPathFinal._highPath + '|' + t.relId : t.relId + ''
      })
    }
    return {
      pathObj: pathObj,
      filterPathObj: filterPathObj,
      allPathObj: allPathObj,
      statePathObj: statePathObj,
      highLightPath: shortPathFinal,
    }
  },

  chartApis: function (cmd) {
    // 以下的图谱接口需要进行新老id兼容处理
    const cmds = [
      'getbeneficiaryroute',
      'getentpatht',
      'getactualcontrollerroute',
      'getrelativepath',
      'getmultirelativepath',
      'getinvestpath',
      'relationpathcorps',
      'getrelationpathmulti',
      'getrelationpath',
    ]
    if (cmds.indexOf(cmd) > -1) {
      return true
    }
    return false
  },

  /**
   * 图谱点击弹出卡片事件
   * param - obj
   */
  chartCardEventHandler: function (param) {
    if (param.companyCode) {
      if (param.type == 'person' || param.companyCode.length > 15) {
      } else {
        wftCommon.linkCompany('Bu3', param.companyCode)
      }
    }
  },
  chartCardShowHandler: function (param) {
    let titles = param.title || ''
    titles = titles.split('|')
    let rootName = ''
    let rootCode = ''
    if (titles.length && titles.length > 1) {
      rootName = titles[2]
      rootCode = titles[1]
    }
    if (param.type == 'person') {
      // $('#corpListTitle').text(wftCommon.en_access_config ? intl('40513') : '人物信息');
      // window._childParams = { companyCode: param.companyCode, cardTitle: '人物信息', cardType: 'person', companyName: param.name };
      // $('.corp-list-framediv').show();
      // $('#corpListIframe').attr('src', 'chartCard.html' + location.search);
    } else if (param.type == 'company') {
      // $('#corpListTitle').text(wftCommon.en_access_config ? intl('120662') : '企业信息');
      // window._childParams = { companyCode: param.companyCode, cardTitle: '企业信息', cardType: 'company', companyName: param.name };
      // $('.corp-list-framediv').show();
      // $('#corpListIframe').attr('src', 'chartCard.html' + location.search);
      wftCommon.linkCompany('Bu3', param.companyCode)
    } else if (param.type == 'person_beneficiary') {
      // $('#corpListTitle').text(wftCommon.en_access_config ? intl('40513') : '人物信息');
      // window._childParams = { companyCode: param.companyCode, cardTitle: '人物信息', cardType: 'person_beneficiary', companyName: param.name, _rootCode: '', _rootName: '', };
      // window._childParams._rootCode = rootCode;
      // window._childParams._rootName = rootName;
      // $('.corp-list-framediv').show();
      // $('#corpListIframe').attr('src', 'chartCard.html' + location.search);
    } else if (param.type == 'company_beneficiary') {
      // $('#corpListTitle').text(wftCommon.en_access_config ? intl('120662') : '企业信息');
      // window._childParams = { companyCode: param.companyCode, cardTitle: '企业信息', cardType: 'company_beneficiary', companyName: param.name };
      // window._childParams._rootCode = rootCode;
      // window._childParams._rootName = rootName;
      // $('.corp-list-framediv').show();
      // $('#corpListIframe').attr('src', 'chartCard.html' + location.search);
      wftCommon.linkCompany('Bu3', param.companyCode)
    }
  },

  /***
   * 拍平对象数组 默认子节点 children
   * @param arr  对象数组，eg. [{name:'lxh',children:[{name:'lyx'}]}]
   * @param _node  拍平节点，默认'children'
   * @returns Array 拍平后的一维数组 eg. [{name:'lxh'},{name:'lyx'}]
   */

  flattenObjectArray: (arr, _node = 'children') => {
    if (!Array.isArray(arr)) return []
    let res = []
    for (let i = 0; i < arr.length; i++) {
      res.push(arr[i])
      if (arr[i]?.children?.length) {
        const child = wftCommon.flattenObjectArray(arr[i]?.children)
        res = res.concat(child)
      }
    }
    return res
  },
  /**
   * 预搜索
   * 需要判断当前输入框中value与ajax搜索的key是否同一个，如果不是，直接return
   */
}

export const Nodata = () => {
  return <div className="no-data">{intl('132725', '暂无数据')}</div>
}

export function sendVerifyCode(phone) {
  return axios
    .request({
      url: `/baifen-api/marketing/verify/code/send`,
      method: 'POST',
      data: { phone: phone },
    })
    .then((res) => !!res)
}

export function submitApplyMessage(name, companyName, phone, verifyCode) {
  return axios.request({
    url: `/baifen-api/marketing/trial/account/apply`,
    method: 'POST',
    data: {
      name: name,
      companyName: companyName,
      phone: phone,
      verifyCode,
      model: '网点拓客',
    },
  })
}

export function getUserInfo() {
  let userInfo = {}

  if (window.external && window.external.ClientFunc) {
    const info = window.external?.ClientFunc?.(
      JSON.stringify({
        func: 'querydata',
        isGlobal: '1',
        name: 'terminaluserinfo',
      })
    )
    if (typeof info === 'string' || typeof info === 'object') {
      userInfo = JSON.parse(info)
    } else {
      console.error('client func get user info error', info)
    }
  }

  return userInfo
}
