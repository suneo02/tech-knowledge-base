import { WCBChart } from '@wind/chart-builder'
import { Tabs } from '@wind/wind-ui'
import React, { useEffect, useState, Suspense, lazy } from 'react'
import type { CorpDetailModuleWithChildrenCfg } from '@/types/corpDetail'
import { getCorpModuleInfo, myWfcAjax } from '../../api/companyApi'
import intl, { translateComplexHtmlData } from '../../utils/intl'
const ProductWordsCloud = lazy(() =>
  import('../../components/company/buss/bid').then((m) => ({ default: m.ProductWordsCloud }))
)
const RegionDistribution = lazy(() =>
  import('../../components/company/buss/bid').then((m) => ({ default: m.RegionDistribution }))
)
const WinAmountChartWithControls = lazy(() =>
  import('../../components/company/buss/bid').then((m) => ({ default: m.WinAmountChartWithControls }))
)
const WinCountChartWithControls = lazy(() =>
  import('../../components/company/buss/bid').then((m) => ({ default: m.WinCountChartWithControls }))
)
import { StatisticalChartType } from './type/statisticalChart'
import { createRequest } from '@/api/request'
import './StatisticalChart.module.less'

const TabPane = Tabs.TabPane

// 时间区间类型
type IntervalType = 'month' | 'quarter' | 'year'
// 招投标相关接口类型定义
interface TenderTrendData {
  startTime: string // 统计区间开始时间
  interval: IntervalType
  bidCount: number // 中标次数
  notBidCount: number // 未中标次数
  totalMoney: number // 中标总金额
}
interface TenderMoneyData {
  startTime: string // 统计区间开始时间
  interval: IntervalType
  maxMoney: number // 最高中标金额
  minMoney: number // 最低中标金额
  midMoney: number // 中标金额中位数
  lowQuarterMoney: number // 下四分之一位数
  highQuarterMoney: number // 上四分之一位数
}

interface TenderSubjectData {
  subject: string // 标的物名称
  count: string // 中标项目个数
}

interface TenderAreaData {
  areaCode: string // 地区代码
  bidCount: string // 该地区中标项目个数
}

// 地区选项数据 - 用于地区分布图表的地区选择
const areaOptions = [
  { code: '110000', name: '北京市' },
  { code: '120000', name: '天津市' },
  { code: '130000', name: '河北省' },
  { code: '310000', name: '上海市' },
  { code: '320000', name: '江苏省' },
  { code: '330000', name: '浙江省' },
  { code: '440000', name: '广东省' },
  { code: '450000', name: '广西壮族自治区' },
  { code: '460000', name: '海南省' },
]

