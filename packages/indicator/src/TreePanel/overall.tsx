import { AutoComplete, Button, Checkbox, Col, Divider, Input, Row, Switch } from '@wind/wind-ui'
import { useScroll } from 'ahooks'
import { IndicatorTreeClassification } from 'gel-api'
import { useScrollTracking } from 'gel-ui'
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react'
import { IndicatorClassificationCard } from './ClassificationCard'
import { filterIndicatorTree } from './handle'
import { useIndicatorCheck } from './hooks/useIndicatorCheck'
import { IndicatorTreeOverallRef } from './hooks/useIndicatorTreeOverall'
import styles from './style/overall.module.less'
import { CoinsO } from '@/assets'
import { VerticalAlignTopOutlined } from '@ant-design/icons'
import { t } from 'gel-util/intl'

export { useIndicatorTreeOverall } from './hooks/useIndicatorTreeOverall'
const STRINGS = {
  SHOW_COINS: t('464228', '显示积分'),
  SEARCH_PLACEHOLDER: t('465501', '搜索指标'),
}
// Helper function to generate React Element options for AutoComplete
const generateIndicatorOptions = (
  tree: IndicatorTreeClassification[],
  parentPath: string,
  checkedIndicatorIds: Set<number>, // 改为使用 Set<number>
  initialCheckedIndicators: Set<number>,
  handleIndicatorCheckFn: (key: number, checked: boolean) => void,
  forceDropdownOpenFn: () => void
): React.ReactElement[] => {
  const options: React.ReactElement[] = []
  const WindOption = AutoComplete.Option

  tree.forEach((classification) => {
    const currentPath = parentPath ? `${parentPath}-${classification.title}` : classification.title

    // Add indicators to options if they exist
    classification.indicators?.forEach((indicator) => {
      if (indicator.spId && indicator.indicatorDisplayName) {
        const fullPathText = `${currentPath}-${indicator.indicatorDisplayName}`
        const isDisabled = initialCheckedIndicators.has(indicator.spId)

        // Define styles for disabled row
        const optionStyle: React.CSSProperties = isDisabled ? { opacity: 0.6, cursor: 'not-allowed' } : {}
        const textStyle: React.CSSProperties = isDisabled
          ? { color: '#999' } // Lighter text color for disabled items
          : {}
        options.push(
          <WindOption
            key={indicator.spId}
            value={indicator.spId} // Value for onSelect is the indicator's key
            text={fullPathText} // Text for filtering
            style={optionStyle}
          >
            <Row gutter={8} style={{ width: '100%' }} align="middle">
              <Col span={18} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <span title={fullPathText} style={textStyle}>
                  {fullPathText}
                </span>
              </Col>
              <Col span={6} style={{ textAlign: 'right' }}>
                <Checkbox
                  checked={checkedIndicatorIds.has(indicator.spId) || initialCheckedIndicators.has(indicator.spId)}
                  disabled={initialCheckedIndicators.has(indicator.spId)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleIndicatorCheckFn(indicator.spId, e.target.checked)
                    forceDropdownOpenFn() // Keep dropdown open after checkbox click
                  }}
                />
              </Col>
            </Row>
          </WindOption>
        )
      }
    })

    // Recursively process child classifications
    if (classification.children && classification.children.length > 0) {
      options.push(
        ...generateIndicatorOptions(
          classification.children,
          currentPath,
          checkedIndicatorIds,
          initialCheckedIndicators,
          handleIndicatorCheckFn,
          forceDropdownOpenFn
        )
      )
    }
  })
  return options
}

export const IndicatorTreeOverall = forwardRef<
  IndicatorTreeOverallRef,
  {
    indicatorTree: IndicatorTreeClassification[]
    onIndicatorCheckChange?: (checkedIndicators: Set<number>) => void
    onVisibleClassificationChange?: (classificationKey: string | null) => void
    initialCheckedIndicators?: Set<number>
  }
