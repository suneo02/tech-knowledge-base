import { IndicatorBulkImportApi } from '@/BulkImport/type'
import { Dropdown, Input, Menu, Spin, Tooltip } from '@wind/wind-ui'
import { useRequest } from 'ahooks'
import { ApiCodeForWfc, IndicatorCorpSearchRes } from 'gel-api'
import { t } from 'gel-util/intl'
import { debounce } from 'lodash'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styles from './corpSearchSelect.module.less'

const { Search } = Input

/**
 * 公司搜索选择组件的属性接口
 */
interface CorpSearchSelectProps extends Pick<IndicatorBulkImportApi, 'searchCompanies'> {
  /**
   * 当前选中的标准公司名称
   * 这是公司的规范化名称，通常来自数据库或API
   * 例如：用户输入"小米"，但实际公司全称是"北京小米科技有限责任公司"
   */
  corpName?: string

  /**
   * 当前的查询文本
   * 这是用户实际输入或要显示的文本
   * 可能是用户的原始输入，或者是简称、别名等
   *
   * 注意：这个值优先级高于 corpName，如果同时提供两者，会优先使用 queryText
   */
  queryText?: string

  /**
   * 选择变更的回调函数
   * 当用户从下拉列表中选择一个公司时触发
   */
  onChange: (company: IndicatorCorpSearchRes) => void
}

/**
 * 下拉菜单项类型
 */
interface DropdownItem {
  /**
   * 显示在下拉菜单中的文本（公司名称）
   */
  text: string | null

  /**
   * 与菜单项关联的公司数据
   */
  value: IndicatorCorpSearchRes
}

/**
 * 公司搜索选择组件
 *
 * 这是一个支持远程搜索的公司选择组件，主要用于企业匹配场景。
 *
 * 关于 corpName 和 queryText：
 * 1. corpName：
 *    - 代表公司的标准/规范名称
 *    - 通常来自数据库或API返回
 *    - 用于数据存储和关联
 *
 * 2. queryText：
 *    - 代表用户的实际输入或显示文本
 *    - 可能是公司简称、别名或用户习惯的称呼
 *    - 用于提供更好的用户体验
 *
 * 使用场景：
 * 1. 新建/搜索时：
 *    - 只需提供 onChange 回调
 *    - 组件内部维护输入状态
 *
 * 2. 编辑已有数据时：
 *    - 提供 queryText 显示当前值
 *    - 可选提供 corpName 作为备选显示
 *
 * @example
 * // 新建场景
 * <CorpSearchSelect onChange={handleChange} />
 *
 * // 编辑场景
 * <CorpSearchSelect
 *   queryText="小米科技"
 *   corpName="北京小米科技有限责任公司"
 *   onChange={handleChange}
 * />
 */
