import { Layout, ThemeProvider, Tree } from '@wind/wind-ui'
import React, { useEffect, useRef, useState } from 'react'
import { pointBuriedGel } from '../api/configApi'
import atlasBg from '../assets/imgs/atlas_bg.png'
import atlasCglj from '../assets/imgs/atlas_cglj.png'
import atlasCgx from '../assets/imgs/atlas_cgx.png'
import atlasDdycd from '../assets/imgs/atlas_ddycd.png'
import atlasDwtz from '../assets/imgs/atlas_dwtz.png'
import atlasGlftp from '../assets/imgs/atlas_glftp.png'
import atlasGqct from '../assets/imgs/atlas_gqct.png'
import atlasJztp from '../assets/imgs/atlas_jztp.png'
import atlasQytp from '../assets/imgs/atlas_qytp.png'
import atlasRzlc from '../assets/imgs/atlas_rzlc.png'
import atlasRztp from '../assets/imgs/atlas_rztp.png'
import atlasYsgx from '../assets/imgs/atlas_ysgx.png'
import atlasYsskr from '../assets/imgs/atlas_ysskr.png'
import atlasZzsyr from '../assets/imgs/atlas_zzsyr.png'
import intl from '../utils/intl'
import { wftCommon } from '../utils/utils'
import './AtlasPlatform.less'

import OldCompanyChart from './Chart/OldCompanyChart'
import { pointBuriedByModule } from '../api/pointBuried/bury'

const ForceRelationChart = () => React.lazy(() => import('./Charts/ForceRelationChart'))
const ForceRelationChartComp = ForceRelationChart()
const DetachChart = () => React.lazy(() => import('./Charts/DetachChart'))
const DetachChartComp = DetachChart()
const ShareholderGraph = () => React.lazy(() => import('./Charts/ShareholderGraph'))
const ShareholderGraphComp = ShareholderGraph()
// const ShareAndInvest = () => React.lazy(() => import('./Charts/ShareInvestChart'))
// const ShareAndInvestComp = ShareAndInvest()
// const InvestChart = () => React.lazy(() => import('./Charts/InvestChart'))
// const InvestChartComp = InvestChart()

const { Header, Content, Sider } = Layout