>(({ indicatorTree, onIndicatorCheckChange, onVisibleClassificationChange, initialCheckedIndicators }, ref) => {
  const [showCoins, setShowCoins] = useState()
  const treeParsed = useMemo(() => filterIndicatorTree(indicatorTree), [indicatorTree])

  const [searchValue, setSearchValue] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const {
    checkedIndicators,
    handleClassificationCheck,
    handleIndicatorCheck,
    isClassificationSelected,
    isClassificationIndeterminate,
    setCheckedIndicators,
    resetCheckedIndicators,
    getCheckedIds,
    getCheckedIndicators,
  } = useIndicatorCheck(treeParsed, initialCheckedIndicators)

  const forceDropdownOpen = () => setIsDropdownOpen(true)

  // 获取选中的指标ID集合，用于兼容性
  const checkedIndicatorIds = useMemo(() => getCheckedIds(), [getCheckedIds])

  const allFlattenedOptionElements = useMemo(
    () =>
      generateIndicatorOptions(
        indicatorTree,
        '',
        checkedIndicatorIds,
        initialCheckedIndicators || new Set(),
        handleIndicatorCheck,
        forceDropdownOpen
      ),
    [indicatorTree, checkedIndicatorIds, initialCheckedIndicators, handleIndicatorCheck]
  )

  const filteredDataSource = useMemo(() => {
    if (!searchValue) {
      return allFlattenedOptionElements
    }
    return allFlattenedOptionElements.filter((optionElement) => {
      // Ensure props and text exist before trying to access
      const textToSearch = optionElement.props?.text as string | undefined
      return textToSearch?.toLowerCase().includes(searchValue.toLowerCase())
    })
  }, [allFlattenedOptionElements, searchValue])

  const handleSearch = (value: string) => {
    setSearchValue(value)
    if (value) {
      setIsDropdownOpen(true)
    }
  }

  // 计算本次新增的积分（排除初始已选中的指标）
  // const totalScore = useMemo(() => {
  //   let score = 0
  //   const initialSet = initialCheckedIndicators || new Set()
  //   const selectedIndicators = getCheckedIndicators()

  //   // console.log('=== 积分计算调试信息 ===')
  //   // console.log('checkedIndicators keys:', Array.from(checkedIndicators.keys()))
  //   // console.log('initialCheckedIndicators:', Array.from(initialSet))
  //   // console.log('selectedIndicators:', selectedIndicators)

  //   // 直接从选中的指标对象数组计算积分
  //   selectedIndicators.forEach((indicator) => {
  //     const isInitial = initialSet.has(indicator.spId)
  //     const shouldCount = !isInitial

  //     console.log(`指标 ${indicator.indicatorDisplayName} (id: ${indicator.spId}):`, {
  //       isInitial,
  //       shouldCount,
  //       points: indicator.points,
  //     })

  //     // 只计算新增选中的指标积分，排除初始就已经选中的
  //     if (shouldCount) {
  //       score += indicator.points || 0
  //     }
  //   })

  //   console.log('最终积分:', score)
  //   console.log('=== 调试信息结束 ===')
  //   return score
  // }, [checkedIndicators, initialCheckedIndicators, getCheckedIndicators])

  const {
    containerRef: treeRef,
    itemRefCallbacks: observerRefs,
    currentVisibleItemKey: currentVisibleClassification,
    scrollToItem: scrollToClassification,
  } = useScrollTracking<IndicatorTreeClassification, HTMLDivElement>({
    items: treeParsed,
    getItemKey: (item: IndicatorTreeClassification) => item.key.toString(),
    onVisibleItemChange: onVisibleClassificationChange,
  })

  // 监听滚动位置
  const scrollPosition = useScroll(treeRef)
  const showScrollTop = scrollPosition && scrollPosition.top > 300

  // 滚动到顶部
  const scrollTop = () => {
    if (treeRef.current) {
      treeRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }

  // 通知父组件选中的指标ID变化（保持兼容性）
  useEffect(() => {
    onIndicatorCheckChange?.(checkedIndicatorIds)
  }, [checkedIndicatorIds, onIndicatorCheckChange])

  // 暴露方法给父组件
  useImperativeHandle(
    ref,
    () => ({
      checkedIndicators,
      // 兼容性方法：返回选中的指标ID集合
      getCheckedIndicators: () => checkedIndicatorIds,
      // 新方法：返回选中的指标Map
      getCheckedIndicatorsMap: () => checkedIndicators,
      // 新方法：返回选中的指标对象数组
      getCheckedIndicatorsList: () => getCheckedIndicators(),
      setCheckedIndicators,
      resetCheckedIndicators,
      handleIndicatorCheck,
      // 添加滚动控制功能
      scrollToClassification,
      getCurrentVisibleClassification: () => currentVisibleClassification,
    }),
    [
      checkedIndicators,
      checkedIndicatorIds,
      getCheckedIndicators,
      setCheckedIndicators,
      resetCheckedIndicators,
      handleIndicatorCheck,
      scrollToClassification,
      currentVisibleClassification,
    ]
  )

  return (
    <div className={styles.overallContainer}>
      <div className={styles.search}>
        <div className={styles.searchInput}>
          <AutoComplete
            className={styles.searchAutoComplete}
            dataSource={filteredDataSource}
            onSearch={handleSearch}
            // onSelect={handleAutoCompleteSelect}
            value={searchValue}
            open={isDropdownOpen}
            onDropdownVisibleChange={setIsDropdownOpen}
            onFocus={() => {
              if (filteredDataSource.length > 0 || searchValue) {
                setIsDropdownOpen(true)
              }
            }}
          >
            <Input.Search placeholder={STRINGS.SEARCH_PLACEHOLDER} allowClear />
          </AutoComplete>
        </div>

        {/* 显示积分 */}
        <Divider type="vertical" />
        <div className={styles.searchCoins}>
          <CoinsO style={{ marginInlineEnd: 4 }} />
          <span className={styles.searchCoinsText}>{STRINGS.SHOW_COINS}</span>
          {/* @ts-expect-error 类型错误 */}
          <Switch checked={showCoins} onChange={(checked) => setShowCoins(checked)} />
        </div>
        {/* <Divider type="vertical" />
        <div className={styles.searchTotalCoins}>
          <CoinsO style={{ marginInlineEnd: 4 }} />
    
          <div className={styles.searchTotalCoinsText}>{totalScore} / 条</div>
        </div> */}
      </div>

      <div className={styles.overall} ref={treeRef}>
        {treeParsed.map((item) => {
          return (
            <IndicatorClassificationCard
              key={item.key}
              classification={item}
              isClassificationSelected={isClassificationSelected}
              isClassificationIndeterminate={isClassificationIndeterminate}
              handleClassificationCheck={handleClassificationCheck}
              checkedIndicators={checkedIndicators}
              initialCheckedIndicators={initialCheckedIndicators}
              handleIndicatorCheck={handleIndicatorCheck}
              // 添加 ref 回调以跟踪滚动
              ref={observerRefs.get(item.key.toString()) || null}
              showCoins={showCoins}
            />
          )
        })}

        {/* 回到顶部按钮 - 使用悬浮div实现 */}
        {showScrollTop && (
          <div className={styles.backToTop}>
            <Button shape="circle" size="large" onClick={scrollTop} icon={<VerticalAlignTopOutlined />} />
          </div>
        )}
      </div>
    </div>
  )
})

// 添加 displayName 以修复 linter 错误
IndicatorTreeOverall.displayName = 'IndicatorTreeOverall'
