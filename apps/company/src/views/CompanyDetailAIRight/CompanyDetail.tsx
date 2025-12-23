/**
 * 企业详情页核心业务组件
 *
 * 负责企业数据的完整展示，包括菜单导航、企业介绍、基本信息和各类数据模块
 * 这是企业详情页的核心业务逻辑和数据处理中心
 *
 * @see ../../docs/CorpDetail/layout-middle.md - 企业详情核心设计文档
 * @see ../../docs/CorpDetail/design.md - 整体架构设计文档
 */

import * as companyActions from '@/actions/company'
import { createFastCrawl, getCorpHeaderInfo, getCorpInfo, myWfcAjax } from '@/api/companyApi'
import { getcustomercountgroupnew } from '@/api/companyDynamic'
import { pointBuriedGel } from '@/api/configApi'
import { CorpBasicNum, getCompanyBasicNumT } from '@/api/corp/basicNum/index.ts'
import { getCorpOtherInfo } from '@/api/corp/info/otherInfo.ts'
import { pointBuriedByModule } from '@/api/pointBuried/bury.ts'
import { translateByAlice } from '@/api/translate'
import { ApiCodeForWfc, ApiResponse } from '@/api/types.ts'
import CompanyBase from '@/components/company/CompanyBase'
import CompanyIntroduction from '@/components/company/CompanyIntroduction.tsx'
import { handleBuryInCorpDetailMenu } from '@/components/company/detail/bury/menu'
import CompanyInfo from '@/components/company/info/CompanyInfo.tsx'
import { ICorpBasicInfoFront } from '@/components/company/info/handle'
import Collect from '@/components/searchListComponents/collect'
import ToolsBar from '@/components/toolsBar/index.tsx'
import { getIfPrivateFundCorpByBasicNum, getIfPublicFundCorpByBasicNum } from '@/handle/corp/basicNum/fund.ts'
import { ICorpBasicNumFront } from '@/handle/corp/basicNum/type.ts'
import { getOverSea, TCorpArea } from '@/handle/corp/corpArea.ts'
import { useHandleOverseaCorp } from '@/handle/corp/corpType'
import { TCorpCategory } from '@/handle/corp/corpType/category.ts'
import { createCorpDetailScrollCallback, SCROLL_FROM_MENU_CLICK_ID, triggerInitialModuleLoad } from '@/handle/corp/misc'
import { handleCorpDetailScrollMenuChanged, handleCorpDetailScrollMenuLoad } from '@/handle/corp/misc/scroll'
import { usePageTitle } from '@/handle/siteTitle'
import { parseQueryString } from '@/lib/utils'
import { IState } from '@/reducers/type.ts'
import { wftCommon } from '@/utils/utils'
import { Card, message } from '@wind/wind-ui'
import { CorpOtherInfo } from 'gel-types'
import { mergeCorpBasicNum } from 'gel-util/corp'
import { multiTabIds } from 'gel-util/corpConfig'
import { isEn } from 'gel-util/intl'
import { cloneDeep, isNil } from 'lodash'
import React, { FC, UIEventHandler, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import CorpDetailMenu from '../Company/comp/menu'
import { getIfIPOCorpByBasicNum } from '../Company/handle/corpBasicNum'
import { CorpMenuData, handleCorpDetailMenu, ICorpMenuCfg, useCorpMenuByType } from '../Company/menu'
import { Content } from './comp/ScrollContent/index'
import './corpDetail.less'

const BODYOFFSETTOP = 36 // 顶部空间

export const ScrollContainerClass = 'companyDetailScrollContainer' // 滚动容器类名

/**
 * 处理页面滚动的回调函数
 * 使用 debounce 防抖处理，避免频繁触发，延迟300ms执行
 * @param e - 滚动事件对象
 * @param fn - 处理模块加载的回调函数
 * @param menuChanged - 处理菜单状态变化的回调函数
 */
const scrollCallback = createCorpDetailScrollCallback(BODYOFFSETTOP)

const CompanyDetail: FC<{
  baseInfo: ICorpBasicInfoFront
  corpNameEng: string
  setCorpNameEng: (corpNameEng: string) => void
  setCorpModuleReadyed
  getCorpHeaderInfo
  setCorpArea
  getBasicNum
  corpCategory: TCorpCategory[]
  setCorpCategory: (arg0: TCorpCategory[]) => any
  getCorpInfo
  setCorpOtherInfo
  setCollectState
  setIsObjection
  scrollModuleIds
  feedParam
  collectState
  userPackageinfo
  userPackageInfoApiLoaded
}> = (props) => {
  const { corpNameEng, setCorpNameEng } = props
  const qsParam = parseQueryString()
  let companycode = qsParam['companycode']
  if (!companycode) {
    companycode = qsParam['CompanyCode']
  }
  if (!companycode) {
    companycode = qsParam['companyCode']
  }
  if (companycode) {
    // 转string
    companycode = companycode + ''
    if (companycode.length < 3) {
      companycode = ''
    }
  }
  useEffect(() => {
    pointBuriedByModule(922610400001, {
      companyID: companycode,
    })
  }, [])

  let singleModuleId = qsParam['moduleid'] || qsParam['moduleId'] || null // 有值 代表单独要显示的模块
  const fromPage = qsParam['fromPage'] || null //  f9 代表股票等f9页面
  const fromF9 = fromPage == wftCommon.fromPage_f9 // f9页面进入
  const fromShfic = fromPage == wftCommon.fromPage_shfic // 提供给工商联的页面 不需要左侧导航
  const autoWidth = qsParam['autoWidth'] || null // 宽度自适应 （满足shifc小屏需求）

  let f9grid = qsParam['grid'] || ''
  f9grid = f9grid?.toLocaleLowerCase() // alice 跳转定位到指定模块
  const linksource = qsParam['linksource'] || null || ''
  // 这三个都是 menu 的 data 不知道有啥区别
  const [allTreeDatas, setAllTreeDatas] = useState<CorpMenuData[]>([])
  const [allTreeDataObj, setAllTreeDataObj] = useState({})
  const [treeDatas, setTreeDatas] = useState<CorpMenuData[]>([])
  const [expandedKeys, setExpandedKeys] = useState([])

  const [autoExpandParent, setAutoExpandParent] = useState(true)
  const corpid = qsParam['companyid'] || ''
  const [companyid, setCompanyid] = useState(corpid)
  const [corpname, setCorpname] = useState('')
  const companyNameIntl = isEn() ? corpNameEng : corpname
  usePageTitle('CompanyDetail', companyNameIntl)
  const [corpBaseInfoCard, setCorpBaseInfoCard] = useState(null)
  const [basicNum, setBasicNum] = useState<ICorpBasicNumFront>({})
  const [companyRegDate, setCompanyRegDate] = useState('')

  const [selectedKeys, setSelectedKeys] = useState<string[]>(['showCompanyInfo'])

  const [collectList, setCollectList] = useState([])

  const [modalShow, setModalShow] = useState(false)

  const [corpArea, setCorpArea] = useState<TCorpArea>('')

  const [loadedBrandAndPatent, setLoadedBrandAndPatent] = useState(false)
  const [loadedBid, setLoadedBid] = useState(false)
  const [userPackageInfoReady, setUserPackageInfoReady] = useState(false)

  // 使用 Hook 获取菜单配置（自动处理基金/IPO等特殊菜单项和海外企业）
  const currentMenus = useCorpMenuByType(props.baseInfo, basicNum, corpArea)

  window.__GELCOMPANYCODE__ = companycode

  const is_terminal = wftCommon.usedInClient()

  const hash = window.location.hash
  if (hash && hash.length > 2) {
    // f9 兼容旧版接入方案 路由接入
    const arr = hash.split('#/')
    const moduleidFromHash = arr[arr.length - 1]
    // 招投标 包含 招标 、 中标
    if (moduleidFromHash && moduleidFromHash.indexOf('biddingInfo') > -1) {
      singleModuleId = 'biddingInfo&tiddingInfo'
    }
  }

  useEffect(() => {
    if (fromPage) {
      wftCommon.fromPage(fromPage)
    }
    if (fromShfic) {
      if (autoWidth) {
        document.body.classList.add('wind-gel-shifc-medium')
      } else {
        document.body.classList.add('wind-gel-shifc')
      }
    }
  }, [fromPage])

  useEffect(() => {
    // alice 模块定位
    if (!Object.entries(basicNum).length) return
    if (f9grid) {
      let f9grid2 = ''
      for (const k in currentMenus) {
        if (f9grid2) break
        for (let i = 0; i < currentMenus[k].showList.length; i++) {
          const t = currentMenus[k].showList[i]
          const lowMenuStr = t?.toLocaleLowerCase()
          if (lowMenuStr === f9grid) {
            f9grid = t
            f9grid2 = f9grid
            break
          }
        }
        currentMenus[k].showList.map((t) => {
          const lowMenuStr = t?.toLocaleLowerCase()
          if (lowMenuStr === f9grid) {
            f9grid = t
          }
        })
      }
      if (is_terminal) {
        // 终端内才支持alice模块定位，浏览器模式先不支持，性能效果不佳
        setTimeout(() => {
          treeMenuClick([f9grid], { selected: true })
        }, 50)
      }
    }
    if (linksource == 'personSearch') {
      if (basicNum.lastNotice !== 0 || basicNum.industrialRegist !== 0) {
        treeMenuClick(['showMainMemberInfo'], { selected: true })
      } else if (basicNum.coreteam_num !== 0) {
        treeMenuClick(['showCoreTeam'], { selected: true })
      }
    }

    // 特殊类型企业，手动执行一次滑动，避免首屏出现loading模块
    if (basicNum.__specialcorp > 0 || basicNum.__overseacorp > 0) {
      setTimeout(() => {
        const ele = document.querySelector(`.${ScrollContainerClass}`)
        if (ele) {
          if (ele.scrollTop < 2) {
            document.querySelector(`.${ScrollContainerClass}`).scrollTo({ top: 3 })
          }
        }
      }, 200)
    }
  }, [basicNum, currentMenus])
  useHandleOverseaCorp(corpBaseInfoCard)
  useEffect(() => {
    if (!currentMenus || Object.keys(currentMenus).length === 0) return

    const allMenu = []
    for (const k in currentMenus) {
      const menu = {
        key: k,
        title: currentMenus[k].title,
        children: [],
      }
      if (k == 'overview') {
        menu.children.push({
          key: currentMenus[k].showList[0],
          title: currentMenus[k].showName[0],
          titleStr: currentMenus[k].showName[0],
          titleNum: '',
          parentMenuKey: k,
        })
      }
      if (!currentMenus[k].hide) {
        allMenu.push(menu)
      }
    }
    setTreeDatas(allMenu)
  }, [currentMenus])

  const refreshCorpOtherInfo = async () => {
    try {
      const res = await getCorpOtherInfo(companycode)

      if (res && res.data) {
        // FIXME
        props.setCorpOtherInfo(res.data)

        if (res.data.isCollect) {
          props.setCollectState(true)
        }

        if (res.data.isObjection) {
          props.setIsObjection(res.data.isObjection)
        }
      }
    } catch (error) {
      console.error('Failed to refresh corporate other info:', error)
    }
  }

  const getCorpBasicNumLocal = () => {
    let basicNumNew: Partial<ICorpBasicNumFront> = {}
    props.getBasicNum(companycode, (res: ApiResponse<CorpBasicNum>) => {
      if (isNil(res) || isNil(res.Data)) {
        console.error('~ get basic num error', res)
        return
      }
      const basicNumData = cloneDeep(res.Data)
      const corpCategory: TCorpCategory[] = [...(props.corpCategory || [])] // 创建新数组

      // 检查并添加私募基金类型
      if (getIfPrivateFundCorpByBasicNum(basicNumData)) {
        if (!corpCategory.includes('privatefund')) {
          corpCategory.push('privatefund')
        }
      }

      // 检查并添加公募基金类型
      if (getIfPublicFundCorpByBasicNum(basicNumData)) {
        if (!corpCategory.includes('publicfund')) {
          corpCategory.push('publicfund')
        }
      }

      // 检查并添加上市公司类型
      if (getIfIPOCorpByBasicNum(basicNumData)) {
        if (!corpCategory.includes('ipo')) {
          corpCategory.push('ipo')
        }
      }

      // 只在类别有变化时才更新状态
      if (corpCategory.length > 0 && JSON.stringify(corpCategory) !== JSON.stringify(props.corpCategory)) {
        props.setCorpCategory(corpCategory)
      }
      window.__GELBASICNUM__ = basicNumData
      basicNumNew = { ...basicNumNew, ...basicNumData }
      setBasicNum((prevState) => ({
        ...prevState,
        ...basicNumNew,
      }))
    })
  }
  useEffect(() => {
    if (!companycode) {
      // 兼容从f9进来有时传0
      message.warning(window.en_access_config ? 'Not Found This Company Info!(0)' : '未找到相关企业!(0)', 2)
      return
    }
    if (singleModuleId) {
      if (singleModuleId.indexOf('biddingInfo') > -1) {
        props.setCorpModuleReadyed(['biddingInfo', 'tiddingInfo'])
        // 兼容后端性能低下 无法获取到招投标各tab统计数字 前端单独调一次
        if (!loadedBid) {
          setLoadedBid(true)
        }
      } else if (singleModuleId.indexOf('getbrand') > -1 || singleModuleId.indexOf('getpatent') > -1) {
        // 兼容后端性能低下 无法获取到商标、专利各tab统计数字 前端单独调一次
        if (!loadedBrandAndPatent) {
          setLoadedBrandAndPatent(true)
        }
        props.setCorpModuleReadyed([singleModuleId])
      } else {
        props.setCorpModuleReadyed([singleModuleId])
      }
    } else {
      props.getCorpHeaderInfo(companycode, (res) => {
        setCorpBaseInfoCard(res?.data)
        // 如果companycode有效，触发快爬
        if (res?.data?.corp_id) {
          createFastCrawl(companycode)
        }
        res.data.corp = res.data
        setCorpname(res.data.corp.corp_name)
        const area = res.data.corp.areaCode ? getOverSea(res.data.corp.areaCode) : ''
        if (area && !corpArea) {
          props.setCorpArea(area)
          setCorpArea(area)
        }
        if (window.en_access_config) {
          window.__GELCOMPANYNAMEEN__ = res.data.eng_name || res.data.corp.corp_name || ''
          setCorpNameEng(res.data.eng_name || '--')
        }
        window.__GELCOMPANYNAME__ = res.data.corp.corp_name
        window.__GELCOMPANYID__ = res.data.corp.corp_old_id
        if (!companyid) {
          setCompanyid(res.data.corp.corp_old_id)
        }
        setCompanyRegDate(res.data.corp.reg_date ? res.data.corp.reg_date.substring(0, 4) : '')
      })

      getCorpBasicNumLocal()
      props.getCorpInfo(companycode, (res) => {
        const corpCategory = [...(props.corpCategory || [])]
        const area = res.data.areaCode ? getOverSea(res.data.areaCode) : ''
        if (area && !corpArea) {
          props.setCorpArea(area)
          setCorpArea(area)
        }
        const corptypeid = res.Data.corp_type_id
        let ifOverseaCorp = 0
        let ifSpecialCorp = 0
        let categoryChanged = false

        // 企业基本信息已通过 Redux 管理，菜单配置由 useCorpMenuByType Hook 自动处理

        // 判断是否为特殊企业类型（政府机构、社会组织等）
        if (
          wftCommon.corpState_zfList.indexOf(wftCommon.corpFroms[corptypeid]) > -1 ||
          wftCommon.corpState_shList.indexOf(wftCommon.corpFroms[corptypeid]) > -1 ||
          wftCommon.corpFroms[corptypeid] == '事业单位' ||
          wftCommon.corpFroms[corptypeid] == '政府机构' ||
          String(corptypeid) == '912034101'
        ) {
          if (!corpCategory.includes('specialcorp')) {
            corpCategory.push('specialcorp')
            categoryChanged = true
          }
        }

        // 判断是否为海外企业
        if (
          String(corptypeid) == '298060000' ||
          res.Data.areaCode == '030407' ||
          res.Data.areaCode?.indexOf('18') == 0
        ) {
          ifOverseaCorp = 1
        }

        if (corpCategory.indexOf('specialcorp') > -1) {
          ifSpecialCorp = 1
        } else {
          ifSpecialCorp = -1
        }

        // 只在类别发生变化时更新
        if (categoryChanged) {
          props.setCorpCategory(corpCategory)
        }

        setBasicNum((prevState) => ({
          ...prevState,
          __overseacorp: ifOverseaCorp,
          __specialcorp: ifSpecialCorp,
        }))
      })

      refreshCorpOtherInfo()

      pointBuriedGel('922602100272', '企业详情', 'companyDetail', {
        opActive: 'loading',
        currentPage: 'company',
        opEntity: '企业详情',
        currentId: companycode,
        opId: companycode,
      })
    }
  }, [])

  // 用户权限包信息更新后执行后续逻辑，临时方案
  useEffect(() => {
    if (!props.userPackageinfo && !props.userPackageInfoApiLoaded) {
      return
    }
    setUserPackageInfoReady(true)
    console.warn('~ props.userPackageInfo updated:', props.userPackageinfo)
  }, [props.userPackageinfo])

  // 监听菜单配置和统计数据变化，自动更新菜单树
  useEffect(() => {
    // 确保有足够的统计数据后再构建菜单树
    if (Object.entries(basicNum).length >= 5 && currentMenus && Object.keys(currentMenus).length > 0) {
      handleMenuTree(currentMenus, basicNum)
    }
  }, [currentMenus, basicNum])

  useEffect(() => {
    // 专门拉取 商标 专利 统计数字
    if (!loadedBrandAndPatent) {
      return
    }
    const params = { companycode, pageNo: 0, pageSize: 1, type: 'trademark_sum_corp', companyType: 0 }
    const params1 = {
      companycode,
      pageNo: 0,
      pageSize: 1,
      type: 'patent_sum_corp',
      companyType: 0,
      __primaryKey: companycode,
    }
    let numsObj: Partial<ICorpBasicNumFront> = {}
    let patentAndBrandReady = 0
    myWfcAjax('getintellectual', params).then(
      (backRes) => {
        patentAndBrandReady++
        if (backRes.ErrorCode === ApiCodeForWfc.SUCCESS) {
          if (backRes.Data) {
            numsObj = mergeCorpBasicNum(numsObj, undefined, backRes.Data)
          }
        }
        if (patentAndBrandReady > 1) {
          setBasicNum((prevState) => ({
            ...prevState,
            ...numsObj,
          }))
        }
      },
      () => {
        patentAndBrandReady++
      }
    )
    myWfcAjax('detail/company/patent_statistical_number', params1).then(
      (backRes) => {
        patentAndBrandReady++
        if (backRes.ErrorCode === ApiCodeForWfc.SUCCESS && backRes.Data) {
          numsObj = mergeCorpBasicNum(numsObj, backRes.Data, undefined)
        }
        if (patentAndBrandReady > 1) {
          setBasicNum((prevState) => ({
            ...prevState,
            ...numsObj,
          }))
        }
      },
      () => {
        patentAndBrandReady++
      }
    )
  }, [loadedBrandAndPatent])

  useEffect(() => {
    // 专门拉取 招投标 统计数字

    if (loadedBid) {
      const paramBid = { companycode, pageNo: 0, pageSize: 1, roleType: 0, __primaryKey: companycode }
      const numsObj: Partial<ICorpBasicNumFront> = {}
      let bidTidReady = 0
      myWfcAjax('detail/company/penetration_bid_statistical_number', paramBid).then((backRes) => {
        bidTidReady++
        if (backRes.ErrorCode === ApiCodeForWfc.SUCCESS) {
          if (backRes.Data && backRes.Data.length) {
            backRes.Data.map((t) => {
              if (t.corpType == '1') {
                numsObj.bid_num_kgqy = t.total
              } else if (t.corpType == '2') {
                numsObj.bid_num_dwtz = t.total
              } else if (t.corpType == '3') {
                numsObj.bid_num_fzjg = t.total
              } else {
                numsObj.bid_num_bgs = t.total
              }
            })
            if (bidTidReady > 1) {
              setBasicNum((prevState) => ({
                ...prevState,
                ...numsObj,
              }))
            }
          }
        }
      })

      const paramTid = { companycode, pageNo: 0, pageSize: 1, roleType: 1, __primaryKey: companycode }
      // 招投标穿透
      myWfcAjax('detail/company/penetration_bid_statistical_number', paramTid).then((backRes) => {
        bidTidReady++
        if (backRes.ErrorCode === ApiCodeForWfc.SUCCESS) {
          if (backRes.Data && backRes.Data.length) {
            backRes.Data.map((t) => {
              if (t.corpType == '1') {
                numsObj.tid_num_kgqy = t.total
              } else if (t.corpType == '2') {
                numsObj.tid_num_dwtz = t.total
              } else if (t.corpType == '3') {
                numsObj.tid_num_fzjg = t.total
              } else {
                numsObj.tid_num_bgs = t.total
              }
            })

            if (bidTidReady > 1) {
              setBasicNum((prevState) => ({
                ...prevState,
                ...numsObj,
              }))
            }
          }
        }
      })
    }
  }, [loadedBid])

  const handleMenuTree = (menus: ICorpMenuCfg, nums: ICorpBasicNumFront) => {
    const { allMenu, allMenuData, allMenuDataObj } = handleCorpDetailMenu(menus, nums, corpArea)
    setAllTreeDatas(allMenuData)
    setTreeDatas(allMenu)
    setAllTreeDataObj(allMenuDataObj)

    onExpand(['overview'])

    // 菜单构建完成后，触发初次模块加载检测
    setTimeout(() => {
      if (!singleModuleId) {
        triggerInitialModuleLoad(
          BODYOFFSETTOP,
          (moduleId) => {
            handleCorpDetailScrollMenuLoad(moduleId, {
              loadedBrandAndPatent,
              setLoadedBrandAndPatent,
              loadedBid,
              setLoadedBid,
              props,
              allTreeDataObj,
              setSelectedKeys,
              setExpandedKeys,
              expandedKeys,
            })
          },
          (moduleId) => {
            handleCorpDetailScrollMenuChanged(moduleId, {
              setSelectedKeys,
              setExpandedKeys,
              expandedKeys,
              allTreeDataObj,
            })
          }
        )
      }
    }, 100) // 等待DOM更新后触发
  }

  const scrollEventHandler: UIEventHandler<HTMLDivElement> = (e) => {
    if (singleModuleId) return false
    if (Object.entries(basicNum).length == 0) {
      return null
    }
    scrollCallback(
      e,
      (moduleId) => {
        handleCorpDetailScrollMenuLoad(moduleId, {
          loadedBrandAndPatent,
          setLoadedBrandAndPatent,
          loadedBid,
          setLoadedBid,
          props,
          allTreeDataObj,
          setSelectedKeys,
          setExpandedKeys,
          expandedKeys,
        })
      },
      (moduleId) => {
        handleCorpDetailScrollMenuChanged(moduleId, {
          setSelectedKeys,
          setExpandedKeys,
          expandedKeys,
          allTreeDataObj,
        })
      }
    )
  }

  const treeMenuClick = (menuData: string[], e: any) => {
    const menu = menuData
    if (Object.entries(basicNum).length == 0) {
      return null
    }

    if (!menu) return
    if (!e.selected) return
    let table = null
    let tableOffsetTop = null

    if (!e._reRender) {
      handleBuryInCorpDetailMenu(menuData, corpid, allTreeDataObj, treeDatas)
    }

    setSelectedKeys(menu)

    const scrollContainer = document.querySelector(`.${ScrollContainerClass}`)

    // @ts-expect-error
    if (menu == 'showCompanyInfo') {
      table = document.querySelector(`.showCompanyInfo`)
      table = table.offsetParent
      tableOffsetTop = table.offsetTop - BODYOFFSETTOP
      scrollContainer.scrollTo({ top: tableOffsetTop, behavior: 'instant' }) // smooth instant
      return
    }
    // @ts-expect-error ttt
    if (currentMenus[menu]) {
      // 点击一级模块名跳转
      const moduleTitle: any = document.querySelector(`.module-title-${menu}`)
      if (!moduleTitle) {
        console.error('~ tree menu click level 1 dom not found', menu, currentMenus)
        return
      }
      tableOffsetTop = moduleTitle.offsetTop + (moduleTitle.offsetParent ? moduleTitle.offsetParent.offsetTop : 0)
      scrollContainer.scrollTo({ top: tableOffsetTop, behavior: 'instant' }) // smooth instant
      return
    }

    table = document.querySelector(`[data-custom-id="${menu}"]`)

    if (table) {
      tableOffsetTop = table.offsetTop
      SCROLL_FROM_MENU_CLICK_ID.value = menu
    } else {
      let i = 0
      for (i = 0; i < 5; i++) {
        if (multiTabIds.indexOf(menu.toString() as any) > -1) {
          table = document.querySelector(`[multitabid=${menu}]`)
          if (!table) {
            return
          }
          tableOffsetTop = table.offsetTop
          break
        }
        if (!table) {
          table = document.querySelector(`[data-custom-id="${menu}-${i}"]`)
        }
        if (table) {
          table = table.offsetParent
          tableOffsetTop = table.offsetTop
          break
        }
      }
      SCROLL_FROM_MENU_CLICK_ID.value = `${menu}-${i}`
    }
    if (!table) {
      return
    }
    // @ts-expect-error ttt
    tableOffsetTop = document.querySelector(`.companyTab`).offsetTop + tableOffsetTop

    scrollContainer.scrollTo({
      top: tableOffsetTop - BODYOFFSETTOP,
      behavior: e._reRender ? 'smooth' : 'instant',
    }) // smooth instant

    if (!e._reRender) {
      setTimeout(() => {
        treeMenuClick(menu, { selected: true, _reRender: true })
      }, 600)
    }
  }

  const onExpand = (expandedKeys) => {
    setExpandedKeys(expandedKeys)
    setAutoExpandParent(false)
  }

  const showCollectModal = () => {
    getcustomercountgroupnew().then((res) => {
      if (res.Data && res.Data.length) {
        setCollectList(res.Data)
        setModalShow(true)
      }
    })
  }

  const closeModal = () => {
    setModalShow(false)
  }

  return (
    <Content className={ScrollContainerClass} onScroll={scrollEventHandler}>
      <>
        {!(singleModuleId || fromShfic) ? (
          <div className="tree-menu-container">
            {treeDatas.length ? (
              <CorpDetailMenu
                expandedKeys={expandedKeys}
                setExpandedKeys={setExpandedKeys}
                treeDatas={treeDatas}
                allTreeDatas={allTreeDatas}
                treeMenuClick={treeMenuClick}
                onExpand={onExpand}
                autoExpandParent={autoExpandParent}
                selectedKeys={selectedKeys}
                data-uc-id="WUEJ-ZqUl"
                data-uc-ct="corpdetailmenu"
              />
            ) : (
              ''
            )}
          </div>
        ) : null}
        <div
          className={`companyBody ${singleModuleId ? 'companyBodyF9' : ''}  ${fromF9 ? 'companyF9' : ''} ${
            fromShfic ? (!autoWidth ? 'companySHFIC' : 'companySHFIC-autoWidth') : ''
          }  `}
        >
          <div>
            <div className={'companyDetail'}>
              {!singleModuleId ? (
                <CompanyIntroduction
                  companyname={corpname}
                  companycode={companycode}
                  companyid={companyid}
                  basicNum={basicNum}
                  menuClick={treeMenuClick}
                  collect={showCollectModal}
                  canBack={fromShfic || false}
                  onlyCompanyIntroduction={fromShfic || false}
                  isAIRight
                  data-uc-id="fDvmG_4rTj"
                  data-uc-ct="companyintroduction"
                />
              ) : null}

              <Card className="companyTab" bordered={false}>
                {!singleModuleId ? <CompanyInfo cmd="companyInfo" companycode={companycode} /> : null}
                {userPackageInfoReady || singleModuleId ? (
                  <CompanyBase
                    basicNum={basicNum}
                    companyname={corpname}
                    companycode={companycode}
                    companyid={companyid}
                    singleModuleId={singleModuleId}
                    companyRegDate={companyRegDate}
                    menuClick={treeMenuClick}
                    allMenuDataObj={allTreeDataObj}
                    refreshCorpOtherInfo={refreshCorpOtherInfo}
                  />
                ) : null}
              </Card>
            </div>
          </div>

          {!(singleModuleId || fromShfic) ? (
            <ToolsBar
              backTopWrapClass={ScrollContainerClass}
              isShowHome={true}
              isShowHelp={false}
              companyName={companyNameIntl}
            />
          ) : null}
        </div>
        {modalShow ? (
          <Collect
            state={props.collectState}
            list={collectList}
            code={companycode}
            from={'detail'}
            close={closeModal}
            change={(e) => props.setCollectState(e)}
          />
        ) : null}
      </>
    </Content>
  )
}

const mapStateToProps = (state: IState) => {
  return {
    baseInfo: state.company.baseInfo,
    scrollModuleIds: state.company.scrollModuleIds,
    basicNum: state.company.basicnum,
    corpCategory: state.company.corpCategory,
    feedParam: state.company.feedBackPara,
    collectState: state.company.collectState,
    userPackageinfo: state.home.userPackageinfo,
    userPackageInfoApiLoaded: state.home.userPackageInfoApiLoaded,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getCorpInfo: (data, fn) => {
      getCorpInfo(data).then((res) => {
        if (res && res.Data) {
          const newRes = { ...res }
          newRes.Data.corp = res.Data
          newRes.Data.usednames = res.Data.usednames
          const xxIndustryList = res.Data.xxIndustryList
          newRes.Data.xxIndustryListEn = ''
          try {
            let d = ''
            if (xxIndustryList) {
              xxIndustryList[0].map((t) => {
                d = d ? d + '-' + t.industryName : t.industryName
              })
              newRes.Data.xxIndustryListEn = d
            }
          } catch (error) {
            console.error('Error processing industry list:', error)
          }
          if (res.Data?.usednames?.length && window.en_access_config) {
            wftCommon.zh2en(res.Data.usednames, (endata) => {
              res.Data.usednames = endata
              dispatch(companyActions.getCorpInfo(newRes))
              if (fn) {
                fn(newRes)
              }
              window.__GELCORPID__ = newRes.data.corp_id
            })
          } else {
            dispatch(companyActions.getCorpInfo(newRes))
            if (fn) {
              fn(newRes)
            }
            window.__GELCORPID__ = newRes.data.corp_id
          }
        } else {
          setTimeout(() => {
            message.warning(window.en_access_config ? 'Not Found This Company Info!' : `未找到相关企业!`, 5)
          }, 4000)
        }
      })
    },
    setCorpModuleReadyed: (data) => {
      dispatch(companyActions.setCorpModuleReadyed(data))
    },
    getBasicNum: (code: string, fn?: (arg0: ApiResponse<CorpBasicNum>) => any) => {
      getCompanyBasicNumT(code).then((res) => {
        dispatch(companyActions.getCompanyBasicNum(res))
        if (fn) {
          fn(res)
        }
      })
    },
    getCorpHeaderInfo: (data, fn) => {
      getCorpHeaderInfo(data).then(async (res) => {
        // 中文环境 直接返回
        if (!window.en_access_config) {
          dispatch(companyActions.getCorpHeaderInfo(res))
          fn?.(res)
          return
        }

        // 英文环境 分步骤翻译
        // 处理企业名称翻译，如果eng_name不存在，则翻译corp_name
        if (res.Data?.eng_name) {
          res.Data.corp_name = res.Data.eng_name
        } else if (res.Data?.corp_name) {
          try {
            const { data: translateRes } = await translateByAlice({
              transText: res.Data.corp_name,
            })
            if (translateRes?.code === 1000) {
              res.Data.eng_name = translateRes.response?.content
              res.Data.corp_name = res.Data.eng_name
            }
          } catch (error) {
            console.error('Failed to translate corp_name:', error)
          }
        }

        // 并行处理其他翻译
        const translatePromises: Promise<void>[] = []

        // 翻译主要数据
        if (res.Data) {
          translatePromises.push(
            new Promise<void>((resolve) => {
              wftCommon.translateService(res.Data, (endata) => {
                res.Data = endata
                resolve()
              })
            })
          )
        }

        // 翻译企业曾用名
        if (res.Data?.former_name?.length) {
          translatePromises.push(
            new Promise<void>((resolve) => {
              wftCommon.zh2en(res.Data.former_name, (endata) => {
                res.Data.former_name = endata
                resolve()
              })
            })
          )
        }

        // 等待所有翻译完成
        await Promise.all(translatePromises)

        // 统一dispatch和回调
        dispatch(companyActions.getCorpHeaderInfo(res))
        fn?.(res)
      })
    },
    setCorpCategory: (data) => {
      dispatch(companyActions.setCorpCategory(data))
    },
    setCorpArea: (data) => {
      dispatch(companyActions.setCorpArea(data))
    },
    setCollectState: (data) => {
      dispatch(companyActions.setCollectState(data))
    },
    setIsObjection: (data) => {
      dispatch(companyActions.setIsObjection(data))
    },
    setCorpOtherInfo: (data: CorpOtherInfo) => {
      dispatch({
        type: 'SET_CORP_OTHER_INFO',
        data: data,
      })
    },
  }
}

const connector = connect(mapStateToProps, mapDispatchToProps)(CompanyDetail)
export default connector
