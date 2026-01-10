/**
 * 企业详情页懒加载滚动处理
 *
 * 提供基于滚动事件的模块懒加载功能，支持防抖处理、菜单同步和智能预加载
 *
 * @see ../../../docs/CorpDetail/lazyLoad.md - 懒加载设计文档
 */

import { CorpMenuSimpleData } from '@/views/Company/menu'
import { multiTabIds } from 'gel-util/corpConfig'
import { debounce } from 'lodash'

export const SCROLL_FROM_MENU_CLICK_ID = {
  value: null,
  time: 0,
}
/**
 * 创建初次加载时的模块检测函数
 * 用于页面首次加载时检测视口内的模块并触发加载
 * @param bodyOffsetTop - 顶部偏移量
 * @param fn - 模块加载回调函数
 * @param menuChanged - 菜单变化回调函数
 */
export const triggerInitialModuleLoad = (
  bodyOffsetTop: number,
  fn?: (moduleIds: string[]) => void,
  menuChanged?: (moduleId: string) => void
) => {
  // 模拟一个滚动事件对象，scrollTop为0表示初始位置
  const mockScrollEvent = {
    target: {
      scrollTop: 0,
    },
  } as unknown as React.UIEvent<HTMLDivElement, UIEvent>

  // 直接调用滚动回调逻辑，但跳过debounce
  const scrollLogic = createCorpDetailScrollCallbackLogic(bodyOffsetTop)
  scrollLogic(mockScrollEvent, fn, menuChanged)
}

/**
 * 企业详情页滚动回调的核心逻辑
 *
 * 该函数是懒加载机制的核心，负责：
 * 1. 计算当前视口位置和模块位置关系
 * 2. 识别最接近视口的模块
 * 3. 根据屏幕大小智能计算预加载模块数量
 * 4. 触发模块数据加载和菜单状态更新
 *
 * @param bodyOffsetTop - 页面顶部偏移量（标准版12px，AI版36px）
 * @returns 返回处理滚动事件的函数
 */
