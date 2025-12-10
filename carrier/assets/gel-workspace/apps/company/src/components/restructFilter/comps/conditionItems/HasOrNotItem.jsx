import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { ConditionItem, filterItemTypeConfig } from '.'
import { useConditionFilterStore } from '../../../../store/cde/useConditionFilterStore'
import ConditionTitle from '../filterOptions/ConditionTitle'
import HasOrNotOption from '../filterOptions/HasOrNotOption'

const HasOrNotItem = ({ item }) => {
  const { isVip, itemName, logicOption, itemOption, itemId, hasExtra, hoverHint } = item

  let { updateFilters, getFilterById, filters, setFilters } = useConditionFilterStore()
  let filter = getFilterById(itemId) // 寻找是否存在filter

  //#region 调整数量显示的位置
  const optionsRef = useRef()
  const [optionsWidth, setOptionsWidth] = useState(0) // 单选的宽度
  useEffect(() => {
    if (optionsRef.current) {
      setOptionsWidth(optionsRef.current.clientWidth)
    }
  }, [optionsRef.current])
  //#endregion

  const changeOptionCallback = (value) => {
    //#region 清除子元素有的数据
    if ((value[0] === 'false' || value.length === 0) && hasExtra) {
      filters = filters.filter((_item) => {
        for (let i = 0; i < item.extraConfig.length; i++) {
          const extra = item.extraConfig[i]
          if (extra.itemId === _item.itemId) {
            return false
          }
        }
        return true
      })
      setFilters([...filters])
    }
    //#endregion

    updateFilters({
      filter: item,
      value,
      logic: logicOption,
    })
  }

  return (
    <Box>
      <ConditionItem>
        <ConditionTitle filter={filter} isVip={isVip} itemName={itemName} hoverHint={hoverHint} />

        <HasOrNotOption
          ref={optionsRef}
          itemOption={itemOption}
          defaultValue={filter ? filter.value[0] : ''}
          changeOptionCallback={changeOptionCallback}
          data-uc-id="48YLei-A27"
          data-uc-ct="hasornotoption"
        />
      </ConditionItem>
      {item.hasExtra && filter && filter.value[0] === 'true'
        ? item.extraConfig.map((extra) => {
            const Component = filterItemTypeConfig[extra.itemType]
            return <Component key={extra.itemId} item={extra} parent={item} left={optionsWidth} />
          })
        : null}
    </Box>
  )
}

const Box = styled.div`
  position: relative;
`

export default HasOrNotItem
