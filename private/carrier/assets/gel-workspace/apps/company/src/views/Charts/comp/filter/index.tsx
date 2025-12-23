import React, { useState } from 'react'
import intl from '@/utils/intl'
import { InputNumber, Radio } from '@wind/wind-ui'
import { debounce } from '@/utils/utils'

const RadioGroup = Radio.Group
const debounceFn = debounce((fn) => {
  fn()
}, 1000)

interface FilterProps {
  onlyInvestTree?: boolean
  handleChange?: (val: number, type: string, extraValue?: any) => void
}

const Filter: React.FC<FilterProps> = (props) => {
  const { onlyInvestTree, handleChange } = props
  const [directVal, setDirectVal] = useState(1) // 图表样式
  const [relateVal, setRelateVal] = useState(onlyInvestTree ? 3 : 1) // 穿透方向
  const [stateVal, setStateVal] = useState(1) // 只看存续
  const [rateVal, setRateVal] = useState(1) // 持股比例单选选项激活在哪一个条目
  const [rateLeftVal, setRateLeftVal] = useState(null) // 持股比例下限输入 - 自定义
  const [rateRightVal, setRateRightVal] = useState(null) // 持股比例上限 - 自定义
  const [rate, setRate] = useState(0) // 持股比例下限 用于接口请求
  const [rateUp, setRateUp] = useState('') // 持股比例上限 用于接口请求
  const [opts, setOpts] = useState(null)

  const onChange = (t, type) => {
    const e = t.target.value
    switch (type) {
      case 'direct':
        if (onlyInvestTree) {
        } else {
          // pointBuriedByModule(922602100987)
        }
        if (e === 4) {
          // 股权结构图
          setRelateVal(1)
        }
        setDirectVal(e)
        break
      case 'relate':
        setRelateVal(e)
        break
      case 'state':
        setStateVal(e)
        break
      case 'rate':
        console.log(e)
        if (e < 4) {
          setRateLeftVal('')
          setRateRightVal('')
          setRate(0)
        }
        if (e === 2) {
          setRateUp('')
          setRate(50)
        }
        if (e === 3) {
          setRateUp('')
          setRate(30)
        }
        if (e === 1) {
          setRate(0)
          setRateUp('')
        }
        setRateVal(e)
        break
    }
    handleChange(e, type)
  }

  const onChangeRateLeft = (e) => {
    setRateLeftVal(e)
    debounceFn(() => {
      handleChange(5, 'rate', {
        ratio: e ? `${e}` : '0',
        ratioUp: rateRightVal ? `${rateRightVal}` : '100',
      })
    })
  }
  const onChangeRateRight = (e) => {
    setRateRightVal(e)
    debounceFn(() => {
      handleChange(5, 'rate', {
        ratio: rateLeftVal ? `${rateLeftVal}` : '0',
        ratioUp: e ? `${e}` : '100',
      })
    })
  }

  const radioStyle = {
    display: 'block',
    height: '34px',
    lineHeight: '34px',
  }
  const relateOpts = [
    {
      txt: intl('138649', '不限'),
      value: 1,
    },
    {
      txt: intl('356654', '只看股东'),
      value: 2,
    },
    {
      txt: intl('356673', '只看对外投资'),
      value: 3,
    },
  ]
  const stateOpts = [
    {
      txt: intl('138649', '不限'),
      value: 1,
    },
    {
      txt: intl('358274', '只看存续'),
      value: 2,
    },
  ]
  const rateOpts = [
    {
      txt: intl('138649', '不限'),
      value: 1,
    },
    {
      txt: intl('437674', '大于50%'),
      value: 2,
    },
    {
      txt: intl('358233', '大于30%'),
      value: 3,
    },
    {
      txt: intl('25405', '自定义'),
      value: 4,
    },
  ]
  const directOpts = [
    {
      txt: intl('358235', '上下结构'),
      value: 1,
    },
    {
      txt: intl('358254', '上下结构(紧凑)'),
      value: 2,
    },
    {
      txt: intl('358234', '左右结构'),
      value: 3,
    },
    {
      txt: intl('358255', '缩进结构(原股权结构图)'),
      value: 4,
    },
  ]

  return (
    <div className={`gqct-chart-nav`}>
      <div style={{ borderBottom: '1px solid #c5c5c5', color: '#000', padding: '6px 12px' }}>
        {intl('257655', '筛选')}
      </div>
      <div style={{ padding: 12 }}>
        {[relateOpts, stateOpts, rateOpts, directOpts].map((item, idx) => {
          if (!idx) {
            if (onlyInvestTree || directVal === 4) return null
          }
          let title = ''
          let type = ''
          let val = 0
          switch (idx) {
            case 0:
              type = 'relate'
              title = intl('358273', '穿透方向')
              val = relateVal
              break
            case 1:
              type = 'state'
              title = intl('134794', '企业状态')
              val = stateVal
              break
            case 2:
              type = 'rate'
              title = intl('451217', '持股比例')
              val = rateVal
              break
            case 3:
              type = 'direct'
              title = intl('358253', '图表样式')
              val = directVal
              break
          }
          return (
            <div key={`gqct-chart-nav-item-${idx}`} className="gqct-chart-nav-item" style={{ marginBottom: 24 }}>
              <div>{title}</div>
              <RadioGroup
                onChange={(e) => {
                  onChange(e, type)
                }}
                value={val}
                style={{ display: 'flex', flexWrap: 'wrap' }}
                data-uc-id="B12SVJ7BQ6"
                data-uc-ct="radiogroup"
              >
                {item.map((t, index) => {
                  if (idx === 2) {
                    return (
                      <Radio
                        key={index}
                        style={radioStyle}
                        value={t.value}
                        data-uc-id="n4Un1H5i1i"
                        data-uc-ct="radio"
                        data-uc-x={index}
                      >
                        {t.txt}
                        {t.value === 4 && rateVal === 4 ? (
                          <>
                            <InputNumber
                              min={0}
                              max={100}
                              // onBlur={() => {
                              //   debounceFn(() => {
                              //     if (rateRightVal && rateLeftVal > rateRightVal) {
                              //       setRateLeftVal(0)
                              //       return
                              //     }
                              //     if (rateLeftVal !== rate) setRate(rateLeftVal)
                              //     if (rateRightVal !== rateUp) setRateUp(rateRightVal)
                              //   })
                              // }}
                              value={rateLeftVal}
                              onChange={(e) => {
                                onChangeRateLeft(e)
                              }}
                              style={{ marginLeft: 4 }}
                              data-uc-id="pdpsR9FreG"
                              data-uc-ct="inputnumber"
                            />
                            -
                            <InputNumber
                              min={0}
                              max={100}
                              // onBlur={() => {
                              //   debounceFn(() => {
                              //     if (rateLeftVal > rateRightVal) {
                              //       setRateLeftVal(0)
                              //       return
                              //     }
                              //     if (rateLeftVal !== rate) setRate(rateLeftVal)
                              //     if (rateRightVal !== rateUp) setRateUp(rateRightVal)
                              //   })
                              // }}
                              value={rateRightVal}
                              onChange={(e) => {
                                onChangeRateRight(e)
                              }}
                              data-uc-id="w_aT63PDIA"
                              data-uc-ct="inputnumber"
                            />
                          </>
                        ) : null}
                      </Radio>
                    )
                  }
                  if (onlyInvestTree && idx === 3 && index === 3) {
                    return null
                  }
                  return (
                    <Radio
                      key={index}
                      style={radioStyle}
                      value={t.value}
                      data-uc-id="ePsIhhOhM6"
                      data-uc-ct="radio"
                      data-uc-x={index}
                    >
                      {t.txt}
                    </Radio>
                  )
                })}
              </RadioGroup>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Filter