function StatisticalChart({
  companyRegDate,
  companycode,
  type,
  eachTable,
}: {
  companyRegDate: string
  companycode: string
  type: StatisticalChartType
  eachTable?: CorpDetailModuleWithChildrenCfg
}) {
  // 商标
  const [trademarkClassify, setTrademarkClassify] = useState([])
  const [trademarkStatus, setTrademarkStatus] = useState([])
  const [tcOption, setTcOption] = useState<any>(null)
  const [tsOption, setTsOption] = useState<any>(null)

  // 专利
  const [patentTypeDetail, setPatentTypeDetail] = useState([])
  const [statusDetail, setStatusDetail] = useState([])
  const [patentTypeDetailOption, setPatentTypeDetailOption] = useState<any>(null)
  const [statusDetailOption, setStatusDetailOption] = useState<any>(null)

  // 招投标数据状态
  const [tenderTrendData, setTenderTrendData] = useState<TenderTrendData[]>([])
  const [tenderMoneyData, setTenderMoneyData] = useState<TenderMoneyData[]>([])
  const [tenderSubjectData, setTenderSubjectData] = useState<TenderSubjectData[]>([])
  const [tenderAreaData, setTenderAreaData] = useState<TenderAreaData[]>([])
  const [tenderLoading, setTenderLoading] = useState(false)
  const [tenderTrendLoading, setTenderTrendLoading] = useState(false)
  const [tenderMoneyLoading, setTenderMoneyLoading] = useState(false)
  const [currentFrequency, setCurrentFrequency] = useState<'month' | 'quarter' | 'year'>('month')

  /**
   * 初始化数据 - 根据组件类型获取对应的统计数据
   */
  const initData = () => {
    let param = {
      companycode: companycode,
      year: companyRegDate,
    }
    switch (type) {
      case StatisticalChartType.brand:
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
        break
      case StatisticalChartType.patent:
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
        break
      case StatisticalChartType.tid:
        // 招投标数据初始化
        fetchTenderData()
        break
    }
  }

  /**
   * 创建招投标相关的请求函数
   * 配置了自动添加 companycode 参数
   */
  const tenderRequest = createRequest({
    noExtra: false, // 不禁用额外参数，这样会自动添加 companycode
    id: companycode, // 设置默认的 ID 参数
  })

  // 获取招投标数据（完整数据，用于初始化）
  const fetchTenderData = async () => {
    if (!companycode) return

    setTenderLoading(true)
    try {
      // 并行请求所有招投标数据
      const [trendRes, moneyRes, subjectRes, areaRes] = await Promise.all([
        // 趋势分析
        tenderRequest('detail/company/tenderTrendAnalyseCompany', {
          params: {
            interval: currentFrequency,
          },
        }),
        // 金额分析
        tenderRequest('detail/company/tenderMoneyAnalyseCompany', {
          params: {
            interval: currentFrequency,
          },
        }),
        // 标的物分析，直接调产品词接口
        tenderRequest('detail/company/tenderSubjectAnalyseCompany'),
        // 地区分析
        tenderRequest('detail/company/tenderAreaAnalyseCompany'),
      ])

      // 处理趋势分析数据
      if (trendRes && Number(trendRes.ErrorCode) === 0 && trendRes.Data) {
        setTenderTrendData(trendRes.Data)
      }

      // 处理金额分析数据
      if (moneyRes && Number(moneyRes.ErrorCode) === 0 && moneyRes.Data) {
        setTenderMoneyData(moneyRes.Data)
      }

      // 处理标的物分析数据
      if (subjectRes && Number(subjectRes.ErrorCode) === 0 && subjectRes.Data) {
        setTenderSubjectData(subjectRes.Data)
      }

      // 处理地区分布数据
      if (areaRes && Number(areaRes.ErrorCode) === 0 && areaRes.Data) {
        setTenderAreaData(areaRes.Data)
      }
    } catch (error) {
      console.error('获取招投标数据失败:', error)
    } finally {
      setTenderLoading(false)
    }
  }

  // 获取趋势分析数据（仅时间相关数据）
  const fetchTenderTrendData = async (frequency?: IntervalType) => {
    if (!companycode) return

    // 使用传入的frequency参数，如果没有则使用currentFrequency状态
    const interval = frequency || currentFrequency

    setTenderTrendLoading(true)
    try {
      const trendRes = await tenderRequest('detail/company/tenderTrendAnalyseCompany', {
        params: {
          interval: interval,
        },
      })

      if (trendRes && Number(trendRes.ErrorCode) === 0 && trendRes.Data) {
        setTenderTrendData(trendRes.Data)
      } else {
        console.warn('趋势分析数据获取失败:', trendRes?.ErrorCode || '未知错误')
      }
    } catch (error) {
      console.error('获取趋势分析数据失败:', error)
      // 可以在这里添加用户友好的错误提示
    } finally {
      setTenderTrendLoading(false)
    }
  }

  // 获取金额分析数据（仅时间相关数据）
  const fetchTenderMoneyData = async (frequency?: IntervalType) => {
    if (!companycode) return

    // 使用传入的frequency参数，如果没有则使用currentFrequency状态
    const interval = frequency || currentFrequency

    setTenderMoneyLoading(true)
    try {
      const moneyRes = await tenderRequest('detail/company/tenderMoneyAnalyseCompany', {
        params: {
          interval: interval,
        },
      })

      if (moneyRes && Number(moneyRes.ErrorCode) === 0 && moneyRes.Data) {
        setTenderMoneyData(moneyRes.Data)
      } else {
        console.warn('金额分析数据获取失败:', moneyRes?.ErrorCode || '未知错误')
      }
    } catch (error) {
      console.error('获取金额分析数据失败:', error)
      // 可以在这里添加用户友好的错误提示
    } finally {
      setTenderMoneyLoading(false)
    }
  }

  // 处理频率切换
  const handleFrequencyChange = (frequency: IntervalType) => {
    if (type === StatisticalChartType.tid) {
      // 只更新需要时间频率的数据，标的物和地区分布保持不变
      fetchTenderTrendData(frequency)
      fetchTenderMoneyData(frequency)
    }
    setCurrentFrequency(frequency)
  }

  // 处理导出
  const handleExport = () => {
    // TODO: 实现导出逻辑
    console.log('导出图表')
  }

  // 处理词条选择
  const handleWordSelect = (word: string) => {
    console.log('选中词条:', word)
    // TODO: 实现词条筛选逻辑
  }

  // 处理地区选择
  const handleRegionSelect = (regionCode: string, regionName: string) => {
    console.log('选中地区:', regionCode, regionName)
    // TODO: 实现地区筛选逻辑
  }

  useEffect(() => {
    initData()
  }, [])

  useEffect(() => {
    if (trademarkClassify && trademarkClassify.length > 0) {
      setTcOption(getPieOption(trademarkClassify, intl('232556', '商标分类分布'), 'keyName'))
    } else {
      setTcOption(null)
    }
  }, [trademarkClassify])

  useEffect(() => {
    if (trademarkStatus && trademarkStatus.length > 0) {
      setTsOption(getPieOption(trademarkStatus, intl('232557', '商标状态分布'), 'keyName'))
    } else {
      setTsOption(null)
    }
  }, [trademarkStatus])

  useEffect(() => {
    if (patentTypeDetail && patentTypeDetail.length > 0) {
      setPatentTypeDetailOption(getPieOption(patentTypeDetail, intl('232559', '专利类型分布'), 'key'))
    } else {
      setPatentTypeDetailOption(null)
    }
  }, [patentTypeDetail])

  useEffect(() => {
    if (statusDetail && statusDetail.length > 0) {
      setStatusDetailOption(getPieOption(statusDetail, intl('232560', '专利状态分布'), 'key'))
    } else {
      setStatusDetailOption(null)
    }
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

  switch (type) {
    // 商标
    case StatisticalChartType.brand:
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
    case StatisticalChartType.patent:
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

    case StatisticalChartType.tid:
      // 投标
      return (
        <Suspense fallback={<div></div>}>
          <Tabs defaultActiveKey="1" onChange={callback1} data-uc-id="4kXDI3Ngx" data-uc-ct="tabs">
            <TabPane tab={intl('', '本机构中标分析')} key="0" disabled></TabPane>
            <TabPane tab={intl('', '趋势分析')} key="1">
              <WinCountChartWithControls
                data={tenderTrendData}
                onIntervalChange={handleFrequencyChange}
                onExport={handleExport}
                loading={tenderTrendLoading}
              />
            </TabPane>
            <TabPane tab={intl('', '金额分析')} key="2">
              <WinAmountChartWithControls
                data={tenderMoneyData}
                onIntervalChange={handleFrequencyChange}
                onExport={handleExport}
                loading={tenderMoneyLoading}
              />
            </TabPane>

            <TabPane tab={intl('', '标的物分析')} key="3">
              <ProductWordsCloud
                data={{
                  words: tenderSubjectData.map((item) => ({
                    subject: item.subject,
                    count: parseInt(item.count),
                  })),
                }}
                onSelectWord={handleWordSelect}
                targetCoverage={0.85}
                minWords={30}
                maxWords={120}
                loading={tenderLoading}
              />
            </TabPane>

            <TabPane tab={intl('216301', '地区分布')} key="4">
              <RegionDistribution
                data={{
                  mapData: tenderAreaData.map((item) => ({
                    regionCode: item.areaCode,
                    regionName: item.areaCode, // TODO: 需要地区代码到名称的映射
                    count: parseInt(item.bidCount),
                    amount: 0, // TODO: 接口中没有金额数据
                    winCount: parseInt(item.bidCount),
                  })),
                  topList: tenderAreaData
                    .sort((a, b) => parseInt(b.bidCount) - parseInt(a.bidCount))
                    .slice(0, 10)
                    .map((item) => ({
                      regionCode: item.areaCode,
                      regionName: item.areaCode, // TODO: 需要地区代码到名称的映射
                      count: parseInt(item.bidCount),
                      amount: 0, // TODO: 接口中没有金额数据
                      winCount: parseInt(item.bidCount),
                    })),
                }}
                areaOptions={areaOptions}
                onSelectRegion={handleRegionSelect}
                loading={tenderLoading}
              />
            </TabPane>
          </Tabs>
        </Suspense>
      )
  }
}

export default StatisticalChart
