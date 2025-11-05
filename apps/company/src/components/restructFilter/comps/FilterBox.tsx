import { useControllableValue } from 'ahooks'
import React, { FC, Fragment, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { useConditionFilterStore } from '../../../store/cde/useConditionFilterStore'

import { isParentHasChild } from '../../../store/cde/helpers/isParentHasChild'
import { filterItemTypeConfig } from './conditionItems'

const FilterBox: FC<{
  leftCurrent?: number
  currentChange?: (index: number) => void
  fromModal?: boolean
}> = (props) => {
  const { fromModal = false } = props
  const [current, setCurrent] = useControllableValue(props, {
    defaultValue: 0,
    valuePropName: 'leftCurrent',
    trigger: 'currentChange',
  })

  const { filterConfigList, getFilterConfigList, filters, geoFilters } = useConditionFilterStore()
  useEffect(() => {
    getFilterConfigList() // 初始化
  }, [])

  // 计算选中的数量
  const figureParentNum = useCallback(
    (item) => {
      let num = 0
      filters.forEach((filter) => {
        isParentHasChild(item, filter) && num++
      })

      if (geoFilters.length > 0 && num === 0 && item.categoryEn === 'area_code') {
        // geoFilter存在，并且数量不为1，切为地区

        num = 1
      }
      console.log('🚀 ~ figureParentNum ~ num:', filters)
      return num
    },
    [filters, geoFilters]
  )

  return (
    <Box>
      <ParentList className="filterbox-lbox" style={window.en_access_config ? { width: '172px' } : null}>
        {/* 左侧大类 */}

        {filterConfigList.map((item, i) => (
          <div
            key={i}
            className={`${i === current ? 'selected' : ''} ${figureParentNum(item) > 0 ? ' hasValue' : ''}`}
            onClick={() => {
              setCurrent(i)
            }}
          >
            {item.category}
            {figureParentNum(item) > 0 ? (
              <span className="num-icon">{figureParentNum(item)}</span>
            ) : item.category === '所属行业/产业' ? (
              <div className="new-icon">
                <span>NEW</span>
              </div>
            ) : null}
          </div>
        ))}
      </ParentList>
      <ChildItem fromModal={fromModal} className="filterbox-rbox">
        {/* 右侧具体细类 */}
        {filterConfigList.length > 0 && current >= 0 ? (
          <Fragment>
            <h2>{filterConfigList[current].category}</h2>
            {filterConfigList[current].newFilterItemList.map((item) => {
              const Component = filterItemTypeConfig[item.itemType]
              if (!Component) return null
              return <Component key={item.itemId} item={item} parent={filterConfigList[current]} />
            })}
          </Fragment>
        ) : (
          <></>
        )}
      </ChildItem>
    </Box>
  )
}

const Box = styled.div`
  display: flex;
  flex: 1;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 0px !important;
  }
  @media (max-height: 640px) {
    .filterbox-lbox {
      height: 450px;
    }
  }
`
const ParentList = styled.div`
  width: 160px;
  overflow-y: scroll;
  background-color: #f2f2f2;
  padding-top: 16px;

  &::-webkit-scrollbar {
    width: 0px !important;
  }

  div {
    padding: 8px 16px;
    white-space: nowrap;
    display: flex;
    word-break: break-all;
    font-size: 14px;
    line-height: 22px;
    height: 40px;
    align-items: center;
    color: #666;
    line-height: 24px;
    cursor: pointer;
    position: relative;

    .num-icon {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background-color: #e22c2f;
      color: #fff;
      font-size: 12px;
      line-height: 16px;
      margin-left: 4px;
      text-align: center;
      margin-left: 15px;
    }
    .new-icon {
      padding: 0;
      padding-left: 6%;
      color: #fff;
      span {
        font-size: 12px;
        font-weight: 600;
        line-height: 16px;
        padding: 0 4px;
        background-color: #e22c2f;
        border-radius: 2px;
      }
    }

    &.selected {
      background: #fff;
      color: #000;
      font-weight: bold;
    }

    &.hasValue {
      color: #000;
    }
  }
`
const ChildItem = styled.div`
  background: #fff;
  padding: 0px 12px 24px 24px;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  flex: 1;
  height: ${(props) => (props.fromModal ? '570px' : '100%')};
  position: relative;

  @media (max-height: 640px) {
    &.filterbox-rbox {
      height: 450px;
    }
  }

  .inputBox input {
    margin-right: 0 !important;
  }

  > h2 {
    color: #333;
    font-size: 16px;
    font-weight: 700;
    line-height: 40px;
    margin-top: 16px;
    margin-bottom: 0;
  }

  &::-webkit-scrollbar {
    /* width: 0px !important; */
    height: 0;
  }
  > div {
    flex-shrink: 0;
  }

  .FilterTrees .inner-box {
    margin-top: 0px !important;
  }
`

export default FilterBox