export const CorpSearchSelect: React.FC<CorpSearchSelectProps> = ({
  corpName,
  queryText: initialQueryText,
  onChange,
  searchCompanies,
}) => {
  // 存储搜索结果数据
  const [data, setData] = useState<DropdownItem[]>([])
  // 控制下拉菜单的可见性
  const [dropVisible, setDropVisible] = useState<boolean | undefined>(false)
  // 控制提示信息的可见性
  const [tooltipVisible, setTooltipVisible] = useState(false)
  // 搜索框中的文本，优先使用 initialQueryText，其次使用 corpName
  const [queryText, setQueryText] = useState(initialQueryText || corpName || '')
  // 存储错误信息
  const [error, setError] = useState<string | null>(null)
  // 追踪最新的请求ID，用于处理竞态条件
  const lastFetchId = useRef(0)

  const { runAsync: runSearchCompanies, loading } = useRequest(searchCompanies, {
    onError: console.error,
    manual: true,
  })

  // 当外部值变化时更新输入框文本
  // 优先使用 initialQueryText（用户输入），其次使用 corpName（标准名称）
  useEffect(() => {
    if (initialQueryText) {
      setQueryText(initialQueryText)
    } else if (corpName) {
      setQueryText(corpName)
    }
  }, [initialQueryText, corpName])

  /**
   * 获取公司数据的函数 - 使用防抖动避免频繁API调用
   */
  const fetchCompanies = useCallback(
    debounce(async (searchText: string) => {
      if (!searchText) return

      // 增加请求ID以追踪最新请求
      lastFetchId.current += 1
      const fetchId = lastFetchId.current

      setError(null)

      try {
        const res = await runSearchCompanies({
          queryText: searchText,
        })
        // 如果不是最新请求，忽略结果
        if (fetchId !== lastFetchId.current) return

        if (res.ErrorCode !== ApiCodeForWfc.SUCCESS) {
          setError(res.ErrorMessage || '')
          return
        }

        if (!res.Data) {
          setError(t('no_results', '未找到匹配的公司'))
          return
        }

        // 处理搜索结果，只保留前5个
        const newData = res.Data.list
          .map((company) => ({
            text: company.corpName,
            value: company,
          }))
          .slice(0, 5)

        setData(newData)
        // 如果没有结果，显示空状态
        if (newData.length === 0) {
          setError(t('no_results', '未找到匹配的公司'))
        }
      } catch (err) {
        // 如果不是最新请求，忽略错误
        if (fetchId !== lastFetchId.current) return
        setError(t('search_error', '搜索公司时出错'))
        console.error('公司搜索错误:', err)
      }
    }, 500),
    [searchCompanies]
  )

  /**
   * 处理输入变化的函数
   */
  const handleInputChange = useCallback(
    (value: string) => {
      setQueryText(value)

      if (value.length < 2) {
        // 当输入少于2个字符时，隐藏下拉框并显示提示
        setDropVisible(false)
        setTooltipVisible(true)
        setData([]) // 清空之前的搜索结果
      } else {
        // 当输入2个或更多字符时，显示下拉框并开始搜索
        setTooltipVisible(false)
        setDropVisible(true)
        fetchCompanies(value)
      }
    },
    [fetchCompanies]
  )

  /**
   * 处理选择项的函数
   */
  const handleItemSelect = useCallback(
    (item: DropdownItem) => {
      setQueryText(item.value.corpName || '')
      onChange(item.value)
      setDropVisible(false)
    },
    [onChange]
  )

  // 下拉菜单内容
  const menu = useMemo(
    () => (
      // @ts-expect-error wind-ui
      <Menu>
        {loading ? (
          // 加载状态
          <Menu.Item key="loading" disabled>
            <Spin size="small" /> {t('loading', '加载中...')}
          </Menu.Item>
        ) : error ? (
          // 错误状态
          <Menu.Item key="error" disabled>
            {error}
          </Menu.Item>
        ) : data.length > 0 ? (
          // 搜索结果
          data.map((item) => (
            <Menu.Item key={item.value.corpId || ''} onClick={() => handleItemSelect(item)}>
              {item.text}
            </Menu.Item>
          ))
        ) : (
          // 空状态
          <Menu.Item key="empty" disabled>
            {t('no_companies', '未找到公司')}
          </Menu.Item>
        )}
      </Menu>
    ),
    [loading, error, data, handleItemSelect]
  )

  // 工具提示文本
  const tooltipTitle = useMemo(() => t('140075', '请至少输入两个字符'), [])

  // 搜索框占位符
  const placeholder = useMemo(() => t('search_placeholder', '请输入公司名称'), [])

  return (
    <Dropdown overlay={menu} visible={dropVisible} onVisibleChange={setDropVisible}>
      <Tooltip title={tooltipTitle} visible={tooltipVisible} placement="topLeft">
        <Search
          className={styles['search-select']}
          placeholder={placeholder}
          value={queryText}
          onChange={(e) => handleInputChange(e.target.value)}
          onSearch={handleInputChange}
          onFocus={() => {
            if (queryText.length >= 2) {
              setDropVisible(true)
              fetchCompanies(queryText)
            }
          }}
        />
      </Tooltip>
    </Dropdown>
  )
}
