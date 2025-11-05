import { ICorpOtherInfo } from '@/api/corp/info/otherInfo.ts'
import { useCorpModuleCfg } from '@/components/company/handle'
import { makeCorpTableByCorpArea } from '@/components/company/handle/makeTableByArea.tsx'
import { useBuyStatusInDetail } from '@/components/company/HKCorp/api.ts'
import { HKCorpInfo } from '@/components/company/HKCorp/info'
import { ICorpSubModuleCfg, ICorpTableCfg } from '@/components/company/type'
import { getCorpModuleNum } from '@/handle/corp/basicNum/handle.tsx'
import { TCorpCategory } from '@/handle/corp/corpType/category.ts'
import { downLoadExcelInCompanyBase } from '@/handle/corp/download.ts'
import { getIfBondCorpByBasicNum, getIfIPOCorpByBasicNum } from '@/views/Company/handle/corpBasicNum.ts'
import { DownloadO } from '@wind/icons'
import { Button, Card, Col, Row, Tabs, Tooltip } from '@wind/wind-ui'
import Table from '@wind/wind-ui-table'
import React, { FC, memo, useEffect, useMemo, useReducer, useState } from 'react'
import { connect } from 'react-redux'
import * as companyActions from '../../actions/company'
import * as globalActions from '../../actions/global'
import { getCorpModuleInfo } from '../../api/companyApi'
import { ICorpBasicNumFront } from '../../handle/corp/basicNum/type.ts'
import { TCorpDetailSubModule } from '../../handle/corp/detail/module/type.ts'
import { useCompanyTabWidth } from '../../hooks/useCompanyTabWidth'
import global from '../../lib/global'
import { getVipInfo } from '../../lib/utils'
import { IState } from '../../reducers/type.ts'
import store from '../../store/store'
import intl from '../../utils/intl'
import { wftCommon } from '../../utils/utils'
import { InfoCircleButton } from '../icons/InfoCircle/index.tsx'
import { FinancialDataUnitFilter } from './buss/financial/FinancialDataUnitFilter.tsx'
import CompanyTable from './CompanyTable.tsx'
import { handleBuryInCorpDetailModuleTab } from './detail/bury'
import { CorpModuleNum, CorpModuleNumClassChild } from './detail/comp/CorpNum'
import { shficRowConfig } from './listRowConfig.tsx'
import corpTableStyles from './style/corpTable.module.less'
import VipModule from './VipModule'

// 白名单：只有在这些 eachTableKey 中才显示额外的 div
const whiteList = [
  'biddingInfo', // 招标公告
  'tiddingInfo', // 投标公告
  'getpatent', // 专利
]

const TabPane = Tabs.TabPane
const { HorizontalTable } = Table

const medicReducer = (_state, action) => {
  return { activeKey: action.activeKey }
}
const initialState = { activeKey: '1' }

const StatisticalChartComp = () => React.lazy(() => import('./StatisticalChart'))
const WCBChartComp = () => React.lazy(() => import('./WcbChartDiv'))
// 这里如果放到具体组件里 父组件属性变动会造成重复渲染，必须拿出来
const StatisticalChartCss = memo(StatisticalChartComp())
const WCBChartCss = memo(WCBChartComp())

const VTable: FC<{ ready; eachTableKey; eachTable; singleModuleId; smaller?; basicNum }> = ({
  ready,
  eachTableKey,
  eachTable,
  singleModuleId,
  smaller,
  basicNum,
}) => {
  const table = useMemo(() => {
    return (
      <CompanyTable
        basicNum={basicNum}
        ready={ready}
        key={eachTableKey}
        singleModuleId={singleModuleId}
        eachTableKey={eachTableKey}
        eachTable={eachTable}
        title={
          smaller ? <span className={corpTableStyles.corpTableTitleText}>{eachTable.title}</span> : eachTable.title
        }
      />
    )
  }, [ready, basicNum])
  return <>{table}</>
}

/**
 * 企业详情组件
 * @date 3/26/2024 - 11:33:41 AM
 * @param {Object} props
 * @param {any} props.basicNum
 * @param {string} props.setCorpModuleReadyed
 * @param {string} props.singleModuleId
 * @param {string} props.companycode  企业wind code
 * @param {string} props.companyname  企业名称
 * @param {string} props.companyid  企业id
 * @param {Array<stirng>} props.scrollModuleIds
 * @param {string} props.companyRegDate
 * @param {any} props.allMenuDataObj
 * @param {()=>void} props.menuClick
 * @param {any} props.company
 * @param {string} props.corpCategory
 */
