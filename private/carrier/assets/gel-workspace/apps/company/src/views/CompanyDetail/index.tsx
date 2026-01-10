import * as companyActions from '@/actions/company'
import { createFastCrawl, getCorpHeaderInfo, getCorpInfo, myWfcAjax } from '@/api/companyApi'
import { getcustomercountgroupnew } from '@/api/companyDynamic'
import { pointBuriedGel } from '@/api/configApi'
import { CorpBasicNum, getCompanyBasicNumT } from '@/api/corp/basicNum/index.ts'
import { getCorpOtherInfo } from '@/api/corp/info/otherInfo.ts'
import { pointBuriedByModule } from '@/api/pointBuried/bury.ts'
import { ApiCodeForWfc, ApiResponse } from '@/api/types'
import CompanyBase from '@/components/company/CompanyBase'
import { isOverseaCorp } from '@/domain/corpDetail/corpType'

import { handleBuryInCorpDetailMenu } from '@/components/company/detail/bury/menu'
import { CorpBasicInfoFront } from '@/components/company/info/handle'
import { translateCorpBaseInfoData } from '@/handle/corp/base/translate'
import { CorpArea, getCorpAreaByAreaCode } from '@/handle/corp/corpArea.ts'
import { useHandleOverseaCorp } from '@/handle/corp/corpType'
import { TCorpCategory } from '@/handle/corp/corpType/category.ts'
import { createCorpDetailScrollCallback, SCROLL_FROM_MENU_CLICK_ID, triggerInitialModuleLoad } from '@/handle/corp/misc'
import { handleCorpDetailScrollMenuChanged, handleCorpDetailScrollMenuLoad } from '@/handle/corp/misc/scroll'
import { usePageTitle } from '@/handle/siteTitle'
import { parseQueryString } from '@/lib/utils'
import { selectCorpNameIntl } from '@/reducers/company'
import { IState } from '@/reducers/type.ts'
import { CorpBasicNumFront } from '@/types/corpDetail'
import { parseUrlParamsToJsonArray } from '@/utils/common'
import { wftCommon } from '@/utils/utils'
import '@/views/Company/style/corpDetail.less'
import { Card, message } from '@wind/wind-ui'
import {
  CorpBasicInfo,
  CorpCardInfo,
  CorpOtherInfo,
  TCorpDetailModule,
  TCorpDetailSubModule,
  UserPackageInfo,
} from 'gel-types'
import { mergeCorpBasicNum } from 'gel-util/corp'
import { multiTabIds } from 'gel-util/corpConfig'
import { getCorpNameOriginalByBaseAndCardInfo } from 'gel-util/misc'
import { cloneDeep, isNil } from 'lodash'
import { FC, lazy, Suspense, UIEventHandler, useEffect, useState } from 'react'
import { connect, useSelector } from 'react-redux'

import {
  getIfIPOCorpByBasicNum,
  getIfPrivateFundCorpByBasicNum,
  getIfPublicFundCorpByBasicNum,
} from '@/domain/corpDetail'
import { CorpDetailMenu } from '../Company/comp/menu'
import { useCorpMenuByType, useCorpMenuData } from '../Company/menu'

// 懒加载组件 - 优化性能，只有在需要时才会加载
const CompanyIntroduction = lazy(() => import('@/components/company/CompanyIntroduction.tsx'))
const CompanyInfo = lazy(() => import('@/components/company/info/CompanyInfo.tsx'))
// 懒加载收藏模态框 - 只有在用户点击收藏按钮时才会加载
const Collect = lazy(() => import('@/components/searchListComponents/collect'))
// 懒加载工具栏 - 只有在完整页面模式下才会加载（单模块和SHFIC页面不需要）
const ToolsBar = lazy(() => import('@/components/toolsBar/index.tsx'))

