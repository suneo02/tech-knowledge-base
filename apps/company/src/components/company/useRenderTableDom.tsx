import { getCorpModuleNum } from '@/handle/corp/basicNum/handle.tsx'
import { CorpBasicNumFront } from '@/types/corpDetail/basicNum.ts'
import { CorpSubModuleCfg } from '@/types/corpDetail/module.ts'
import { CompanyDetailCustom } from '@/types/corpDetail/node/custom'
import { Card, Tabs, Tooltip } from '@wind/wind-ui'
import { CorpPurchaseData } from 'gel-types'
import React, { lazy, memo, ReactNode, Suspense } from 'react'
import { useCompanyTabWidth } from '../../hooks/useCompanyTabWidth'
import { getVipInfo } from '../../lib/utils'
import { InfoCircleButton } from '../icons/InfoCircle/index.tsx'
import { CompanyVipCard } from './auth/CompanyVipCard.tsx'
import FinancialStatements from './custom/FinancialStatements/index.tsx'
import { handleBuryInCorpDetailModuleTab } from './detail/bury'
import { CorpModuleNum, CorpModuleNumClassChild } from './detail/comp/CorpNum'
import { CompanyBaseYProps } from './type/companyBaseY.ts'
import { MakeTableInCompanyBase } from './type/makeTable.ts'

// 懒加载 HKCorpInfo 组件 - 仅在香港企业时才加载
const HKCorpInfo = lazy(() =>
  import('@/components/company/HKCorp/info').then((module) => ({
    default: module.HKCorpInfo,
  }))
)

const FinancialIndicators = lazy(() =>
  import('@/components/company/custom/FinancialIndicators').then((module) => ({
    default: module.FinancialIndicators,
  }))
)

const MaskRedirect = lazy(() =>
  import('@/components/company/MaskRedirect/index').then((module) => ({
    default: module.MaskRedirect,
  }))
)

// 白名单：只有在这些 eachTableKey 中才显示额外的 div
const whiteList = [
  'biddingInfo', // 招标公告
  'tiddingInfo', // 投标公告
  'getpatent', // 专利
]

const TabPane = Tabs.TabPane
const StatisticalChartComp = () => React.lazy(() => import('./StatisticalChart'))
// 这里如果放到具体组件里 父组件属性变动会造成重复渲染，必须拿出来
const StatisticalChartCss = memo(StatisticalChartComp())

export const useRenderTableDom = (params: {
  basicNum: CorpBasicNumFront
  companycode: string
  companyname: string
  companyid: string
  hkCorpInfoBuyData: CorpPurchaseData
  companyRegDate: string
  corpId: string
  props: CompanyBaseYProps
  makeTable: MakeTableInCompanyBase
}) => {
  const { basicNum, companycode, companyname, companyid, hkCorpInfoBuyData, companyRegDate, corpId, props, makeTable } =
    params
  const userVipInfo = getVipInfo()
  const isWidthLessThan985 = useCompanyTabWidth()

  // 所有配置类表格生产Dom
  const renderTableDom = (corpModuleSubCfg: CorpSubModuleCfg, eachTableKey, tables) => {
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
    if ('custom' in corpModuleSubCfg && corpModuleSubCfg.custom === CompanyDetailCustom.HKCorpInfo) {
      if (getCorpModuleNum(corpModuleSubCfg.modelNum, basicNum)) {
        tables.push(
          <Suspense fallback={<div>Loading...</div>}>
            <HKCorpInfo
              corpCode={companycode}
              corpName={companyname}
              tableReady={props.scrollModuleIds.indexOf(eachTableKey) > -1 ? true : false}
              bussStatusData={hkCorpInfoBuyData}
              baseInfo={props?.company?.baseInfo}
              refreshHKCorpBussStatus={props.refreshCorpOtherInfo}
            />
          </Suspense>
        )
      }
    } else if ('custom' in corpModuleSubCfg && corpModuleSubCfg.custom === CompanyDetailCustom.MaskRedirect) {
      if (getCorpModuleNum(corpModuleSubCfg.modelNum, basicNum)) {
        tables.push(
          <Suspense fallback={<div>Loading...</div>}>
            <MaskRedirect
              title={corpModuleSubCfg.title}
              modelNum={corpModuleSubCfg.modelNum}
              basicNum={basicNum}
              maskRedirect={corpModuleSubCfg.maskRedirect}
              companyCode={companycode}
              moduleKey={eachTableKey}
            />
          </Suspense>
        )
      }
    } else if ('custom' in corpModuleSubCfg && corpModuleSubCfg.custom === CompanyDetailCustom.FinancialStatements) {
      tables.push(<FinancialStatements companyCode={companycode} basicNum={basicNum} />)
    } else if ('custom' in corpModuleSubCfg && corpModuleSubCfg.custom === CompanyDetailCustom.FinancialIndicators) {
      tables.push(
        <Suspense fallback={<div>Loading...</div>}>
          <FinancialIndicators
            subCfg={corpModuleSubCfg}
            companycode={companycode}
            companyname={companyname}
            basicNum={basicNum}
            moduleKey={eachTableKey}
            corpId={corpId}
          />
        </Suspense>
      )
    } else if ('withTab' in corpModuleSubCfg && corpModuleSubCfg.withTab) {
      if (!userVipInfo.isSvip && !userVipInfo.isVip) {
        if (
          ('notVipTitle' in corpModuleSubCfg && corpModuleSubCfg.notVipTitle) ||
          ('notVipTips' in corpModuleSubCfg && corpModuleSubCfg.notVipTips)
        ) {
          tables.push(
            <CompanyVipCard
              dataCustomId={eachTableKey}
              key={eachTableKey}
              title={corpModuleSubCfg.title}
              vipTitle={(('notVipTitle' in corpModuleSubCfg && corpModuleSubCfg.notVipTitle) || '') as ReactNode}
            />
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
            <CompanyVipCard
              dataCustomId={eachTableKey}
              key={eachTableKey}
              title={corpModuleSubCfg.title}
              vipTitle={(('notVipTitle' in corpModuleSubCfg && corpModuleSubCfg.notVipTitle) || '') as ReactNode}
            />
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

  return renderTableDom
}
