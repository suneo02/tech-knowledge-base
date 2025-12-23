import { useCorpModuleCfg } from '@/components/company/handle'
import { makeCorpTableByCorpArea } from '@/components/company/handle/makeTableByArea.tsx'
import { useBuyStatusInDetail } from '@/components/company/HKCorp/api.ts'
import { HKCorpInfo } from '@/components/company/HKCorp/info'
import { ICorpSubModuleCfg, ICorpTableCfg } from '@/components/company/type'
import { getCorpModuleNum } from '@/handle/corp/basicNum/handle.tsx'
import { TCorpCategory } from '@/handle/corp/corpType/category.ts'
import { downLoadExcelInCompanyBase } from '@/handle/corp/download.ts'
import { DownloadO } from '@wind/icons'
import { Button, Card, Tabs, Tooltip } from '@wind/wind-ui'
import Table from '@wind/wind-ui-table'
import { CorpOtherInfo, TCorpDetailSubModule } from 'gel-types'
import React, { FC, lazy, memo, Suspense, useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import * as companyActions from '../../actions/company'
import * as globalActions from '../../actions/global'
import { getCorpModuleInfo } from '../../api/companyApi'
import { ICorpBasicNumFront } from '../../handle/corp/basicNum/type.ts'
import { useCompanyTabWidth } from '../../hooks/useCompanyTabWidth'
import global from '../../lib/global'
import { getVipInfo } from '../../lib/utils'
import { IState } from '../../reducers/type.ts'
import store from '../../store/store'
import intl from '../../utils/intl'
import { wftCommon } from '../../utils/utils'
import { InfoCircleButton } from '../icons/InfoCircle/index.tsx'
import CompanyTable from './CompanyTable.tsx'
import { handleBuryInCorpDetailModuleTab } from './detail/bury'
import { CorpModuleNum, CorpModuleNumClassChild } from './detail/comp/CorpNum'
import { shficRowConfig } from './listRowConfig.tsx'
import corpTableStyles from './style/corpTable.module.less'
import { useTablesGel } from './tablesGel.tsx'
import { CompanyBaseYProps } from './type/companyBaseY.ts'
import VipModule from './VipModule'

// 懒加载 FinancialDataUnitFilter 组件 - 仅在财务数据模块时才加载
const FinancialDataUnitFilter = lazy(() =>
  import('./buss/financial/FinancialDataUnitFilter.tsx').then((module) => ({
    default: module.FinancialDataUnitFilter,
  }))
)

// 白名单：只有在这些 eachTableKey 中才显示额外的 div
const whiteList = [
  'biddingInfo', // 招标公告
  'tiddingInfo', // 投标公告
  'getpatent', // 专利
]

const TabPane = Tabs.TabPane
const { HorizontalTable } = Table
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
 */
const CompanyBaseY: FC<CompanyBaseYProps> = (props) => {
  const userVipInfo = getVipInfo()
  const isWidthLessThan985 = useCompanyTabWidth()

  const companyname = props.companyname
  const companyid = props.companyid
  const basicNum = props.basicNum
  const companycode = props.companycode
  const companyRegDate = props.companyRegDate
  const corpId = props?.company?.baseInfo?.corp_id
  const corpArea = props.corpArea // 国家地区
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
              data-uc-id="mLgOkU9tWW"
              data-uc-ct="tabs"
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
                    key={idx}
                    data-uc-id="lqxC1LBIXy"
                    data-uc-ct="tabpane"
                    data-uc-x={idx}
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
                icon={
                  <DownloadO
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    data-uc-id="55QZVSikT"
                    data-uc-ct="downloado"
                  />
                }
                data-uc-id="Tlj4KDP4XW"
                data-uc-ct="button"
              >
                {intl('4698', '导出数据')}
              </Button>
            ) : null}
            {eachTableKey == 'FinancialData' ? (
              <div className="financial-select">
                {' '}
                <span> {intl('31686', '单位')}：</span>
                <Suspense fallback={<div></div>}>
                  <FinancialDataUnitFilter corpModuleSubCfg={corpModuleSubCfg} />
                </Suspense>
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

  const tablesGEL = useTablesGel({
    props,
    corpModuleCfg,
    renderTableDom,
    fundSizeDataPie,
    fundSizeData,
    privateFundBase,
    privateFundProduct,
    privateFundProductFormance,
    companyid,
    isWidthLessThan985,
  })
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
                  icon={
                    <DownloadO
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                      data-uc-id="pjl1Y0zP4u"
                      data-uc-ct="downloado"
                    />
                  }
                  data-uc-id="e0s3DiSL08"
                  data-uc-ct="button"
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
            data-uc-id="6UkIecAUrz_"
            data-uc-ct="a"
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
    singleModuleOrder,
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
    singleModuleOrder?: string[]
    scrollModuleIds: any[]
    setCorpModuleReadyed
    allMenuDataObj
    corpOtherInfo: CorpOtherInfo
    refreshCorpOtherInfo: () => void
  }) => {
    return (
      <CompanyBaseY
        basicNum={basicNum}
        setCorpModuleReadyed={setCorpModuleReadyed}
        singleModuleId={singleModuleId}
        singleModuleOrder={singleModuleOrder}
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