const createCorpDetailScrollCallbackLogic = (bodyOffsetTop: number) => {
  return (
    e: React.UIEvent<HTMLDivElement, UIEvent>,
    onModuleLoad: (moduleIds: string[]) => void,
    menuChanged: (moduleId: string) => void
  ) => {
    // ========== 第一阶段：获取滚动位置 ==========

    /**
     * 获取当前滚动条距离顶部的距离
     * 使用多种方式兼容不同浏览器的滚动值获取
     * 优先级：documentElement.scrollTop > pageYOffset > body.scrollTop > event.target.scrollTop
     */
    let windowScrollTop =
      window.document.documentElement.scrollTop ||
      window.pageYOffset ||
      window.document.body.scrollTop ||
      (e.target as HTMLElement).scrollTop

    // ========== 第二阶段：DOM查询与基础数据准备 ==========

    /**
     * 查询所有带有 data-custom-id 属性的模块元素
     * 这些元素代表页面中可以懒加载的业务模块
     */
    let modules: any = document.querySelectorAll('[data-custom-id]')

    /**
     * 获取浏览器视窗高度
     * 用于计算模块是否在可视区域内
     */
    const windowHeight = (window.outerHeight ? window.outerHeight : window.innerHeight) || 0

    /**
     * 距离计算相关变量
     * maxDistance: 用于找到距离当前视口最近的模块，初始化为极大值
     * result: 存储找到的最近模块元素
     */
    let maxDistance = 1000000000
    let result = null

    // ========== 第三阶段：坐标系调整 ==========

    /**
     * 第一次坐标调整：减去页面顶部偏移量
     * bodyOffsetTop 是页面顶部的固定偏移（如导航栏高度）
     */
    windowScrollTop -= bodyOffsetTop

    /**
     * 获取企业详情标签页的顶部位置
     * companyTab 是页面中的重要基准元素，用于进一步调整坐标系
     */
    const companyTabTop = document.querySelector(`.companyTab`)
      ? (document.querySelector(`.companyTab`) as HTMLElement).offsetTop
      : 0

    /**
     * 获取主容器的高度
     * 用于动态计算预加载模块数量，适应不同屏幕尺寸
     */
    const screenHeight = document.querySelector('.main-container')
      ? (document.querySelector('.main-container') as HTMLElement).offsetHeight
      : 0

    // ========== 第四阶段：智能预加载策略 ==========

    /**
     * 动态计算需要预加载的模块数量
     * 基于当前滚动位置和屏幕高度进行智能调整
     */
    let screenCanShowModulesN = 5 // 默认预加载5个模块
    const moduleLoadingHeight = 300 // 每个模块的预估高度（px）

    /**
     * 预加载数量调整逻辑（优化版）：
     * 优先级：屏幕大小 > 滚动位置
     * 1. 大屏幕：根据屏幕高度增加预加载数量，提升用户体验
     * 2. 小屏幕 + 接近顶部：减少预加载，避免初次加载压力
     * 3. 其他情况：使用默认值5个模块
     */
    if (screenHeight / moduleLoadingHeight > 5) {
      // 大屏幕优先：预加载数量 = 屏幕可容纳模块数 + 1
      // 即使在顶部，大屏幕用户也应该享受更好的预加载体验
      screenCanShowModulesN = Math.ceil(screenHeight / moduleLoadingHeight) + 1
      console.log(`[懒加载] 大屏幕模式: 屏幕高度=${screenHeight}px, 预加载${screenCanShowModulesN}个模块`)
    } else if (windowScrollTop < moduleLoadingHeight / 2) {
      // 小屏幕 + 顶部区域：减少预加载避免性能压力
      screenCanShowModulesN = 3
      console.log(`[懒加载] 小屏顶部模式: 滚动位置=${windowScrollTop}px, 预加载${screenCanShowModulesN}个模块`)
    } else {
      console.log(
        `[懒加载] 默认模式: 屏幕高度=${screenHeight}px, 滚动位置=${windowScrollTop}px, 预加载${screenCanShowModulesN}个模块`
      )
    }
    // 其他情况（小屏幕 + 非顶部）：使用默认值5个模块

    // ========== 第五阶段：最终坐标系调整 ==========

    /**
     * 第二次坐标调整：减去企业详情标签页的顶部位置
     * 将滚动位置转换为相对于内容区域的位置
     */
    windowScrollTop = windowScrollTop - companyTabTop

    /**
     * 模块遍历的索引计数器
     * 用于记录当前找到的最近模块在模块列表中的位置
     */
    let k = 0

    // ========== 第六阶段：主要模块查找循环 ==========

    /**
     * 遍历所有模块，找到距离当前滚动位置最近的模块
     * 这是懒加载算法的核心部分：通过距离计算确定哪个模块最应该被加载
     */
    for (let i = 0; i < modules.length; i++) {
      /**
       * 获取模块相对于文档的顶部位置
       * offsetTop 是元素顶边距离最近定位父元素顶边的距离
       */
      let curModuleTop = modules[i].offsetTop
      const id = modules[i].getAttribute('data-custom-id')

      // ========== 处理复合模块的位置计算 ==========

      /**
       * 处理带有子模块的复合模块情况
       * 某些模块是嵌套结构，需要特殊的位置计算逻辑
       */
      if (id.indexOf('-') > 0) {
        /**
         * 检查是否为多标签页业务模块
         * multiTabIds 包含了需要特殊处理的多标签模块ID列表
         */
        if (multiTabIds.indexOf(id.split('-')[0]) > -1) {
          /**
           * 多标签页模块的位置计算：
           * 1. 找到对应的标签页容器元素 [multitabid=xxx]
           * 2. 将子模块位置 + 标签页容器位置 = 真实位置
           */
          const parentTab: any = document.querySelector(`[multitabid=${id.split('-')[0]}]`)
          curModuleTop = curModuleTop + parentTab?.offsetTop
        } else {
          /**
           * 普通子模块的位置计算：
           * 子模块位置 + 父容器位置 = 真实位置
           */
          curModuleTop = curModuleTop + modules[i].offsetParent.offsetTop
        }
      }

      // ========== 距离计算与最近模块判定 ==========

      /**
       * 计算当前模块顶部到当前视口位置的绝对距离
       * 使用绝对值确保无论模块在视口上方还是下方都能正确计算
       */
      const curDistanceToTop = Math.abs(curModuleTop - windowScrollTop)

      /**
       * 更新最近模块的逻辑：
       * 1. 距离更近（小于当前最小距离）
       * 2. 模块位置在视口范围内（curModuleTop < windowScrollTop + windowHeight）
       *
       * 第二个条件确保我们只考虑当前可见或接近可见的模块
       */
      if (maxDistance > curDistanceToTop) {
        if (curModuleTop < windowScrollTop + windowHeight) {
          maxDistance = curDistanceToTop
          result = modules[i] // 更新最近的模块元素
          k = i // 记录模块在列表中的索引，用于后续预加载计算
        }
      }
    }

    // ========== 第七阶段：备用查找策略 ==========

    /**
     * 备用查找逻辑：当主要查找没有结果时启用
     * 这种情况通常发生在页面初始化或特殊滚动状态下
     */
    if (!result) {
      /**
       * 从已加载的模块中查找
       * 'table-custom-module-readyed' 类名标识已经完成数据加载的模块
       * 这提供了一个备用的参考点，确保总能找到一个有效的模块
       */
      modules = document.getElementsByClassName('table-custom-module-readyed')
      maxDistance = 1000000000 // 重置距离计算

      /**
       * 对已加载模块重复执行相同的查找逻辑
       * 这确保了即使在极端情况下也能有模块可以作为参考
       */
      for (let i = 0; i < modules.length; i++) {
        let curModuleTop = modules[i].offsetTop
        const id = modules[i].getAttribute('data-custom-id') || 'showCompanyInfo' // 提供默认值

        /**
         * 复合模块位置处理（与主循环逻辑相同）
         */
        if (id.indexOf('-') > 0) {
          if (multiTabIds.indexOf(id.split('-')[0]) > -1) {
            const parentTab: any = document.querySelector(`[multitabid=${id.split('-')[0]}]`)
            curModuleTop = curModuleTop + parentTab?.offsetTop
          } else {
            curModuleTop = curModuleTop + modules[i].offsetParent.offsetTop
          }
        }

        /**
         * 距离计算与最近模块更新（与主循环逻辑相同）
         */
        const curDistanceToTop = Math.abs(curModuleTop - windowScrollTop)
        if (maxDistance > curDistanceToTop) {
          if (curModuleTop < windowScrollTop + windowHeight) {
            maxDistance = curDistanceToTop
            result = modules[i]
          }
        }
      }

      /**
       * 备用查找仍然失败的情况处理
       * 如果连已加载的模块都找不到，说明页面可能还在初始化过程中
       */
      if (!result) return

      /**
       * 备用模块的菜单状态更新
       * 触发菜单变化回调，确保菜单状态与当前找到的模块保持一致
       */
      const moduleId = result.getAttribute('data-custom-id') || 'showCompanyInfo'
      if (menuChanged) {
        menuChanged(moduleId)
      }
    } else {
      // ========== 第八阶段：成功找到模块的处理逻辑 ==========

      /**
       * 获取找到的最近模块的ID
       * 这个模块将作为当前加载的主要目标
       */
      const moduleId = result.getAttribute('data-custom-id')

      /**
       * 初始化需要加载的模块ID列表
       * next数组将包含当前模块和所有需要预加载的模块
       */
      const next = [moduleId]

      // ========== 菜单点击优化逻辑 ==========

      /**
       * 根据触发来源优化加载策略
       * SCROLL_FROM_MENU_CLICK_ID.value 记录了最近一次菜单点击的目标模块
       * 如果当前模块匹配菜单点击目标，说明这是菜单点击导致的滚动
       */
      if (next.indexOf(SCROLL_FROM_MENU_CLICK_ID.value) > -1) {
        /**
         * 菜单点击触发的预加载逻辑
         * 从当前模块开始，向后预加载指定数量的模块
         * k是当前模块在模块列表中的索引，screenCanShowModulesN是预加载数量
         */
        for (let j = k + 1; j < k + screenCanShowModulesN; j++) {
          if (modules[j]) {
            const id = modules[j].getAttribute('data-custom-id')
            if (id) next.push(id) // 将有效的模块ID添加到加载队列
          }
        }
      } else {
        /**
         * 普通滚动触发的预加载逻辑
         * 逻辑与菜单点击相同，都是从当前模块向后预加载
         *
         * 注释：这里的逻辑重复可能是历史原因，
         * 实际上两种情况的处理方式是相同的
         */
        for (let j = k + 1; j < k + screenCanShowModulesN; j++) {
          if (modules[j]) {
            const id = modules[j].getAttribute('data-custom-id')
            if (id) next.push(id)
          }
        }
      }

      // ========== 第九阶段：触发模块加载 ==========

      /**
       * 执行模块加载回调
       * fn回调函数将接收到需要加载的模块ID数组
       * 这个回调会触发实际的数据请求和模块渲染
       */
      if (onModuleLoad) {
        onModuleLoad(next)
      }
    }
  }
}

