import React, { useEffect, useState } from 'react'
import { pointClickSpecialList } from '../../lib/pointBuriedGel'

function SpecialAppFilterTab(props) {
  const { filtersData } = props
  const tabDatas = (filtersData && filtersData[0]?.data[0]) || [] // 
  const [activeKey, setActiveKey] = useState('') // 一级选中
  const [activeMultiKey, setActiveMultiKey] = useState('') // 一级选中
  const [filterDataMulti, setFilterDataMulti] = useState([])

  // Tab Click
  const itmeClick = (item, flag) => {
    if (flag === 'multi') {
      // 二级分类点击
      setActiveMultiKey(item?.key)
    } else {
      setActiveKey(item?.key)

      setFilterDataMulti(item.children || [])
      if (item?.params?.corpNature === '企业集团财务公司') {
        // 其他金融机构 默认 选中二级分类 企业集团财务公司
        setActiveMultiKey('financialcorpOther1')
      } else {
        setActiveMultiKey('')
      }

      pointClickSpecialList(item?.params?.corpNature) // 埋点
    }
    props.onFiltersHandle(item)
  }

  useEffect(() => {
    setActiveKey(tabDatas?.key)
    tabDatas?.params?.corpNature && pointClickSpecialList(tabDatas?.params?.corpNature) // 埋点
    setFilterDataMulti(tabDatas?.children||[]) // 二级分类
  }, [tabDatas?.key])

  const filterListRender = (itemData, flag) => {
    return (
      <div key={itemData.title} className="module-tab-nav">
        <div className="module-tab-title">{itemData.title}：</div>
        <div className="module-tab-type">
          {itemData.data &&
            itemData.data.map((item) => {
              let key = item.key
              let flagKey = flag === 'multi' ? activeMultiKey : activeKey
              const activeClass = flagKey === key ? 'active' : ''
              return (
                <span key={key} className={`module-tab-btn ${activeClass}`} onClick={() => itmeClick(item, flag)}>
                  {item.name}
                </span>
              )
            })}
        </div>
      </div>
    )
  }

  return (
    <div className="filter-wrap">
      {props.filtersData &&
        Object.keys(props.filtersData).map((item) => {
          const itemData = props.filtersData[item]
          return filterListRender(itemData)
        })}
      {filterDataMulti &&
        Object.keys(filterDataMulti).map((item) => {
          const itemData = filterDataMulti[item]
          return filterListRender(itemData, 'multi')
        })}
    </div>
  )
}

export default SpecialAppFilterTab
