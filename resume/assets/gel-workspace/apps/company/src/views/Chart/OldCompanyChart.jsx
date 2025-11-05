import React, { useEffect, useMemo, useState } from 'react'

import CompanyChart from './CompanyChart'
import './companyChart.less'
// import  './commonAssembly.css'
import loading from '../../assets/imgs/loading.gif'
import intl from '../../utils/intl'
import { getCompanyName } from '../../api/searchListApi'
import { wftCommon } from '../../utils/utils'
import { atlasTreeData } from '../AtlasPlatform'
import PreInput from '../../components/common/search/PreInput'
import { pointBuriedByModule } from '../../api/pointBuried/bury'

const ShareAndInvestComp = React.lazy(() => import('../Charts/ShareInvestChart'))
const InvestChartComp = React.lazy(() => import('../Charts/InvestChart'))
const BeneficialChartComp = React.lazy(() => import('../Charts/BeneficialChart'))
const ActCtrlChartComp = React.lazy(() => import('../Charts/ActCtrlChart'))
const RelateChartComp = React.lazy(() => import('../Charts/RelateChart'))
const CompanyMapComp = React.lazy(() => import('../Charts/CompanyMap'))

const ChartComponentEnum = {
  chart_gqct: ShareAndInvestComp, // 股权穿透
  chart_newtzct: InvestChartComp, // 对外投资
  chart_yskzr: ActCtrlChartComp, // 实际控制
  chart_qysyr: BeneficialChartComp, // 最终受益
  chart_glgx: RelateChartComp, // 关联方
  chart_qytp: CompanyMapComp, // 企业图谱
}

