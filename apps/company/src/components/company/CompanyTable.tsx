import { createRequest } from '@/api/request.ts'
import { listDetailConfig } from '@/components/company/listDetailConfig.tsx'
import { CorpTableModelNum } from '@/components/company/table/ModelNumComp.tsx'
import { getCorpModuleNum } from '@/handle/corp/basicNum/handle.tsx'
import { downLoadCorpExcel } from '@/handle/corp/download.ts'
import { handleAnnouncementCommentAndCountNum } from '@/handle/corpModuleCfg'

import { LinksModule } from '@/handle/link'
import { CorpBasicNumFront } from '@/types/corpDetail/basicNum.ts'
import { CompanyTableSelectOptions, CorpTableCfg } from '@/types/corpDetail/index.ts'
import { zh2en } from '@/utils/intl/zh2enFlattened.ts'
import { DownloadO, InfoCircleO } from '@wind/icons'
import { Button, Card, Checkbox, Input, Select, Tooltip } from '@wind/wind-ui'
import Table from '@wind/wind-ui-table'
import { Cascader, ConfigProvider } from 'antd'
import enUS from 'antd/locale/en_US'
import zhCN from 'antd/locale/zh_CN'
import { multiTabIds } from 'gel-util/corpConfig'
import { isLinkSourceF9 } from 'gel-util/env'
import { isEn } from 'gel-util/intl'
import { isEqual, isString } from 'lodash'
import React, { ComponentProps, FC, ReactNode, useEffect, useMemo, useState } from 'react'
import { getCorpModuleInfo, getCorpModuleInfoFromRisk } from '../../api/companyApi'
import { pointBuriedByModule } from '../../api/pointBuried/bury'
import LongTxtLabel from '../../components/LongTxtLabel'
import DetailTable from '../../components/table/detailTable'
import { useTableAggregationApi } from '../../handle/table/aggregation/api.ts'
import { useTranslateService } from '../../hook'
import global from '../../lib/global'
import { VipPopup } from '../../lib/globalModal'
import { getVipInfo } from '../../lib/utils'
import intl, { translateService, translateToEnglish } from '../../utils/intl'
import { wftCommon } from '../../utils/utils'
import Links from '../common/links/Links.tsx'
import { InfoCircleButton } from '../icons/InfoCircle/index.tsx'
import Products from '../selectbleTag'
import SmartHorizontalTable from '../table/SmartHorizontalTable'

//  这个样式比较重要 ... 不能删除，后续清洗优化吧
import { getIfBondCorpByBasicNum, getIfIPOCorpByBasicNum } from '@/domain/corpDetail/index.ts'
import { ApiCodeForWfc } from 'gel-api'
import { TCorpDetailSubModule } from 'gel-types'
import { ErrorBoundary } from 'gel-ui'
import '../table/table.less'
import { CompanyVipCard } from './auth/CompanyVipCard.tsx'
import './style/CompanyTable.less'
import { CorpTableAggregation, useCorpTableAggApiCmd } from './table/aggregation'
import { CompanyTableRightSelect } from './table/aggregation/select.tsx'
import { handleCompanyTableRightSelect } from './table/aggregation/util.ts'
import { getTableLocale } from './table/handle.ts'
import { CompanyTechScore } from './techScore/CompanyTechScore'
import VipModule from './VipModule.tsx'

const { Search } = Input
const { HorizontalTable } = Table
const Option = Select.Option

const GqctChartComp = () => React.lazy(() => import('./ShareAndInvest'))

const WCBChartComp = () => React.lazy(() => import('./WcbChartDiv'))

/**
 *
 * @param data
 * @param domRef {MutableRefObject<HTMLElement>}
 * @param eachTableKey
 * @returns {[undefined]|[*]}
 */
const useCompanyTableIntl = (data, eachTableKey) => {
  const ifNeedTranslate = useMemo(() => {
    // 对这些模块做翻译，对别的不敢开这个，需要详细测试
    return ['showControllerCompany', 'showCompanyChange', 'gatpatent-0', 'historycompany', 'showIndustry'].includes(
      eachTableKey
    )
  }, [eachTableKey])
  const ifComplexHtml = useMemo(() => {
    return ['showCompanyChange', 'showIndustry'].includes(eachTableKey)
  }, [eachTableKey])

  const [dataIntl] = useTranslateService(data, ifNeedTranslate, ifComplexHtml)

  if (ifNeedTranslate) {
    return [dataIntl]
  } else {
    return [data]
  }
}