export const atlasTreeData = [
  {
    title: intl('367279', '图谱平台首页'),
    key: 'atlasplatform',
    url: 'index.html?isSeparate=1&nosearch=1#/atlasplatform',
    parentNode: false, // 点击事件中为true是展开的效果，为false是跳转页面
    homePage: true, // 用来判断跳转的是否是react新的router
  },
  {
    title: intl('367256', '股权类图谱'),
    key: 'gqltp',
    parentNode: true,
    children: [
      {
        title: intl('138279', '股权穿透图'),
        key: 'chart_gqct',
        url: 'CompanyChart.html?companycode={companyCode}&notoolbar=1&nonavtabs=1#chart_gqct',
        img: atlasGqct,
        buryId: 922602100370,
      },
      {
        title: intl('367274', '对外投资图'),
        key: 'chart_newtzct',
        url: 'CompanyChart.html?companycode={companyCode}&notoolbar=1&nonavtabs=1#chart_newtzct',
        img: atlasDwtz,
        buryId: 922602100998,
      },
      {
        title: intl('356113', '实控人图谱'),
        key: 'chart_yskzr',
        url: 'CompanyChart.html?companycode={companyCode}&notoolbar=1&nonavtabs=1#chart_yskzr',
        img: atlasYsskr,
        buryId: 922602100303,
      },
      {
        title: intl('367259', '受益人图谱'),
        key: 'chart_qysyr',
        url: 'CompanyChart.html?companycode={companyCode}&notoolbar=1&nonavtabs=1#chart_qysyr',
        img: atlasZzsyr,
        buryId: 922602100994,
      },
    ],
  },
  {
    title: intl('367257', '关系类图谱'),
    key: 'gxltp',
    parentNode: true,
    children: [
      {
        title: intl('243685', '关联方图谱'),
        key: 'chart_glgx',
        url: 'CompanyChart.html?companycode={companyCode}&notoolbar=1&nonavtabs=1#chart_glgx',
        img: atlasGlftp,
      },
      {
        title: intl('138676', '企业图谱'),
        key: 'chart_qytp',
        url: 'CompanyChart.html?companycode={companyCode}&notoolbar=1&nonavtabs=1#chart_qytp',
        img: atlasQytp,
      },
      {
        title: intl('138486', '疑似关系'),
        key: 'chart_ysgx',
        url: 'CompanyChart.html?companycode={companyCode}&notoolbar=1&nonavtabs=1#chart_ysgx',
        img: atlasYsgx,
        buryId: 922602100302,
      },
      // 产品词图谱暂时隐藏
      // {
      //     title: intl('367260',"产品词图谱"),
      //     key: 'chart_cpctp',
      //     url: '',
      //     img: atlasCpctp
      // },
      {
        title: intl('342095', '竞争图谱'),
        key: 'chart_jztp',
        url: '/windkg/index.html#/competitors?companyname={companyName}&id={lc}',
        img: atlasJztp,
        externalLink: true,
      },
    ],
  },
  {
    title: intl('367258', '融资类图谱'),
    key: 'rzltp',
    parentNode: true,
    children: [
      {
        title: intl('206370', '融资图谱'),
        key: 'chart_rztp',
        url: 'CompanyChart.html?companycode={companyCode}&notoolbar=1&nonavtabs=1#chart_rztp',
        img: atlasRztp,
        buryId: 922602100301,
      },
      {
        title: intl('138297', '融资历程'),
        key: 'chart_rzlc',
        url: 'CompanyChart.html?companycode={companyCode}&notoolbar=1&nonavtabs=1#chart_rzlc',
        img: atlasRzlc,
        buryId: 922602100304,
      },
    ],
  },
  {
    title: intl('422046', '查关系'),
    key: 'cgx',
    parentNode: true,
    children: [
      {
        title: intl('422046', '查关系'),
        key: 'chart_cgx',
        url: 'relationChart',
        // url: 'ChartPlatForm.html?lc={lc}&lcn={companyName}&notoolbar=1&nonavtabs=1',
        img: atlasCgx,
      },
      {
        title: intl('247485', '多对一触达'),
        key: 'chart_ddycd',
        url: 'chartDetach',
        img: atlasDdycd,
        buryId: 922602101004,
      },
      {
        title: intl('303394', '持股路径'),
        key: 'chart_cglj',
        url: 'ChartPlatForm_inner.html?notoolbar=1&nonavtabs=1',
        img: atlasCglj,
      },
    ],
  },
]

