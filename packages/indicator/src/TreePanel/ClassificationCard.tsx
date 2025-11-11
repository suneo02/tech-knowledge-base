import { Button, Checkbox, Typography } from '@wind/wind-ui'
import classNames from 'classnames'
import type { IndicatorTreeClassification } from 'gel-api'
import React, { forwardRef } from 'react'
import { IndicatorCheckboxGroup } from './components/IndicatorCheckboxGroup'
import { UseIndicatorCheckResult } from './hooks/useIndicatorCheck'
import styles from './style/classsificationCard.module.less'
import { t } from 'gel-util/intl'

/**
 * 二级分类卡片组件
 */
export const IndicatorClassificationCard = forwardRef<
  HTMLDivElement,
  {
    className?: string
    classification: IndicatorTreeClassification
    showCoins?: boolean
    initialCheckedIndicators?: Set<number>
  } & Pick<
    UseIndicatorCheckResult,
    | 'checkedIndicators'
    | 'handleIndicatorCheck'
    | 'isClassificationSelected'
    | 'isClassificationIndeterminate'
    | 'handleClassificationCheck'
  >
>(
  (
    {
      classification,
      className,
      isClassificationSelected,
      isClassificationIndeterminate,
      handleClassificationCheck,
      checkedIndicators,
      handleIndicatorCheck,
      showCoins,
      initialCheckedIndicators,
    },
    ref
  ) => {
    return (
      <div className={classNames(styles.secondLevelCard, className)} ref={ref}>
        <div className={styles.secondLevelCardHeader}>
          {/* @ts-expect-error 类型错误 */}
          <Typography className={styles.secondLevelCardHeaderText}>{classification.title}</Typography>
        </div>
        {/* 渲染二级分类下的指标 */}
        <IndicatorCheckboxGroup
          classification={classification}
          checkedIndicators={checkedIndicators}
          handleIndicatorCheck={handleIndicatorCheck}
          showCoins={showCoins}
          initialCheckedIndicators={initialCheckedIndicators}
        />
        {/* 渲染三级分类 */}
        {classification.children?.map((child) => (
          <ThirdLevelCard
            key={child.key}
            classification={child}
            isClassificationSelected={isClassificationSelected}
            isClassificationIndeterminate={isClassificationIndeterminate}
            handleClassificationCheck={handleClassificationCheck}
            checkedIndicators={checkedIndicators}
            handleIndicatorCheck={handleIndicatorCheck}
            showCoins={showCoins}
            initialCheckedIndicators={initialCheckedIndicators}
          />
        ))}
      </div>
    )
  }
)

/**
 * 三级分类卡片组件
 */
const ThirdLevelCard: React.FC<
  {
    className?: string
    classification: IndicatorTreeClassification
    showCoins?: boolean
    initialCheckedIndicators?: Set<number>
  } & Pick<
    UseIndicatorCheckResult,
    | 'checkedIndicators'
    | 'handleIndicatorCheck'
    | 'isClassificationSelected'
    | 'isClassificationIndeterminate'
    | 'handleClassificationCheck'
  >
> = ({
  classification,
  className,
  isClassificationSelected,
  isClassificationIndeterminate,
  handleClassificationCheck,
  checkedIndicators,
  handleIndicatorCheck,
  showCoins,
  initialCheckedIndicators,
}) => {
  return (
    <div className={classNames(styles.thirdLevelCard, className)}>
      <div className={styles.thirdLevelCardHeader}>
        {/* @ts-expect-error 类型错误 */}
        <Typography className={styles.thirdLevelCardTitle}>{classification.title}</Typography>
        <Button
          // className={styles.thirdLevelCardButton}
          onClick={() => {
            if (isClassificationSelected(classification)) {
              handleClassificationCheck(false, classification)
            } else {
              handleClassificationCheck(true, classification)
            }
          }}
        >
          {isClassificationSelected(classification) ? t('421473', '取消') : t('464230', '选择全部')}
        </Button>
      </div>
      {/* 渲染三级分类下的指标 */}
      <IndicatorCheckboxGroup
        classification={classification}
        checkedIndicators={checkedIndicators}
        handleIndicatorCheck={handleIndicatorCheck}
        showCoins={showCoins}
        initialCheckedIndicators={initialCheckedIndicators}
      />
      {/* 渲染四级分类 */}
      <FourthLevelCardContainer
        classification={classification}
        isClassificationSelected={isClassificationSelected}
        isClassificationIndeterminate={isClassificationIndeterminate}
        handleClassificationCheck={handleClassificationCheck}
        // @ts-expect-error 类型错误
        checkedIndicators={checkedIndicators}
        handleIndicatorCheck={handleIndicatorCheck}
        showCoins={showCoins}
        initialCheckedIndicators={initialCheckedIndicators}
      />
    </div>
  )
}

const FourthLevelCardContainer: React.FC<{
  classification: IndicatorTreeClassification
  isClassificationSelected: (classification: IndicatorTreeClassification) => boolean
  isClassificationIndeterminate: (classification: IndicatorTreeClassification) => boolean
  handleClassificationCheck: (checked: boolean, classification: IndicatorTreeClassification) => void
  checkedIndicators: Set<number>
  handleIndicatorCheck: (indicatorKey: number, checked: boolean) => void
  showCoins?: boolean
  initialCheckedIndicators?: Set<number>
}> = ({
  classification,
  isClassificationSelected,
  isClassificationIndeterminate,
  handleClassificationCheck,
  checkedIndicators,
  handleIndicatorCheck,
  showCoins,
  initialCheckedIndicators,
}) => {
  if (!classification.children?.length) {
    return null
  }
  return (
    <>
      {classification.children?.map((res) => (
        <div className={styles.fourthLevelCardContainer} key={res.key}>
          <div className={styles.fourthLevelCardContainerHeader}>
            <Checkbox
              className={styles.fourthLevelCardCheck}
              checked={isClassificationSelected(res)}
              indeterminate={isClassificationIndeterminate(res)}
              // @ts-expect-error 类型错误
              onChange={(e) => handleClassificationCheck(e.target.checked, res)}
            >
              <span className={styles.fourthLevelCardTitle}>{res.title}</span>
            </Checkbox>
          </div>
          <div className={styles.fourthLevelCardContainerContent}>
            <IndicatorCheckboxGroup
              classification={res}
              // @ts-expect-error 类型错误
              checkedIndicators={checkedIndicators}
              handleIndicatorCheck={handleIndicatorCheck}
              showCoins={showCoins}
              initialCheckedIndicators={initialCheckedIndicators}
            />
          </div>
        </div>
      ))}
    </>
  )
}