type Props = {
  title: ReactNode
  eachTableKey: string
  eachTable: CorpTableCfg
  singleModuleId: string
  ready: boolean
  basicNum: CorpBasicNumFront
  corpNameIntl?: string
}
const CompanyTable: FC<Props> = ({ title, eachTableKey, eachTable, singleModuleId, ready, basicNum, corpNameIntl }) => {
  const [result, setResult] = useState([])
  const [chartData, setChartData] = useState({})
  const [pageNo, setPageNo] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = eachTable.pageSize || 10
  const companycode = eachTable.ajaxExtras.companycode
  const companyid = eachTable.ajaxExtras.companyid
  const riskUseCompanyCode =
    eachTable.ajaxExtras.companycode?.length > 10
      ? eachTable.ajaxExtras.companycode?.slice(2, 12)
      : eachTable.ajaxExtras?.companycode
  const [selOption, setSelOption] = useState<CompanyTableSelectOptions | null>(null)
  const [cascaderOption, setCascaderOption] = useState([])
  const [dataLoaded, setDataLoaded] = useState(false)
  // 初始化筛选项值
  const initselOptionValue: string[] = []
  if (eachTable && eachTable.rightFilters && eachTable.rightFilters.length) {
    for (let i = 0; i < eachTable.rightFilters.length; i++) {
      const val = eachTable.rightFilters && eachTable.rightFilters[i]?.name
      initselOptionValue.push(val || '')
    }
  }

  const [allSelOption, setAllSelOption] = useState<CompanyTableSelectOptions | null>(null) // 记录初始所有筛选项列表
  const [selOptionValue, setSelOptionValue] = useState<string[]>(initselOptionValue)

  const [hisBasicInfoList, setHisBasicInfoList] = useState([]) // 历史工商信息模块
  const [hisBasicInfoListIntl] = useTranslateService(hisBasicInfoList) // 历史工商信息模块
  const [hisBasicInfoColumn, setHisBasicInfoColumn] = useState([])

  const [businessScope, setBusinessScope] = useState('')

  const [expandDetailData, setExpandDetailData] = useState({})

  const [ajaxExtras, setAjaxExtra] = useState({ ...eachTable.ajaxExtras })

  let expandDetail = listDetailConfig[eachTableKey] || null

  if (eachTableKey == 'showguarantee' && getIfIPOCorpByBasicNum(basicNum) && getIfBondCorpByBasicNum(basicNum)) {
    expandDetail = listDetailConfig['showguaranteeNotMarket'] || null
  }

  const [bidInfo, setBidInfo] = useState(null) // 招标信息
  const [tidInfo, setTidInfo] = useState(null) // 投标信息
  const [products, setProducts] = useState([]) // 产品词信息

  const [selectedTags, setSelectedTags] = useState([])

  const [keyword, setKeyword] = useState('') // 搜索框的value

  const [expandedRowKeys, setExpandedRowKeys] = useState([])

  const [selectPenetrationType, setSelectPenetrationType] = useState(1) // 股东穿透tab选中
  const [penetrationColumns, setPenetrationColumns] = useState(eachTable.columns) // 不同列
  const [penetrationInputVal, setPenetrationInputVal] = useState<number | string>(0) // 股权穿透持股比例input值

  const [resultIntl] = useCompanyTableIntl(result, eachTableKey)

  /** 只针对发行股票 */
  const [shareRemark, setShareRemark] = useState(null)

  const locale = getTableLocale(dataLoaded)

  /**
   * 聚合接口独立后存的用户筛选值
   */
  const [searchFilter, setSearchFilter] = useState({})

  const userVipInfo = getVipInfo()
  let selOptionIndex = 0 // 记录当前选中筛选项组的idx

  const isBid = eachTableKey.indexOf('biddingInfo') > -1 || eachTableKey.indexOf('tiddingInfo') > -1

  const aggApiCmd = useCorpTableAggApiCmd(eachTable.searchOptionApi, companycode)
  const { aggData, apiExecute: aggApiExecute } = useTableAggregationApi(
    aggApiCmd,
    searchFilter,
    eachTable.searchOptionDataType
  )

  // 是否来自 F9单独模块访问（走f9的fuse和权限控制逻辑，如股权穿透图）
  const linkSourceF9 = isLinkSourceF9()
  // 注意，如果来自 F9单独模块访问，则不走普通fuse和权限控制逻辑，此模块访问需要满足2个条件
  // 1. 配置f9cmd (无cmd配置的模块如股权穿透图，则直接判断linkSourceF9)
  // 2. 来自 F9单独模块访问（目前通过url参数  linksource=f9 标识）
  const linkSourceF9ModuleAccess = linkSourceF9 && eachTable.f9cmd ? true : false
  if (linkSourceF9ModuleAccess) {
    eachTable.cmd = eachTable.f9cmd
    eachTable.notVipTitle = ''
    eachTable.notVipTips = ''
  }

  useEffect(() => {
    // if (!ready) return 如果加了会出现拿不到的情况，很吃屎
    if (isString(aggApiCmd) && aggApiCmd !== '') {
      aggApiExecute()
    }
    // }, [searchFilter, ready])
  }, [searchFilter])

  // 适配有数组的接AI翻译 arrKey数组字段，strkey1，strkey2，strkey3数组字段的参数
  const promiseArrzh2en = (data, arrKey, strkey1?, strkey2?, strkey3?) => {
    return new Promise((resolve) => {
      let typeofArrisStr
      data &&
        data.length &&
        data.map((t) => {
          t[arrKey] &&
            t[arrKey].length &&
            t[arrKey].map((tt, idx) => {
              if (typeof tt == 'string') {
                t[idx] = tt
                typeofArrisStr = true
              } else {
                strkey1 && (t[strkey1 + idx] = tt[strkey1])
                strkey2 && (t[strkey2 + idx] = tt[strkey2])
                strkey3 && (t[strkey3 + idx] = tt[strkey3])
              }
            })
          t['_roleLength'] = t[arrKey] ? t[arrKey].length : 0
          delete t[arrKey]
        })
      if (!eachTable.noTranslate) {
        translateToEnglish(data).then((res) => {
          if (!res.success) {
            resolve(data)
            return
          }
          const dataTransed = res.data
          dataTransed.map((t) => {
            t[arrKey] = []
            if (t['_roleLength'] > 0) {
              for (let i = 0; i < t['_roleLength']; i++) {
                if (typeofArrisStr) {
                  t[arrKey].push(t[i])
                } else {
                  const tt = {}
                  strkey1 && (tt[strkey1] = t[strkey1 + i])
                  strkey2 && (tt[strkey2] = t[strkey2 + i])
                  strkey3 && (tt[strkey3] = t[strkey3 + i])
                  t[arrKey].push(tt)
                }
              }
            }
          })
          resolve(dataTransed)
        })
      }
    })
  }

  const drawBarChart = (extra) => {
    let params = { companycode, ...ajaxExtras }
    delete params.windcode
    delete params.windCode
    delete params.companyid
    params = eachTable.chartParams ? eachTable.chartParams(params) : params
    if (extra) {
      params = { ...params, ...extra }
    }
    const businessIndexEn = params.businessIndex_en
    delete params.businessIndex_en
    getCorpModuleInfo(eachTable.chartCmd, { ...params })
      .then((res) => {
        if (res && res.code === global.SUCCESS) {
          const barData = []
          res.Data.map((t) => {
            const obj = {}
            Object.defineProperty(obj, t.time, {
              value: t.value,
              enumerable: true,
            })
            barData.push(obj)
          })

          const data = {
            config: {
              title: {
                show: true,
                fontSize: '12px',
              },
              yAxis: {
                '0:0-yAxis-0': {
                  isCopied: false, // 只展示一侧坐标轴
                },
              },
            },
            indicators: [
              {
                meta: {
                  name: window.en_access_config ? businessIndexEn : params.businessIndex,
                  type: 'bar',
                },
                data: barData,
              },
            ],
          }
          setChartData(data)
        }
      })
      .catch(() => {})
  }

  eachTable.chartCallback = (row) => {
    if (window.en_access_config) {
      drawBarChart({
        businessIndex: row._businessIndex,
        frequency: row._frequency,
        businessIndex_en: row.businessIndex,
      })
    } else {
      drawBarChart({
        businessIndex: row.businessIndex,
        frequency: row.frequency,
      })
    }
  }

  const pageProps = {
    current: pageNo,
    pageSize: pageSize,
    total: total > 5000 ? 5000 : total,
    onChange: (page) => pageChange(page),
    hideOnSinglePage: false,
    showSizeChanger: false,
    showQuickJumper: true,
  }

  const pageChange = (page) => {
    if (!userVipInfo.isSvip && !userVipInfo.isVip && !linkSourceF9ModuleAccess) {
      VipPopup()
      return
    }
    setPageNo(page)
    setExpandedRowKeys([])
  }

  const fetchRiskModuleData = (params) => {
    setDataLoaded(false)
    getCorpModuleInfoFromRisk(eachTable.cmd, { ...params }, eachTable.apiSource)
      .then((res) => {
        if (!window.en_access_config) {
          setDataLoaded(true)
        }
        if (res && res.code == global.SUCCESS) {
          const total = res.data.total
          if (res.data) {
            if (eachTable.dataCallback) {
              res.data = eachTable.dataCallback(res.data, basicNum, params.pageNum ? params.pageNum - 1 : 0)
            }
          }

          const dataCall = (endata) => {
            if (!dataLoaded) {
              setDataLoaded(true)
            }
            res.data = endata
            res.data.forEach((t, index) => {
              const pagenum = params.pageNum ? params.pageNum - 1 : 0
              const pagesize = params.pageSize || 10
              if (!t.hasOwnProperty('NO.')) {
                t['NO.'] = index + pagenum * pagesize + 1
              }
            })
            setResult(res.data || [])
            setTotal(total)
          }

          if (!res.data.length) {
            setResult([])
            setTotal(total)
            if (isEn()) {
              setDataLoaded(true)
            }
          } else {
            if (isEn()) {
              zh2en(
                res.data,
                (endata) => {
                  setDataLoaded(true)
                  dataCall(endata)
                },
                null,
                () => {
                  setDataLoaded(true)
                }
              )
            } else {
              dataCall(res.data)
            }
          }
        } else {
          if (window.en_access_config) {
            setDataLoaded(true)
          }
        }
      })
      .catch(() => {
        setDataLoaded(true)
      })
  }

  const renderHistory = (res) => {
    if (!Object.entries(res).length) return
    const data = []
    const hisregistercaptical = res.hisregistercaptical
    const hisbusinessscope = res.hisbusinessscope
    const histel = res.histel
    const hisaddress = res.hisaddress
    const hisemail = res.hisemail
    const types = {}

    let endIdx = 0

    if (hisregistercaptical && hisregistercaptical.length) {
      hisregistercaptical.map((t) => {
        data.push({
          type: intl('469522', '历史注册资本'),
          date: wftCommon.formatTime(t.deadline),
          info: wftCommon.formatMoney(t.content, [4, '万元']),
        })
      })
      types[data[data.length - 1].type] = [0, hisregistercaptical.length - 1]
      endIdx = hisregistercaptical.length
    }
    if (hisbusinessscope && hisbusinessscope.length) {
      hisbusinessscope.map((t) => {
        data.push({
          type: intl('469501', '历史经营范围'),
          date: wftCommon.formatTime(t.deadline),
          info: t.content,
        })
      })
      types[data[data.length - 1].type] = [endIdx, endIdx + hisbusinessscope.length - 1]
      endIdx = hisbusinessscope.length + endIdx
    }
    if (histel && histel.length) {
      histel.map((t) => {
        data.push({
          type: '历史联系电话',
          date: wftCommon.formatTime(t.deadline),
          info: t.content,
        })
      })
      types[data[data.length - 1].type] = [endIdx, endIdx + histel.length - 1]
      endIdx = hisbusinessscope.length + endIdx
    }
    if (hisaddress && hisaddress.length) {
      hisaddress.map((t) => {
        data.push({
          type: intl('469523', '历史联系地址'),
          date: wftCommon.formatTime(t.deadline),
          info: t.content,
        })
      })
      types[data[data.length - 1].type] = [endIdx, endIdx + hisaddress.length - 1]
      endIdx = hisbusinessscope.length + endIdx
    }
    if (hisemail && hisemail.length) {
      hisemail.map((t) => {
        data.push({
          type: '历史邮箱',
          date: wftCommon.formatTime(t.deadline),
          info: t.content,
        })
      })
      types[data[data.length - 1].type] = [endIdx, endIdx + hisemail.length - 1]
      endIdx = hisbusinessscope.length + endIdx
    }

    const columns = [
      {
        title: intl('203850', '类别'),
        width: '25%',
        dataIndex: 'type',
        render: (text, _row, index) => {
          const obj: any = {
            children: text,
            props: {},
          }
          const matchs = types[text]
          if (matchs) {
            if (matchs[0] == index) {
              obj.props.rowSpan = matchs[1] - matchs[0] + 1
            } else if (index > matchs[0] && index <= matchs[1]) {
              obj.props.rowSpan = 0
            } else {
              const idx = index + matchs[0]
              if (matchs[0] == idx) {
                obj.props.rowSpan = matchs[1] - matchs[0] + 1
              } else if (idx > matchs[0] && idx <= matchs[1]) {
                obj.props.rowSpan = 0
              }
            }
          }
          return obj
        },
      },
      {
        title: intl('19528', '时间'),
        width: '20%',
        dataIndex: 'date',
        render: (text) => {
          const obj = {
            children: text,
            props: {},
          }
          return obj
        },
      },
      {
        title: intl('31887', '信息'),
        width: '55%',
        dataIndex: 'info',
        render: (text) => {
          const obj: any = {
            children: <LongTxtLabel txt={text}></LongTxtLabel>,
            props: {},
          }
          if (!text) {
            obj.children = '--'
          }
          if (text.length < 50) {
            obj.children = text
          }
          return obj
        },
      },
    ]
    setHisBasicInfoColumn(columns)
    setHisBasicInfoList(data)
    setDataLoaded(true)
  }

  const expandedRowRender = (record, index) => {
    const itemKey = expandDetail.itemKey
    const rowKey = expandDetail.rowKey
    const rows = []
    let item = []
    const detailDataCallSet = (data) => {
      const result = { ...expandDetailData }
      Object.defineProperty(result, record.key, {
        value: data,
        enumerable: true,
      })
      setExpandDetailData(result)
    }

    if (eachTableKey == 'selectList') {
      if (!expandDetailData[record.key]) {
        const param = expandDetail.extraParams(record, {
          companycode,
          companyid,
        })
        getCorpModuleInfo(expandDetail.cmd + '/' + companycode, param).then((res) => {
          const data = res.data ? res.data.list : []
          if (data && data.length) {
            if (window.en_access_config) {
              zh2en(data, (endata) => {
                detailDataCallSet(endata)
              })
              return
            }
          }
          detailDataCallSet(data)
        })
      }
      let itemKey2 = []

      // 名录详情
      switch (record.objectId) {
        case '2010202098': // 高新技术企业
          itemKey2 = [
            {
              title: intl('478578', '有效期起始日'),
              dataIndex: 'originDate',
              render: (txt) => {
                return wftCommon.formatTime(txt)
              },
            },
            {
              title: intl('390613', '有效期到期日'),
              dataIndex: 'expireDate',
              render: (txt) => {
                return wftCommon.formatTime(txt)
              },
            },
          ]
          break
        case '2010202479': // 科技小巨人
        case '2010202476': // 创新型企业
        case '2010202481': // 民营科技企业
        case '2010202480': // 技术先进型服务企业
        case '2010202478': // 雏鹰企业
        case '2010202501': // 创建世界一流专精特新示范企业
        case '2010202500': // 创建世界一流示范企业
        case '2010202505': // 重点专精特新小巨人企业
          itemKey2 = [
            {
              title: intl('232873', '认定级别'),
              dataIndex: 'recognitionLevel',
            },
            {
              title: intl('478597', '认证年度'),
              dataIndex: 'certificationYear',
            },
          ]
          break
        case '2010202470': // 科技型中小企业
          itemKey2 = [
            {
              title: intl('478597', '认证年度'),
              dataIndex: 'certificationYear',
            },
            {
              title: intl('478578', '有效期起始日'),
              dataIndex: 'originDate',
              render: (txt) => {
                return wftCommon.formatTime(txt)
              },
            },
            {
              title: intl('390613', '有效期到期日'),
              dataIndex: 'expireDate',
              render: (txt) => {
                return wftCommon.formatTime(txt)
              },
            },
          ]
          break
        case '2010100370': // 专精特新小巨人企业
        case '2010202471': // 专精特新企业
          itemKey2 = [
            {
              title: intl('232873', '认定级别'),
              dataIndex: 'recognitionLevel',
            },
            {
              title: intl('478597', '认证年度'),
              dataIndex: 'certificationYear',
            },
            {
              title: intl('478578', '有效期起始日'),
              dataIndex: 'originDate',
              render: (txt) => {
                return wftCommon.formatTime(txt)
              },
            },
            {
              title: intl('390613', '有效期到期日'),
              dataIndex: 'expireDate',
              render: (txt) => {
                return wftCommon.formatTime(txt)
              },
            },
          ]
          break
        case '2010202499': // 科改企业
        case '2010202498': // 双百企业
          itemKey2 = [
            {
              title: intl('232873', '认定级别'),
              dataIndex: 'recognitionLevel',
            },
          ]
          break
        case '2010000007': // 上市企业
          itemKey2 = [
            {
              title: intl('451227', '股票简称'),
              dataIndex: 'stockAbbreviation',
            },
            { title: intl('6440', '股票代码'), dataIndex: 'stockCode' },
            {
              title: intl('451211', '上市板块'),
              dataIndex: 'listingSector',
            },
            { title: intl('451228', '交易所'), dataIndex: 'exchange' },
            {
              title: intl('111024', '上市日期'),
              dataIndex: 'listingDate',
              render: (txt) => {
                return wftCommon.formatTime(txt)
              },
            },
          ]
          break
        case '2010202489': // 中华老字号
          itemKey2 = [{ title: intl('138560', '商标名'), dataIndex: 'remarks' }]
          break
        case '2010100013': // 独角兽企业
        case '2010202477': // 隐形冠军企业
          itemKey2 = [
            {
              title: intl('478597', '认证年度'),
              dataIndex: 'certificationYear',
            },
          ]
          break
        case '2010100369': // 制造业单项冠军企业
          itemKey2 = [
            { title: intl('15433', '项目类型'), dataIndex: 'itemType' },
            {
              title: intl('478597', '认证年度'),
              dataIndex: 'certificationYear',
            },
          ]
          break
        case '2010202497': // 全国碳排放权交易配额管理企业
          itemKey2 = [{ title: intl('478579', '名录公示行业'), dataIndex: 'remarks' }]
          break
        case '2010202507': // 联合国责任投资原则组织国内企业
        case '2010202506': // 联合国责任投资原则组织全球
          itemKey2 = [
            {
              title: intl('21772', '起始日期'),
              dataIndex: 'originDate',
              render: (txt) => {
                return wftCommon.formatTime(txt)
              },
            },
          ]
          break
      }
      return <DetailTable columns={itemKey2} dataSource={expandDetailData[record.key]} />
    }

    !expandDetail.notHorizontal &&
      itemKey &&
      itemKey.map((t, idx) => {
        // 这里对详情字段做每行只展示2列处理，如有特殊处理，请单独安排调整
        if (item.length > 1 || Array.isArray(t)) {
          rows.push([...item])
          item = []
        }
        // 如果传的是数组，则单行展示
        if (Array.isArray(t)) {
          item.push({
            title: t[0] || '',
            dataIndex: rowKey[idx].split('|')[0],
            colSpan: 5,
            render: (txt, row) => {
              if (expandDetail.columns && expandDetail.columns.length && expandDetail.columns[idx]) {
                return expandDetail.columns[idx].render(row, txt)
              }
              if (rowKey[idx].split('|').length > 1) {
                // 格式
                return wftCommon[rowKey[idx].split('|')[1]](txt)
              }
              return wftCommon.formatCont(String(txt))
            },
          })
        } else {
          item.push({
            title: t,
            dataIndex: rowKey[idx].split('|')[0],
            colSpan: 2,
            render: (txt, row) => {
              if (expandDetail.columns && expandDetail.columns.length && expandDetail.columns[idx]) {
                return expandDetail.columns[idx].render(row, txt)
              }
              if (rowKey[idx].split('|').length > 1) {
                // 格式
                return wftCommon[rowKey[idx].split('|')[1]](txt)
              }
              return wftCommon.formatCont(String(txt))
            },
          })
        }
        if (idx == itemKey.length - 1) {
          if (itemKey.length % 2) {
            // 正好是奇数个字段，则最后一个字段单独展示
            item[item.length - 1].colSpan = 5
          }
          rows.push([...item])
        }
      })
    if (!expandDetailData[record.key]) {
      if (expandDetail.cmd) {
        const param = expandDetail.extraParams(record, {
          companycode,
          companyid,
        })
        const isRestfulApi = expandDetail.cmd.indexOf('/') > -1
        const url = isRestfulApi ? expandDetail.cmd + '/' + companycode : expandDetail.cmd
        // todo 紧急任务，暂时为了解决掉两次接口的问题 resolved by calvin
        if (window.COMPANY_TABLE_DETAIL_TIMER) return
        window.COMPANY_TABLE_DETAIL_TIMER = true
        setTimeout(() => {
          window.COMPANY_TABLE_DETAIL_TIMER = false
        }, 200)

        getCorpModuleInfo(url, param).then((res) => {
          if (!res) return
          let data = {}
          if (expandDetail.dataCallback) {
            data = expandDetail.dataCallback(res)
          } else {
            data = res.data
          }
          if (data) {
            if (window.en_access_config) {
              if (data instanceof Array) {
                zh2en(data, (endata) => {
                  detailDataCallSet(endata)
                })
              } else {
                translateService(data, (endata) => {
                  detailDataCallSet(endata)
                })
              }
              return
            }
          }
          detailDataCallSet(data || {})
        })
      } else {
        // 直接从list中读取数据进行detail展示
        // let result = {...expandDetailData};
        // Object.defineProperty(result, record.key, {
        //     value: record,
        //     enumerable: true,
        // })
        // setExpandDetailData(result);
        detailDataCallSet(record)
      }
    }
    if (expandDetail.notHorizontal) {
      return <DetailTable columns={expandDetail.itemKey} dataSource={expandDetailData[record.key]} />
    } else {
      if (expandDetail.cmd === 'getmergerinfo') {
        const arrIndex = Object.keys(expandDetailData)[0] || 0
        //横版table中rows的格式对比竖版要多嵌套一层数组
        return (
          <HorizontalTable
            bordered={'default'}
            className=""
            loading={false}
            title={expandDetail.title || null}
            rows={[expandDetail.itemKey]}
            dataSource={Object.keys(expandDetailData).length !== 0 ? [expandDetailData[arrIndex][index]] : [[]]}
            data-uc-id="3V-nHEqpYy"
            data-uc-ct="horizontaltable"
          ></HorizontalTable>
        )
      } else if (
        expandDetail.cmd === 'getstockpledgees' ||
        expandDetail.cmd === 'getstockplexes' ||
        expandDetail.cmd === 'getstockpledgers'
      ) {
        return (
          <HorizontalTable
            bordered={'default'}
            className=""
            loading={false}
            title={expandDetail.title || null}
            rows={rows}
            dataSource={
              expandDetailData[record.key] ? expandDetailData[record.key][index] : expandDetailData[record.key]
            }
            data-uc-id="KxKStg7a3C"
            data-uc-ct="horizontaltable"
          ></HorizontalTable>
        )
      } else if (expandDetail.cmd == 'getlandannsdetail') {
        // 地块公示
        const itemKey1 = expandDetail.itemKey1
        const rowKey1 = expandDetail.rowKey1
        const rows1 = []
        let item1 = []
        const itemKey2 = expandDetail.itemKey2
        const rowKey2 = expandDetail.rowKey2
        let item2 = []

        itemKey1.map((t, idx) => {
          // 这里对详情字段做每行只展示2列处理，如有特殊处理，请单独安排调整
          if (item1.length > 1) {
            rows1.push([...item1])
            item1 = []
          }
          item1.push({
            title: t,
            dataIndex: rowKey1[idx].split('|')[0],
            colSpan: 2,
            align: 'left',
            render: (txt, row) => {
              if (rowKey1[idx] == 'annStart') {
                const startTime = row.annStart ? wftCommon.formatTime(row.annStart) : '--' //开始时间
                const endTime = row.annEnd ? wftCommon.formatTime(row.annEnd) : '--' //结束时间
                return !row.annStart && !row.annEnd ? '--' : startTime + ' 至 ' + endTime
              }
              if (rowKey1[idx].split('|').length > 1) {
                // 格式
                return wftCommon[rowKey1[idx].split('|')[1]](txt)
              }
              return wftCommon.formatCont(String(txt))
            },
          })
          if (idx == itemKey1.length - 1) {
            if (itemKey1.length % 2) {
              // 正好是奇数个字段，则最后一个字段单独展示
              item1[item.length - 1].colSpan = 5
            }
            rows1.push([...item1])
          }
        })

        if (expandDetail.cmd == 'getlandannsdetail') {
          item1 = []
          item1.push({
            title: intl('205943', '意见反馈方式'),
            dataIndex: 'feedbackMth',
            colSpan: 5,
            align: 'left',
            render: (txt) => {
              return wftCommon.formatCont(String(txt))
            },
          })
          rows1.push(item1)
          item1 = []
          item1.push({
            align: 'left',
            title: intl('203750', '备注'),
            dataIndex: 'comment',
            colSpan: 5,
            render: (txt) => {
              return wftCommon.formatCont(String(txt))
            },
          })
          rows1.push(item1)
          item1 = []
          item1.push({
            title: intl('90845', '公告标题'),
            dataIndex: 'annTitle',
            colSpan: 5,
            render: (txt) => {
              return wftCommon.formatCont(String(txt))
            },
          })
          item1.push({
            title: intl('199999', '项目名称'),
            dataIndex: 'projName',
            colSpan: 5,
            align: 'left',
            render: (txt) => {
              return wftCommon.formatCont(String(txt))
            },
          })
          item1.push({
            title: intl('205434', '地块位置'),
            dataIndex: 'landLoc',
            colSpan: 5,
            render: (txt) => {
              return wftCommon.formatCont(String(txt))
            },
          })
          item1.reverse()
          item1.map((t) => {
            rows1.unshift([t])
          })
        }
        if (expandDetail.cmd == 'getlandpurchasedetail') {
          item1.push({
            title: intl('199999', '项目名称'),
            dataIndex: 'projName',
            colSpan: 5,
            align: 'left',
            render: (txt) => {
              return wftCommon.formatCont(String(txt))
            },
          })
          item1.push({
            title: intl('205434', '地块位置'),
            dataIndex: 'projPos',
            colSpan: 5,
            align: 'left',
            render: (txt) => {
              return wftCommon.formatCont(String(txt))
            },
          })
          item1.reverse()
          item1.map((t) => {
            rows1.unshift([t])
          })
        }
        itemKey2.map((t, idx) => {
          // 这里对详情字段做每行只展示2列处理，如有特殊处理，请单独安排调整
          if (item2.length > 1) {
            rows1.push([...item2])
            item2 = []
          }
          item2.push({
            title: t,
            dataIndex: rowKey2[idx].split('|')[0],
            colSpan: 2,
            align: 'left',
            render: (txt) => {
              if (rowKey2[idx].split('|').length > 1) {
                // 格式
                return wftCommon[rowKey2[idx].split('|')[1]](txt)
              }
              return wftCommon.formatCont(String(txt))
            },
          })
          if (idx == itemKey2.length - 1) {
            if (itemKey2.length % 2) {
              // 正好是奇数个字段，则最后一个字段单独展示
              item2[item.length - 1].colSpan = 5
            }
            rows1.push([...item2])
          }
        })
        return (
          <>
            <HorizontalTable
              bordered={'default'}
              className=""
              loading={false}
              rows={rows1}
              dataSource={expandDetailData[record.key]}
              data-uc-id="RAhlAou_Yk"
              data-uc-ct="horizontaltable"
            ></HorizontalTable>
          </>
        )
      } else if (expandDetail.cmd == 'getillegaltaxdetail') {
        // 税收违法
        const itemKey1 = expandDetail.itemKey1
        const rowKey1 = expandDetail.rowKey1
        const rows1 = []
        let item1 = []
        const itemKey2 = expandDetail.itemKey2
        const rowKey2 = expandDetail.rowKey2
        const rows2 = []
        let item2 = []
        const itemKey3 = expandDetail.itemKey3
        const rowKey3 = expandDetail.rowKey3
        const rows3 = []
        let item3 = []

        itemKey1.map((t, idx) => {
          // 这里对详情字段做每行只展示2列处理，如有特殊处理，请单独安排调整
          if (item1.length > 1) {
            rows1.push([...item1])
            item1 = []
          }
          item1.push({
            title: t,
            dataIndex: rowKey1[idx].split('|')[0],
            colSpan: 2,
            align: 'left',
            render: (txt) => {
              if (rowKey1[idx].split('|').length > 1) {
                // 格式
                return wftCommon[rowKey1[idx].split('|')[1]](txt)
              }
              return wftCommon.formatCont(String(txt))
            },
          })
          if (idx == itemKey1.length - 1) {
            if (itemKey1.length % 2) {
              // 正好是奇数个字段，则最后一个字段单独展示
              item1[item1.length - 1].colSpan = 5
            }
            rows1.push([...item1])
          }
        })

        itemKey2.map((t, idx) => {
          // 这里对详情字段做每行只展示2列处理，如有特殊处理，请单独安排调整
          if (item2.length > 1) {
            rows2.push([...item2])
            item2 = []
          }
          item2.push({
            title: t,
            dataIndex: rowKey2[idx].split('|')[0],
            colSpan: 2,
            align: 'left',
            render: (txt) => {
              if (rowKey2[idx].split('|').length > 1) {
                // 格式
                return wftCommon[rowKey2[idx].split('|')[1]](txt)
              }
              return wftCommon.formatCont(String(txt))
            },
          })
          if (idx == itemKey2.length - 1) {
            if (itemKey2.length % 2) {
              // 正好是奇数个字段，则最后一个字段单独展示
              item2[item2.length - 1].colSpan = 5
            }
            rows2.push([...item2])
          }
        })
        itemKey3.map((t, idx) => {
          // 这里对详情字段做每行只展示2列处理，如有特殊处理，请单独安排调整
          if (item3.length > 1) {
            rows3.push([...item3])
            item3 = []
          }
          item3.push({
            title: t,
            dataIndex: rowKey3[idx].split('|')[0],
            colSpan: 2,
            align: 'left',
            render: (txt) => {
              if (rowKey3[idx].split('|').length > 1) {
                // 格式
                return wftCommon[rowKey3[idx].split('|')[1]](txt)
              }
              return wftCommon.formatCont(String(txt))
            },
          })
          if (idx == itemKey3.length - 1) {
            if (itemKey3.length % 2) {
              // 正好是奇数个字段，则最后一个字段单独展示
              item3[item3.length - 1].colSpan = 5
            }
            rows3.push([...item3])
          }
        })
        return (
          <>
            <div style={{ padding: '5px 0 5px 0' }}>{intl('138480', '注册信息')}</div>
            <HorizontalTable
              bordered={'default'}
              className=""
              loading={false}
              rows={rows1}
              dataSource={expandDetailData[record.key]}
              data-uc-id="NyZB5PcsZv"
              data-uc-ct="horizontaltable"
            ></HorizontalTable>
            <div style={{ padding: '5px 0 5px 0' }}>{intl('478598', '案件信息')}</div>
            <HorizontalTable
              bordered={'default'}
              className=""
              loading={false}
              rows={rows2}
              dataSource={expandDetailData[record.key]}
              data-uc-id="qDiSv6P7oT"
              data-uc-ct="horizontaltable"
            ></HorizontalTable>
            <div style={{ padding: '5px 0 5px 0' }}>{intl('478599', '相关人员及公司')}</div>
            <HorizontalTable
              bordered={'default'}
              className=""
              loading={false}
              rows={rows3}
              dataSource={expandDetailData[record.key]}
              data-uc-id="qcj1qNlDd7"
              data-uc-ct="horizontaltable"
            ></HorizontalTable>
          </>
        )
      } else {
        if (expandDetail.cmd == 'getlandpurchasedetail') {
          // 购地信息
          item = []
          item.push({
            title: intl('199999', '项目名称'),
            dataIndex: 'projName',
            colSpan: 5,
            align: 'left',
            render: (txt) => {
              return wftCommon.formatCont(String(txt))
            },
          })
          item.push({
            title: intl('205434', '地块位置'),
            dataIndex: 'projPos',
            colSpan: 5,
            align: 'left',
            render: (txt) => {
              return wftCommon.formatCont(String(txt))
            },
          })
          item.reverse()
          item.map((t) => {
            rows.unshift([t])
          })
        }
        if (expandDetail.cmd == 'getlandtransdetail') {
          // 土地转让
          item = []
          item.push({
            title: intl('205434', '地块位置'),
            dataIndex: 'landPos',
            colSpan: 5,
            align: 'left',
            render: (txt) => {
              return wftCommon.formatCont(String(txt))
            },
          })
          item.map((t) => {
            rows.unshift([t])
          })
        }
        return (
          <HorizontalTable
            bordered={'default'}
            className=""
            loading={false}
            title={expandDetail.title || null}
            rows={rows}
            dataSource={expandDetailData[record.key]}
            data-uc-id="8ji6MnokZh7"
            data-uc-ct="horizontaltable"
          ></HorizontalTable>
        )
      }
    }
  }

  const fetchCorpModuleData = (params, CascaderLabels?) => {
    setDataLoaded(false)
    if (!eachTable.cmd) return false
    params = { ...ajaxExtras, ...params }

    if (wftCommon.fromPage_shfic == wftCommon.fromPage()) {
      // 工商联项目不依赖num 直接全部读取
    } else if (
      (eachTableKey.indexOf('showShareholder') > -1 || eachTableKey.indexOf('showActualController') > -1) &&
      typeof eachTable.modelNum === 'number' &&
      basicNum[eachTable.modelNum] <= 0
    ) {
      setDataLoaded(true)
      setResult([])
      return
    }

    const handleFetchWithData = (backRes) => {
      const dataCall = (res, loaded?) => {
        if (!dataLoaded && !loaded) {
          setDataLoaded(true)
        }
        // 招标标的物
        if (eachTableKey.indexOf('biddingInfo') > -1) {
          if (backRes.Data?.aggregations?.highlight?.length) {
            const bidhigh = []
            backRes.Data.aggregations.highlight.map((t) => {
              t.split('|').map((tt) => {
                if (bidhigh.indexOf(tt) == -1) bidhigh.push(tt)
              })
            })
            if (bidhigh.length > 10) {
              bidhigh.length = 10
            }
            setBidInfo(bidhigh)
          } else if (bidInfo) {
            setBidInfo([])
          }
        }
        // 投标标的物
        if (eachTableKey.indexOf('tiddingInfo') > -1) {
          if (backRes.Data?.aggregations?.highlight?.length) {
            const bidhigh = []
            backRes.Data.aggregations.highlight.map((t) => {
              t.split('|').map((tt) => {
                if (bidhigh.indexOf(tt) == -1) bidhigh.push(tt)
              })
            })
            if (bidhigh.length > 10) {
              bidhigh.length = 10
            }
            setTidInfo(bidhigh)
          } else if (tidInfo) {
            setTidInfo([])
          }
        }

        // 产品词
        if (eachTableKey.indexOf('tiddingInfo') > -1 || eachTableKey.indexOf('biddingInfo') > -1) {
          if (backRes.Data?.aggregations?.aggs_product_name?.length) {
            const bidhigh = backRes.Data.aggregations.aggs_product_name || []
            if (bidhigh.length > 10) {
              bidhigh.length = 10
            }
            setProducts(bidhigh)
          } else if (products) {
            setProducts([])
          }
        }
        if (eachTableKey == 'historycompany') {
          return renderHistory(res)
        }

        if (eachTable.cmd == 'getmainbusinessstruct') {
          setBusinessScope(res[0].reportDate)
        }
        if (eachTableKey == 'showShareSearch') {
          // 股东穿透 层级过滤
          const selObj = [
            { key: 1, value: 1 },
            { key: 2, value: 2 },
            { key: 3, value: 3 },
            {
              key: 4,
              value: 4,
            },
            { key: 5, value: 5 },
            { key: 6, value: 6 },
          ]
          setSelOption(selObj as unknown as CompanyTableSelectOptions)
        }
        handleCompanyTableRightSelect({
          eachTable,
          backRes,
          params,
          selOption,
          selOptionValue,
          selOptionIndex,
          eachTableKey,
          setSelOption,
          allSelOption,
          setAllSelOption,
        })

        if (eachTable.rightCascader && eachTable.rightCascader.length && backRes.Data.aggregations) {
          const createList = (arr) => {
            const res = []
            for (let i = 0; i < arr.length; i++) {
              const obj = {}
              obj['label'] = arr[i].classifyName
              obj['value'] = arr[i].classifyNo
              if (arr[i].children && arr[i].children.length) {
                obj['children'] = createList(arr[i].children)
              }
              res.push(obj)
            }
            return res
          }
          let cascaderList
          if (isEn()) {
            promiseArrzh2en(backRes.Data.aggregations, 'children', 'classifyNo', 'classifyName', 'count')
              .then((res) => {
                cascaderList = createList(res)
                setCascaderOption(cascaderList)
              })
              .catch(() => {})
          } else {
            cascaderList = createList(backRes.Data.aggregations)
            setCascaderOption(cascaderList)
          }
        }
        if (!res.length) {
          setResult([])
          return
        } else {
          res.forEach((t, index) => {
            const pagenum = params.pageNo || 0
            const pagesize = params.pageSize || 10
            if (!t.hasOwnProperty('NO.')) {
              t['NO.'] = index + pagenum * pagesize + 1
            }
          })
        }
        setResult(res || [])
        setTotal(backRes.Page.Records)
      }

      // 风控类数据接口 处理当事人逻辑 (将object提出成string)
      const riskParty = (backRes, roleKey, roleType?, entityName?, entityCode?) => {
        roleType = roleType || 'roleType'
        entityName = entityName || 'name'
        entityCode = entityCode || 'id'
        backRes.data &&
          backRes.data.length &&
          backRes.data.map((t) => {
            t[roleKey] &&
              t[roleKey].length &&
              t[roleKey].map((tt, idx) => {
                t[roleType + idx] = tt[roleType]
                t[entityName + idx] = tt[entityName]
                t[entityCode + idx] = tt[entityCode]
              })
            t['_roleLength'] = t[roleKey] ? t[roleKey].length : 0
            delete t.judgeResult
            delete t.companyCode
            delete t.companyName
            delete t.courtStaffs
            delete t[roleKey]
            delete t.party
          })
        zh2en(
          backRes.data,
          (res) => {
            setDataLoaded(true)
            res.map((t) => {
              t[roleKey] = []
              if (t['_roleLength'] > 0) {
                for (let i = 0; i < t['_roleLength']; i++) {
                  const tt = {}
                  tt[roleType] = t[roleType + i]
                  tt[entityName] = t[entityName + i]
                  tt[entityCode] = t[entityCode + i]
                  t[roleKey].push(tt)
                }
              }
            })
            dataCall(res)
          },
          null,
          () => {
            setDataLoaded(true)
          }
        )
      }
      if (eachTable.dataCallback) {
        backRes.data = eachTable.dataCallback(backRes.data, basicNum, params.pageNo)
        if (!backRes.data || !backRes.data.length) {
          dataCall([])
          return
        }
      }

      if (isEn()) {
        dataCall(backRes.data, true)

        if (eachTableKey == 'showCompanyChange') {
          backRes.data.map((t) => {
            if (t.after_change) {
              t.after_change = t.after_change.replaceAll("<span class='text-insert'>", '')
              t.after_change = t.after_change.replaceAll("<span class='text-delete'>", '')
              t.after_change = t.after_change.replaceAll("<span class='text-red'>", '')
              t.after_change = t.after_change.replaceAll("<span class='text-yellow'>", '')
              t.after_change = t.after_change.replaceAll('</span>', '')
              t.after_change = t.after_change.replaceAll('<br />', '')
            }
            if (t.before_change) {
              t.before_change = t.before_change.replaceAll("<span class='text-insert'>", '')
              t.before_change = t.before_change.replaceAll("<span class='text-delete'>", '')
              t.before_change = t.before_change.replaceAll("<span class='text-red'>", '')
              t.before_change = t.before_change.replaceAll("<span class='text-yellow'>", '')
              t.before_change = t.before_change.replaceAll('</span>', '')
              t.before_change = t.before_change.replaceAll('<br />', '')
            }
            return t
          })
        }
        if (eachTableKey == 'getcourtdecision') {
          riskParty(backRes, 'judgeRoles', 'roleType', 'entityName', 'entityCode')
          return
        }
        if (eachTableKey == 'showDeliveryAnnouncement') {
          riskParty(backRes, 'roles')
          return
        }
        if (['getcourtannouncement', 'getfilinginfo', 'getcourtopenannouncement'].indexOf(eachTableKey) > -1) {
          riskParty(backRes, 'judgeRoles')
          return
        }
        if (eachTableKey == 'showBuildOrder') {
          backRes.data = backRes.data.map((i) => {
            return {
              ...i,
              qualificationClassify: i.qualificationClassify.replace(/<em>/g, '').replace(/<\/em>/, ''),
              qualificationNameList: i.qualificationNameList.map((j) => j.replace(/<em>/g, '').replace(/<\/em>/, '')),
            }
          })
        }
        if (eachTableKey == 'showControllerCompany') {
          backRes.data &&
            backRes.data.map((t) => {
              delete t.short_name
            })
        }
        // 如果配置了跳过翻译的字段，则使用 新的翻译服务
        if (eachTable.skipTransFieldsInKeyMode && eachTable.skipTransFieldsInKeyMode.length) {
          translateToEnglish(backRes.data, {
            skipFields: eachTable.skipTransFieldsInKeyMode,
          })
            .then((res) => {
              dataCall(res.data)
            })
            .catch((e) => {
              console.error(e)
            })
            .finally(() => {
              setDataLoaded(true)
            })
        } else {
          let children
          if (eachTableKey == 'showBuildOrder') {
            children = 'qualificationNameList'
          }
          promiseArrzh2en(backRes.data, children).then((res: any) => {
            setDataLoaded(true)
            if (res && res.length) {
              if (eachTableKey == 'showBuildOrder') {
                CascaderLabels &&
                  CascaderLabels.length &&
                  res.map((i) => {
                    i.qualificationClassify = CascaderLabels.includes(i.qualificationClassify)
                      ? `<em>${i.qualificationClassify}</em>`
                      : i.qualificationClassify
                    i.qualificationNameList = i.qualificationNameList.map((j) =>
                      CascaderLabels.includes(j) ? `<em>${j}</em>` : j
                    )
                  })
              }
            }
            dataCall(res)
          })
        }
      } else {
        dataCall(backRes.data)
      }
    }
    const handleFetchSuccess = (backRes) => {
      setDataLoaded(true)

      if (backRes.data) {
        handleFetchWithData(backRes)
      } else {
        if (isEn()) {
          setDataLoaded(true)
        }
        setResult([])
      }
    }
    getCorpModuleInfo(eachTable.cmd, params)
      .then((backRes) => {
        if (!isEn()) {
          setDataLoaded(true)
        }
        if (backRes && backRes.code === ApiCodeForWfc.SUCCESS) {
          handleFetchSuccess(backRes)
        } else {
          if (isEn()) {
            setDataLoaded(true)
          }
        }
      })
      .catch((e) => {
        console.error(e)
        setDataLoaded(true)
      })
  }

  useEffect(() => {
    if (!ready) return
    if (!userVipInfo.isSvip && !userVipInfo.isVip && !linkSourceF9ModuleAccess) {
      if (eachTable.notVipTitle || eachTable.notVipTips) {
        return
      }
    }
    let params: any = {
      pageNo: pageNo - 1,
      pageSize,
      companycode,
      ...searchFilter,
      windCode: companycode,
      companyid: companyid,
    }

    if (eachTable.apiSource === 'risk') {
      // 风控接口
      let vparams = {}
      if (eachTable.cmd == 'get_penalty_for_violate') {
        vparams = {
          associationArray: ['81000'],
        }
      }
      params = {
        companyCodes: [riskUseCompanyCode],
        requestFrom: 'GEL',
        pageNum: pageNo,
        pageSize: 10,
        ...vparams,
      }
      fetchRiskModuleData(params)
    } else {
      fetchCorpModuleData(params)
    }
  }, [pageNo, ready, searchFilter])

  useEffect(() => {
    if (!result || !result.length) return
    // 柱状图
    if (eachTable.chartCmd) {
      if (isEn()) {
        drawBarChart({
          businessIndex: result[0]._businessIndex,
          frequency: result[0]._frequency,
          businessIndex_en: result[0].businessIndex,
        })
      } else {
        drawBarChart({
          businessIndex: result[0].businessIndex,
          frequency: result[0].frequency,
        })
      }
    }
  }, [result])

  const getShowShareRemark = async () => {
    const api = createRequest()
    const { Data } = await api('detail/company/getsubjectinfo')
    if (!Data?.subjectType) return
    const cmpt = <Links module={LinksModule.COMPANY} id={Data.subjectId} title={Data.subjectName} useUnderline></Links>

    let remark = null
    if (Data.subjectType === '上市主体') {
      const remarkRaw = intl('437177', '该企业为境外上市主体的境内运营主体，此处为其境外上市主体%的对应上市信息')
      // 百分号前
      const remarkBefore = remarkRaw.split('%')[0]
      // 百分号后
      const remarkAfter = remarkRaw.split('%')[1]
      remark = (
        <span>
          {remarkBefore}
          {cmpt}
          {remarkAfter}
        </span>
      )
    }
    if (Data.subjectType === '运营主体') {
      const remarkRaw = intl('437443', '该企业的境内运营主体为%')
      // 百分号前
      const remarkBefore = remarkRaw.split('%')[0]
      remark = (
        <span>
          {remarkBefore}
          {cmpt}
        </span>
      )
    }
    setShareRemark(
      <span style={{ color: 'rgb(153, 153, 153)', fontSize: 14 }}>
        <InfoCircleButton style={{ marginRight: 4 }} />
        {remark}
      </span>
    )
  }

  /** 针对发行股票做的处理 */
  useEffect(() => {
    if (
      resultIntl?.length &&
      (eachTableKey === 'showShares-0' || eachTableKey === 'showSharesOther-0') &&
      !eachTable?.remark
    ) {
      getShowShareRemark()
    }
  }, [resultIntl, eachTableKey, eachTable?.remark])

  const handleSelectChangeShareTrace = (val, key) => {
    ajaxExtras[key] = val ? val : ''
    key === 'percent' && setPenetrationInputVal(val)
    setAjaxExtra(ajaxExtras)
    if (pageNo !== 1) {
      setPageNo(1)
    } else {
      const params = { pageNo: 0, pageSize, companycode, ...ajaxExtras }
      fetchCorpModuleData(params)
    }
  }

  const handleCascaderChange = (value, t, obj) => {
    const res = []
    value.forEach((item) => {
      res.push(item[item.length - 1])
    })

    const labels = []
    obj.forEach((item) => {
      labels.push(item[item.length - 1]?.label)
    })
    const classify = res.join(',')
    if (t.typeOf == 'string') {
      ajaxExtras.classify = classify
      setAjaxExtra(ajaxExtras)
    }
    if (pageNo !== 1) {
      setPageNo(1)
    } else {
      const params = {
        ...ajaxExtras,
        pageNo: 0,
        pageSize,
        classify,
        companycode,
        windCode: companycode,
      }
      fetchCorpModuleData(params, labels)
    }
  }

  const handleSelectChange = (value, t, index) => {
    selOptionValue[index] = value
    selOptionIndex = index
    setSelOptionValue(selOptionValue)
    if (eachTable.rightFilterCallback) {
      ajaxExtras[t.key4ajax] = value
      setAjaxExtra(ajaxExtras)
      eachTable.rightFilterCallback(ajaxExtras)
    } else {
      if (t?.typeOf == 'string') {
        ajaxExtras[t.key4ajax] = value
      } else {
        ajaxExtras[t.key4ajax] = value || (value === 0 ? parseInt(value) : '')
      }
      setAjaxExtra(ajaxExtras)
    }

    if (pageNo !== 1) {
      setPageNo(1)
    } else {
      const params = {
        pageNo: 0,
        pageSize,
        companycode,
        ...ajaxExtras,
        windCode: companycode,
      }
      fetchCorpModuleData(params)
    }
  }

  const handleDynamicSelectChange = (searchFilterChanged) => {
    if (isEqual(searchFilter, searchFilterChanged)) {
      return
    }
    setSearchFilter(searchFilterChanged)
    if (pageNo !== 1) {
      setPageNo(1)
    }
  }

  // 股东穿透 tab切换事件
  const penetrationType = (item) => {
    setAjaxExtra({ ...ajaxExtras, percent: 0, level: 6, type: item?.value })
    setPenetrationInputVal(0)
    setSelectPenetrationType(item?.value)
    if (pageNo !== 1) {
      setPageNo(1)
    } else {
      const params = {
        pageNo: 0,
        pageSize,
        companycode,
        ...ajaxExtras,
        percent: 0,
        level: 6,
        type: item?.value,
      }
      fetchCorpModuleData(params)
    }

    if (item?.value === 1) {
      setPenetrationColumns(eachTable.columns)
    } else {
      setPenetrationColumns(setStructOfCols(eachTable.typeMergence))
    }
  }

  /**
   * table数据结构转换
   * @param {*} eachTable
   */
  const setStructOfCols = (eachTable) => {
    let columns = eachTable.columns || []
    if (eachTable.thName && eachTable.thName.length) {
      // 1 有thName 用兼容老企业库的config编写的columns
      const cols = []
      eachTable.thName.map((_t, idx) => {
        let align = eachTable.align ? eachTable.align[idx] : 0
        align = align ? (align == 2 ? 'right' : 'center') : 'left'
        const col = {
          title: eachTable.thName ? eachTable.thName[idx] : '',
          width: eachTable.thWidthRadio ? eachTable.thWidthRadio[idx] : '',
          dataIndex: eachTable.fields ? eachTable.fields[idx] : '',
          align,
          render: function (_txt, row) {
            try {
              const tdName = col.dataIndex
              if (tdName.indexOf('|') > 0) {
                return wftCommon[tdName.split('|')[1]](row[tdName.split('|')[0]], row)
              }
              return row[col.dataIndex] ? row[col.dataIndex] : ''
            } catch (e) {
              console.error(e)
              return '--'
            }
          },
          ...eachTable.columns[idx],
        }
        cols.push(col)
      })
      columns = cols
    }
    return columns
  }

  // 产品词筛选
  const handleChange = (tag, checked, t, index) => {
    const nextSelectedTags = checked ? [tag] : []

    setSelectedTags(nextSelectedTags)
    handleSelectChange(checked ? tag?.key : '', t, index)
  }

  handleAnnouncementCommentAndCountNum(eachTable, result[0])

  const renderAgg = () => {
    if (!(eachTable.searchOptions && eachTable.searchOptionApi && ready)) {
      return null
    } else {
      return (
        <CorpTableAggregation
          tableCfg={{
            ...eachTable,
            searchOptionApi: undefined,
          }}
          value={searchFilter}
          companyCode={companycode}
          aggDataProp={aggData}
          onChange={handleDynamicSelectChange}
          data-uc-id="RjXvPThvxiv"
          data-uc-ct="corptableaggregation"
        />
      )
    }
  }

  eachTable.titleStr = eachTable.hideTitle ? (
    ''
  ) : (
    <>
      {title}

      {eachTable.hint ? (
        <Tooltip
          overlayClassName="corp-tooltip"
          title={<div dangerouslySetInnerHTML={{ __html: eachTable.hint }}></div>}
        >
          <InfoCircleButton />
        </Tooltip>
      ) : null}

      {/*  数字 */}
      {isBid ? null : (
        <CorpTableModelNum
          total={total}
          eachTableKey={eachTableKey as TCorpDetailSubModule}
          modelNum={eachTable.modelNum}
          modelNumUseTotal={eachTable.modelNumUseTotal}
          compDefault={eachTable.modelNumStr}
          numHide={eachTable.numHide}
          basicNum={basicNum}
        />
      )}

      {eachTableKey == 'showShareSearch' && (
        <div className="gqct-tabs">
          {eachTable.extension.tabs.map((item) => {
            return (
              <span
                className={selectPenetrationType === item.value ? 'active' : ''}
                key={item.value}
                onClick={() => {
                  if (item.value === 2) {
                    pointBuriedByModule(922602100346)
                  }
                  penetrationType(item)
                }}
                data-uc-id="RYEQyTxNAQ7"
                data-uc-ct="span"
                data-uc-x={item.value}
              >
                {item.name}
              </span>
            )
          })}
        </div>
      )}

      {eachTable.comment && (
        <span
          style={{
            fontWeight: 'normal',
            fontSize: '14px',
            color: '#999',
            marginLeft: '12px',
          }}
        >
          {eachTable.comment}
        </span>
      )}

      {eachTable.notVipTitle || eachTable.notVipTips ? (
        wftCommon.fromPage_shfic == wftCommon.fromPage() ? null : (
          <span style={{ marginTop: '7px' }} className="module-vip-tips">
            <i></i>
          </span>
        )
      ) : null}

      {/* {eachTable.new && <span className="new-flag"></span>} */}

      <div className="header-utils">
        {businessScope && !window.en_access_config ? (
          <div className="businessScope-hint">按产品类别统计，数据取自{businessScope}年报</div>
        ) : null}

        {renderAgg()}

        {/* 招标公告复选框 */}
        {eachTable?.rightFilters?.map((t, index) => {
          if (t?.isCheckBox) {
            const count = selOption?.[index]?.[index].find(
              (i) => i.key === '本企业中标' || i.value === '本企业中标'
            )?.doc_count //

            const content =
              (window.en_access_config ? 'Bids current company won' : intl('417659', '本企业中标')) +
              (count !== undefined ? ` (${count || 0})` : '')
            return (
              <Checkbox
                checked={selOptionValue[index]}
                onChange={(e) => {
                  handleSelectChange(e.target.checked ? 1 : 0, t, index)
                }}
                style={{
                  fontWeight: 'initial',
                  display: 'flex',
                  alignItems: 'center',
                  marginRight: '0',
                }}
                data-uc-id="472jNb4Yl"
                data-uc-ct="checkbox"
              >
                <span
                  title={content}
                  style={{
                    maxWidth: '110px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: 'inline-block',
                    verticalAlign: 'bottom',
                  }}
                >
                  {content}
                </span>
              </Checkbox>
            )
          }
        })}

        {isBid ? (
          <Search
            style={{ marginRight: '10px', width: 'auto' }}
            placeholder={intl('437446', '请输入公告标题')}
            onSearch={(val) => {
              if (val == ajaxExtras.keyword) {
                return false
              }
              if (val && val.trim()) {
                ajaxExtras.keyword = val.trim()
              } else {
                ajaxExtras.keyword = ''
              }
              setAjaxExtra(ajaxExtras)
              const params = { pageNo: 0, pageSize, companycode, ...ajaxExtras }
              fetchCorpModuleData(params)
            }}
            data-uc-id="AP-LpkMr5h"
            data-uc-ct="search"
          />
        ) : null}

        {/* 右侧筛选等操作 */}
        {eachTable.rightFilters && eachTable.rightFilters.length
          ? eachTable.rightFilters.map((t, index) => {
              // 投标公告-本企业投标 单独处理
              if (t?.isCheckBox || t.type === 'tag') {
                return null
              }

              return (
                <CompanyTableRightSelect
                  index={index}
                  selOptionValue={selOptionValue}
                  t={t}
                  eachTable={eachTable}
                  handleSelectChange={handleSelectChange}
                  selOption={selOption}
                />
              )
            })
          : null}

        {/* 右侧级联筛选 */}
        {eachTable.rightCascader && eachTable.rightCascader.length
          ? eachTable.rightCascader.map((t) => {
              return (
                <ConfigProvider
                  locale={window.en_access_config ? enUS : zhCN}
                  theme={{
                    token: { colorPrimary: '#0596b3', borderRadius: 0, borderRadiusSM: 2, colorBorder: '#c3c5c9' },
                    components: {
                      Cascader: { optionSelectedBg: '#d3eef5', controlWidth: 140 },
                    },
                  }}
                >
                  <Cascader
                    // className="my_cascader"
                    options={cascaderOption}
                    onChange={(val, obj) => {
                      handleCascaderChange(val, t, obj)
                    }}
                    // suffixIcon={<DownloadO />}
                    multiple
                    showSearch
                    // expandTrigger="hover"
                    placeholder={intl('357413', '全部资质')}
                    popupPlacement="bottomRight"
                    maxTagCount={1}
                    data-uc-id="ave6zQgE3D9"
                    data-uc-ct="cascader"
                  ></Cascader>
                </ConfigProvider>
              )
            })
          : null}
        {eachTableKey == 'showShareSearch' ? (
          <>
            {' '}
            {selectPenetrationType === 1 && (
              <>
                <span className="header-utils-tip-tit"> {intl('451215', '层级：')} </span>{' '}
                <Select
                  defaultValue={'6'}
                  style={{ width: 60, marginRight: 10 }}
                  onChange={(val) => {
                    handleSelectChangeShareTrace(val, 'level')
                  }}
                  data-uc-id="LMwnoK90Is"
                  data-uc-ct="select"
                >
                  {selOption && selOption.length
                    ? selOption.map((tt) => {
                        const item = tt
                        return (
                          <Option
                            onChange
                            key={item.key}
                            value={item.value}
                            data-uc-id={`YX9CcdinRGG${item.key}`}
                            data-uc-ct="option"
                            data-uc-x={item.key}
                          >
                            {item.key} {item.doc_count ? `(${item.doc_count})` : ''}
                          </Option>
                        )

                        // })
                      })
                    : null}
                </Select>
              </>
            )}{' '}
            <span className="header-utils-tip-tit"> {intl('451216', '持股比例大于：')} </span>{' '}
            <Search
              className="share-input"
              type="number"
              onSearch={(val) => {
                handleSelectChangeShareTrace(val, 'percent')
              }}
              style={{ width: '60px', marginRight: '5px', paddingRight: 0 }}
              value={penetrationInputVal}
              placeholder=""
              onChange={(e) => setPenetrationInputVal(e.target.value)}
              data-uc-id="6SR_sOOsuM"
              data-uc-ct="search"
            />{' '}
            <span className="header-utils-tip-tit">{' %'} </span>{' '}
          </>
        ) : null}

        {/* 搜索框 */}
        {eachTable.search ? (
          <Search
            style={{ width: 120, marginLeft: '10px' }}
            placeholder={eachTable.search.title || '点击搜索'}
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value)
            }}
            onSearch={(val) => {
              const param = eachTable.search.param || 'keyword'
              if (val == ajaxExtras[param]) {
                return false
              }
              if (val && val.trim()) {
                // 默认搜索参数是keyword，可在eachTable.search.param指定
                if (param) {
                  ajaxExtras[param] = val.trim()
                } else {
                  ajaxExtras.keyword = val.trim()
                }
              } else {
                ajaxExtras[param] = ''
              }
              setAjaxExtra(ajaxExtras)
              const params = { pageNo: 0, pageSize, companycode, ...ajaxExtras }
              fetchCorpModuleData(params)
            }}
            data-uc-id="z_dDP0Nqtw"
            data-uc-ct="search"
          />
        ) : null}

        {eachTable.prefixDownDoc &&
          eachTable.prefixDownDoc({ companyCode: companycode, companyName: eachTable.companyname })}
        {/* 导出数据 */}
        {eachTable.downDocType ? (
          wftCommon.fromPage_shfic == wftCommon.fromPage() ? null : (
            <Button
              style={{ marginInlineStart: 4 }}
              onClick={() => {
                downLoadCorpExcel({
                  downDocTypeApi: eachTable.downDocType,
                  tableTitle: eachTable.title,
                  companyName: eachTable.companyname,
                  companycode: riskUseCompanyCode,
                  ajaxExtras,
                })
              }}
              icon={
                <DownloadO
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                  data-uc-id="fX8C_fpGA"
                  data-uc-ct="downloado"
                />
              }
              data-uc-id="qZXizANh5B"
              data-uc-ct="button"
            >
              {intl('4698', '导出数据')}
            </Button>
          )
        ) : null}

        {/* 更多外部功能跳转 */}
        {eachTable.rightLink
          ? eachTable.rightLink({
              companyCode: companycode,
              companyId: companyid,
              companyName: eachTable.companyname,
              corpId: eachTable?.ajaxExtras?.corpId,
            })
          : null}

        {/* 海外国家数据来源  */}
        {eachTable.dataComment ? (
          <span className="data-comment" style={{ marginInlineStart: 8 }}>
            {eachTable.dataComment}
          </span>
        ) : null}

        <br />
      </div>

      {eachTable?.rightFilters?.map((t) => {
        if (t.type === 'tag') {
          const index = eachTable?.rightFilters.findIndex((i) => i.type === 'tag')
          const products = (selOption && selOption[index]?.[index]) || []

          return (
            <div className="product" key={index}>
              <Products
                data={products}
                type="filter"
                selectedTags={selectedTags}
                onChange={(value, check) => {
                  handleChange(value, check, t, index)
                }}
                data-uc-id="cS6FJ_TPreW"
                data-uc-ct="products"
              />
            </div>
          )
        }
      })}
    </>
  )

  if (eachTable.remark && !window.en_access_config) {
    eachTable.remark = <div className="table-remark">{eachTable.remark}</div>
  }

  if (!ready) {
    // 注：table自带的loading比较影响性能，此处用 loading... 文本代替
    return (
      <div data-custom-id={eachTableKey} className="table-custom-module table-custom-module-loading">
        <Table
          key={eachTableKey}
          style={{ minHeight: '200px' }}
          title={eachTable.titleStr}
          columns={eachTable.columns}
          locale={locale}
          data-uc-id="7iIPPHVMBz"
          data-uc-ct="table"
          data-uc-x={eachTableKey}
        />
      </div>
    )
  }
  // 所属行业/产业
  if (eachTable.horizontalTable) {
    const _resultIntl = {}

    resultIntl.forEach((item) => {
      _resultIntl[item.key] = {
        ...item,
      }
    })

    return (
      <div id={eachTableKey} style={{ marginBlockEnd: 20 }} data-custom-id={eachTableKey}>
        <SmartHorizontalTable
          bordered={'dotted'}
          title={
            <div>
              {eachTable.title}
              {eachTable.tooltips ? (
                <Tooltip title={eachTable.tooltips}>
                  <Button
                    type="text"
                    icon={
                      <InfoCircleO
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                        data-uc-id="LzoakxqCVo"
                        data-uc-ct="infocircleo"
                      />
                    }
                    style={{ marginInlineStart: 4 }}
                    data-uc-id="8cnIszNjjn"
                    data-uc-ct="button"
                  />
                </Tooltip>
              ) : null}
            </div>
          }
          rows={eachTable.columns as ComponentProps<typeof SmartHorizontalTable>['rows']}
          dataSource={_resultIntl}
          hideRowIfEmpty={eachTable.hideRowIfEmpty}
          locale={locale}
        />
      </div>
    )
  }
  // 历史工商信息
  if (eachTableKey == 'historycompany') {
    if (!userVipInfo.isSvip && !userVipInfo.isVip) {
      if (eachTable.notVipTitle || eachTable.notVipTips) {
        return (
          <CompanyVipCard
            dataCustomId={eachTableKey}
            key={eachTableKey}
            title={eachTable.titleStr}
            vipTitle={eachTable.notVipTitle || ''}
          />
        )
      }
    }
    return (
      <>
        {dataLoaded && !hisBasicInfoListIntl.length ? null : (
          <div data-custom-id={eachTableKey} style={{ marginBottom: '32px' }}>
            <Table
              bordered="dotted"
              key={eachTableKey}
              title={eachTable.titleStr}
              columns={hisBasicInfoColumn}
              pagination={false}
              loading={!dataLoaded}
              locale={locale}
              dataSource={hisBasicInfoListIntl}
              style={{ width: '100%' }}
              data-uc-id="Nb3sZWgm3H"
              data-uc-ct="table"
              data-uc-x={eachTableKey}
            />
          </div>
        )}
      </>
    )
  }

  // 股权穿透图，vip才可用
  if ('getShareAndInvest' === eachTableKey) {
    const GqctChartCss = GqctChartComp()
    return (
      <Card
        key={'gqctchart'}
        // @ts-expect-error ttt
        multiTabId={eachTableKey}
        className="vtable-container gqct-card"
        divider={'none'}
        title={intl('138279', '股权穿透图')}
      >
        {!userVipInfo.isVip && !linkSourceF9 ? (
          <VipModule title={eachTable.notVipTitle || ''} />
        ) : (
          <React.Suspense fallback={<div></div>}>
            {<GqctChartCss companyname={corpNameIntl} companycode={companycode} />}
          </React.Suspense>
        )}
      </Card>
    )
  }

  // 科创分
  if ('gettechscore' === eachTableKey) {
    return (
      <CompanyTechScore corpCode={companycode} eachTableKey={eachTableKey} eachTable={eachTable}></CompanyTechScore>
    )
  }

  if (!userVipInfo.isSvip && !userVipInfo.isVip) {
    if (eachTable.notVipTitle || eachTable.notVipTips) {
      return (
        <CompanyVipCard
          dataCustomId={eachTableKey}
          key={eachTableKey}
          title={eachTable.titleStr}
          vipTitle={eachTable.notVipTitle || ''}
        />
      )
    }
  }

  let NoneData = null
  const NoneDataDom = (
    <div
      data-custom-id={eachTableKey}
      id={eachTableKey}
      className="table-custom-module-readyed"
      data-custom-num={eachTable.modelNum}
    >
      <Table
        data-custom-id={eachTableKey}
        dataSource={[]}
        title={eachTable.titleStr}
        columns={eachTable.columns}
        loading={false}
        locale={locale}
        data-uc-id="H6wNoedRhg"
        data-uc-ct="table"
      />
    </div>
  )
  if (eachTableKey === 'showShareholder-1' || eachTableKey === 'showActualController-1') {
    // 工商登记 无数据 要保留
    // NoneData = <Table data-custom-id={eachTableKey} dataSource={[]} title={eachTable.titleStr} columns={eachTable.columns} loading={false} locale={locale} />
    NoneData = NoneDataDom
  } else if (
    eachTable.needNoneTable ||
    (eachTableKey.indexOf('-') > -1 &&
      multiTabIds.indexOf(eachTableKey.split('-')[0] as (typeof multiTabIds)[number]) > -1)
  ) {
    // 1如果是类似tab切换类的表格，也需要展示空table  [config中配置上 needNoneTable 属性 (eg. 招投标)]
    // NoneData = <Table data-custom-id={eachTableKey} dataSource={[]} title={eachTable.titleStr} columns={eachTable.columns} loading={false} locale={locale} />
    NoneData = NoneDataDom
  } else if (getCorpModuleNum(eachTable.modelNum, basicNum) && eachTableKey.indexOf('-') === -1) {
    // 2如果统计数字有值 模块没加载到数据 空table要展示出来  ( 只针对无子表的模块 )
    // 3其他情况 没数据则将当前模块 null 隐藏掉
    // NoneData = <Table data-custom-id={eachTableKey} dataSource={[]} title={eachTable.titleStr} columns={eachTable.columns} loading={false} locale={locale} />
    NoneData = NoneDataDom
  }

  const WCBChartCss = resultIntl.length && eachTable.chartCmd ? WCBChartComp() : null

  return (
    <>
      {resultIntl.length && eachTable.chartCmd ? (
        <React.Suspense fallback={<div></div>}>{<WCBChartCss data={chartData}> </WCBChartCss>}</React.Suspense>
      ) : null}
      {dataLoaded && !resultIntl.length && pageProps.current == 1 && !singleModuleId ? (
        NoneData
      ) : (
        <div
          data-custom-id={eachTableKey}
          id={eachTableKey}
          className="table-custom-module-readyed"
          data-custom-num={eachTable.modelNum}
        >
          <Table
            key={eachTableKey}
            title={
              <>
                {eachTable.titleStr}
                {shareRemark}
              </>
            }
            columns={penetrationColumns}
            pagination={total > 10 || eachTable.noPagination ? pageProps : false}
            loading={!dataLoaded}
            dataSource={resultIntl}
            style={{ width: '100%' }}
            expandIconColumnIndex={expandDetail ? expandDetail.rowIdx : -1}
            expandIcon={
              expandDetail && expandDetail.iconNode
                ? (ex) => {
                    return expandDetail.iconNode(ex)
                  }
                : null
            }
            expandedRowRender={expandDetail ? expandedRowRender : null}
            onExpand={(ex, record) => {
              try {
                if (expandDetail?.bury?.id) {
                  pointBuriedByModule(expandDetail?.bury?.id)
                }

                if (ex) {
                  setExpandedRowKeys([record.key])
                } else {
                  setExpandedRowKeys([])
                }
              } catch (e) {
                console.error(e)
              }
            }}
            expandedRowKeys={expandedRowKeys}
            onRow={(record, idx) => {
              if (eachTable.rowSet) return eachTable.rowSet(record, idx)
            }}
            locale={locale}
            bordered="dotted"
            data-uc-id="w8toXVlZl8"
            data-uc-ct="table"
            data-uc-x={eachTableKey}
          />
        </div>
      )}
    </>
  )
}

const Wrapper: FC<Props> = (props) => (
  <ErrorBoundary>
    <CompanyTable {...props} />
  </ErrorBoundary>
)
export default Wrapper
