import { CoinsO } from '@/assets'
import { VerticalAlignTopOutlined } from '@ant-design/icons'
import { AutoComplete, Button, Checkbox, Col, Divider, Input, Row, Switch } from '@wind/wind-ui'
import { useScroll } from 'ahooks'
import { IndicatorTreeClassification } from 'gel-api'
import { useScrollTracking } from 'gel-ui'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react'
import { IndicatorClassificationCard } from './ClassificationCard'
import { filterIndicatorTree } from './handle'
import { useIndicatorCheck } from './hooks/useIndicatorCheck'
import { IndicatorTreeOverallRef } from './hooks/useIndicatorTreeOverall'
import styles from './style/overall.module.less'

export { useIndicatorTreeOverall } from './hooks/useIndicatorTreeOverall'

// 辅助函数：展平指标树并格式化名称
const flattenIndicatorTree = (tree: IndicatorTreeClassification[], parentName = ''): string[] => {
  let result: string[] = []
  tree.forEach((classification) => {
    const currentName = parentName ? `${parentName}-${classification.title}` : classification.title
    if (classification.indicators && classification.indicators.length > 0) {
      classification.indicators.forEach((indicator) => {
        result.push(`${currentName}-${indicator.indicatorDisplayName}`)
      })
    }
    if (classification.children && classification.children.length > 0) {
      result = result.concat(flattenIndicatorTree(classification.children, currentName))
    }
  })
  return result
}

// Helper function to generate React Element options for AutoComplete
const generateIndicatorOptions = (
  tree: IndicatorTreeClassification[],
  parentPath = '',
  checkedIndicators: Set<number>,
  initialCheckedIndicators: Set<number>,
  handleIndicatorCheckFn: (key: number, checked: boolean) => void,
  forceDropdownOpenFn: () => void // Callback to keep dropdown open
): React.ReactElement[] => {
  let options: React.ReactElement[] = []
  const WindOption = AutoComplete.Option // Assuming AutoComplete.Option, or just Option if standalone

  tree.forEach((classification) => {
    const currentPath = parentPath ? `${parentPath}-${classification.title}` : classification.title
    if (classification.indicators && classification.indicators.length > 0) {
      classification.indicators.forEach((indicator) => {
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
                    checked={checkedIndicators.has(indicator.spId) || initialCheckedIndicators.has(indicator.spId)}
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
    }
    if (classification.children && classification.children.length > 0) {
      options = options.concat(
        generateIndicatorOptions(
          classification.children,
          currentPath,
          checkedIndicators,
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
  const [showCoins, setShowCoins] = useState(true)
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
  } = useIndicatorCheck(initialCheckedIndicators)

  const forceDropdownOpen = () => setIsDropdownOpen(true)

  const allFlattenedOptionElements = useMemo(
    () =>
      generateIndicatorOptions(
        indicatorTree,
        '',
        checkedIndicators,
        initialCheckedIndicators || new Set(),
        handleIndicatorCheck,
        forceDropdownOpen
      ),
    [indicatorTree, checkedIndicators, initialCheckedIndicators, handleIndicatorCheck]
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

  // 计算总积分
  const totalScore = useMemo(() => {
    let score = 0
    treeParsed.forEach((classification) => {
      classification.indicators?.forEach((indicator) => {
        // 假设 indicator 对象有 key 和 score 属性
        if (checkedIndicators.has(indicator.spId)) {
          score += indicator.points
        }
      })
      classification.children?.forEach((child) => {
        child.indicators?.forEach((indicator) => {
          if (checkedIndicators.has(indicator.spId)) {
            score += indicator.points
          }
        })
      })
    })
    return score
  }, [checkedIndicators, treeParsed])

  const {
    containerRef: treeRef,
    itemRefCallbacks: observerRefs,
    currentVisibleItemKey: currentVisibleClassification,
    scrollToItem: scrollToClassification,
  } = useScrollTracking<IndicatorTreeClassification, HTMLDivElement>({
    items: treeParsed,
    getItemKey: (item) => item.key.toString(),
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

  useEffect(() => {
    onIndicatorCheckChange?.(checkedIndicators)
  }, [checkedIndicators, onIndicatorCheckChange])

  // 暴露方法给父组件
  useImperativeHandle(
    ref,
    () => ({
      checkedIndicators,
      getCheckedIndicators: () => checkedIndicators,
      setCheckedIndicators,
      resetCheckedIndicators,
      handleIndicatorCheck,
      // 添加滚动控制功能
      scrollToClassification,
      getCurrentVisibleClassification: () => currentVisibleClassification,
    }),
    [
      checkedIndicators,
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
            // @ts-ignore - User confirms 'open' prop is supported at runtime
            open={isDropdownOpen}
            // @ts-ignore - User confirms 'onDropdownVisibleChange' prop is supported at runtime
            onDropdownVisibleChange={setIsDropdownOpen}
            // @ts-ignore - User confirms 'onFocus' prop is supported at runtime
            onFocus={() => {
              if (filteredDataSource.length > 0 || searchValue) {
                setIsDropdownOpen(true)
              }
            }}
          >
            <Input.Search placeholder="搜索指标" allowClear />
          </AutoComplete>
        </div>

        {/* 显示积分 */}
        <Divider type="vertical" />
        <div className={styles.searchCoins}>
          <CoinsO style={{ marginInlineEnd: 4 }} />
          <span className={styles.searchCoinsText}>显示积分</span>
          <Switch checked={showCoins} onChange={(checked) => setShowCoins(checked)} />
        </div>
        <Divider type="vertical" />
        <div className={styles.searchTotalCoins}>
          <CoinsO style={{ marginInlineEnd: 4 }} />
          {/* 显示计算的总积分 */}
          <div className={styles.searchTotalCoinsText}>{totalScore} / 条</div>
        </div>
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
