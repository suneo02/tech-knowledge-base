import { Radio } from '@wind/wind-ui'
import React, { forwardRef, useMemo } from 'react'
import styled from 'styled-components'
import intl from '../../../../utils/intl'

const HasOrNotOption = forwardRef(({ defaultValue = '', changeOptionCallback = () => null, itemOption = [] }, ref) => {
  const value = useMemo(() => {
    // console.log(defaultValue);
    return defaultValue || 'any'
  }, [defaultValue])

  //#region 添加不限
  const options = useMemo(() => {
    let _options = [...itemOption]
    _options.unshift({
      name: intl('138649', '不限'),
      value: 'any',
    })

    return _options
  }, [itemOption])

  const changeOption = (e) => {
    const value = e.target.value
    if (value === 'any') {
      changeOptionCallback([])
      return
    }
    changeOptionCallback([value])
  }

  return (
    <Box>
      <div ref={ref}>
        <Radio.Group value={value} onChange={changeOption} data-uc-id="fFc_7kXK77" data-uc-ct="radio">
          {options.map((item) => (
            <Radio
              key={item.value}
              value={item.value}
              data-uc-id="6EoKi9GkYk"
              data-uc-ct="radio"
              data-uc-x={item.value}
            >
              {item.name}
            </Radio>
          ))}
        </Radio.Group>
      </div>
    </Box>
  )
})

const Box = styled.div`
  display: flex;
  .ant-radio-wrapper,
  .w-radio-wrapper {
    margin-right: 25px;
    span {
      color: #666;
      line-height: 32px;
      display: inline-flex;
    }
    .ant-radio-checked,
    .w-radio-checkeinline-flexd {
      span {
        color: #000 !important;
      }
    }
  }
`

export default HasOrNotOption
