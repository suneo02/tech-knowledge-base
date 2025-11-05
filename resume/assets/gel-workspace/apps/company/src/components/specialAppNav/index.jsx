import React, { useEffect, useState } from 'react'
import { wftCommon } from '../../utils/utils'
import { pointBuriedByModule } from '../../api/pointBuried/bury'

function SpecialAppNav(props) {
  const [active, setActive] = useState('ipoNew')

  const itemClick = (data) => {
    // 外部链接
    if (data.link) {
      pointBuriedByModule(922602101044)
      wftCommon.jumpJqueryPage(data.link)
      return
    } else {
      setActive(data.key)
      props?.navClickHandle?.(data.key)
    }
  }

  useEffect(() => {
    const activeKey = wftCommon.parseQueryString('pageType', window.location.search)
    if (activeKey) {
      setActive(activeKey)
    }
  }, [])

  return (
    <div className="nav-special-list">
      <div className="nav-menu">
        <ul>
          {props.config &&
            Object.keys(props.config).map((item) => {
              const itemData = props.config[item]
              const classnames = {
                active: active === item,
                link: itemData.link,
              }
              const classNames = Object.keys(classnames)
                .filter((key) => classnames[key])
                .join(' ')
              return (
                <li key={item} className={classNames} onClick={() => itemClick(itemData)}>
                  <span>{itemData.title}</span>
                </li>
              )
            })}
        </ul>
      </div>
    </div>
  )
}

export default SpecialAppNav
