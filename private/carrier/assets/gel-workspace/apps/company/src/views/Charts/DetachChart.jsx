import { Button, Checkbox, message, Row } from '@wind/wind-ui'
import React, { useEffect, useState } from 'react'
import { getuserinfo } from '../../api/chartApi'
import { searchcollectlist } from '../../api/companyDynamic'
import { pointBuriedGel } from '../../api/configApi'
import { getPreCorpSearchNew } from '../../api/homeApi'
import detach_multi from '../../assets/imgs/detach_multi.jpg'
import detachMultiEn from '../../assets/imgs/detachMultiEn.jpg'
import PreInput from '../../components/common/search/PreInput'
import { parseQueryString } from '../../lib/utils'
import intl from '../../utils/intl'
import './DetachChart.less'
import GraphChartComp from './GraphChart'
import { pointBuriedByModule } from '../../api/pointBuried/bury'

const CheckboxGroup = Checkbox.Group

function DetachChart() {
  const qsParam = parseQueryString()
  let leftUrlCode =
    qsParam?.companycode && qsParam?.companyname
      ? {
          id: qsParam.companycode?.length === 15 ? qsParam.companycode.substr(2, 10) : qsParam.companycode,
          name: qsParam?.companyname ? decodeURIComponent(qsParam?.companyname) : '',
        }
      : null

  const [fromCorpDetach, setFromCorpDetach] = useState(leftUrlCode ? true : false)
  const [preInputLeft, setPreInputLeft] = useState(leftUrlCode)
  const [preInputRight, setPreInputRight] = useState(null)
  const [showChart, setShowChart] = useState(false)
  const [indeterminate, setIndeterminate] = useState(true)
  const [checkAll, setCheckAll] = useState(false)
  const [checkedList, setCheckedList] = useState([])
  const plainOptions = [intl('437666', '股权'), intl('437667', '合作')]
  const [relativeType, setRelativeType] = useState('')
  const [nodes, setNodes] = useState({})
  const [forceUpdate, setForceUpdate] = useState(Date.now())
  const [userCorp, setUserCorp] = useState(null)
  const [userFavor, setUserFavor] = useState([])
  const [relateList, setRelateList] = useState([])
  const [showFilter, setShowFilter] = useState(false)

  const exampleCodesOne = [
    {
      name: '深圳市腾讯网域计算机网络有限公司',
      id: '1029618203',
    },
  ]
  const exampleCodesTwo = [
    {
      CompanyName: '滴滴出行科技有限公司',
      CompanyCode: '1175155522',
      checked: true,
    },
    {
      CompanyName: '抖音有限公司',
      CompanyCode: '1100421275',
      checked: true,
    },
    {
      CompanyName: '阿里巴巴(中国)有限公司',
      CompanyCode: '1036973013',
      checked: true,
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

  const gotoSample = () => {
    setPreInputLeft(exampleCodesOne[0])
    const tmp = [...relateList]
    tmp.map((t) => {
      t.checked = false
    })
    tmp.splice(1, 0, exampleCodesTwo[0])
    tmp.splice(1, 0, exampleCodesTwo[1])
    tmp.splice(1, 0, exampleCodesTwo[2])
    setRelateList(tmp)

    const list = []
    const listNames = []
    tmp.map((t) => {
      if (t.checked) {
        list.push(t.CompanyCode)
        listNames.push(t.CompanyName)
      }
    })

    setNodes({
      left: exampleCodesOne[0],
      right: {
        id: list.join(','),
        name: listNames,
      },
    })
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
  const gotoSearch = (lastList) => {
    if (!preInputLeft) {
      message.info('请选择触达目标企业!')
      return
    }
    if (!relateList?.length && !lastList) {
      message.info('请选择触达关联企业!')
      return
    }
    pointBuriedByModule(922602101006)
    const tmp = lastList?.length ? [...lastList] : [...relateList]
    const list = []
    const listNames = []
    tmp.map((t) => {
      if (t.checked) {
        list.push(t.CompanyCode)
        listNames.push(t.CompanyName)
      }
    })
    if (!list.length) {
      message.info('请选择触达关联企业!')
      return
    }
    for (let i = 0; i < list.length; i++) {
      if (list[i].indexOf(preInputLeft.id) > -1) {
        message.warn('关联企业中包含目标企业!')
        return
      }
    }
    if (relativeType) {
      // 触达tab下的按钮点击时，自动将右侧关系类型清空
      setCheckedList([])
      setIndeterminate(false)
      setRelativeType('')
    }
    if (nodes && nodes.left && nodes.left.id === preInputLeft.id) {
      if (nodes.right && nodes.right.id === list.join(',')) {
        // 如果两次点击没有变更节点， 1000ms内只允许重复查询一次
        const currentTime = Date.now()
        if (currentTime - forceUpdate > 1000) {
          setForceUpdate(currentTime)
        }
        return
      }
    }
    setNodes({
      left: preInputLeft,
      right: {
        id: list.join(','),
        name: listNames,
      },
    })
    !showChart && setShowChart(true)
  }

  const onChangeList = (e) => {
    e.checked = !e.checked
    const tmp = [...relateList]
    let count = 0
    for (let i = 0; i < tmp.length; i++) {
      if (tmp[i].checked) count++
      if (count > 10) {
        message.warn('最多选择10个关联企业')
        e.checked = !e.checked
        return
      }
    }
    setRelateList(tmp)
  }

  useEffect(() => {
    // todo 多对一触达埋点，缺省，先用查关系记录，参数上区分
    // 查关系- 探查
    pointBuriedGel('922602100665', '多对一触达', 'detachChartView', {
      opActive: 'search',
      currentPage: 'detachChartView',
      opEntity: '多对一触达',
    })

    searchcollectlist({
      pageindex: 0,
      pagenum: 100,
      groupId: 'all',
    }).then((res) => {
      if (res?.code == '0' && res?.Data?.length) {
        // 前5条默认选中
        let len = 5
        if (leftUrlCode) {
          len = 9
        }
        if (res.Data.length <= len) {
          res.Data.map((t) => {
            t.checked = true
          })
        } else {
          for (let i = 0; i < len; i++) {
            res.Data[i].checked = true
          }
        }
        res.Data.map((t) => {
          if (t.CompanyCode && t.CompanyCode.length == 15) {
            t.CompanyCode = t.CompanyCode.substr(2, 10)
          }
        })
        setUserFavor(res.Data)
        if (!relateList.length) {
          setRelateList(res.Data)
        }
      }
    })
    getuserinfo({}).then((res) => {
      if (res && res.code == '0' && res.data) {
        let str = decodeURIComponent(window.atob(res.data))
        str = JSON.parse(str)
        var name = str.CompanyName || ''
        var id = ''
        if (name) {
          getPreCorpSearchNew({ queryText: name, pageSize: 5 }).then((res) => {
            if (res.ErrorCode == 0 && res.Data && res.Data.corplist && res.Data.corplist.length) {
              var list = res.Data.corplist.map((i) => ({
                ...i,
                name: i.corp_name,
                id: i.corp_id,
              }))
              var match = false
              for (var i = 0; i < list.length; i++) {
                var t = list[i]
                if (t.is_fullmatch) {
                  match = true
                  id = t.id
                  break
                }
              }
              if (!match) id = list[0].id
              if (!id) return
              id = id.substr(2, 10)
              setUserCorp({
                CompanyCode: id,
                CompanyName: name,
                checked: true,
              })
            }
          })
        }
      }
    })
  }, [])

  useEffect(() => {
    if (!userCorp) return
    if (relateList?.length && relateList[0].CompanyCode == userCorp.CompanyCode) return
    const tmp = [...relateList]
    tmp.unshift(userCorp)
    setRelateList(tmp)
  }, [userCorp])

  useEffect(() => {
    if (userCorp && fromCorpDetach && relateList.length > 1) {
      setFromCorpDetach(false)
      gotoSearch()
    }
  }, [relateList])

  useEffect(() => {
    if (preInputRight?.id) {
      const tmp = [...relateList]
      let count = 0
      for (let i = 0; i < tmp.length; i++) {
        if (tmp[i].checked) count++
        if (tmp[i].CompanyCode.indexOf(preInputRight.id) > -1) {
          message.warn('当前选中公司已存在!')
          return
        }
        if (count > 9) {
          message.warn('最多选择10个关联企业')
          return
        }
      }
      tmp.splice(1, 0, {
        CompanyCode: preInputRight.id,
        CompanyName: preInputRight.name,
        checked: true,
      })
      setRelateList(tmp)
    }
  }, [preInputRight])

  return (
    <div className="detach-chart-container">
      <div className="relation-chart-main">
        <div className={` relation-chart-nav  `}>
          <div className="detach-nav-tab">
            <span
              className={` detach-nav-tab-left ${!showFilter ? 'detach-nav-tab-sel' : ''} `}
              onClick={() => {
                showFilter && setShowFilter(false)
              }}
              data-uc-id="GynhcOIAmG"
              data-uc-ct="span"
            >
              {intl('437660', '触达企业')}
            </span>
            <span
              className={` detach-nav-tab-right ${showFilter ? 'detach-nav-tab-sel' : ''}`}
              onClick={() => {
                !showFilter && setShowFilter(true)
              }}
              data-uc-id="WajSzA_R31"
              data-uc-ct="span"
            >
              {intl('437661', '关系类型')}
            </span>
          </div>

          <div style={{ display: showFilter ? 'none' : 'block' }}>
            <div className="detach-nav-title"> {intl('437662', '触达目标企业')}</div>
            <PreInput defaultValue={preInputLeft?.name} selectItem={setPreInputLeft} needRealCode={true}></PreInput>

            <div className="detach-chart-line"></div>
            <div className="detach-nav-title">{intl('437663', '我的关联企业（最多选择10家企业）')} </div>
            <PreInput
              defaultValue={preInputRight?.name}
              selectItem={setPreInputRight}
              needRealCode={true}
              style={{ marginBottom: '12px' }}
            ></PreInput>
            <div className="detach-chart-favor-list">
              {relateList && relateList.length
                ? relateList.map((t) => {
                    return (
                      <div key={t.CompanyCode} title={t.CompanyName} className="detach-chart-favor-item">
                        <Checkbox
                          checked={t.checked}
                          onChange={() => {
                            onChangeList(t)
                          }}
                          data-uc-id="0qyOqFqEn_"
                          data-uc-ct="checkbox"
                        >
                          {t.CompanyName}
                        </Checkbox>
                      </div>
                    )
                  })
                : null}
            </div>
            <Button className="detach-chart-btn" onClick={gotoSearch} data-uc-id="dY2HRL0XE" data-uc-ct="button">
              {intl('437664', '查触达路径')}
            </Button>
          </div>

          <div style={{ display: !showFilter ? 'none' : 'block' }}>
            <div className="relation-chart-nav-type"> {intl('437661', '关系类型')} </div>
            <div className="relation-chart-nav-opts">
              <Checkbox
                indeterminate={indeterminate}
                onChange={onCheckAllChange}
                checked={checkAll}
                data-uc-id="4KCQBivaYG"
                data-uc-ct="checkbox"
              >
                {intl('272165', '全部')}
              </Checkbox>
              <CheckboxGroup
                options={plainOptions}
                value={checkedList}
                onChange={onChange}
                data-uc-id="kDY1u-V0X5"
                data-uc-ct="checkboxgroup"
              />
            </div>
            <Button className="relation-chart-ok" onClick={gotoFilter} data-uc-id="y6ovG2KBY4" data-uc-ct="button">
              {intl('437668', '关系透查')}
            </Button>
            <div className="chart-nav-slide"></div>
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
        </div>

        {!showChart ? (
          <div className="detach-chart-demo">
            <div className="search-relation-label">
              {intl('437675', '深度探寻我的关系企业与触达目标企业间的最短触达路径')}{' '}
            </div>
            <Row type="flex" justify={'space-around'} className="search-relation-sample">
              <div
                onClick={() => {
                  gotoSample()
                }}
                data-uc-id="LDdl-nhLUr"
                data-uc-ct="div"
              >
                <img
                  src={window.en_access_config ? detachMultiEn : detach_multi}
                  style={{ maxWidth: '946px' }}
                  alt=""
                />
                <div>{intl('437665', '点击查看样例')}</div>
              </div>
            </Row>
          </div>
        ) : null}

        {showChart ? (
          <GraphChartComp
            multi={true}
            sourceNodes={nodes.right}
            targetNodes={nodes.left}
            relativeTypes={relativeType}
            forceUpdate={forceUpdate}
          ></GraphChartComp>
        ) : null}
      </div>
    </div>
  )
}

export default DetachChart
