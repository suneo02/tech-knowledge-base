import { ApiResponse } from '@/api/types'
import { CompanyTableSelectOptions, CorpTableCfg } from '@/types/corpDetail'
import { translateComplexHtmlData } from '@/utils/intl'
import { wftCommon } from '@/utils/utils'

/**
 * 聚合项配置接口
 * 定义表格右侧筛选器的数据结构
 */
interface AggregationItem {
  key: string
  value?: string
  doc_count?: number | string
  doc_count_key?: string
}

/**
 * 处理企业表格右侧筛选器的选项数据
 *
 * 功能说明：
 * 1. 从后端聚合数据中提取筛选选项
 * 2. 处理国际化翻译
 * 3. 处理静态筛选项（如排序选项）
 * 4. 更新筛选器的文档计数
 * 5. 维护筛选器状态的同步
 *
 * @param ops - 配置参数对象
 */
export const handleCompanyTableRightSelect = (ops: {
  /** 当前表格配置 */
  eachTable: CorpTableCfg
  /** 后端返回的响应数据 */
  backRes: ApiResponse
  /** 请求参数 */
  params: any
  /** 当前筛选器选项数据 */
  selOption: CompanyTableSelectOptions
  /** 当前筛选器选中的值数组 */
  selOptionValue: string[]
  /** 当前操作的筛选器索引 */
  selOptionIndex: number
  /** 表格的唯一标识 */
  eachTableKey: string
  /** 设置筛选器选项的函数 */
  setSelOption: (options: CompanyTableSelectOptions) => void
  /** 所有筛选器的初始选项（用于重置） */
  allSelOption: CompanyTableSelectOptions
  /** 设置所有筛选器初始选项的函数 */
  setAllSelOption: (options: CompanyTableSelectOptions) => void
}) => {
  const {
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
  } = ops

  // 如果表格没有配置右侧筛选器，直接返回
  if (!(eachTable.rightFilters && eachTable.rightFilters.length)) {
    return
  }

  // 存储所有筛选器的选项数据，索引对应筛选器位置
  const selObj: CompanyTableSelectOptions = []
  // 记录已处理完成的筛选器数量（用于异步处理计数）
  let selObjCount = 0
  // 标记是否有异步翻译任务
  let hasAsyncTranslation = false

  // 遍历每个右侧筛选器配置
  eachTable.rightFilters.map((item, idx) => {
    // 获取聚合字段的 key（用于从后端响应中提取数据）
    const key = item.key4sel
    // 从后端聚合数据中获取当前筛选器的选项列表
    let selList: AggregationItem[] = (backRes.Data.aggregations && backRes.Data.aggregations[key]) || []
    // 保存英文版本的选项列表（用于国际化处理）
    let selList_En: AggregationItem[] = Object.assign([], selList)

    /**
     * 筛选列表数据处理回调函数
     * 处理国际化、自定义渲染、添加"全部"选项等逻辑
     *
     * @param data - 处理后的聚合数据（可能是翻译后的）
     */
    const selListCallback = (data: AggregationItem[]) => {
      selObjCount++
      selList_En = data

      // 如果配置了自定义渲染函数，使用自定义渲染
      if (item.keyRender) {
        selList = selList.map((ele: AggregationItem, index: number) => ({
          value: ele.value ? ele.value : ele.key,
          key: window.en_access_config ? selList_En[index].key : item.keyRender!(ele.key),
          doc_count: ele.doc_count || '',
        }))
      } else {
        // 如果是英文环境，使用翻译后的 key
        if (window.en_access_config) {
          selList = selList.map((ele: AggregationItem, index: number) => ({
            value: ele.value ? ele.value : ele.key,
            key: selList_En[index].key,
            doc_count: ele.doc_count || '',
          }))
        }
      }
      const sel_list = selList
      const obj = {}

      // 为非静态筛选项且需要"全部"选项的筛选器添加默认"全部"选项
      // 静态固定筛选项（如排序）和 noNeedAll 为 true 的不添加"全部"选项
      if (!item?.isStatic && !item?.noNeedAll) {
        sel_list.splice(0, 0, {
          key: item.name, // 显示文本，如"全部类型"
          value: item.key, // 值为空字符串，表示不筛选
        })
      }

      // 使用 Object.defineProperty 确保属性可枚举
      Object.defineProperty(obj, idx, {
        value: sel_list,
        enumerable: true,
      })

      // 直接通过索引赋值，不使用 push
      // 因为异步处理可能导致顺序错乱，使用索引可以保证顺序正确
      selObj[idx] = obj

      // 预留：处理无数据情况的逻辑
      if (!((backRes.Data.list && backRes.Data.list.length) || (backRes.Data && backRes.Data.length))) {
        // 如果没有数据，可以在这里添加特殊处理
      }
    }

    // 处理静态固定筛选项（如排序选项）
    if (item.isStatic) {
      // 如果需要为静态选项添加文档计数
      if (item.needStaticCount) {
        item.listSort = item.listSort!.map((i) => {
          // 从聚合数据中查找对应的计数
          const doc_count =
            selList.find((j: AggregationItem) => {
              return j.key === i.doc_count_key
            })?.doc_count || 1
          return {
            ...i,
            doc_count: doc_count,
          }
        })
      }
      // 使用配置的静态列表
      selList = item.listSort as AggregationItem[]
      selListCallback(selList)
    } else if (key === 'agg_year') {
      // 特殊处理：年份筛选器，将 key 作为 value
      selList = selList.map((i: AggregationItem) => ({
        ...i,
        value: i.key,
      }))
      selListCallback(selList)
    } else if (window.en_access_config) {
      // 英文环境：需要翻译选项文本
      hasAsyncTranslation = true
      translateComplexHtmlData(selList_En)
        .then((endata) => {
          selListCallback(endata)
          // 翻译完成后，重新调用统一的更新逻辑
          if (params.pageNo === 0) {
            updateSelOption()
          }
        })
        .catch((e) => {
          console.error(e)
        })
    } else {
      // 中文环境：直接使用原始数据
      selListCallback(selList)
    }
  })

  // 只在第一页时更新筛选器选项（分页时不需要重新构建筛选器）
  if (params.pageNo != 0) {
    return
  }

  /**
   * 初始化筛选器选项
   * 直接使用新构建的 selObj 设置选项
   */
  const initializeSelOption = () => {
    setSelOption(selObj)
    // 如果还没有保存初始选项，保存当前选项作为初始状态（用于重置）
    !allSelOption && setAllSelOption(selObj)
  }

  /**
   * 更新现有筛选器选项的文档计数
   * 保留原有选项结构，只更新 doc_count
   */
  const updateSelOptionDocCount = () => {
    // 深拷贝当前选项，避免直接修改原对象
    const oldSelOption: CompanyTableSelectOptions = wftCommon.deepClone(selOption)

    oldSelOption.map((t, idx) => {
      // 判断当前筛选器是否需要跳过更新
      let pass = 0

      // 如果是当前正在操作的筛选器
      if (idx === selOptionIndex) {
        const item = selOption[idx]
        // 如果有选中值（非"全部"选项）或选中的不是第一项，则跳过
        // 因为用户正在操作这个筛选器，不需要更新它
        if (selOptionValue[idx] || (selOptionValue[idx] && selOptionValue[idx] !== item[idx][0].key)) {
          pass++
        }
        // 特殊处理："本企业投标"选项需要更新计数
        if (selOptionValue[idx] === '本企业投标') {
          pass = 0
        }
      }

      // 以下情况跳过更新：
      // 1. pass > 0：当前正在操作的筛选器
      // 2. selOption.length === 1：只有一个筛选器
      // 3. eachTableKey === 'showControllerCompany'：控股企业表格（特殊处理）
      if (pass || selOption.length === 1 || eachTableKey === 'showControllerCompany') return

      // 获取旧的选项列表和新的选项列表
      const oldSelItem = t[idx]
      const newSelItem = selObj[idx]?.[idx]

      // 如果新选项不存在，跳过（可能是异步翻译还未完成）
      if (!newSelItem) return

      // 更新每个选项的文档计数
      oldSelItem.map((item: AggregationItem) => {
        if (item.hasOwnProperty('doc_count')) {
          // 在新数据中查找对应的选项
          const targetSel = newSelItem.find((x: AggregationItem) => x.key == item.key)
          if (targetSel) {
            // 更新计数
            item.doc_count = targetSel.doc_count
          } else {
            // 如果新数据中没有这个选项，计数设为 0
            item.doc_count = 0
          }
        }
      })
    })

    // 更新筛选器选项
    setSelOption(oldSelOption)
  }

  /**
   * 统一的选项更新入口
   * 根据当前状态决定是初始化还是更新文档计数
   */
  const updateSelOption = () => {
    // 场景1：初始化状态 - 没有现有选项或选项为空
    if (!(selOption && selOptionValue?.length && selOption?.length)) {
      initializeSelOption()
    } else {
      // 场景2：更新状态 - 已有选项，需要更新文档计数
      updateSelOptionDocCount()
    }
  }

  // 只有在没有异步翻译任务时才同步调用更新
  // 如果有异步翻译，会在翻译完成后的回调中调用
  if (!hasAsyncTranslation) {
    updateSelOption()
  }
}
