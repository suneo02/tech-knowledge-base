import { CDEFormConfigItem, CDEFormBizValues } from 'cde'
import styles from './index.module.less'
import cn from 'classnames'

const PREFIX = 'logical-keyword-display'

interface LogicalKeywordDisplayProps {
  item: CDEFormConfigItem
  value?: CDEFormBizValues
}

export const LogicalKeywordDisplay = ({ item, value }: LogicalKeywordDisplayProps) => {
  const logicalMap = [
    { value: 'any', label: '含任一' },
    { value: 'all', label: '含所有' },
    { value: 'none', label: '不含' },
  ]

  return (
    <div className={styles[`${PREFIX}-item`]}>
      <div className={styles[`${PREFIX}-item-title`]}>
        <h4>{item.itemName}</h4>
        <div className={styles[`${PREFIX}-item-title-right`]}>
          {logicalMap.map((option) => (
            <span
              key={option.value}
              className={cn(styles[`${PREFIX}-item-title-right-item`], {
                [styles[`${PREFIX}-item-title-right-item-active`]]: value?.logic === option.value,
              })}
            >
              {option.label}
            </span>
          ))}
        </div>
      </div>
      <div className={styles[`${PREFIX}-item-tags-input`]}>
        {Array.isArray(value?.value) &&
          value.value.map((tag, i) => (
            <div className={styles[`${PREFIX}-item-tags-input-item`]} key={`${tag}-${i}`}>
              {tag}
            </div>
          ))}
      </div>
    </div>
  )
}
