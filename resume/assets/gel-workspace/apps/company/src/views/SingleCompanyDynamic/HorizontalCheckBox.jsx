import { Col, Row } from '@wind/wind-ui'
import { useState } from 'react'
import intl from '../../utils/intl'

import './HorizontalCheckBox.less'

const HorizontalCheckBox = ({ isMultiple = false, options, onSelect, selected = [],label='' }) => {
  const [selectArrs, setSelectArrs] = useState([])

  return (
    <>
      <Row className="dynamicType">
        <Col
          span={2}
          style={{
            color: '#666',
          }}
        >
          {label}
        </Col>
        <Col span={21}>
          {options.map((i, index, arr) => (
            <span
              key={index}
              className={selected.some((j) => j.name == i.name) ? 'activeMenu span' : 'span'}
              onClick={() => {
                if (isMultiple) {
                  let menu = [...selected]
                  let index = menu.findIndex((j) => j.name == i.name)
                  let isAllindex = menu.findIndex((j) => j.name == arr[0].name)
                  if (index > -1) {
                    menu.splice(index, 1)
                  } else {
                    if (i.isAll) {
                     return onSelect([i]) 
                    } else {
                      isAllindex > -1 && menu.splice(isAllindex, 1)
                      menu.push(i)
                    }
                  }
                  if (!menu.length) menu = [arr[0]]
                  onSelect([...menu])
                } else {
                  onSelect([i])
                }

                // setActiveMenu(i)
                // setCurrentMenu(i.children || [])
              }}
            >
              {intl('', i.name)}
            </span>
          ))}
        </Col>
      </Row>
    </>
  )
}

export default HorizontalCheckBox