let Common = wftCommon
const OldCompanyChart = ({ type, companyCode, onlyChart = false, bottomMask = true }) => {
  const [companycode, setCompanycode] = useState(companyCode)
  const [companyInfo, setCompanyInfo] = useState({})
  const [showInput, setShowInput] = useState(false)
  const [chartComp, setChartComp] = useState(null)

  useEffect(() => {
    if (companyCode !== companycode) {
      setCompanycode(companyCode)
    }
  }, [companyCode])

  useEffect(() => {
    switch (type) {
      case 'chart_glgx':
        pointBuriedByModule(922602100891)
        break
      case 'chart_yskzr':
        pointBuriedByModule(922602100364)
    }
  }, [type])
  useEffect(() => {
    const ChildCompopent = ChartComponentEnum[type] || null
    const fn = async () => {
      let res = await getCompanyName({
        companycode: companycode,
      })
      setCompanyInfo(res?.Data)

      if (ChildCompopent) {
        // 新版
      } else {
        // TODO 切换到新版时这个埋点可去除
        if (type === 'chart_qysyr') {
          pointBuriedByModule(922602100993)
        }
        CompanyChart.init(type, res?.Data)
      }
    }

    if (ChildCompopent) {
      if (type === 'chart_qysyr') {
        pointBuriedByModule(922602100993)
      }
      setChartComp(
        <React.Suspense fallback={<div></div>}>
          {<ChildCompopent companycode={companycode}></ChildCompopent>}
        </React.Suspense>
      )
    } else {
      setChartComp(null)
    }

    fn()

    return () => {
      if (ChildCompopent) {
        // 新版
      } else {
        CompanyChart.reset()
      }
    }
  }, [type, companycode])

  let activeNav = useMemo(() => {
    return Common.flattenObjectArray(atlasTreeData).find((i) => {
      return i.key === type
    })?.title
  }, [type]) // 获取选中的nav的名字

  const { companyName, companyId } = companyInfo
  return (
    <>
      <div className={onlyChart ? 'companyChart companyChart-only' : 'companyChart'}>
        <div className="toolbar chart-topbar" id="toolBar" style={{ display: 'none' }} />
        <div className="wrapper clearfix">
          {!onlyChart && (
            <div className="nav clearfix" id="mainNav" style={{ height: '38px' }}>
              {showInput ? (
                <div className="search-relation">
                  <div className="search-relation-from">
                    <PreInput
                      type="text"
                      defaultValue={companyName}
                      className="input-search-relation"
                      width={250}
                      style={{
                        display: 'inline-block',
                      }}
                      autocomplete="off"
                      id="inputSearchRelation02"
                      maxlength="14"
                      selectItem={(t) => {
                        setShowInput(false)
                        setCompanycode(t?.id)
                        setCompanyInfo({
                          companyName: t.name,
                          companyId: t?.id,
                        })
                      }}
                    ></PreInput>
                    <span
                      data-code="1047934153"
                      onClick={() => {
                        setShowInput(false)
                      }}
                      className="wi-demo-link wi-demo-link-switch"
                      style={{
                        lineHeight: '36px',
                        cursor: 'pointer',
                        marginLeft: '50px',
                      }}
                    >
                      {intl('19405', '取消')}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="nav-company-name fl">
                  <span
                    className="nav-name-txt"
                    onClick={() => {
                      Common.linkCompany('Bu3', companycode)
                    }}
                  >
                    {companyName}
                  </span>
                  <span className="active-nav">{activeNav}</span>
                  <span
                    data-code="1047934153"
                    onClick={() => {
                      if (type === 'chart_qysyr') {
                        pointBuriedByModule(922602100995)
                      }
                      setShowInput(true)
                    }}
                    className="wi-demo-link wi-demo-link-switch"
                  >
                    {intl('367453', '切换企业')}
                  </span>
                </div>
              )}

              <div className="nav-tabs" style={{ display: 'none' }}>
                <div className="nav-block">
                  <div className="menu-title">
                    <a id="linkGQCT" href="#chart_gqct" className="wi-link-color" langkey="138279">
                      {intl('138279', '股权穿透')}
                    </a>
                    <div className="menu-title-underline " />
                  </div>
                </div>

                <div className="nav-block">
                  <div className="menu-title">
                    <a id="linkTZCT" langkey="345553" href="#chart_newtzct" className="wi-link-color">
                      {intl('345553', '投资穿透图')}
                    </a>
                    <div className="menu-title-underline " />
                  </div>
                </div>

                <div className="nav-block">
                  <div className="menu-title">
                    <a id="linkYSKZR" href="#chart_yskzr" className="wi-link-color" langkey="261456">
                      {intl('261456', '疑似实控人')}
                    </a>
                    <div className="menu-title-underline " />
                  </div>
                </div>

                <div className="nav-block">
                  <div className="menu-title">
                    <a id="linkQYSYR" href="#chart_qysyr" className="wi-link-color" langkey="258886">
                      {intl('214864', '企业受益人图')}
                    </a>
                    <div className="menu-title-underline " />
                  </div>
                </div>

                <div className="nav-block">
                  <div className="menu-title">
                    <a id="linkGLGX" href="#chart_glgx" className="wi-link-color" langkey="243685">
                      {intl('243685', '关联方图谱')}
                    </a>
                    <div className="menu-title-underline " />
                  </div>
                </div>

                <div className="nav-block">
                  <div className="menu-title">
                    <a id="linkRZLC" href="#chart_rzlc" className="wi-link-color" langkey="260223">
                      {intl('138297', '融资历程')}
                    </a>
                    <div className="menu-title-underline " />
                  </div>
                </div>

                <div className="nav-block" id="navRZTP" style={{ display: 'none' }}>
                  <div className="menu-title">
                    <a id="linkRZTP" href="#chart_rztp" className="wi-link-color" langkey="258887">
                      {intl('206370', '融资图谱')}
                    </a>
                    <div className="menu-title-underline " />
                  </div>
                </div>

                <div className="nav-block">
                  <div className="menu-title">
                    <a id="linkYSGX" href="#chart_ysgx" className="wi-link-color" langkey="138486">
                      {intl('138486', '疑似关系')}
                    </a>
                    <div className="menu-title-underline " />
                  </div>
                </div>

                <div className="nav-block">
                  <div className="menu-title">
                    <a id="linkQYTP" href="#chart_qytp" className="wi-link-color" langkey="259132">
                      {intl('138676', '企业图谱')}
                    </a>
                    <div className="menu-title-underline " />
                  </div>
                </div>

                <div className="nav-relation">
                  <div className="menu-relation">
                    <span langkey="422046" id="linkToRelation">
                      {intl('422046', '查关系')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="content clearfix">
            {chartComp ? (
              chartComp
            ) : (
              <div id="rContent" className="r-content">
                {/* chart画布 */}
                <div className="mao-screen-area" id="screenArea">
                  <div className="chart-loading" id="load_data" style={{ display: 'none' }}>
                    <img src={loading} />
                    <span langkey="417506">{intl('420204', '加载中..')}</span>...
                  </div>
                  <div className="chart-none" id="no_data" style={{ display: 'none' }} langkey="132725">
                    {intl('132725', '暂无数据')}
                  </div>
                  <div id="companyChart" />
                </div>

                {/* 疑似实际控制人文本内容 */}
                <div className="chart-yskzr" style={{ display: 'none' }}></div>

                <div className="corp-list-framediv">
                  <div className="corp-list-title">
                    <span id="corpListTitle" />
                    <i />
                  </div>
                  <iframe id="corpListIframe" frameBorder="0" width="410" height="600" />
                </div>
              </div>
            )}
          </div>
          {bottomMask && (
            <div className="bottom-content" langkey="437654">
              {intl('437654', '计算结果基于公开信息和第三方数据利用大数据技术独家计算生成')}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default OldCompanyChart
