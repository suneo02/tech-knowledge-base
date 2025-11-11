import { CDEFormBizValues, CDEFormConfigItem } from 'cde'
import cn from 'classnames'
import styles from './index.module.less'
import { Input, InputNumber } from '@wind/wind-ui'
import CascadeDisplay from '../CascadeDisplay'
import { useMemo } from 'react'
import { CheckboxRadioDisplay } from '../CheckboxRadioDisplay'
import { LogicalKeywordDisplay } from '../LogicalKeywordDisplay'
import { HierarchicalDisplay } from '../HierarchicalDisplay'

export enum CDEFilterType {
  CASCADER_WITH_CONFIDENCE = '0',
  LOGICAL_KEYWORD = '1',
  TAGS_INPUT = '2',
  CHECKBOX = '3',
  RADIO = '4',
  RADIO_ALT = '5',
  NUMBER_RANGE = '6',
  SEARCH = '9',
  CASCADER_WITH_CONFIDENCE_ALT = '10',
}

interface FilterDisplayProps {
  config: CDEFormConfigItem[]
  initialValues: CDEFormBizValues[]
}

const PREFIX = 'filter-display'

export const FilterDisplay = ({ config, initialValues }: FilterDisplayProps) => {
  const valuesMap = useMemo(() => {
    if (!initialValues?.length) return new Map()
    return new Map(initialValues.map((item) => [item.itemId, item]))
  }, [initialValues])

  const getValue = (id: string | number) => {
    return valuesMap.get(id)
  }

  const renderFilterItem = (item: CDEFormConfigItem) => {
    const currentValue = getValue(item.itemId)
    switch (item.itemType) {
      case CDEFilterType.CASCADER_WITH_CONFIDENCE_ALT:
      case CDEFilterType.CASCADER_WITH_CONFIDENCE:
        return (
          <div className={styles[`${PREFIX}-item`]}>
            <div className={styles[`${PREFIX}-item-title`]}>
              <h4>{item.itemName}</h4>
              <div className={styles[`${PREFIX}-item-title-right`]}>
                {(item?.extraOptions as { value: string; label: string }[])?.map((option) => (
                  <span
                    key={option.value}
                    className={cn(styles[`${PREFIX}-item-title-right-item`], {
                      [styles[`${PREFIX}-item-title-right-item-active`]]: currentValue?.confidence === option.value,
                    })}
                  >
                    {option.label.replace('置信度：', '')}
                  </span>
                ))}
              </div>
            </div>
            <CascadeDisplay field={item.itemField} value={currentValue} />
          </div>
        )
      case CDEFilterType.LOGICAL_KEYWORD:
        return <LogicalKeywordDisplay item={item} value={currentValue} />
      case CDEFilterType.TAGS_INPUT:
        return (
          <div className={styles[`${PREFIX}-item`]}>
            <div className={styles[`${PREFIX}-item-title`]}>
              <h4>{item.itemName}</h4>
            </div>
            <div className={styles[`${PREFIX}-item-tags-input`]}>
              {Array.isArray(currentValue?.value)
                ? currentValue.value.map((item, i) => (
                    <div className={styles[`${PREFIX}-item-tags-input-item`]} key={`${item}-${i}`}>
                      {item}
                    </div>
                  ))
                : currentValue?.value}
            </div>
          </div>
        )
      case CDEFilterType.CHECKBOX:
        return (
          <div className={styles[`${PREFIX}-item`]}>
            <div className={styles[`${PREFIX}-item-title`]}>
              <h4>{item.itemName}</h4>
            </div>
            {/* @ts-expect-error ttt */}
            <HierarchicalDisplay options={item.itemOption || []} value={currentValue?.value} />
          </div>
        )
      case CDEFilterType.RADIO:
      case CDEFilterType.RADIO_ALT:
        return (
          <div className={styles[`${PREFIX}-item`]}>
            <div className={styles[`${PREFIX}-item-title`]}>
              <h4>{item.itemName}</h4>
            </div>
            <CheckboxRadioDisplay options={item.itemOption} value={currentValue?.value} />
          </div>
        )
      case CDEFilterType.NUMBER_RANGE:
        return (
          <Input.Group compact>
            <InputNumber style={{ width: '45%', textAlign: 'center' }} placeholder="最小值" />
            <Input
              style={{
                width: '10%',
                borderLeft: 0,
                borderRight: 0,
                pointerEvents: 'none',
              }}
              placeholder="~"
              disabled
            />
            <InputNumber style={{ width: '45%', textAlign: 'center', borderLeft: 0 }} placeholder="最大值" />
          </Input.Group>
        )
      case CDEFilterType.SEARCH:
        return <Input.Search placeholder="请输入搜索内容" />
      default:
        return null
    }
  }

  return (
    <div className={styles[`${PREFIX}-container`]}>
      {initialValues?.length
        ? initialValues?.map((item) => {
            const currentItem = config.find((c) => c.itemId === item.itemId) as CDEFormConfigItem | undefined
            if (!currentItem) {
              return null
            }
            return (
              <div key={item.itemId} className={styles[`${PREFIX}-item-container`]}>
                {renderFilterItem(currentItem)}
              </div>
            )
          })
        : null}
    </div>
  )
}
