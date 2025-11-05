/** @format */

import { Button, InputNumber, Layout, message, Radio, Resizer } from '@wind/wind-ui'
import React, { useEffect, useState } from 'react'
import { pointBuriedGel } from '../../api/configApi'
import { parseQueryString } from '../../lib/utils'
import intl from '../../utils/intl'
import { debounce, wftCommon } from '../../utils/utils'
import ShareAndInvestTree from './ShareAndInvestTree'
import './ShareInvestChart.less'
import { pointBuriedByModule } from '../../api/pointBuried/bury'
import { showExportReportModal } from './handle'
import { CHART_HASH } from '@/components/company/intro/charts'

const { Content, Sider } = Layout
const RadioGroup = Radio.Group

const debounceFn = debounce((fn) => {
  fn()
}, 100)

function ShareAndInvest(props) {
  const qsParam = parseQueryString()
  const companycode = props.companycode || qsParam['companycode']
  const onlyInvestTree = props.onlyInvestTree || false // true，表示当前为对外投资图

  const linksource = qsParam.linksource || ''
  const linkSourceRIME = linksource === 'rime' ? true : false
  const [directVal, setDirectVal] = useState(1) // 图表样式
  const [relateVal, setRelateVal] = useState(onlyInvestTree ? 3 : 1) // 穿透方向
  const [stateVal, setStateVal] = useState(1) // 只看存续
  const [rateVal, setRateVal] = useState(1) // 持股比例单选选项激活在哪一个条目
  const [rateLeftVal, setRateLeftVal] = useState(null) // 持股比例下限输入 - 自定义
  const [rateRightVal, setRateRightVal] = useState(null) // 持股比例上限 - 自定义
  const [rate, setRate] = useState('') // 持股比例下限 用于接口请求
  const [rateUp, setRateUp] = useState('') // 持股比例上限 用于接口请求
  const [opts, setOpts] = useState(null)
  const [showSlide, setShowSlide] = useState(true) // 筛选侧边栏是否展示
  const snapshot = qsParam.snapshot || false //  只展示图谱快照
  const [noSlide, setNoSlide] = useState(snapshot || qsParam.noslide || linkSourceRIME ? true : false) // 不展示侧边栏
  const [resizeWidth, setResizeWidth] = useState(290)
  const waterMask = props.waterMask === false || linkSourceRIME ? false : true // 水印
  const disableExportExcel = qsParam.disableExportExcel ? true : false

  useEffect(() => {
    if (linksource === 'pcai') {
      document.body.classList.add('pcai-mode')
    }
    return () => {
      document.body.classList.remove('pcai-mode')
    }
  }, [linksource])

  const onChange = (t, type) => {
    const e = t.target.value
    switch (type) {
      case 'direct':
        if (onlyInvestTree) {
        } else {
          pointBuriedByModule(922602100987)
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
        if (e < 4) {
          setRateLeftVal('')
          setRateRightVal('')
          setRate('')
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
          setRate('')
          setRateUp('')
        }
        setRateVal(e)
        break
    }
  }

  const onChangeRateLeft = (e) => {
    setRateLeftVal(e)
  }
  const onChangeRateRight = (e) => {
    setRateRightVal(e)
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
  if (onlyInvestTree) {
    directOpts.length = 3
  }

  const showReport = (corpName) => {
    showExportReportModal({
      companycode,
      corpName,
      onlyInvestTree,
      linkSourceRIME,
    })
  }

  useEffect(() => {
    if (!snapshot) return
    const root = document.querySelector('#root')
    if (root instanceof HTMLElement) {
      root.style.setProperty('min-width', 'auto')
    }
  }, [snapshot])

  useEffect(() => {
    const params = {
      rate: rate || '',
      rateUp: rateUp || '',
      onlyShareHolder: relateVal === 2 ? true : false,
      onlyInvest: relateVal === 3 ? true : false,
      stateOnlyNormal: stateVal === 2 ? true : false,
      direction: directVal === 3 ? 'lr' : '',
      shareHolderTree: directVal === 4 ? true : false, // 股权结构图
      indent: directVal === 2 ? true : false,
      noShareHolder: onlyInvestTree ? true : false,
      snapshot: snapshot,
    }
    setOpts(params)
  }, [rate, rateUp, directVal, relateVal, stateVal])

  useEffect(() => {
    if (onlyInvestTree) {
      // 对外投资图
      pointBuriedGel('922602100371', '对外投资图', 'tzctView', {
        opActive: 'loading',
        currentPage: 'tzctView',
        opEntity: '对外投资图',
        currentId: companycode,
        opId: companycode,
      })
    } else {
      // 股权穿透图
      pointBuriedGel('922602100371', '股权穿透图', 'gqctView', {
        opActive: 'loading',
        currentPage: 'gqctView',
        opEntity: '股权穿透图',
        currentId: companycode,
        opId: companycode,
      })
    }
  }, [])

  const handleResize = (e, { deltaX }) => {
    setResizeWidth(resizeWidth + deltaX)
    setShowSlide(!showSlide)
  }

  const gotoChart = () => {
    const url = `index.html?isSeparate=1&nosearch=1&companycode=${companycode}&activeKey=chart_gqct#/${CHART_HASH}`
    wftCommon.jumpJqueryPage(url)
  }

  return (
    <div
      className={` gqct-chart-main ${showSlide ? '' : 'gqct-chart-slide-hide'} ${noSlide ? 'gqct-chart-no-slide' : ''} `}
    >
      <Layout style={{ height: '100%' }}>
        {noSlide ? null : (
          <>
            <Sider width={resizeWidth}>
              <div className={` gqct-chart-nav `}>
                <div>
                  {[relateOpts, stateOpts, rateOpts, directOpts].map((item, idx) => {
                    if (!idx) {
                      if (onlyInvestTree || directVal === 4) return null
                    }
                    let title = ''
                    let type = ''
                    let val = ''
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
                      <div key={`gqct-chart-nav-item-${idx}`} className="gqct-chart-nav-item">
                        <div>{title}</div>
                        <RadioGroup
                          onChange={(e) => {
                            onChange(e, type)
                          }}
                          value={val}
                        >
                          {item.map((t, index) => {
                            if (idx === 2) {
                              return (
                                <Radio key={index} style={radioStyle} value={t.value}>
                                  {t.txt}
                                  {t.value === 4 && rateVal === 4 ? (
                                    <>
                                      <InputNumber
                                        min={0}
                                        max={100}
                                        onBlur={() => {
                                          debounceFn(() => {
                                            if (rateRightVal && rateLeftVal > rateRightVal) {
                                              setRateLeftVal(0)
                                              return
                                            }
                                            if (rateLeftVal !== rate) setRate(rateLeftVal)
                                            if (rateRightVal !== rateUp) setRateUp(rateRightVal)
                                          })
                                        }}
                                        value={rateLeftVal}
                                        onChange={(e) => {
                                          onChangeRateLeft(e)
                                        }}
                                      />
                                      -{' '}
                                      <InputNumber
                                        min={0}
                                        max={100}
                                        onBlur={() => {
                                          debounceFn(() => {
                                            if (rateLeftVal > rateRightVal) {
                                              setRateLeftVal(0)
                                              return
                                            }
                                            if (rateLeftVal !== rate) setRate(rateLeftVal)
                                            if (rateRightVal !== rateUp) setRateUp(rateRightVal)
                                          })
                                        }}
                                        value={rateRightVal}
                                        onChange={(e) => {
                                          onChangeRateRight(e)
                                        }}
                                      />
                                    </>
                                  ) : null}
                                </Radio>
                              )
                            }
                            return (
                              <Radio key={index} style={radioStyle} value={t.value}>
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
            </Sider>
            <Resizer unfoldedSize={290} onResize={handleResize} defaultFolded={false} />
          </>
        )}
        <Content className="f-df">
          <div className="gqct-chart-box">
            {snapshot ? <div className="snapshot" onClick={gotoChart}></div> : null}
            {opts ? (
              <ShareAndInvestTree
                companycode={companycode}
                opts={opts}
                exportFn={disableExportExcel ? null : showReport}
                waterMask={waterMask}
                linksource={linksource}
              ></ShareAndInvestTree>
            ) : null}
          </div>
        </Content>
      </Layout>
    </div>
  )
}

export default ShareAndInvest