const CompanyBaseY: FC<{
  companyname: string
  companyid: string
  basicNum: ICorpBasicNumFront
  companycode: string
  companyRegDate
  company
  corpArea
  corpCategory: TCorpCategory[]
  menuClick
  singleModuleId
  scrollModuleIds: any[]
  setCorpModuleReadyed
  allMenuDataObj
  corpOtherInfo: ICorpOtherInfo
  refreshCorpOtherInfo: () => void
}> = (props) => {
  const userVipInfo = getVipInfo()
  const isWidthLessThan985 = useCompanyTabWidth()

  const companyname = props.companyname
  const companyid = props.companyid
  const basicNum = props.basicNum
  const companycode = props.companycode
  const companyRegDate = props.companyRegDate
  const corpId = props?.company?.baseInfo?.corp_id

  const corpArea = props.corpArea // 国家地区

  const [medicActiveKey, dispatchMedic] = useReducer(medicReducer, initialState)

  const [fundSizeData, setFundSizeData] = useState(null) // 公募基金
  const [fundSizeDataPie, setFundSizeDataPie] = useState(null) // 公募基金

  const [privateFundBase, setPrivateFundBase] = useState(null) // 私募基金-基本信息
  const [privateFundProduct, setPrivateFundProduct] = useState(null) // 私募基金-产品结构
  const [privateFundProductFormance, setPrivateFundProductFormance] = useState(null) // 私募基金-产品结构-区间业绩
  // 企业详情配置
  const corpModuleCfg = useCorpModuleCfg(props.company?.baseInfo?.corp_type, props.company?.baseInfo?.corp_type_id)

  useEffect(() => {
    if (props.corpCategory && props.corpCategory.indexOf('privatefund') > -1 && companyid) {
      showPrivateFundInfoLoad()
    }
    if (props.corpCategory && props.corpCategory.indexOf('publicfund') > -1 && companyid) {
      showFundSizeLoad()
    }
  }, [props.corpCategory, companyid])

  const { hkCorpInfoBuyData } = useBuyStatusInDetail(props.corpOtherInfo?.userPurchaseInfo)

  const makeTable = (table: ICorpTableCfg, eachTableKey: TCorpDetailSubModule, idx?, smaller?) => {
    // 无子表，直接展示
    if (table.menuClick) {
      table.menuClickFunc = props.menuClick
    }

    if (makeCorpTableByCorpArea(corpArea, table, eachTableKey) == false) {
      // 该 table 不展示
      return null
    }
    setStructOfCols(table)
    const ajaxExtras = {
      companycode: props.companycode,
      windcode: props.companycode,
      windCode: props.companycode,
      companyid: companyid || window.__GELCOMPANYID__ || '',
      corpId,
    }
    table.ajaxExtras = table.extraParams ? table.extraParams(ajaxExtras) : ajaxExtras
    table.companyname = companyname
    let tableReady = false

    if (wftCommon.fromPage_shfic == wftCommon.fromPage()) {
      // 工商联 直接加载
      tableReady = true
    } else if (smaller) {
      tableReady =
        props.singleModuleId && props.singleModuleId.length
          ? props.scrollModuleIds.indexOf(eachTableKey) > -1
          : props.scrollModuleIds.indexOf(eachTableKey + '-' + idx) > -1
      return (
        <VTable
          key={eachTableKey + '-table' + idx}
          basicNum={basicNum}
          smaller={true}
          ready={tableReady}
          singleModuleId={props.singleModuleId}
          eachTableKey={eachTableKey + '-' + idx}
          eachTable={table}
        ></VTable>
      )
    } else {
      tableReady = props.scrollModuleIds.indexOf(eachTableKey) > -1 ? true : false
    }
    return (
      <VTable
        key={eachTableKey + '-table' + idx}
        basicNum={basicNum}
        ready={tableReady}
        singleModuleId={props.singleModuleId}
        eachTableKey={eachTableKey}
        eachTable={table}
      ></VTable>
    )
  }
  const downLoadExcel = (type, txt, name) => {
    downLoadExcelInCompanyBase(type, txt, name, companycode)
  }
  const showPrivateFundInfoLoad = () => {
    getCorpModuleInfo(`detail/company/getinformationofund/${companycode}`, {
      companyId: companyid,
    }).then((res) => {
      const rows = [
        [
          {
            title: intl('141152', '核心人物'),
            dataIndex: 'investmentDirector',
            titleWidth: '15%',
            contentWidth: '15%',
          },
          { title: intl('31990', '机构类型'), dataIndex: 'institutionType', titleWidth: '15%', contentWidth: '15%' },
          {
            title: intl('145394', '基金经理人数'),
            dataIndex: 'fundManagerNumber',
            titleWidth: '15%',
            contentWidth: '15%',
          },
        ],
        [
          { title: intl('143097', '登记编号'), dataIndex: 'registerNo', titleWidth: '15%', contentWidth: '15%' },
          {
            title: intl('31990', '机构规模'),
            dataIndex: 'managementScaleInterval',
            titleWidth: '15%',
            contentWidth: '15%',
          },
          { title: intl('143603', '是否协会会员'), dataIndex: 'beMember', titleWidth: '15%', contentWidth: '15%' },
        ],
      ]
      if (res.data && res.data.length) {
        if (window.en_access_config) {
          wftCommon.zh2en(res.data, (endata) => {
            setPrivateFundBase({ rows: rows, list: endata[0] })
          })
        } else {
          setPrivateFundBase({ rows: rows, list: res.data[0] })
        }
      }
    })
    getCorpModuleInfo(`detail/company/getownedfundperformance/${companycode}`, {
      companyId: companyid,
    }).then((res) => {
      const cols = [
        {
          title: '',
          dataIndex: 'No.',
          width: '4%',
          render: (_txt, _row, idx) => {
            return idx + 1
          },
        },
        {
          title: intl('7996', '基金名称'),
          dataIndex: 'name',
          width: '20%',
          render: (txt, row) => {
            if (txt && row.windCode) {
              return wftCommon.linkF9(txt, row, ['', 'windCode'])
            }
          },
        },
        {
          title: intl('14384', '投资策略'),
          dataIndex: 'strategyType',
          width: '15%',
        },
        {
          title: intl('2823', '成立日期'),
          dataIndex: 'foundDate',
          width: '11%',
        },
      ]

      if (res.data.length) {
        if (window.en_access_config) {
          wftCommon.zh2en(res.data, (endata) => {
            setPrivateFundProductFormance({ columns: cols, list: endata })
          })
        } else {
          setPrivateFundProductFormance({ columns: cols, list: res.data })
        }
      }
    })
    getCorpModuleInfo(`detail/company/getproductstructure/${companycode}`, {
      companyId: companyid,
    }).then((res) => {
      const pieData = {}

      if (res.Data && res.Data.length) {
        const dataSorted = res.Data.sort((a, b) => b?.productNumber - a?.productNumber)
        if (window.en_access_config) {
          wftCommon.zh2en(dataSorted, (endata) => {
            endata.map((t) => {
              Object.defineProperty(pieData, t.strategyType, {
                value: t.productNumber,
                enumerable: true,
              })
            })
            const option = {
              chart: {
                categoryAxisDataType: 'category',
              },
              config: {
                layoutConfig: {
                  isSingleSeries: true,
                },
              },
              indicators: [
                {
                  meta: {
                    type: 'pie',
                    name: 'Institution Holdings',
                    unit: '%',
                  },
                  data: pieData,
                },
              ],
            }
            setPrivateFundProduct({ list: endata, pie: option })
          })
        } else {
          dataSorted.map((t) => {
            Object.defineProperty(pieData, t.strategyType, {
              value: t.productNumber,
              enumerable: true,
            })
          })
          const option = {
            chart: {
              categoryAxisDataType: 'category',
            },
            config: {
              layoutConfig: {
                isSingleSeries: true,
              },
            },
            indicators: [
              {
                meta: {
                  type: 'pie',
                  name: 'Institution Holdings',
                  unit: '%',
                },
                data: pieData,
              },
            ],
          }
          setPrivateFundProduct({ list: res.data, pie: option })
        }
      }
    })
  }

  const showFundSizeLoad = () => {
    /**
     * 包含公司ID、公司名称、日期、总规模和总数量等详细信息。
     * @typedef {Object} FundnetAssetValue
     * @property {string} companyId - 公司的唯一标识符，例如："502031274"。
     * @property {string} companyName - 公司名称，例如："易方达基金"。
     * @property {string} date - 特定日期，例如："2014-12-31"。
     * @property {string} totalScale - 公司的总规模，例如："2088.03"（可能表示金额或规模）。
     * @property {number} totalNum - 公司的总数量，例如：60（可能表示产品数量、员工数量等）。
     */

    // 管理规模 + 基金数量
    getCorpModuleInfo(`detail/company/getfundnetassetvalue/${companycode}`, {
      companyId: companyid,
    }).then((res) => {
      const fundSizeCall = (resData) => {
        const barData = []
        const lineData = []
        resData.map((t) => {
          const obj = {}
          Object.defineProperty(obj, t.date, {
            value: t.totalScale,
            enumerable: true,
          })
          barData.push(obj)
          const line = {}
          Object.defineProperty(line, t.date, {
            value: t.totalNum,
            enumerable: true,
          })
          lineData.push(line)
        })

        const data = {
          chart: {
            categoryAxisDataType: 'category',
          },
          config: {
            title: {
              text: '',
              show: true,
              fontSize: '12px',
            },
            barWidth: '50',
            barMinWidth: '40',
          },
          indicators: [
            {
              meta: {
                name: intl('313037', '管理规模'),
                type: 'bar',
                unit: intl('19493', '亿元'),
                barWidth: '50',
                barMinWidth: '40',
              },
              data: barData,
            },
          ],
        }
        setFundSizeData(data)
      }

      if (res && res.Data && res.Data.length) {
        if (window.en_access_config) {
          wftCommon.zh2en(res.Data, (endata) => {
            fundSizeCall(endata)
          })
        } else {
          fundSizeCall(res.Data)
        }
      }
    })

    /**
     * 基金类型对象，包含基金类型、产品数量、资产总额、排序字段和资产占比等信息。
     * @typedef {Object} FundType
     * @property {string} fundTypeName - 基金类型名称，例如："货币市场型基金"。
     * @property {number} productNumber - 该基金类型下的产品数量，例如：10。
     * @property {string} assets - 该基金类型的资产总额，例如："6929.97"。
     * @property {number} _sort - 排序字段，用于对基金类型进行排序，例如：40000。
     * @property {string} assetsPercentage - 该基金类型的资产占比，例如："0.3044"。
     */
    /**
     * 基金类型分布
     */
    getCorpModuleInfo(`detail/company/getpublicfundscale/${companycode}`, {
      companyId: companyid,
    }).then((res) => {
      const fundScaleCall = (resData) => {
        const pieData = {}
        resData.map((t) => {
          Object.defineProperty(pieData, t.fundTypeName, {
            value: t.assetsPercentage * 100,
            enumerable: true,
          })
        })

        const option = {
          chart: {
            categoryAxisDataType: 'category',
          },
          config: {
            layoutConfig: {
              isSingleSeries: true,
            },
          },
          indicators: [
            {
              meta: {
                type: 'pie',
                name: 'Institution Holdings',
                unit: '%',
              },
              data: pieData,
            },
          ],
        }
        setFundSizeDataPie({ pie: option, list: resData })
      }

      if (res && res.Data && res.Data.length) {
        if (window.en_access_config) {
          wftCommon.zh2en(res.Data, (endata) => {
            fundScaleCall(endata)
          })
        } else {
          fundScaleCall(res.Data)
        }
      }
    })
  }

  // 所有配置类表格生产Dom
  const renderTableDom = (corpModuleSubCfg: ICorpSubModuleCfg, eachTableKey, tables) => {
    if (eachTableKey == 'showMainMemberInfo') {
      if (!basicNum.lastNotice || basicNum.lastNotice - 0 == 0) {
        if ('children' in corpModuleSubCfg) {
          delete corpModuleSubCfg.children[0].title
          corpModuleSubCfg.children[0].extraParams = (param) => {
            param.__primaryKey = param.companycode
            param.companyCode = param.companycode
            return param
          }
          corpModuleSubCfg = { ...corpModuleSubCfg, ...corpModuleSubCfg.children[0] }
          // @ts-expect-error ttt
          delete corpModuleSubCfg.children
        }
      }
    }
    if ('custom' in corpModuleSubCfg) {
      if (eachTableKey === 'HKCorpInfo' && getCorpModuleNum(corpModuleSubCfg.modelNum, basicNum)) {
        tables.push(
          <HKCorpInfo
            corpCode={companycode}
            corpName={companyname}
            tableReady={props.scrollModuleIds.indexOf(eachTableKey) > -1 ? true : false}
            bussStatusData={hkCorpInfoBuyData}
            baseInfo={props?.company?.baseInfo}
            refreshHKCorpBussStatus={props.refreshCorpOtherInfo}
          />
        )
      }
    } else if ('titleTabs' in corpModuleSubCfg && corpModuleSubCfg.titleTabs) {
      // 医药数据 - title带tab，表格下也带tab 特殊处理
      const titleStr = (
        <>
          <span> {corpModuleSubCfg.title} </span>
          <div className="multitabs-more-title">
            {corpModuleSubCfg.titleTabs.map((t, idx) => {
              return (
                <span
                  className={!idx ? 'sel' : ''}
                  key={idx}
                  onClick={(e) => {
                    // @ts-expect-error ttt
                    const selTab = e.target.parentElement.querySelector('.sel')
                    if (e.target == selTab) {
                      return false
                    } else {
                      selTab && selTab.classList.remove('sel')
                    }
                    // @ts-expect-error ttt
                    e.target.classList.add('sel')
                    corpModuleSubCfg.children.map((t, idx) => {
                      t.extraParams = (param) => {
                        return {
                          ...param,
                          productType: t,
                        }
                      }
                      !idx && t.medicineFresh && t.medicineFresh()
                    })
                    if (medicActiveKey.activeKey != 0) {
                      dispatchMedic({ activeKey: '0' })
                    }
                  }}
                >
                  {t}
                </span>
              )
            })}{' '}
          </div>
        </>
      )
      const tabs = (
        <Card key={eachTableKey} className="vtable-container" divider={'none'} title={titleStr}>
          {/* @ts-expect-error ttt*/}
          <Tabs
            activeKey={medicActiveKey.activeKey}
            onChange={(key) => {
              if (key == medicActiveKey.activeKey) {
                return
              }
              dispatchMedic({ activeKey: key })
            }}
          >
            <div>
              {corpModuleSubCfg.children.map((t, idx) => {
                t.hideTitle = true
                const tableStr = makeTable(t, eachTableKey, idx, true)
                return (
                  // @ts-expect-error ttt
                  <TabPane tab={t.title} key={idx} forceRender={false}>
                    {tableStr}
                  </TabPane>
                )
              })}
            </div>
          </Tabs>
        </Card>
      )
      tables.push(tabs)
    } else if ('withTab' in corpModuleSubCfg && corpModuleSubCfg.withTab) {
      if (!userVipInfo.isSvip && !userVipInfo.isVip) {
        if (
          ('notVipTitle' in corpModuleSubCfg && corpModuleSubCfg.notVipTitle) ||
          ('notVipTips' in corpModuleSubCfg && corpModuleSubCfg.notVipTips)
        ) {
          tables.push(
            <Card
              data-custom-id={eachTableKey}
              key={eachTableKey}
              className="table-custom-module-readyed vtable-container gqct-card"
              divider={'none'}
              title={corpModuleSubCfg.title}
            >
              <VipModule
                modelInstanceNum={global.VIP_MODEL_COUNT++}
                show={true}
                title={('notVipTitle' in corpModuleSubCfg && corpModuleSubCfg.notVipTitle) || ''}
                tips={('notVipTips' in corpModuleSubCfg && corpModuleSubCfg.notVipTips) || ''}
              />
            </Card>
          )
          return
        }
      }

      // 带tab切换的普通页面
      const titleStr = (
        <>
          {' '}
          {corpModuleSubCfg.title} {corpModuleSubCfg.modelNumStr}{' '}
          {corpModuleSubCfg.rightLink
            ? corpModuleSubCfg.rightLink({
                companyCode: companycode,
                companyName: companyname,
                companyId: companyid,
              })
            : null}{' '}
        </>
      )

      const tabs = (
        <Card
          key={'card_' + eachTableKey}
          className={`vtable-container ${eachTableKey}_tab_div  `}
          // @ts-expect-error 不能删
          multiTabId={eachTableKey}
          divider={'none'}
          title={titleStr}
        >
          {/* // 商标 专利 图表 */}
          {corpModuleSubCfg.statisticalChart && getCorpModuleNum(corpModuleSubCfg.statisticalChartNum, basicNum) ? (
            <React.Suspense fallback={<div></div>}>
              {
                <StatisticalChartCss
                  eachTable={corpModuleSubCfg}
                  companyRegDate={companyRegDate}
                  companycode={companycode}
                  type={corpModuleSubCfg.statisticalChart}
                />
              }
            </React.Suspense>
          ) : null}

          {'children' in corpModuleSubCfg && corpModuleSubCfg.children?.length ? (
            // @ts-expect-error ttt
            <Tabs
              className="VTable"
              defaultActiveKey="0"
              onChange={(e) => {
                if (props.scrollModuleIds.indexOf(`${eachTableKey}-${e}`) == -1) {
                  const tmp = [...props.scrollModuleIds]
                  tmp.push(`${eachTableKey}-${e}`)
                  props.setCorpModuleReadyed(tmp)
                }
              }}
              onTabClick={(key) => {
                handleBuryInCorpDetailModuleTab(corpModuleSubCfg, key, corpId)
                const dom = document.querySelector('[multitabid=tiddingInfo]')?.querySelector('.w-tabs-top-bar')
                if (key === '0' && dom) {
                  dom.className = 'w-tabs-top-bar'
                } else if (key !== '0' && dom) {
                  dom.className = 'w-tabs-top-bar noMaxWidth'
                }
              }}
            >
              {corpModuleSubCfg.children.map((t, idx) => {
                t.hideTitle = true
                if (corpModuleSubCfg.withTab) {
                  t.hideTitle = false
                }

                const tabChildNumStr = (
                  <>
                    {t.title}
                    <CorpModuleNum
                      modelNum={t.modelNum}
                      basicNum={basicNum}
                      numHide={t.numHide}
                      className={CorpModuleNumClassChild}
                    />
                  </>
                )
                const tableStr = makeTable(t, eachTableKey, idx, true)

                return (
                  <TabPane
                    className={corpModuleSubCfg.withTab ? 'tab-show-small-title' : ''}
                    tab={tabChildNumStr}
                    // @ts-expect-error ttt
                    key={idx}
                  >
                    {isWidthLessThan985 && whiteList.includes(eachTableKey) && <div style={{ height: '40px' }}></div>}
                    {tableStr}
                  </TabPane>
                )
              })}
            </Tabs>
          ) : null}
        </Card>
      )

      tables.push(tabs)
    } else {
      if ('children' in corpModuleSubCfg && corpModuleSubCfg.children) {
        if (
          !userVipInfo.isSvip &&
          !userVipInfo.isVip &&
          (('notVipTitle' in corpModuleSubCfg && corpModuleSubCfg.notVipTitle) ||
            ('notVipTips' in corpModuleSubCfg && corpModuleSubCfg.notVipTips))
        ) {
          tables.push(
            <Card
              data-custom-id={eachTableKey}
              key={eachTableKey}
              className="table-custom-module-readyed vtable-container gqct-card"
              divider={'none'}
              title={corpModuleSubCfg.title}
            >
              <VipModule
                modelInstanceNum={global.VIP_MODEL_COUNT++}
                show={true}
                title={('notVipTitle' in corpModuleSubCfg && corpModuleSubCfg.notVipTitle) || ''}
                tips={('notVipTips' in corpModuleSubCfg && corpModuleSubCfg.notVipTips) || ''}
              />
            </Card>
          )
          return
        }

        // 有子表
        const tableChildren = []
        corpModuleSubCfg.children.forEach((childTable, idx) => {
          // @ts-expect-error ttt
          if (childTable.hideWhenNumZero && basicNum[childTable.modelNum] == 0) {
            return
          }
          tableChildren.push(makeTable(childTable, eachTableKey, idx, true))
        })
        const titleStr = (
          <div className="has-child-table">
            <span className="table-title">{corpModuleSubCfg.title}</span>

            {'hint' in corpModuleSubCfg && corpModuleSubCfg.hint ? (
              <Tooltip
                overlayClassName="corp-tooltip"
                title={<div dangerouslySetInnerHTML={{ __html: corpModuleSubCfg.hint }}></div>}
              >
                <InfoCircleButton />
              </Tooltip>
            ) : null}

            {corpModuleSubCfg.modelNumStr}
            {('notVipTitle' in corpModuleSubCfg && corpModuleSubCfg.notVipTitle) ||
            ('notVipTips' in corpModuleSubCfg && corpModuleSubCfg.notVipTips) ? (
              <span className="module-vip-tips" style={{ marginBlockStart: 7 }}></span>
            ) : null}
            {'rightLink' in corpModuleSubCfg && corpModuleSubCfg.rightLink
              ? corpModuleSubCfg.rightLink({
                  companyCode: companycode,
                  companyName: companyname,
                  companyId: companyid,
                })
              : null}
            {'downDocType' in corpModuleSubCfg && corpModuleSubCfg.downDocType ? (
              <Button
                onClick={() => {
                  // @ts-expect-error ttt
                  downLoadExcel(corpModuleSubCfg.downDocType, corpModuleSubCfg.title, corpModuleSubCfg.companyname)
                }}
                icon={<DownloadO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
              >
                {intl('4698', '导出数据')}
              </Button>
            ) : null}
            {eachTableKey == 'FinancialData' ? (
              <div className="financial-select">
                {' '}
                <span> {intl('31686', '单位')}：</span>
                <FinancialDataUnitFilter corpModuleSubCfg={corpModuleSubCfg} />
              </div>
            ) : null}
          </div>
        )
        const tableWrapper = (
          <Card key={eachTableKey + '-wrapper'} className="vtable-container" divider={'none'} title={titleStr}>
            {tableChildren.map((t) => {
              return t
            })}
          </Card>
        )

        tables.push(tableWrapper)
      } else {
        const tableStr = makeTable(corpModuleSubCfg, eachTableKey)
        tables.push(tableStr)
      }
    }
  }

  const tablesGEL = React.useMemo(() => {
    if (!props.singleModuleId) {
      // 1. 要先获取到统计数字basicnum
      // 2. 要通过是否specialcorp区分不同类型实体的展示模块
      if (Object.entries(basicNum).length < 5) {
        return null
      }
      if (!basicNum.__specialcorp) {
        return null
      }
    }
    const bodys = []
    corpModuleCfg.map((corpModulePrimaryCfg, _idx) => {
      const tables = []
      let currentModuleIsEmpty = true // 记录当前大模块是否全部子模块都没有数据

      let eachTableKey: TCorpDetailSubModule | 'moduleTitle'
      for (eachTableKey in corpModulePrimaryCfg) {
        /* ----------------- 单独处理的几个特殊模块，业务数据、医药数据、私募基金、公募基金等 ------------------------ */
        if (corpModulePrimaryCfg.showFundSize) {
          // 公募基金模块， 如果当前企业非公募基金类型，直接跳过
          if (!props.corpCategory || props.corpCategory.indexOf('publicfund') == -1) {
            currentModuleIsEmpty = false
            continue
          }
        }
        if (corpModulePrimaryCfg.showPrivateFundInfo) {
          // 私募基金模块， 如果当前企业非私募基金类型，直接跳过
          if (!props.corpCategory || props.corpCategory.indexOf('privatefund') == -1) {
            currentModuleIsEmpty = false
            continue
          }
        }
        if (corpModulePrimaryCfg.showIpoYield) {
          // 业务数据模块， 如果当前企业非上市公司，直接跳过
          if (!props.corpCategory || props.corpCategory.indexOf('ipo') == -1) {
            currentModuleIsEmpty = false
            continue
          }
        }
        /* ------------------------------------------------------------------------------------------------- */

        if (eachTableKey == 'showFundSize') {
          const pieStr = fundSizeDataPie ? (
            <Row gutter={16}>
              <Col span={12}>
                <React.Suspense fallback={<div></div>}>
                  {<WCBChartCss data={fundSizeDataPie.pie} waterMark={false} style={{ height: 400 }} />}
                </React.Suspense>
              </Col>
              <Col span={12}>
                <Table
                  style={{ marginTop: '32px' }}
                  key={'fundSizeDataPie'}
                  columns={[
                    {
                      dataIndex: 'fundTypeName',
                      title: intl('66063', '基金类型'),
                    },
                    {
                      dataIndex: 'assets',
                      title: intl('18827', '资产净值合计(亿元)'),
                      align: 'right',
                    },
                    {
                      dataIndex: 'assetsPercentage',
                      title: intl('105862', '占比'),
                      align: 'right',
                      render: (txt, _row) => {
                        return wftCommon.formatPercent(txt * 100)
                      },
                    },
                  ]}
                  pagination={false}
                  dataSource={fundSizeDataPie.list}
                />
              </Col>
            </Row>
          ) : (
            ''
          )

          tables.push(
            <Card
              key={eachTableKey}
              className="vtable-container card-fundsize"
              /*@ts-expect-error ttt*/
              multiTabId={eachTableKey}
              divider={'none'}
              title={intl('37109', '基金规模')}
            >
              {' '}
              {fundSizeDataPie ? pieStr : ''}{' '}
              {fundSizeData ? (
                <React.Suspense fallback={<div></div>}>
                  {<WCBChartCss data={fundSizeData} waterMark={false} style={{ height: 400 }} />}
                </React.Suspense>
              ) : (
                ''
              )}{' '}
            </Card>
          )
          currentModuleIsEmpty = false
          continue
        }

        if (eachTableKey == 'showPrivateFundInfo') {
          const tableStr = privateFundBase ? (
            <HorizontalTable
              bordered={'default'}
              className=""
              loading={false}
              title={<span>{intl('205468', '基本信息')}</span>}
              rows={privateFundBase.rows}
              dataSource={privateFundBase.list}
            ></HorizontalTable>
          ) : null

          privateFundBase && tables.push(tableStr)

          const pieStr = privateFundProduct ? (
            <Row gutter={16}>
              <Col span={12}>
                <React.Suspense fallback={<div></div>}>
                  {<WCBChartCss data={privateFundProduct.pie} waterMark={false} style={{ height: 400 }} />}
                </React.Suspense>
              </Col>
              <Col span={12}>
                <Table
                  style={{ marginTop: '12px', marginBottom: '32px' }}
                  key={'privateFundBasePie'}
                  columns={[
                    {
                      dataIndex: 'strategyType',
                      title: intl('228375', '产品策略'),
                    },
                    {
                      dataIndex: 'productNumber',
                      title: intl('2491', '产品数量'),
                      align: 'right',
                    },
                  ]}
                  pagination={false}
                  dataSource={privateFundProduct.list}
                />
              </Col>
            </Row>
          ) : null

          tables.push(
            <Card
              key={'privateFundProductFormance'}
              /*@ts-expect-error ttt*/
              multiTabId={eachTableKey}
              className="vtable-container private-fund-card"
              divider={'none'}
              title={intl('37254', '产品结构')}
            >
              {' '}
              {privateFundProduct ? pieStr : ''}{' '}
              {privateFundProductFormance ? (
                <Table
                  style={{ marginTop: '12px' }}
                  key={'privateFundBaseTable'}
                  columns={privateFundProductFormance.columns}
                  pagination={false}
                  dataSource={privateFundProductFormance.list}
                />
              ) : null}{' '}
            </Card>
          )
          currentModuleIsEmpty = false
          continue
        }

        if (basicNum.__specialcorp > 0) {
          // 特殊的企业如 社会组织 则根据指定的menu渲染
          const theModuleKey = eachTableKey.split('-')[0]
          if (theModuleKey !== 'moduleTitle' && !props.allMenuDataObj[theModuleKey]) {
            continue
          }
        }

        if (!props.singleModuleId) {
          if (eachTableKey == 'moduleTitle') {
            tables.push(
              <div
                key={corpModulePrimaryCfg[eachTableKey].moduleKey + '-moduleTitle'}
                className={` module-title  module-title-${corpModulePrimaryCfg[eachTableKey].moduleKey} `}
              >
                {corpModulePrimaryCfg[eachTableKey].title}
              </div>
            )
            continue
          }
        }
        // corpModulePrimaryCfg - 每个一级菜单包含的所有模块(大类)
        // eachTableKey - 每个二级菜单也就是独立模块对应的key
        // corpModuleSubCfg - 每个二级菜单对应：这里分两类 一类是包含多个子表的 如：股东信息模块，包含两个子表模块
        let corpModuleSubCfg: ICorpSubModuleCfg = corpModulePrimaryCfg[eachTableKey] as ICorpSubModuleCfg

        /**
         * asharelist_num  判断A股上市   >0就是上市，=0就是非上市
         * sharedbonds_num  判断发债企业  >0就是发债企业，=0就是非发债企业
         */
        // 非上市发债
        if (eachTableKey == 'showguarantee' && getIfIPOCorpByBasicNum(basicNum) && getIfBondCorpByBasicNum(basicNum)) {
          corpModuleSubCfg = corpModulePrimaryCfg[eachTableKey]['showguaranteeNotMarket']
        }

        // 此处谨慎修改，model num 为 undefined 时需要跳过这个逻辑
        if (!props.singleModuleId && 'modelNum' in corpModuleSubCfg && corpModuleSubCfg.modelNum) {
          const currentModuleNum = getCorpModuleNum(corpModuleSubCfg.modelNum, basicNum)
          if (!currentModuleNum) {
            continue
          }
          if (
            // 当前模块 配置为 true 固定展示，或者统计数字大于0

            (typeof currentModuleNum === 'number' && currentModuleNum > 0) ||
            currentModuleNum === true
          ) {
            corpModuleSubCfg.modelNumStr = (
              <CorpModuleNum
                numHide={corpModuleSubCfg.numHide}
                modelNum={corpModuleSubCfg.modelNum}
                basicNum={basicNum}
              />
            )
            currentModuleIsEmpty = false
          }
        }

        if (props.singleModuleId) {
          // f9等单独嵌入的单模块处理
          currentModuleIsEmpty = false
          if (props.singleModuleId.indexOf(eachTableKey) > -1) {
            renderTableDom(corpModuleSubCfg, eachTableKey, tables)
          }
        } else {
          renderTableDom(corpModuleSubCfg, eachTableKey, tables)
        }
      }
      if (!props.singleModuleId) {
        if (currentModuleIsEmpty) {
          if (
            corpModulePrimaryCfg.moduleTitle &&
            corpModulePrimaryCfg.moduleTitle.moduleKey !== 'intellectual' &&
            corpModulePrimaryCfg.moduleTitle.moduleKey !== 'bussiness'
          ) {
            // 当前大模块下子模块都不展示，则需要展示empty
            // 知识产权intellectual 大模块除外 （由于没有商标和专利的统计数字）   招投标 也除外  无统计数字 bussiness模块不显示暂无数据
            if (corpModulePrimaryCfg.moduleTitle.noneData) {
              tables.push(
                <div key={corpModulePrimaryCfg.moduleTitle.moduleKey + '-' + 'empty'} className="no-data-module">
                  <i></i> {corpModulePrimaryCfg.moduleTitle.noneData}
                </div>
              )
            } else {
              tables.push(
                <div key={corpModulePrimaryCfg.moduleTitle.moduleKey + '-' + 'empty'} className="no-data-module">
                  <i></i> {window.en_access_config ? 'No ' : intl('145622', '暂无')}
                  {corpModulePrimaryCfg.moduleTitle.title}
                  {window.en_access_config ? ' Data' : intl('203798', '数据')}
                </div>
              )
            }
          }
        }
      }

      bodys.push(tables)
    })

    if (props.singleModuleId) {
      // f9单个模块
      if (!bodys.join('').length) {
        // 一个错误的singleModuleId 如 xxx
        // 此时返回暂无数据即可
        return <div className="wind-ui-table-empty"> {intl('132725', '暂无数据')} </div>
      }
      return bodys.map((t) => {
        return t.map((tt) => {
          return tt
        })
      })
    }
    return bodys.map((t, idx) => {
      let css = 'corp-body-card '
      if (idx == 0) {
        css += ' corp-body-card-first '
      }
      if (t && t.length) {
        if (t[0].key == 'IpoBusinessData-moduleTitle') {
          // 业务数据
          css += ' corp-body-card-ipobussiness '
        }
        return (
          <div key={idx} className={css}>
            {t.map((tt) => {
              return tt
            })}
          </div>
        )
      }
    })
  }, [
    props.scrollModuleIds,
    props.corpCategory,
    props.allMenuDataObj,
    companyid,
    basicNum,
    medicActiveKey,
    privateFundProduct,
    privateFundProductFormance,
    isWidthLessThan985,
  ])
  /**
   * 上海工商联
   */
  // @ts-expect-error ttt
  const tablesSHFIC = useMemo(() => {
    const tables = []
    shficRowConfig.forEach((eachModule) => {
      for (const eachTableKey in eachModule) {
        const eachTable = eachModule[eachTableKey]

        if (eachTable.children) {
          if (!userVipInfo.isSvip && !userVipInfo.isVip) {
            if (eachTable.notVipTitle || eachTable.notVipTips) {
              tables.push(
                <Card
                  data-custom-id={eachTableKey}
                  key={eachTableKey}
                  className="table-custom-module-readyed vtable-container gqct-card"
                  divider={'none'}
                  title={eachTable.title}
                >
                  <VipModule
                    modelInstanceNum={global.VIP_MODEL_COUNT++}
                    show={true}
                    title={eachTable.notVipTitle || ''}
                    tips={eachTable.notVipTips || ''}
                  />
                </Card>
              )
              return
            }
          }

          // 有子表
          const tableChilds = []
          eachTable.children.map((childTable, idx) => {
            // @ts-expect-error ttt
            const tableStr = makeTable(childTable, eachTableKey, idx, true)
            tableChilds.push(tableStr)
          })
          const titleStr = (
            <div className="has-child-table">
              <span className="table-title">{eachTable.title}</span>
              {eachTable.hint ? (
                <Tooltip
                  overlayClassName="corp-tooltip"
                  title={<div dangerouslySetInnerHTML={{ __html: eachTable.hint }}></div>}
                >
                  <InfoCircleButton />
                </Tooltip>
              ) : null}

              {eachTable.modelNumStr}
              {eachTable.notVipTitle || eachTable.notVipTips ? (
                <span className="module-vip-tips" style={{ marginBlockStart: 7 }}></span>
              ) : null}
              {eachTable.rightLink
                ? eachTable.rightLink({
                    companyCode: companycode,
                    companyName: companyname,
                    companyId: companyid,
                  })
                : null}
              {eachTable.downDocType ? (
                <Button
                  onClick={() => {
                    downLoadExcel(eachTable.downDocType, eachTable.title, eachTable.companyname)
                  }}
                  icon={<DownloadO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                >
                  {intl('4698', '导出数据')}
                </Button>
              ) : null}
            </div>
          )
          const tableWrapper = (
            <Card key={eachTableKey + '-wrapper'} className="vtable-container" divider={'none'} title={titleStr}>
              {' '}
              {tableChilds.map((t) => {
                return t
              })}
            </Card>
          )
          tables.push(tableWrapper)
        } else {
          // @ts-expect-error ttt
          const tableStr = makeTable(eachTable, eachTableKey)
          tables.push(tableStr)
        }
      }
    })

    const css = 'corp-body-card '
    return (
      <div className={css}>
        {' '}
        {tables.map((tt) => {
          return tt
        })}{' '}
      </div>
    )
  })

  const tableDom = wftCommon.fromPage_shfic == wftCommon.fromPage() ? tablesSHFIC : tablesGEL

  return (
    <>
      {tableDom}
      {!props.singleModuleId ? (
        <div className="corp-body-card corp-body-card-last corp-body-card-bottom">
          {intl(
            437428,
            '免责声明：企业库所有数据来源于公开渠道和第三方提供，万得尊重并倡导保护知识产权，本产品所引用数据及其他信息仅作参考，不代表万得赞同或证实其描述。如对该数据服务存在异议，或发现违法及不良信息，请拨打电话400-820-9463或发送邮件至GelSupport@wind.com.cn，我们将及时处理。'
          ) +
            intl('437429', '数据来源说明') +
            (window.en_access_config ? ',' : '，')}
          <a
            style={{
              color: '#0093Ad',
            }}
            onClick={() => {
              store.dispatch(
                globalActions.setGolbalModal({
                  className: 'disclaimerModal',
                  width: 445,
                  height: 680,
                  visible: true,
                  onCancel: () => store.dispatch(globalActions.clearGolbalModal()),
                  title: intl('23348', '免责声明'),
                  content: (
                    <React.Suspense fallback={<div></div>}>
                      <p>
                        {intl(
                          391696,
                          '企业库所有数据来源于公开渠道和第三方提供，万得尊重并倡导保护知识产权，本产品所引用数据及其他信息仅作参考，不代表万得赞同或证实其描述。如对该数据服务存在异议，或发现违法及不良信息，请拨打电话400-820-9463或发送邮件至GelSupport@wind.com.cn，我们将及时处理。'
                        )}
                      </p>
                      <br />
                      <p>{intl('437429', '数据来源说明') + (window.en_access_config ? ':' : '：')}</p>
                      <p>
                        {(window.en_access_config ? '(1)' : '（1）') +
                          intl('416890', '基本信息：国家企业信用信息公示系统、全国建筑市场监管公共服务平台等。')}
                      </p>
                      <p>
                        {(window.en_access_config ? '(2)' : '（2）') +
                          intl(
                            '416891',
                            '法律诉讼：国家企业信用信息公示系统、中国裁判文书网、中国执行信息公开网、中华人民共和国最高人民法院、人民法院公告网、中国庭审公开网、各地方人民法院等。'
                          )}
                      </p>
                      <p>
                        {(window.en_access_config ? '(3)' : '（3）') +
                          intl(
                            '416892',
                            '经营风险：国家企业信用信息公示系统、国家税务总局、中国执行信息公开网、人民法院诉讼资产网、中国土地市场网、各省份税务局、各地市级环保局等。'
                          )}
                      </p>
                      <p>
                        {(window.en_access_config ? '(4)' : '（4）') +
                          intl(
                            '416933',
                            '经营信息：国家信用信息公示系统、巨潮资讯网、中国土地市场网、全国公共资源交易服务平台、中华人民共和国工业和信息化部网站、中国海关企业进出口信用信息管理平台、中国政府采购网、中国招标投标公共服务平台等。'
                          )}
                      </p>
                      <p>
                        {(window.en_access_config ? '(5)' : '（5）') +
                          intl(
                            '416953',
                            '知识产权：国家工商行政管理总局商标局、中华人民共和国国家知识产权局、中国版权登记门户网、中华人民共和国工业和信息化部网站、中国药监局官网、全国建筑市场监管公共服务平台、中国银保监会官网等。'
                          )}
                      </p>
                      <p>
                        {(window.en_access_config ? '(6)' : '（6）') +
                          intl(
                            '416934',
                            '历史信息：各官方网站，包括全国企业信用信息公示系统、中华人民共和国最高人民法院全国法院、国家知识产权局官方网站、国家工商行政管理总局商标局官网、国家版权局官方网站，为我司保存的官方网站历史记录，因参考、使用该信息造成的损失，万得征信不承担任何责任。'
                          )}
                      </p>
                    </React.Suspense>
                  ),
                  footer: [],
                })
              )
            }}
          >
            {intl('437430', '请点击') + '>>'}
          </a>
        </div>
      ) : null}
    </>
  )
}

/**
 * 减少重复渲染Hoc
 * @date 3/26/2024 - 11:33:41 AM
 */
const CompanyBase = memo(
  ({
    scrollModuleIds,
    singleModuleId,
    companycode,
    companyid,
    companyname,
    basicNum,
    companyRegDate,
    setCorpModuleReadyed,
    allMenuDataObj,
    ...prop
  }: {
    companyname
    companyid
    basicNum: ICorpBasicNumFront
    companycode
    companyRegDate
    company: IState['company']
    corpArea
    corpCategory: TCorpCategory[]
    menuClick
    singleModuleId
    scrollModuleIds: any[]
    setCorpModuleReadyed
    allMenuDataObj
    corpOtherInfo: ICorpOtherInfo
    refreshCorpOtherInfo: () => void
  }) => {
    return (
      <CompanyBaseY
        basicNum={basicNum}
        setCorpModuleReadyed={setCorpModuleReadyed}
        singleModuleId={singleModuleId}
        companyname={companyname}
        companycode={companycode}
        companyid={companyid}
        scrollModuleIds={scrollModuleIds}
        companyRegDate={companyRegDate}
        allMenuDataObj={allMenuDataObj}
        {...prop}
      />
    )
  }
)
CompanyBase.displayName = 'CompanyBase'
/**
 * table数据结构转换
 * @param {*} eachTable
 */
const setStructOfCols = (eachTable) => {
  if (eachTable.thName && eachTable.thName.length) {
    // 1 有thName 用兼容老企业库的config编写的columns
    eachTable.columns = eachTable.columns || []
    const cols = []
    eachTable.thName.map((_t, idx) => {
      let align = eachTable.align ? eachTable.align[idx] : 0
      align = align ? (align == 2 ? 'right' : 'center') : 'left'
      const col = {
        title: eachTable.thName ? eachTable.thName[idx] : '',
        width: eachTable.thWidthRadio ? eachTable.thWidthRadio[idx] : '',
        dataIndex: eachTable.fields ? eachTable.fields[idx] : '',
        align,
        render: function (_txt, row, _idx) {
          try {
            const tdName = col.dataIndex
            if (tdName.indexOf('|') > 0) {
              return wftCommon[tdName.split('|')[1]](row[tdName.split('|')[0]], row)
            }
            return row[col.dataIndex] ? row[col.dataIndex] : ''
          } catch (e) {
            return '--'
          }
        },
        ...eachTable.columns[idx],
      }
      cols.push(col)
    })
    eachTable.columns = cols
  }
  return eachTable
}

const mapStateToProps = (state: IState) => {
  return {
    company: state.company,
    scrollModuleIds: state.company.scrollModuleIds,
    corpCategory: state.company.corpCategory,
    corpArea: state.company.corpArea,
    corpOtherInfo: state.company.corpOtherInfo,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setCorpModuleReadyed: (data) => {
      dispatch(companyActions.setCorpModuleReadyed(data))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompanyBase)
