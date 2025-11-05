/** @format */

import React, { useEffect, useState } from 'react'
import intl from '../../utils/intl'
import { Button, Checkbox, message, Row } from '@wind/wind-ui'
import PreInput from '../../components/common/search/PreInput'
import './ForceRelationChart.less'
import demo_relation from '../../assets/imgs/chart/demo_relation.png'
import demo_chain from '../../assets/imgs/chart/demo_chain.png'
import GraphChartComp from './GraphChart'
import { parseQueryString } from '../../lib/utils'
import { pointBuriedGel } from '../../api/configApi'
import { pointBuriedByModule } from '../../api/pointBuried/bury'

const CheckboxGroup = Checkbox.Group

function ForceRelationChart() {
  useEffect(() => {
    pointBuriedByModule(922602100990)
  }, [])
  const qsParam = parseQueryString()
  const leftUrlCode =
    qsParam?.lc && qsParam?.lcn
      ? {
          id: qsParam.lc?.length === 15 ? qsParam.lc.substr(2, 10) : qsParam.lc,
          name: qsParam?.lcn ? decodeURIComponent(qsParam?.lcn?.replace(/\+/g, ' ')) : '',
        }
      : null

  const rightUrlCode =
    qsParam?.rc && qsParam?.rcn
      ? {
          id: qsParam.rc?.length === 15 ? qsParam.rc.substr(2, 10) : qsParam.rc,
          name: qsParam?.rcn ? decodeURIComponent(qsParam?.rcn?.replace(/\+/g, ' ')) : '',
        }
      : null

  const onlyChart = qsParam.onlychart ? true : false
  const [preInputLeft, setPreInputLeft] = useState(leftUrlCode)
  const [preInputRight, setPreInputRight] = useState(rightUrlCode)
  const [showChart, setShowChart] = useState(false)
  const [indeterminate, setIndeterminate] = useState(true)
  const [checkAll, setCheckAll] = useState(false)
  const [checkedList, setCheckedList] = useState([])
  const plainOptions = [intl('437666', '股权'), intl('437667', '合作')]
  const [relativeType, setRelativeType] = useState('')
  const [nodes, setNodes] = useState({})
  const [forceUpdate, setForceUpdate] = useState(Date.now())
  const exampleCodesOne = [
    {
      name: '深圳市腾讯网域计算机网络有限公司',
      id: '1029618203',
    },
    {
      name: '阿里巴巴(中国)有限公司',
      id: '1036973013',
    },
  ]
  const exampleCodesTwo = [
    {
      name: '江苏磁谷节能服务有限公司',
      id: '1035532018',
    },
    {
      name: '安徽海螺水泥股份有限公司',
      id: '1008020612',
    },
  ]

  const onChange = (checkedList) => {
    setCheckedList(checkedList)
    setIndeterminate(!!checkedList.length && checkedList.length < plainOptions.length)
    setCheckAll(checkedList.length === plainOptions.length)
  }
  const onCheckAllChange = (e) => {
    setCheckedList(e.target.checked ? plainOptions : [])
    setIndeterminate(false)
    setCheckAll(e.target.checked)
  }

  const gotoSample = (type) => {
    if (type === 1) {
      setPreInputLeft(exampleCodesOne[0])
      setPreInputRight(exampleCodesOne[1])
      setNodes({
        left: exampleCodesOne[0],
        right: exampleCodesOne[1],
      })
    } else {
      setPreInputLeft(exampleCodesTwo[0])
      setPreInputRight(exampleCodesTwo[1])
      setNodes({
        left: exampleCodesTwo[0],
        right: exampleCodesTwo[1],
      })
    }
    setTimeout(() => {
      setShowChart(true)
    }, 50)
  }

  const gotoFilter = () => {
    if (!checkedList || !checkedList.length) {
      message.info('未勾选任何关系类型!')
      return
    }
    if (checkAll) {
      setRelativeType('')
    } else if (plainOptions[0].indexOf(checkedList) > -1) {
      setRelativeType('invest|investctrl|actctrl')
    } else {
      setRelativeType('merge|equitypledge|guarantee|customer|supplier|bid')
    }
  }
  const gotoSearch = () => {
    if (preInputLeft && preInputRight) {
      pointBuriedByModule(922602100991)
      setCheckedList([])
      setCheckAll(false)
      setRelativeType('')
      setNodes({
        left: preInputLeft,
        right: preInputRight,
      })
      setForceUpdate(Date.now())
      if (!showChart) {
        setTimeout(() => {
          setShowChart(true)
        }, 50)
      }
    } else {
      message.info('请选择双方企业!')
    }
  }

  useEffect(() => {
    if (leftUrlCode && rightUrlCode) {
      setNodes({
        right: preInputLeft,
        left: preInputRight,
      })
      setTimeout(() => {
        setShowChart(true)
      }, 50)
    }
    // 查关系- 探查
    pointBuriedGel('922602100665', '查关系', 'cgxView', {
      opActive: 'search',
      currentPage: 'cgxView',
      opEntity: '查关系',
    })
  }, [])

  return (
    <div className="relation-chart-container">
      <Row type="flex" className="search-relation-input">
        <PreInput defaultValue={preInputLeft?.name} selectItem={setPreInputLeft} needRealCode={true}></PreInput>
        <span className="icon-search-relation"></span>
        <PreInput defaultValue={preInputRight?.name} selectItem={setPreInputRight} needRealCode={true}></PreInput>
        <Button size="default" type="primary" onClick={gotoSearch}>
          {intl('437659', '探查')}
        </Button>
      </Row>

      {showChart ? null : (
        <div style={{ marginTop: '45px' }}>
          <div className="search-relation-label">
            {' '}
            {window.en_access_config
              ? 'Explore the Relationship Between Any Two Enterprises in Depth'
              : '深度探寻任意两个企业之间的关联关系'}
          </div>
          <Row type="flex" justify={'space-around'} className="search-relation-sample">
            <div
              onClick={() => {
                gotoSample(1)
              }}
            >
              <img src={demo_relation} alt="" />
              <div className="demo-jump-cont">
                <div>{intl('422046', '查关系')} </div>
                <div>{intl('437665', '点击查看样例')} </div>
              </div>
            </div>

            <div
              onClick={() => {
                gotoSample(2)
              }}
            >
              <img src={demo_chain} alt="" />
              <div className="demo-jump-cont">
                <div>{intl('437669', '探供应链')} </div>
                <div>{intl('437665', '点击查看样例')}</div>
              </div>
            </div>
          </Row>
        </div>
      )}

      {showChart ? (
        <div className={` relation-chart-main ${onlyChart ? 'relation-chart-main-chartonly' : ''}`}>
          {onlyChart ? null : (
            <div className={` relation-chart-nav  `}>
              <div className="relation-chart-nav-type">{intl('437661', '关系类型')} </div>
              <div className="relation-chart-nav-opts">
                <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                  {intl('272165', '全部')}
                </Checkbox>
                <CheckboxGroup options={plainOptions} value={checkedList} onChange={onChange} />
              </div>
              <Button className="relation-chart-ok" onClick={gotoFilter}>
                {intl('437668', '关系透查')}
              </Button>
              <div className="chart-nav-infotips">
                {window.en_access_config ? null : (
                  <>
                    <div>{window.en_access_config ? 'Tips:' : '注:'} </div>
                    <div>{intl('265512', '股权关系包含：对外投资、对外控股、实际控股')} </div>
                    <div>{intl('265522', '合作关系包含：并购、股权出质、担保、中标、供应链')}</div>
                  </>
                )}
              </div>
            </div>
          )}

          <GraphChartComp
            sourceNodes={nodes.left}
            targetNodes={nodes.right}
            relativeTypes={relativeType}
            forceUpdate={forceUpdate}
          ></GraphChartComp>
        </div>
      ) : null}
    </div>
  )
}

export default ForceRelationChart
