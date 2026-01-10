import { getIfBondCorpByBasicNum, getIfIPOCorpByBasicNum } from '@/domain/corpDetail'
import { getCorpModuleNum } from '@/handle/corp/basicNum/handle.tsx'
import { CorpPrimaryModuleCfg, CorpSubModuleCfg } from '@/types/corpDetail'
import Table from '@wind/wind-ui-table'
import { TCorpDetailSubModule } from 'gel-types'
import React, { memo, useMemo } from 'react'
import intl from '../../utils/intl'
import PublicFundSize from './buss/fund/PublicFundSize'
import { CorpModuleNum } from './detail/comp/CorpNum'
import { CompanyBaseYProps } from './type/companyBaseY'

const { HorizontalTable } = Table
const WCBChartComp = () => React.lazy(() => import('./WcbChartDiv'))
// 这里如果放到具体组件里 父组件属性变动会造成重复渲染，必须拿出来
const WCBChartCss = memo(WCBChartComp())
const FinancialDataRegionToggleComp = () => React.lazy(() => import('./buss/financial/FinancialDataRegionToggle'))
const FinancialDataRegionToggleCss = memo(FinancialDataRegionToggleComp())

export const useTablesGel = (params: {
  props: CompanyBaseYProps
  corpModuleCfg: CorpPrimaryModuleCfg[]
  renderTableDom: (
    corpModuleSubCfg: CorpSubModuleCfg,
    eachTableKey: TCorpDetailSubModule | 'moduleTitle',
    tables
  ) => void
  fundSizeDataPie: any
  fundSizeData: any
  companyid: string
  isWidthLessThan985: boolean
}) => {
  const { props, corpModuleCfg, renderTableDom, fundSizeDataPie, fundSizeData, companyid, isWidthLessThan985 } = params
  const { basicNum } = props
  return useMemo(() => {
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

    // 根据是否有自定义顺序来决定渲染方式
    let moduleConfigsToRender = corpModuleCfg

    if (props.singleModuleOrder && props.singleModuleOrder.length > 0) {
      // 直接按用户指定的模块顺序逐个渲染，而不是重新排列配置组
      props.singleModuleOrder.forEach((moduleId) => {
        // 在所有配置组中查找包含该模块的配置
        for (const corpModulePrimaryCfg of corpModuleCfg) {
          if (corpModulePrimaryCfg[moduleId]) {
            const tables = []
            let currentModuleIsEmpty = true

            // 应用原有的业务逻辑检查
            if (
              corpModulePrimaryCfg.showFundSize &&
              (!props.corpCategory || props.corpCategory.indexOf('publicfund') == -1)
            ) {
              break
            }
            if (corpModulePrimaryCfg.showIpoYield && (!props.corpCategory || props.corpCategory.indexOf('ipo') == -1)) {
              break
            }

            // 只渲染当前指定的模块
            const eachTableKey = moduleId
            let corpModuleSubCfg = corpModulePrimaryCfg[eachTableKey] as CorpSubModuleCfg

            // 处理特殊模块配置
            if (
              eachTableKey == 'showguarantee' &&
              getIfIPOCorpByBasicNum(basicNum) &&
              getIfBondCorpByBasicNum(basicNum)
            ) {
              corpModuleSubCfg = corpModulePrimaryCfg[eachTableKey]['showguaranteeNotMarket']
            }

            // 处理统计数字
            if (!props.singleModuleId && 'modelNum' in corpModuleSubCfg && corpModuleSubCfg.modelNum) {
              const currentModuleNum = getCorpModuleNum(corpModuleSubCfg.modelNum, basicNum)
              if (!currentModuleNum) {
                break
              }
              if ((typeof currentModuleNum === 'number' && currentModuleNum > 0) || currentModuleNum === true) {
                corpModuleSubCfg.modelNumStr = (
                  <CorpModuleNum
                    numHide={corpModuleSubCfg.numHide}
                    modelNum={corpModuleSubCfg.modelNum}
                    basicNum={basicNum}
                  />
                )
              }
            }

            // 检查模块是否应该渲染
            const tableReady = props.scrollModuleIds.indexOf(eachTableKey) > -1
            const hasSingleModule = props.singleModuleId && props.singleModuleId.indexOf(eachTableKey) > -1

            if (props.singleModuleId) {
              if (hasSingleModule) {
                renderTableDom(corpModuleSubCfg, eachTableKey, tables)
                currentModuleIsEmpty = false
              }
            } else {
              if (tableReady) {
                renderTableDom(corpModuleSubCfg, eachTableKey, tables)
                currentModuleIsEmpty = false
              }
            }

            if (!currentModuleIsEmpty && tables.length > 0) {
              // 注意：这里需要推送tables数组，而不是包装后的div，保持与原逻辑一致
              bodys.push(tables)
            }

            break // 找到模块后跳出配置组循环
          }
        }
      })
    } else {
      // 原有的默认渲染逻辑
      moduleConfigsToRender.map((corpModulePrimaryCfg, _idx) => {
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
          if (corpModulePrimaryCfg.showIpoYield) {
            // 业务数据模块， 如果当前企业非上市公司，直接跳过
            if (!props.corpCategory || props.corpCategory.indexOf('ipo') == -1) {
              currentModuleIsEmpty = false
              continue
            }
          }
          /* ------------------------------------------------------------------------------------------------- */

          if (eachTableKey == 'showFundSize') {
            const tableReady = props.scrollModuleIds.indexOf(eachTableKey) > -1
            const hasSingleModule = props.singleModuleId && props.singleModuleId.indexOf(eachTableKey) > -1
            const shouldRenderContent = props.singleModuleId ? hasSingleModule : tableReady
            tables.push(
              <PublicFundSize
                key={eachTableKey}
                eachTableKey={eachTableKey}
                fundSizeDataPie={fundSizeDataPie}
                fundSizeData={fundSizeData}
                shouldRenderContent={shouldRenderContent}
                ChartComp={WCBChartCss}
              />
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
              const mk = corpModulePrimaryCfg[eachTableKey].moduleKey
              const titleNode = (
                <div key={mk + '-moduleTitle'} className={` module-title  module-title-${mk} `}>
                  <div>{corpModulePrimaryCfg[eachTableKey].title}</div>
                  {mk === 'financialData' &&
                  props.basicNum?.domesticFinancialReportNum > 0 &&
                  props.basicNum?.overseasFinancialReportNum > 0 ? (
                    <React.Suspense fallback={<div></div>}>
                      {
                        <FinancialDataRegionToggleCss
                          companycode={props.companycode}
                          style={{ marginInlineStart: 8 }}
                          basicNum={props.basicNum}
                        />
                      }
                    </React.Suspense>
                  ) : null}
                </div>
              )
              tables.push(titleNode)
              continue
            }
          }
          // corpModulePrimaryCfg - 每个一级菜单包含的所有模块(大类)
          // eachTableKey - 每个二级菜单也就是独立模块对应的key
          // corpModuleSubCfg - 每个二级菜单对应：这里分两类 一类是包含多个子表的 如：股东信息模块，包含两个子表模块
          let corpModuleSubCfg: CorpSubModuleCfg = corpModulePrimaryCfg[eachTableKey] as CorpSubModuleCfg

          /**
           * asharelist_num  判断A股上市   >0就是上市，=0就是非上市
           * sharedbonds_num  判断发债企业  >0就是发债企业，=0就是非发债企业
           */
          // 非上市发债
          if (
            eachTableKey == 'showguarantee' &&
            getIfIPOCorpByBasicNum(basicNum) &&
            getIfBondCorpByBasicNum(basicNum)
          ) {
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
    } // 结束else分支

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
    props.singleModuleOrder, // 添加新的依赖
    companyid,
    basicNum,
    isWidthLessThan985,
  ])
}
