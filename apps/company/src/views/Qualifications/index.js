import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { AutoComplete, Button, Card, Col, Input, Row, Spin } from '@wind/wind-ui'

import './qualificationsIndex.less'

import { debounce, wftCommon } from '../../utils/utils'
import { numberFormat, parseQueryString } from '../../lib/utils'

import intl from '../../utils/intl'
import { RightO, SynO } from '@wind/icons'
import { qualificationhotchange, qualificationsearch } from '../../api/qualificationsApi'
import { pointBuriedGel } from '../../api/configApi'
import { usePageTitle } from '../../handle/siteTitle'
import { getUrlByLinkModule, LinksModule } from '@/handle/link'

const Option = AutoComplete.Option

const debounceSearch = debounce((param, fn) => {
  qualificationsearch(param)
    .then((res) => {
      fn && fn(res)
    })
    .catch(() => {
      fn && fn(null)
    })
}, 300)

function QualificationsIndex(props) {
  usePageTitle('QualificationsHome')
  const { location, history } = props
  let { id } = parseQueryString()

  const [value, setValue] = useState('')
  const [result, setResult] = useState([])
  const [records, setRecords] = useState(0)
  const [hot_data, setHot_data] = useState([])
  const [spinning, setSpinning] = useState(false)
  const [pageNo, setPageNo] = useState(0)

  useEffect(() => {
    setSpinning(true)
    pointBuriedGel('922602100896', '资质大全-首页点击', 'qualificationIndex')
    getHotData()
  }, [])
  const getHotData = () => {
    qualificationhotchange({
      qualificationCode: 'Q1000000000', //固定值
      pageNo,
      pageSize: 6,
    }).then((res) => {
      if (window.en_access_config) {
        wftCommon.zh2en(res.Data, (newData) => {
          setPageNo((i) => i + 1)
          setHot_data(newData || [])
          setSpinning(false)
          setRecords(res.Page?.Records)
        })
      } else {
        setPageNo((i) => i + 1)
        setHot_data(res.Data || [])
        setSpinning(false)
        setRecords(res.Page?.Records)
      }
    })
  }
  const handleSearch = (value) =>
    debounceSearch(
      {
        keyWord: value,
        pageNo: 0,
        pageSize: 5,
      },
      (res) => {
        setResult(res?.Data || [])
      }
    )

  const handleSelect = (value, option) => {
    console.log('🚀 ~handleSelect ~ value:', value, option)
    pointBuriedGel('922602100897', '资质大全-搜索', 'qualificationSearch')
    window.open(`#/qualificationsDetail?id=${option['data-code']}&isSeparate=1&nosearch=1`)
  }

  const handleChange = () => {
    setSpinning(true)
    getHotData()
  }

  const handleClick = (code) => {
    window.open(`#/qualificationsDetail?id=${code}&isSeparate=1&nosearch=1`)
  }

  const handleSearchBtn = () => {
    if (!value) return
    pointBuriedGel('922602100897', '资质大全-搜索', 'qualificationSearch')
    window.open(`#/qualificationsDetail?search=${value}&isSeparate=1&nosearch=1`)
  }

  const children = result.map((i) => {
    return (
      <Option
        key={i.name}
        className="option"
        data-code={i.code}
        data-uc-id={`Egn6XjobBEj${i.name}`}
        data-uc-ct="option"
        data-uc-x={i.name}
      >
        <span
          className="optName"
          dangerouslySetInnerHTML={{
            __html: i.nameHighlight || '',
          }}
        ></span>
        <span className="tag">{i.typeInfo || intl('478717', '资质')}</span>
      </Option>
    )
  })
  return (
    <React.Fragment>
      <div className="qualificationIndexContainer">
        <p className="title">{intl('364555', '资质大全')}</p>
        <div className="searchBox">
          <AutoComplete
            className="searchInput"
            onSearch={(value) => {
              setValue(value)
              handleSearch(value)
            }}
            // placeholder={intl('', '搜索企业或资质许可名称')}
            dataSource={children}
            onSelect={handleSelect}
            data-uc-id="9vNiEMHQk"
            data-uc-ct="autocomplete"
          >
            <Input
              className="search_input"
              style={{
                height: '50px',
                fontSize: '18px',
                boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.10)',
              }}
              placeholder={intl('364556', '搜索资质许可名称')}
              data-uc-id="9hEcFDHDsm"
              data-uc-ct="input"
            />
            {/* {children} */}
          </AutoComplete>
          {/* <Input className="searchInput" placeholder={intl('', '搜索企业或资质许可名称')} /> */}
          <Button size="default" onClick={handleSearchBtn} type="primary" data-uc-id="-8Vp8iHW0i" data-uc-ct="button">
            {intl('121124', '搜一下')}
          </Button>
        </div>
        {hot_data ? (
          <div className="hotBox">
            <Row
              className="hotBox_title"
              style={{
                margin: '12px 0',
              }}
            >
              {/* <img src={hot} style={{
                            verticalAlign: 'middle',
                            width:'18px',
                            height:'18px'
                        }} />  */}
              <span className="hot_Group">{intl('364554', '热门资质许可')}</span>

              <a className="change" onClick={handleChange} data-uc-id="KoOBBRn97s" data-uc-ct="a">
                {intl('437752', '换一换')} <SynO data-uc-id="aQY_4DwND6" data-uc-ct="syno" />
              </a>
            </Row>
            <Spin spinning={spinning}>
              <Row gutter={40}>
                {hot_data.map((i) => (
                  <Col span={8}>
                    <Card
                      title={i.name || '--'}
                      styleType="block"
                      extra={
                        <span>
                          <a>
                            {wftCommon.formatMoney(i.total, [4, ' ']) || '--'}{' '}
                            {window.en_access_config ? '' : intl('149186', '条')}
                            <RightO data-uc-id="12S0WO5JA9" data-uc-ct="righto" />
                          </a>{' '}
                        </span>
                      }
                      className="card"
                      onClick={() => handleClick(i.code)}
                    >
                      <p className="Certification">
                        <b>{intl('216395', '发证机关')}</b>: {i.licenceAuthority || '--'}
                        <span></span>
                      </p>
                      <p className="introduction" title={i.introduction || '--'}>
                        <b>{intl('364557', '许可简介')}</b>: <span>{i.introduction || '--'}</span>
                      </p>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Spin>
            <div className="all-fetures">
              <a
                onClick={() =>
                  window.open(
                    getUrlByLinkModule(LinksModule.QUALIFICATION_DETAIL, {
                      id: '62884',
                      params: {
                        isSeparate: '1',
                        nosearch: '1',
                      },
                    })
                  )
                }
                data-uc-id="uVX6zKpjq8"
                data-uc-ct="a"
              >
                {intl('415793', '查看全部资质').replace('%', numberFormat(records, true))}
              </a>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    findCustomer: state.findCustomer,
    userPackageinfo: state.home.userPackageinfo,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    resetData: () => {
      dispatch({ type: 'RESET' })
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(QualificationsIndex)