export const createCorpDetailScrollCallback = (bodyOffsetTop: number) => {
  return debounce(
    (
      e: React.UIEvent<HTMLDivElement, UIEvent>,
      onModuleLoad: (moduleIds: string[]) => void,
      menuChanged: (moduleId: string) => void
    ) => {
      const scrollLogic = createCorpDetailScrollCallbackLogic(bodyOffsetTop)
      scrollLogic(e, onModuleLoad, menuChanged)
    },
    300
  )
}

export const handleCorpDetailScrollMenuLoad = (
  moduleId: string[],
  cbs: {
    loadedBrandAndPatent: boolean
    setLoadedBrandAndPatent: (value: boolean) => void
    loadedBid: boolean
    setLoadedBid: (value: boolean) => void
    allTreeDataObj: Record<string, CorpMenuSimpleData>
    setSelectedKeys: (value: string[]) => void
    setExpandedKeys: (value: string[]) => void
    expandedKeys: string[]
    props: {
      scrollModuleIds: string[]
      setCorpModuleReadyed: (value: string[]) => void
    }
  }
) => {
  const {
    loadedBrandAndPatent,
    setLoadedBrandAndPatent,
    loadedBid,
    setLoadedBid,
    props,
    allTreeDataObj,
    setSelectedKeys,
    setExpandedKeys,
    expandedKeys,
  } = cbs
  if (moduleId) {
    const moduleIdStrs = moduleId.toString()
    if (moduleIdStrs.indexOf('getbrand') > -1 || moduleIdStrs.indexOf('getpatent') > -1) {
      // 兼容后端性能低下 无法获取到商标、专利各tab统计数字 前端单独调一次
      if (!loadedBrandAndPatent) {
        setLoadedBrandAndPatent(true)
      }
    }
    if (moduleIdStrs.indexOf('biddingInfo') > -1) {
      // 兼容后端性能低下 无法获取到招投标各tab统计数字 前端单独调一次
      if (!loadedBid) {
        setLoadedBid(true)
      }
    }
  }

  let scrollModuleIds = [...props.scrollModuleIds]
  if (moduleId.length) {
    moduleId.map((t) => {
      if (props.scrollModuleIds.indexOf(t) == -1) {
        scrollModuleIds = [...scrollModuleIds, t]
      }
    })
  }

  try {
    if (
      scrollModuleIds.length == props.scrollModuleIds.length &&
      scrollModuleIds[0] == props.scrollModuleIds[0] &&
      scrollModuleIds[scrollModuleIds.length - 1] == props.scrollModuleIds[props.scrollModuleIds.length - 1]
    ) {
      // 数组相同，无需更新
    } else {
      props.setCorpModuleReadyed(scrollModuleIds)
    }
  } catch (error) {
    console.error('Error updating scroll module IDs:', error)
  }

  if (moduleId && moduleId.length) {
    const menuId = moduleId[0].split('-')[0]
    if (menuId) {
      // 修复菜单点击跳转抖动问题
      if (SCROLL_FROM_MENU_CLICK_ID.value) {
        if (Date.now() - SCROLL_FROM_MENU_CLICK_ID.time > 1000) {
          SCROLL_FROM_MENU_CLICK_ID.value = null
          SCROLL_FROM_MENU_CLICK_ID.time = 0
        } else if (SCROLL_FROM_MENU_CLICK_ID.value !== menuId) {
          return
        }
      }
      setSelectedKeys([menuId])
    }
    if (menuId && allTreeDataObj[menuId] && allTreeDataObj[menuId].parentMenuKey) {
      if (expandedKeys) {
        if (expandedKeys.indexOf(allTreeDataObj[menuId].parentMenuKey) == -1) {
          setExpandedKeys([...expandedKeys, allTreeDataObj[menuId].parentMenuKey])
        }
      } else {
        setExpandedKeys([allTreeDataObj[menuId].parentMenuKey])
      }
    }
  }
}

