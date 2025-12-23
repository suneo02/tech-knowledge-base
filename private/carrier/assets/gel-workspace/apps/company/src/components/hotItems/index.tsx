import React from 'react'
import HotItem from './item'

import './style/index.less'

function HotItems(props) {
  const {
    hotFlag, // department: 查集团系; fetured: 榜单名录查询; searchHome: 企业库首页;
    hotList,
    extendData,
  } = props

  return (
    <React.Fragment>
      <div
        className={`hot-items 
                ${hotFlag === 'department' ? 'hot-items-department' : ''} 
                ${hotFlag === 'fetured' ? 'hot-items-fetured' : ''}
                ${hotFlag === 'searchHome' ? 'hot-items-search-home' : ''}
            `}
      >
        {hotList?.length > 0 &&
          hotList.map((item) => {
            return (
              <HotItem
                key={item.groupSystemId || item.objectId || item.k}
                hotFlag={hotFlag}
                itemData={item}
                extendData={extendData}
              />
            )
          })}
      </div>
    </React.Fragment>
  )
}

export default HotItems
