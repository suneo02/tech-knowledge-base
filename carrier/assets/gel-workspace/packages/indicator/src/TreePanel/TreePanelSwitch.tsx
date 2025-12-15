import { Button, Divider } from '@wind/wind-ui'
import { AddIndicatorDataToSheetRequest } from 'gel-api'
import React, { useRef } from 'react'
import { IndicatorClassificationCard } from './ClassificationCard'
import { useIndicatorTree } from './context'
import { IndicatorLeftMenu } from './LeftMenu'
import { IndicatorSelectedIndicators, IndicatorSelectedIndicatorsRef } from './SelectedIndicators'
import styles from './style/treePanelSwitch.module.less'
import { convertIndicatorKeysToClassificationList } from './util'
/**
 * #@deprecated
 * @param param0
 * @returns
 */
export const IndicatorTreePanelSwitch: React.FC<{
  onConfirm: (
    checkedIndicator: Set<string>,
    classificationList: AddIndicatorDataToSheetRequest['classificationList']
  ) => void
}> = ({ onConfirm }) => {
  const {
    selectedFirstLevel,
    setSelectedFirstLevel,
    selectedClassification,
    checkedIndicators,
    data: indicatorTree,
    isClassificationSelected,
    isClassificationIndeterminate,
    handleClassificationCheck: originalHandleClassificationCheck,
    getIndicatorName,
    handleIndicatorCheck: originalHandleIndicatorCheck,
  } = useIndicatorTree()

  // 创建SelectedIndicators的ref
  const selectedIndicatorsRef = useRef<IndicatorSelectedIndicatorsRef>(null)

  // 包装handleClassificationCheck，添加滚动到底部的功能
  const handleClassificationCheck = (checked: boolean, classification: any) => {
    originalHandleClassificationCheck(checked, classification)
    // 如果是选中操作，滚动到底部
    if (checked) {
      setTimeout(() => {
        selectedIndicatorsRef.current?.scrollToBottom()
      }, 100) // 添加小延迟确保DOM已更新
    }
  }

  // 包装handleIndicatorCheck，添加滚动到底部的功能
  const handleIndicatorCheck = (key: string, checked: boolean) => {
    // @ts-expect-error
    originalHandleIndicatorCheck(key, checked)
    // 如果是选中操作，滚动到底部
    if (checked) {
      setTimeout(() => {
        selectedIndicatorsRef.current?.scrollToBottom()
      }, 100) // 添加小延迟确保DOM已更新
    }
  }

  return (
    <div className={styles.panel}>
      <div className={styles.sider}>
        <div className={styles.siderTitle}>指标选择</div>
        <Divider />
        <IndicatorLeftMenu
          selectedFirstLevel={selectedFirstLevel}
          setSelectedFirstLevel={setSelectedFirstLevel}
          data={indicatorTree}
        />
      </div>
      <div className={styles.content}>
        {selectedClassification && (
          <IndicatorClassificationCard
            className={styles.contentMain}
            classification={selectedClassification}
            checkedIndicators={checkedIndicators}
            // @ts-expect-error
            handleIndicatorCheck={handleIndicatorCheck}
            isClassificationSelected={isClassificationSelected}
            isClassificationIndeterminate={isClassificationIndeterminate}
            handleClassificationCheck={handleClassificationCheck}
          />
        )}
        <div className={styles.contentRight}>
          <IndicatorSelectedIndicators
            ref={selectedIndicatorsRef}
            className={styles.contentRightSelectedIndicators}
            checkedIndicators={checkedIndicators}
            // @ts-expect-error
            getIndicatorName={getIndicatorName}
            // @ts-expect-error
            handleIndicatorCheck={handleIndicatorCheck}
          />
          <div className={styles.contentRightFooter}>
            <Button>取消</Button>
            <Button
              type="primary"
              onClick={() =>
                // @ts-expect-error
                onConfirm(checkedIndicators, convertIndicatorKeysToClassificationList(indicatorTree, checkedIndicators))
              }
            >
              确定
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
