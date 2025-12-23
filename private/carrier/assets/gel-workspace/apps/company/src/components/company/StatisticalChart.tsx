import { WCBChart } from '@wind/chart-builder'
import { Tabs } from '@wind/wind-ui'
import React, { useEffect, useState } from 'react'
import { getCorpModuleInfo, myWfcAjax } from '../../api/companyApi'
import intl, { translateComplexHtmlData } from '../../utils/intl'

const TabPane = Tabs.TabPane

function StatisticalChart(props) {
  const { companyRegDate, companycode, type } = props

  // 商标
  const [trademarkClassify, setTrademarkClassify] = useState([])
  const [trademarkStatus, setTrademarkStatus] = useState([])
  const [tcOption, setTcOption] = useState({})
  const [tsOption, setTsOption] = useState({})

  // 专利
  const [patentTypeDetail, setPatentTypeDetail] = useState([])
  const [statusDetail, setStatusDetail] = useState([])
  const [patentTypeDetailOption, setPatentTypeDetailOption] = useState({})
  const [statusDetailOption, setStatusDetailOption] = useState([])

  useEffect(() => {
    let param = {
      companycode: companycode,
      year: companyRegDate,
    }
    if (type === 'brand') {
      getCorpModuleInfo('gettrademarkstatistics', param).then((res) => {
        if (res && Number(res.ErrorCode) == 0 && res.Data) {
          Object.entries(res.Data).map(([key, value]) => {
            translateComplexHtmlData(value)
              .then((result) => {
                // @ts-expect-error
                if (key === 'aggs_trademark_classify') setTrademarkClassify(result)
                // @ts-expect-error
                if (key === 'aggs_trademark_status') setTrademarkStatus(result)
              })
              .catch((e) => {
                console.error(e)
              })
          })
        }
      })
    } else {
      myWfcAjax(`detail/company/patentStatisticalChart/${companycode}`, param)
        .then((res) => {
          if (!res || Number(res.ErrorCode) != 0 || !res.Data) {
            return
          }
          let result = res.Data

          result.agg_patentType &&
            translateComplexHtmlData(result.agg_patentType).then((result) => setPatentTypeDetail(result))
          result.agg_lawStatusCode &&
            translateComplexHtmlData(result.agg_lawStatusCode).then((result) => setStatusDetail(result))
        })
        .catch(console.error)
    }
  }, [])

  useEffect(() => {
    setTcOption(getPieOption(trademarkClassify, intl('232556', '商标分类分布'), 'keyName'))
  }, [trademarkClassify])

  useEffect(() => {
    setTsOption(getPieOption(trademarkStatus, intl('232557', '商标状态分布'), 'keyName'))
  }, [trademarkStatus])

  useEffect(() => {
    setPatentTypeDetailOption(getPieOption(patentTypeDetail, intl('232559', '专利类型分布'), 'key'))
  }, [patentTypeDetail])

  useEffect(() => {
    // @ts-expect-error
    setStatusDetailOption(getPieOption(statusDetail, intl('232560', '专利状态分布'), 'key'))
  }, [statusDetail])

  const getPieOption = (list, name, key) => {
    let data = []
    list.forEach((item) => {
      let obj = {}
      obj[item[key]] = String(item.doc_count)
      obj['isObs'] = false
      data.push(obj)
    })
    return {
      chart: {
        categoryAxisDataType: 'category',
      },
      config: {
        layoutConfig: {
          isSingleSeries: true,
        },
        legend: {
          show: name == intl('232556', '商标分类分布') || name == intl('232559', '专利类型分布') ? false : true,
        },
      },
      indicators: [
        {
          meta: {
            type: 'pie',
            name: name,
            unit: '%',
          },
          data: data,
        },
      ],
    }
  }

  const callback1 = (key) => {
    console.log(key)
  }

  const callback2 = (key) => {
    console.log(key)
  }

  if (type === 'brand') {
    return (
      <div>
        <Tabs defaultActiveKey="2" onChange={callback1} data-uc-id="4kXDI3Ngx" data-uc-ct="tabs">
          <TabPane tab={intl('232556', '商标分类分布')} key="2" data-uc-id="AynOJ5O8OP" data-uc-ct="tabpane">
            <div style={{ height: 500 }}>
              {tcOption ? <WCBChart waterMark={false} data={tcOption} /> : <div>{intl('132725', '暂无数据')}</div>}
            </div>
          </TabPane>

          <TabPane tab={intl('232557', '商标状态分布')} key="3" data-uc-id="ywkB7hQpA9" data-uc-ct="tabpane">
            <div style={{ height: 500 }}>
              {tsOption ? <WCBChart waterMark={false} data={tsOption} /> : <div>{intl('132725', '暂无数据')}</div>}
            </div>
          </TabPane>
        </Tabs>
      </div>
    )
  } else {
    return (
      <div>
        <Tabs defaultActiveKey="2" onChange={callback2} data-uc-id="wYUk_WK9zo" data-uc-ct="tabs">
          <TabPane tab={intl('232559', '专利类型分布')} key="2" data-uc-id="GocHjP3v8K" data-uc-ct="tabpane">
            <div style={{ height: 500 }}>
              {patentTypeDetailOption ? (
                <WCBChart waterMark={false} data={patentTypeDetailOption} />
              ) : (
                <div>{intl('132725', '暂无数据')}</div>
              )}
            </div>
          </TabPane>

          <TabPane tab={intl('232560', '专利状态分布')} key="3" data-uc-id="0Tz1uPwSpZ" data-uc-ct="tabpane">
            <div style={{ height: 500 }}>
              {statusDetailOption ? (
                <WCBChart waterMark={false} data={statusDetailOption} />
              ) : (
                <div>{intl('132725', '暂无数据')}</div>
              )}
            </div>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default StatisticalChart