function AtlasPlatform(props) {
  const iframeRef = useRef()
  const [selectedKeys, setSelectedKeys] = useState(['atlasplatform']) // 选中的节点
  const [expandedKeys, setExpandedKeys] = useState(['atlasplatform', 'gqltp', 'gxltp', 'rzltp', 'cgx']) // 展开的节点
  const [isHomePage, setIsHomePage] = useState(true) // 点击的是否是首页链接
  const [linkVal, setLinkVal] = useState('') // iframe的链接
  let companycode = wftCommon.parseQueryString('companycode', window.location.search)
  let companyname = wftCommon.parseQueryString('companyname', window.location.search)
  let activeKey = wftCommon.parseQueryString('activeKey', window.location.search)
  let companycodeVal = companycode || '0A1015343518584'
  let companynameVal = companyname || '融创房地产集团有限公司'

  useEffect(() => {
    window.document.title = intl('138167', '图谱平台')
    window.addEventListener('message', setCompanyInfo) // 接收iframe中改变公司的相关信息

    pointBuriedGel('922602100949', '图谱平台首页', 'atlasPlatform', {
      opActive: 'loading',
      currentPage: 'atlasPlatform',
      opEntity: '图谱平台首页',
    })

    init()

    return () => {
      window.removeEventListener('message', setCompanyInfo)
    }
  }, [])

  const init = () => {
    let link = ''
    let selectNavId = activeKey || sessionStorage.getItem('selectNavId')
    if (selectNavId) {
      setSelectedKeys([selectNavId])
      let lc = companycodeVal.length > 10 ? companycodeVal.substr(2, 10) : companycodeVal
      atlasTreeData.map((item) => {
        item?.children?.length > 0 &&
          item.children.map((itemChild) => {
            if (itemChild.key === selectNavId) {
              link = setLink(
                itemChild.url
                  .replace('{companyCode}', companycodeVal)
                  .replace('{lc}', lc)
                  .replace('{companyName}', companynameVal)
              )
            }
          })
      })
      setLinkVal(link)
      selectNavId !== 'atlasplatform' && setIsHomePage(false)
    }
  }

  const setCompanyInfo = (e) => {
    let data = e?.data
    try {
      // FIXME JSON parse error
      if (data) {
        let companyInfo = JSON.parse(data)
        companycodeVal = companyInfo.code
        companynameVal = companyInfo.companyName
        setCompanyStoragelInfo(companycodeVal, companynameVal)
      }
    } catch (e) {}
  }

  // 设置公司相关信息
  const setCompanyStoragelInfo = (companycodeVal, companynameVal) => {
    sessionStorage.setItem('companyCode', companycodeVal)
    sessionStorage.setItem('companyName', companynameVal)
  }

  // 设置选中的侧边栏
  const setLinkStoragelInfo = (id) => {
    sessionStorage.setItem('selectNavId', id)
  }

  // 展开关闭侧边栏
  const handleExpand = (expandedKeys) => {
    setExpandedKeys(expandedKeys)
  }

  // 点击侧边栏
  const handleSelect = (selectedKeys, e) => {
    if (!selectedKeys.length) return
    pointBuriedByModule(922602100299, {
      currentPage: selectedKeys[0],
    })
    const parentNode = e.node['parentNode'] || false
    if (e.node.buryId) {
      pointBuriedByModule(e.node.buryId)
    }
    if (parentNode) {
      if (expandedKeys.includes(selectedKeys[0])) {
        setExpandedKeys(expandedKeys.filter((i) => i !== selectedKeys[0]))
      } else {
        setExpandedKeys([...expandedKeys, selectedKeys[0]])
      }
    } else {
      jumpPage(e)
    }
  }

  // 根据调校生成url
  const setLink = (url) => {
    const usedInClient = wftCommon.usedInClient()
    let webAppsite = '/Wind.WFC.Enterprise.Web/PC.Front'

    if (!usedInClient) {
      if (!wftCommon.isDevDebugger()) {
        webAppsite = '/web'
      }
    }

    let link = window.location.protocol + '//' + window.location.host + webAppsite + '/Company/' + url
    return link
  }

  /**
   * @param {externalLink} 代表是链接的外部门的项目
   * @param {homePage} 首页链接
   * @param {jumpJqueryPage} 跳转到Jq的老页面
   */
  const jumpPage = (e) => {
    companycodeVal = sessionStorage.getItem('companyCode') || companycode || '0A1015343518584'
    companynameVal = sessionStorage.getItem('companyName') || companyname || '融创房地产集团有限公司'
    let url = e?.url || e?.node?.url
    let id = e?.key || e?.node?.key
    let lc = companycodeVal.length > 10 ? companycodeVal.substr(2, 10) : companycodeVal
    let externalLink = e?.externalLink || e?.node?.externalLink
    if (!url) return

    /**
     * 多对一触达特殊处理：
     * 1.点击侧边栏不把默认公司带入
     * 2.如果从详情页跳转过来再传入lc和companynameVal
     */
    if (id === 'chart_ddycd' && !companycode) {
      url = 'ChartDetach.html?notoolbar=1&nonavtabs=1'
    } else {
      url = url.replace('{companyCode}', companycodeVal).replace('{lc}', lc).replace('{companyName}', companynameVal)
    }
    let link = setLink(url)

    // 更新iframe地址
    if (externalLink) {
      // 竞争图谱点击跳转到外部页面
      window.open(url)
    } else {
      // 不是首页加载iframe
      if (e?.node?.homePage) {
        setCompanyStoragelInfo('', '')
        setLinkStoragelInfo('atlasplatform')
        setIsHomePage(true)
        window.open(url, '_self')
      } else {
        setIsHomePage(false)
        setLinkStoragelInfo(id)
      }
      if (wftCommon.isDevDebugger()) {
        window.location.replace(
          `./index.html#/atlasplatform?isSeparate=1&nosearch=1&activeKey=${id}&lang=${window.en_access_config ? 'en' : 'zh'}`
        )
      }
      setLinkVal('')
      setSelectedKeys([id])
      setTimeout(() => {
        setLinkVal(link)
      }, 50)
    }
  }

  const renderContent = () => {
    let comp = null
    switch (selectedKeys[0]) {
      case 'chart_yskzr': // 疑似实控人
      case 'chart_qysyr': // 企业受益人
      case 'chart_glgx': // 关联关系
      case 'chart_ysgx': //疑似关系
      case 'chart_qytp': //企业图谱
      case 'chart_rztp': // 融资图谱
      case 'chart_rzlc': // 融资历程
      case 'chart_gqct':
      case 'chart_newtzct':
        comp = <OldCompanyChart type={selectedKeys[0]} companyCode={companycodeVal}></OldCompanyChart>
        break
      case 'chart_cgx':
        comp = (
          <React.Suspense fallback={<div></div>}>{<ForceRelationChartComp> </ForceRelationChartComp>}</React.Suspense>
        )
        break
      case 'chart_ddycd':
        comp = <React.Suspense fallback={<div></div>}>{<DetachChartComp> </DetachChartComp>}</React.Suspense>
        break

      case 'chart_cglj':
        comp = <React.Suspense fallback={<div></div>}>{<ShareholderGraphComp> </ShareholderGraphComp>}</React.Suspense>
        break
      default:
        break
    }
    if (comp) return comp
    return <iframe ref={iframeRef} className="iframe-ref" src={linkVal}></iframe>
  }

  return (
    <React.Fragment>
      <Layout style={{ height: '100%' }} className="atlas-platform">
        {/*  侧边栏 */}
        <ThemeProvider value="gray" pattern="gray" style={{ backgroundColor: 'red' }}>
          <Sider
            className="menu"
            collapsible
            collapsedContent={
              <Header size="small" className="f-wm-vr f-bg-none">
                {intl('367279', '图谱平台首页')}
              </Header>
            }
          >
            <Tree
              treeData={atlasTreeData}
              selectedKeys={selectedKeys}
              expandedKeys={expandedKeys}
              onSelect={handleSelect}
              onExpand={handleExpand}
              data-uc-id="Q4tGRt8uA8e"
              data-uc-ct="tree"
            ></Tree>
          </Sider>
        </ThemeProvider>

        {/* 整体内容 */}
        <Layout style={{ backgroundColor: '' }}>
          {/* 内容区 */}
          {
            isHomePage ? (
              <Content className="content">
                <div className="ap-header">
                  <div className="ap-header-left">
                    <p className="title">{intl('365067', '企业图谱平台')}</p>
                    <p>{intl('367255', '一个深度洞察企业股权关系、关联关系的智能可视化平台')}</p>
                    <p>{intl('367273', '适用于企业尽调、营销获客、风险监控等多场景')}</p>
                  </div>
                  <img src={atlasBg} />
                </div>
                <div className="ap-content">
                  {atlasTreeData.map((item) => {
                    return (
                      item.key !== 'atlasplatform' && (
                        <div className="ap-card" key={item.key}>
                          <p className="ap-card-title">{item.title}</p>
                          <ul>
                            {item.children.map((childItem) => {
                              return (
                                <li
                                  onClick={() => jumpPage(childItem)}
                                  key={childItem.key}
                                  data-uc-id={`DzjzeQ02AF${childItem.key}`}
                                  data-uc-ct="li"
                                  data-uc-x={childItem.key}
                                >
                                  <p>{childItem.title}</p>
                                  <img src={childItem.img} />
                                </li>
                              )
                            })}
                          </ul>
                        </div>
                      )
                    )
                  })}
                </div>
              </Content>
            ) : (
              renderContent()
            )
            // <iframe ref={iframeRef} className="iframe-ref" src={linkVal}></iframe>
          }
        </Layout>
      </Layout>
    </React.Fragment>
  )
}

export default AtlasPlatform
