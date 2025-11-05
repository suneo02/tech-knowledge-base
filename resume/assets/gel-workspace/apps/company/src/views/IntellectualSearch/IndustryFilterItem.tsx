import { findCascadeOptionByValue } from '@/components/cascade'
import { WindCascade } from '@/components/cascade/WindCascade'
import intl from '@/utils/intl'
import classNames from 'classnames'
import React from 'react'
import styles from './industryFilterItem.module.less'

interface IndustryFilterItemProps {
  title: string
  titleId: string
  options: any[]
  stateKey: string
  onChange: (names: string[][], title: string, stateKey: string, value: any[][]) => void
}

/**
 * A reusable component for industry filtering options
 */
const IndustryFilterItem: React.FC<IndustryFilterItemProps> = ({ title, titleId, options, stateKey, onChange }) => {
  const handleCascadeChange = (value: string[][], selectedOptions: any[]) => {
    // 根据 values 拿到 names
    const names = value.map((t) => {
      return t.map((tt) => {
        return findCascadeOptionByValue(tt, options).name
      })
    })
    onChange(names, intl(titleId, title), stateKey, value)
  }
  return (
    <div className={classNames('city-industry', 'clearfix', styles['cascade-filter-item'])}>
      <span className="title-patent-industry">
        <span>{intl(titleId, title)}</span>：
      </span>
      <WindCascade
        fieldNames={{ label: 'name', value: 'code', children: 'node' }}
        placeholder={intl('265435', '不限')}
        options={options}
        className="casader-choose-industry"
        onChange={handleCascadeChange}
      />
    </div>
  )
}

export default IndustryFilterItem