/**
 * 处理企业详情页滚动时菜单的变化
 *
 * @param moduleId - 当前视口中的模块ID
 * @param cbs - 回调函数集合
 * @see apps/company/docs/specs/2025-12/2025-12-04-fix-menu-jump/spec-analysis.md - 关于修复菜单抖动问题的详细分析
 */
export const handleCorpDetailScrollMenuChanged = (
  moduleId: string,
  cbs: {
    setSelectedKeys: (value: string[]) => void
    setExpandedKeys: (value: string[]) => void
    expandedKeys: string[]
    allTreeDataObj: Record<string, CorpMenuSimpleData>
  }
) => {
  const { setSelectedKeys, setExpandedKeys, expandedKeys, allTreeDataObj } = cbs
  //  加载过的模块，此回调函数用于更新menu
  if (moduleId) {
    const menuId = moduleId.split('-')[0]
    // 修复菜单点击跳转抖动问题
    if (SCROLL_FROM_MENU_CLICK_ID.value) {
      if (Date.now() - SCROLL_FROM_MENU_CLICK_ID.time > 1000) {
        SCROLL_FROM_MENU_CLICK_ID.value = null
        SCROLL_FROM_MENU_CLICK_ID.time = 0
      } else if (SCROLL_FROM_MENU_CLICK_ID.value !== menuId) {
        return
      }
    }
    if (!allTreeDataObj[menuId]) return
    setSelectedKeys([menuId])
    if (expandedKeys) {
      if (expandedKeys.indexOf(allTreeDataObj[menuId].parentMenuKey) == -1) {
        setExpandedKeys([...expandedKeys, allTreeDataObj[menuId].parentMenuKey])
      }
    } else {
      setExpandedKeys([allTreeDataObj[menuId].parentMenuKey])
    }
  }
}