const BODYOFFSETTOP = 12 // 顶部空间

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
  baseInfo: CorpBasicInfoFront
  setCorpModuleReadyed
  getCorpHeaderInfo: (corpCode: string, onSuccess: (res: ApiResponse<CorpCardInfo>) => void) => void
  setCorpArea
  getBasicNum
  corpCategory: TCorpCategory[]
  setCorpCategory: (arg0: TCorpCategory[]) => any
  getCorpInfo: (corpCode: string, onSuccess: (res: ApiResponse<CorpBasicInfo>) => void) => void
  setCorpOtherInfo
  setCollectState
  setIsObjection
  scrollModuleIds
  feedParam
  collectState
  userPackageinfo: UserPackageInfo | null
  userPackageInfoApiLoaded
}> = (props) => {
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

  const singleModuleIdParam = qsParam['moduleid'] || qsParam['moduleId'] || null // 有值 代表单独要显示的模块
  const singleModuleIds: TCorpDetailSubModule[] = parseUrlParamsToJsonArray(
    singleModuleIdParam
  ) as TCorpDetailSubModule[]
  const fromPage = qsParam['fromPage'] || null //  f9 代表股票等f9页面
  const fromF9 = fromPage == wftCommon.fromPage_f9 // f9页面进入
  const fromShfic = fromPage == wftCommon.fromPage_shfic // 提供给工商联的页面 不需要左侧导航
  const autoWidth = qsParam['autoWidth'] || null // 宽度自适应 （满足shifc小屏需求）

  let f9grid = qsParam['grid'] || ''
  f9grid = f9grid?.toLocaleLowerCase() // alice 跳转定位到指定模块
  const linksource = qsParam['linksource'] || null || ''

  const corpid = qsParam['companyid'] || ''
  const [companyid, setCompanyid] = useState(corpid)
  const companyState = useSelector((state: any) => state.company)
  const corpname = getCorpNameOriginalByBaseAndCardInfo(companyState?.baseInfo, companyState?.corpHeaderInfo)
  const corpNameIntl = useSelector(selectCorpNameIntl)
  usePageTitle('CompanyDetail', corpNameIntl)
  const [corpBaseInfoCard, setCorpBaseInfoCard] = useState(null)
  const [basicNum, setBasicNum] = useState<CorpBasicNumFront>({})
  const [companyRegDate, setCompanyRegDate] = useState('')

  const [collectList, setCollectList] = useState([])

  const [modalShow, setModalShow] = useState(false)

  const [corpArea, setCorpArea] = useState<CorpArea>('')

  const [loadedBrandAndPatent, setLoadedBrandAndPatent] = useState(false)
  const [loadedBid, setLoadedBid] = useState(false)
  const [userPackageInfoReady, setUserPackageInfoReady] = useState(false)

  // 使用 Hook 获取菜单配置（自动处理基金/IPO等特殊菜单项和海外企业）
  // 直接使用 Redux 中的 baseInfo，避免重复状态管理
  const currentMenus = useCorpMenuByType(props.baseInfo, basicNum)

  // 使用 Hook 管理菜单数据和状态
  const { allTreeDataObj, expandedKeys, selectedKeys, autoExpandParent, setExpandedKeys, setSelectedKeys, onExpand } =
    useCorpMenuData(currentMenus, basicNum, () => {
      // 菜单构建完成后的回调：触发初次模块加载检测
      if (!hasSingleModule) {
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
    })

  window.__GELCOMPANYCODE__ = companycode

  const is_terminal = wftCommon.usedInClient()

  const hash = window.location.hash
  if (hash && hash.length > 2) {
    // f9 兼容旧版接入方案 路由接入
    const arr = hash.split('#/')
    const moduleidFromHash = arr[arr.length - 1]
    // 招投标 包含 招标 、 中标
    if (moduleidFromHash && moduleidFromHash.indexOf('biddingInfo') > -1) {
      // 更新singleModuleIds数组以支持hash路由
      singleModuleIds.length = 0 // 清空原数组
      singleModuleIds.push('biddingInfo', 'tiddingInfo')
    }
  }
  const hasSingleModule = singleModuleIds.length > 0

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
        const moduleConfig = currentMenus[k as TCorpDetailModule]
        if (!moduleConfig?.children) continue

        // 第一次遍历：查找匹配的模块
        for (let i = 0; i < moduleConfig.children.length; i++) {
          const child = moduleConfig.children[i]
          const lowMenuStr = child.showModule?.toLocaleLowerCase()
          if (lowMenuStr === f9grid) {
            f9grid = child.showModule
            f9grid2 = f9grid
            break
          }
        }

        // 第二次遍历：再次确认（保持原有逻辑）
        moduleConfig.children.forEach((child) => {
          const lowMenuStr = child.showModule?.toLocaleLowerCase()
          if (lowMenuStr === f9grid) {
            f9grid = child.showModule
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
    let basicNumNew: Partial<CorpBasicNumFront> = {}
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
    if (hasSingleModule) {
      // 处理所有需要显示的模块
      const allModulesToReady: string[] = []

      singleModuleIds.forEach((moduleId) => {
        if (moduleId.indexOf('biddingInfo') > -1) {
          allModulesToReady.push('biddingInfo', 'tiddingInfo')
          // 兼容后端性能低下 无法获取到招投标各tab统计数字 前端单独调一次
          if (!loadedBid) {
            setLoadedBid(true)
          }
        } else if (moduleId.indexOf('getbrand') > -1 || moduleId.indexOf('getpatent') > -1) {
          // 兼容后端性能低下 无法获取到商标、专利各tab统计数字 前端单独调一次
          if (!loadedBrandAndPatent) {
            setLoadedBrandAndPatent(true)
          }
          allModulesToReady.push(moduleId)
        } else {
          allModulesToReady.push(moduleId)
        }
      })

      // 去重并设置所有需要的模块
      const uniqueModules = Array.from(new Set(allModulesToReady))
      props.setCorpModuleReadyed(uniqueModules)
    } else {
      props.getCorpHeaderInfo(
        companycode,
        (
          res: ApiResponse<
            CorpCardInfo & {
              corp?: CorpCardInfo
            }
          >
        ) => {
          setCorpBaseInfoCard(res?.data)
          // 如果companycode有效，触发快爬
          if (res?.data?.corp_id) {
            createFastCrawl(companycode)
          }
          res.data.corp = res.data
          const area = res.data.corp.areaCode ? getCorpAreaByAreaCode(res.data.corp.areaCode) : ''
          if (area && !corpArea) {
            props.setCorpArea(area)
            setCorpArea(area)
          }

          window.__GELCOMPANYNAME__ = res.data.corp.corp_name
          window.__GELCOMPANYID__ = res.data.corp.corp_old_id
          if (!companyid) {
            setCompanyid(res.data.corp.corp_old_id)
          }
          setCompanyRegDate(res.data.corp.reg_date ? res.data.corp.reg_date.substring(0, 4) : '')
        }
      )

      getCorpBasicNumLocal()
      props.getCorpInfo(companycode, (res) => {
        // 企业基本信息已通过 Redux 管理，无需本地 state
        // getCorpInfo 会自动 dispatch 到 Redux store

        const corpCategory = [...(props.corpCategory || [])]
        const area = res.data.areaCode ? getCorpAreaByAreaCode(res.data.areaCode) : ''
        if (area && !corpArea) {
          props.setCorpArea(area)
          setCorpArea(area)
        }
        const corptypeid = res.Data.corp_type_id
        let ifOverseaCorp = 0
        let ifSpecialCorp = 0
        let categoryChanged = false

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
        if (isOverseaCorp(corptypeid, res.Data.areaCode)) {
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
    let numsObj: Partial<CorpBasicNumFront> = {}
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
      const numsObj: Partial<CorpBasicNumFront> = {}
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

  const scrollEventHandler: UIEventHandler<HTMLDivElement> = (e) => {
    if (hasSingleModule) return false
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

  const treeMenuClick = (menuData: string[] | string, e: { selected: boolean; _reRender?: boolean }) => {
    const menu = Array.isArray(menuData) ? menuData[0] : menuData
    if (Object.entries(basicNum).length == 0) {
      return null
    }

    if (!menu) return
    if (!e.selected) return
    let table = null
    let tableOffsetTop = null

    if (!e._reRender) {
      handleBuryInCorpDetailMenu(menuData, corpid, currentMenus)
    }

    setSelectedKeys([menu])

    const scrollContainer = document.querySelector(`.${ScrollContainerClass}`)

    if (menu == 'showCompanyInfo') {
      table = document.querySelector(`.showCompanyInfo`)
      table = table.offsetParent
      tableOffsetTop = table.offsetTop - BODYOFFSETTOP
      scrollContainer.scrollTo({ top: tableOffsetTop, behavior: 'instant' }) // smooth instant
      return
    }

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
        if (multiTabIds.indexOf(menu.toString() as (typeof multiTabIds)[number]) > -1) {
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
    <>
      <div
        className={`companyBody page-container ${hasSingleModule ? 'companyBodyF9' : ''}  ${fromF9 ? 'companyF9' : ''} ${
          fromShfic ? (!autoWidth ? 'companySHFIC' : 'companySHFIC-autoWidth') : ''
        }  `}
      >
        <div className={ScrollContainerClass} onScroll={scrollEventHandler} data-uc-id="8tq-0rHaf" data-uc-ct="div">
          {!(hasSingleModule || fromShfic) ? (
            <div className="tree-menu-container">
              <CorpDetailMenu
                menuConfig={currentMenus}
                basicNum={basicNum}
                expandedKeys={expandedKeys}
                setExpandedKeys={setExpandedKeys}
                treeMenuClick={treeMenuClick}
                onExpand={onExpand}
                autoExpandParent={autoExpandParent}
                selectedKeys={selectedKeys}
                data-uc-id="KotLwhhwK4"
                data-uc-ct="corpdetailmenu"
              />
            </div>
          ) : null}
          <div className={'companyDetail'}>
            {!hasSingleModule ? (
              <Suspense fallback={<div></div>}>
                <CompanyIntroduction
                  companyname={corpname}
                  companycode={companycode}
                  companyid={companyid}
                  basicNum={basicNum}
                  menuClick={treeMenuClick}
                  collect={showCollectModal}
                  canBack={fromShfic || false}
                  onlyCompanyIntroduction={fromShfic || false}
                  data-uc-id="pnCJWvgfsE"
                  data-uc-ct="companyintroduction"
                />
              </Suspense>
            ) : null}

            <Card className="companyTab" bordered={false}>
              {!hasSingleModule ? (
                <Suspense fallback={<div></div>}>
                  <CompanyInfo cmd="companyInfo" companycode={companycode} />
                </Suspense>
              ) : null}
              {userPackageInfoReady || hasSingleModule ? (
                <CompanyBase
                  basicNum={basicNum}
                  companyname={corpname}
                  corpNameIntl={corpNameIntl}
                  companycode={companycode}
                  companyid={companyid}
                  singleModuleId={hasSingleModule ? singleModuleIds.join('|') : null}
                  singleModuleOrder={hasSingleModule ? singleModuleIds : null}
                  companyRegDate={companyRegDate}
                  menuClick={treeMenuClick}
                  allMenuDataObj={allTreeDataObj}
                  refreshCorpOtherInfo={refreshCorpOtherInfo}
                />
              ) : null}
            </Card>
          </div>
        </div>

        {!(hasSingleModule || fromShfic) ? (
          <Suspense fallback={<div></div>}>
            <ToolsBar
              backTopWrapClass={ScrollContainerClass}
              collectState={props.collectState}
              isShowCollect={true}
              isShowFeedback={true}
              companyName={corpNameIntl}
              isShowHome={true}
            />
          </Suspense>
        ) : null}
      </div>
      {modalShow ? (
        <Suspense fallback={<div></div>}>
          <Collect
            state={props.collectState}
            list={collectList}
            code={companycode}
            from={'detail'}
            close={closeModal}
            change={(e) => props.setCollectState(e)}
          />
        </Suspense>
      ) : null}
    </>
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
        const newRes = await translateCorpBaseInfoData(res)
        dispatch(companyActions.getCorpHeaderInfo(newRes))
        fn?.(newRes)
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
