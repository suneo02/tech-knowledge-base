// import { Select } from 'antd'
// import { Select } from '@wind/wind-ui'
import React, { useState } from 'react'
import styled from 'styled-components'

import intl from '../../../../utils/intl'
import { Select } from '@wind/wind-ui'

const Option = Select.Option
const LogicOption = ({ defaultOption = 'any', changeOptionCallback }) => {
  const logicOption = {
    notAny: intl('257771', '不含'),
    any: intl('257770', '含任一'),
    all: intl('257777', '含所有'),
  }
  const [current, setCurrent] = useState(defaultOption)

  const changeOption = (key) => {
    console.log(key)
    setCurrent(key)
    changeOptionCallback && changeOptionCallback(key)
  }

  return (
    <Box>
      <Select defaultValue={current} onChange={changeOption} className="prefixLogic">
        {Object.keys(logicOption).map((item) => (
          <Option key={item} value={item}>
            {logicOption[item]}
          </Option>
        ))}
      </Select>
    </Box>
  )
}

const Box = styled.ul`
  display: flex;
  height: 32px;
  margin-right: 16px;
  .prefixLogic {
    height: 32px;
    width: 90px;
    .ant-select-selection-search {
      border-right: 1px solid #d9d9d9;
      margin: 2px 0;
    }

    .ant-select-arrow {
      right: 8px;
    }
    .w-select-selector {
      height: 100%;
      .w-select-selection-item{
        line-height: 30px;
      }
    }
  }

`

export default LogicOption
