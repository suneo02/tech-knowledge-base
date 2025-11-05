import { Button } from '@wind/wind-ui'
import classNames from 'classnames'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import styles from './style/selectedIndicators.module.less'
import { CloseCircleF } from '@wind/icons'
import RadioGroup from '@wind/wind-ui/lib/radio/group'
import RadioButton from '@wind/wind-ui/lib/radio/radioButton'

// 定义暴露给外部的方法接口
export interface IndicatorSelectedIndicatorsRef {
  scrollToBottom: () => void
}

export const IndicatorSelectedIndicators = forwardRef<
  IndicatorSelectedIndicatorsRef,
  {
    className?: string
    checkedIndicators: Set<number>
    getIndicatorName: (key: number) => string
    handleIndicatorCheck: (key: number, checked: boolean) => void
    initialCheckedIndicators: Set<number>
  }
>(({ className, checkedIndicators, getIndicatorName, handleIndicatorCheck, initialCheckedIndicators }, ref) => {
  console.log('🚀 ~ initialCheckedIndicators:', initialCheckedIndicators)
  console.log('🚀 ~ checkedIndicators:', checkedIndicators)

  // 内容区域的ref
  const contentRef = useRef<HTMLDivElement>(null)
  const [selectedType, setSelectedType] = useState<'selected' | 'new'>('selected')
  console.log(selectedType)

  // 滚动到底部的方法
  const scrollToBottom = () => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight
    }
  }

  // 在指标数量变化时自动滚动到底部
  useEffect(() => {
    if (checkedIndicators.size > 0) {
      scrollToBottom()
    }
  }, [checkedIndicators.size])

  // 暴露方法给外部
  useImperativeHandle(ref, () => ({
    scrollToBottom,
  }))

  return (
    <div className={classNames(styles.selectedIndicators, className)}>
      <div className={styles.selectedIndicatorsTitle}>
        <RadioGroup
          name="city"
          onChange={(e) => setSelectedType((e.target as HTMLInputElement).value as 'selected' | 'new')}
          defaultValue="selected"
        >
          <RadioButton value="selected">已选指标({initialCheckedIndicators.size + checkedIndicators.size})</RadioButton>
          <RadioButton value="new">本次新增指标({checkedIndicators.size})</RadioButton>
        </RadioGroup>
      </div>

      <div className={styles.selectedIndicatorsContent} ref={contentRef}>
        {selectedType === 'selected' &&
          Array.from(initialCheckedIndicators).map((detail) => (
            <div className={styles.selectedIndicatorsItem} key={detail}>
              <div className={styles.selectedIndicatorsItemText}>{getIndicatorName(detail)}</div>
            </div>
          ))}
        {Array.from(checkedIndicators).map((detail) => (
          <div className={styles.selectedIndicatorsItem} key={detail}>
            <div className={styles.selectedIndicatorsItemText}>{getIndicatorName(detail)}</div>
            <div className={styles.selectedIndicatorsItemAction}>
              <Button
                type="text"
                size="small"
                // @ts-expect-error
                icon={<CloseCircleF style={{ color: 'rgba(5, 150, 179, .3)' }} />}
                onClick={() => handleIndicatorCheck(detail, false)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})
