import React from 'react'
import { CustomComponentProps } from '../../../types'
import ItemSelector from './ItemSelector'
import SelectedItemTag from './SelectedItemTag'
import { useItemManagement } from './useItemManagement'
import styles from './index.module.less'

const PREFIX = 'logic-with-searchable-tags'

const LogicWithSearchableTags: React.FC<CustomComponentProps> = (props) => {
  const { logic, selectedItems, availableOptions, handleLogicChange, handleSelect, handleRemove, handleDateChange } =
    useItemManagement(props)

  return (
    <div className={styles[`${PREFIX}-container`]}>
      <ItemSelector
        logic={logic}
        onLogicChange={handleLogicChange}
        onSelect={handleSelect}
        availableOptions={availableOptions}
        disabled={selectedItems.length >= 5}
      />

      <div className={styles[`${PREFIX}-tags-container`]}>
        {selectedItems.map((item) => (
          <SelectedItemTag key={item.id} item={item} onRemove={handleRemove} onDateChange={handleDateChange} />
        ))}
      </div>
    </div>
  )
}

export default LogicWithSearchableTags
