import React from 'react'
import './myMenu.less'
import { wftCommon } from '../../utils/utils'

function MyMenu(props) {
  const { current, className, title, menus, onSelect, ...rest } = props
  return (
    <div className="my-api-menu" {...rest}>
      {title && <div className="my-api-menu-title">{title}</div>}
      {menus.map((item, index) => {
        if (wftCommon.usedInClient()) {
          if (item.key === 'bindphone') {
            return null
          }
        }
        return (
          <div
            key={index}
            className={current.key === item.key ? 'sel' : ''}
            onClick={() => {
              onSelect(item)
            }}
            data-uc-id="BwkB_1GdFo4"
            data-uc-ct="div"
            data-uc-x={index}
          >
            {item?.name || ''}
          </div>
        )
      })}
    </div>
  )
}

export default MyMenu
