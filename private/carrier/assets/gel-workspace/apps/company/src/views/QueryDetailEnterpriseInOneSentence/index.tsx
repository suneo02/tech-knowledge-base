import { getIndicator, pointBuriedGel } from '@/api/configApi'
import { parseQueryString } from '@/lib/utils'
import { wftCommon } from '@/utils/utils'
import { Breadcrumb, message, Resizer } from '@wind/wind-ui'
import { ColumnProps } from '@wind/wind-ui-table'
import { BaseAlign } from '@wind/wind-ui-table/lib/foundation/foundation'
import dayjs from 'dayjs'
import { t } from 'gel-util/intl'
import { generateUrlByModule, LinkModule } from 'gel-util/link'
import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import * as FindCustomerActions from '../../actions/findCustomer'
import { getCustomerSubList, measureSearchFuse } from '../../api/findCustomer.ts'
import TreeTransfer from '../../components/filterOptions/TreeTransfer'
import { MyIcon } from '../../components/Icon'
import LimitNotice from '../../components/LimitNotice'
import { connectZustand } from '../../store'
import { useConditionFilterStore } from '../../store/cde/useConditionFilterStore.tsx'
import Chat from './chat'
import './index.less'
import { useExport } from './useExportHooks'

export function getColumnsWidth(key) {
  const defaultWidth = {
    'No.': 50, //序号
    corp_name: 300, //企业名称
    credit_code: 240, //统一社会信用代码
    region: 160, //地区
    industry_gb: 160, //行业大类
    industry_code: 160, //行业小类
    artificial_person: 100, //法人
    govlevel: 100, //政府级别
    established_time: 130, //成立时间
    register_capital: 160, //注册资本
    capital_unit: 120, //注册资本单位
    register_address: 300, //注册地址
    office_address: 300, //办公地址
    tel: 160, //电话
    mail: 240, //邮箱
    biz_scope: 300, //经营范围
    brief: 300, //简介
    corporation_tags: 160, //企业标签
    corp_classify: 160, //企业分类
    eng_name: 240, //英文名称
    oper_period_end: 240, //营业期限至
    endowment_num: 100, //参保人数
    ent_scale_num_indicator: 100, //企业规模
    patent_num: 100, //专利数
    trademark_num: 100, //商标数
  }
  return defaultWidth[key] || 400
}

export const COLUMNS_RENDER = {
  established_time: (text) => {
    return text ? dayjs(text).format('YYYY-MM-DD') : ''
  },
  oper_period_end: (text, record) => {
    if (!record || !(record instanceof Object)) {
      return ''
    }
    const start =
      record.oper_period_begin || record.established_time
        ? dayjs(record.oper_period_begin || record.established_time).format('YYYY-MM-DD')
        : '--'
    const end = record.oper_period_end
      ? dayjs(record.oper_period_end).format('YYYY-MM-DD') == '9999-99-99'
        ? t('271247', '无固定期限')
        : dayjs(record.oper_period_end).format('YYYY-MM-DD')
      : t('271247', '无固定期限')
    return `${start} ~ ${end}`
  },
}

function QueryDetailEnterpriseInOneSentence(props: any) {
  const [data, setData] = useState([])
  const [translateData, setTranslateData] = useState([])
  const [total, setTotal] = useState(0)
  const [indicators, setIndicators] = useState([
    'credit_code',
    'govlevel',
    'established_time',
    'oper_period_end',
    'register_capital',
    'artificial_person',
    'region',
    'register_address',
    'industry_gb_1',
    'industry_gb_2',
    'industry_gb',
    'tel',
  ])
  const [AllIndicators, setAllIndicators] = useState([])
  const [compIds, setCompIds] = useState([]) // 企业名单列表
  const [transferVisible, setTransferVisible] = useState(false)
  const [subscribeVisible, setSubscribeVisible] = useState(false) //订阅
  const [subInfo, setSubInfo] = useState(undefined)
  const [pageNo, setPageNo] = useState(1)
  const [width, setWidth] = useState(400)
  const [sql, setSql] = useState('')
  const [loading, setLoading] = useState(false)
  const { exportFile, limitNoticeVisible, changeLimitNoticeVisible } = useExport()
  const history = useHistory()

  const pageSize = 20

  const handleResize = (e, { deltaX }) => {
    setWidth(width + deltaX)
  }

  const changeSubscribeVisible = () => {
    setSubscribeVisible(!subscribeVisible)
  }

  //添加模拟数据
  useEffect(() => {
    props.getIndicator()
    const qsParam = parseQueryString()
  }, [])

  useEffect(() => {
    if (!props.filterRes.indicators) return
    setAllIndicators(props.filterRes.indicators)
  }, [props.filterRes.indicators])

  const changeTransferVisible = () => {
    setTransferVisible(!transferVisible)
  }

  const clean = () => {
    setCompIds([])
    setPageNo(1)
    setData([])
    setTotal(0)
  }

  useEffect(() => {
    wftCommon.zh2en(data, (newData) => {
      setTranslateData(newData)
    })
  }, [data])

  // 获取企业id
  const getCropInfo = (data: string[]) => {
    if (!data || data.length === 0) {
      return
    }
    const ids = data.slice(0, pageSize)
    const measureIds = [
      { field: 'corp_id', title: t('455039', '企业id') },
      { field: 'corp_name', title: t('138677', '企业名称') },
    ]
    indicators.forEach((item) => {
      measureIds.push({
        field: item,
        title: AllIndicators.find((i) => i.indicator === item)?.name,
      })
    })
    setLoading(true)
    //获取数据
    props
      .measureSearch({ ids: ids, measures: measureIds, pageNum: 0 })
      .then((res) => {
        setCompIds(data)
        setPageNo(1)
        setData(res.Data)
        setTotal(data.length)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  // 分页
  const onPageChange = (page: number) => {
    const ids = compIds.slice((page - 1) * pageSize, page * pageSize)

    const measureIds = [
      { field: 'corp_id', title: t('455039', '企业id') },
      { field: 'corp_name', title: t('138677', '企业名称') },
    ]
    indicators.forEach((item) => {
      measureIds.push({
        field: item,
        title: AllIndicators.find((i) => i.indicator === item)?.name,
      })
    })
    setLoading(true)
    props
      .measureSearch({ ids: ids, measures: measureIds })
      .then((res) => {
        setData(res.Data)
        setPageNo(page)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const columns: ColumnProps<any>[] = useMemo(() => {
    const fixedColumns = [
      {
        title: <p>{t('441914', '序号')}</p>,
        width: getColumnsWidth('No.'),
        dataIndex: 'No.',
        fixed: 'left' as const,
        render: (text, record, index) => {
          return (pageNo - 1) * pageSize + index + 1
        },
      },
      {
        title: <p>{t('32914', '公司名称')}</p>,
        width: getColumnsWidth('corp_name'),
        dataIndex: 'corp_name',
        fixed: 'left' as const,
        render: (text, record) => (
          <a
            onClick={() => {
              pointBuriedGel('922602100841', '数据浏览器', 'cdeGotoF9')
              record.corp_id && wftCommon.linkCompany('Bu3', record.corp_id)
            }}
            rel="noreferrer"
            data-uc-id="NbN49L70dD"
            data-uc-ct="a"
          >
            {text}
          </a>
        ),
      },
    ]
    const columns = indicators
      .filter((item) => AllIndicators.find((i) => i.indicator === item))
      .map((item) => {
        const target = AllIndicators.find((i) => i.indicator === item)
        return {
          title: <p>{target.name}</p>,
          width: getColumnsWidth(target.indicator),
          dataIndex: target.indicator,
          align: (target.indicator === 'register_capital' ? 'right' : 'left') as BaseAlign,
          render: (text, record) => {
            return COLUMNS_RENDER[target.indicator] ? COLUMNS_RENDER[target.indicator](text, record) : text || '--'
          },
        }
      })
    return [...fixedColumns, ...columns]
  }, [indicators, AllIndicators, pageNo])

  // 新增列指标
  const changeIndicators = (e) => {
    const ids = compIds.slice((pageNo - 1) * pageSize, pageNo * pageSize)
    const measureIds = [
      { field: 'corp_id', title: t('455039', '企业id') },
      { field: 'corp_name', title: t('138677', '企业名称') },
    ]
    e.forEach((item) => {
      measureIds.push({
        field: item,
        title: AllIndicators.find((i) => i.indicator === item)?.name,
      })
    })

    setLoading(true)
    props
      .measureSearch({ ids: ids, measures: measureIds, pageNum: 0 })
      .then((res) => {
        setData(res.Data)
        setIndicators(e)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const pageProps = {
    current: pageNo,
    pageSize: pageSize,
    total: total > 5000 ? 5000 : total,
    onChange: onPageChange,
    hideOnSinglePage: false,
    showSizeChanger: false,
    showQuickJumper: true,
  }

  return (
    <React.Fragment>
      <div className="breadcrumb-box">
        <Breadcrumb data-uc-id="QOvQaMnBPa" data-uc-ct="breadcrumb">
          <Breadcrumb.Item
            style={{ cursor: 'pointer' }}
            onClick={() => {
              wftCommon.jumpJqueryPage('SearchHome.html')
            }}
            data-uc-id="XpQv4sqNQh"
            data-uc-ct="breadcrumb"
          >
            {t('19475', '首页')}{' '}
          </Breadcrumb.Item>
          <Breadcrumb.Item
            style={{ cursor: 'pointer' }}
            onClick={() => {
              // history.push('/queryEnterpriseInOneSentence')
              const url = generateUrlByModule({ module: LinkModule.SUPER })
              window.open(url, '_blank')
            }}
            data-uc-id="6VuRAoQ1Cf"
            data-uc-ct="breadcrumb"
          >
            {t('464234', '一句话找企业')}
          </Breadcrumb.Item>
          <Breadcrumb.Item data-uc-id="irXpRcLIUN" data-uc-ct="breadcrumb">
            {window.en_access_config ? 'Results' : t('419809', '结果列表')}
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="home-filter-res">
        <div className="main-container filterRes">
          <div className="chat-box" style={{ width: width }}>
            <Chat getCropInfo={getCropInfo} clean={clean} />
          </div>
          <Resizer unfoldedSize={280} onResize={handleResize} data-uc-id="aNZv33ka9c" data-uc-ct="resizer" />
          <div className="page-container">
            <div className="tools" style={{ display: 'flex' }}>
              <div className="tools-first"></div>
              <div>
                {!wftCommon.is_overseas_config && (
                  <button
                    disabled={data && data.length === 0}
                    style={{
                      border: 'none',
                      background: 'none',
                      padding: '0 20px 0 12px',
                      cursor: 'pointer',
                      borderRight: '1px solid #999',
                    }}
                    onClick={changeLimitNoticeVisible}
                    data-uc-id="4QmzluZyFQ"
                    data-uc-ct="button"
                  >
                    <MyIcon name="save" /> {t('227063', '导出数据')}
                  </button>
                )}
                {/* <a className="grey-border" onClick={changeTransferVisible}> */}
                <a onClick={changeTransferVisible} data-uc-id="lzTIYYS1Ee" data-uc-ct="a">
                  <MyIcon name="addColumn" /> {t('257742', '新增列指标')}
                </a>
              </div>
            </div>
            <div className="table-container">
              {/* <Table
                size="small"
                rowKey="corp_id"
                columns={columns}
                dataSource={translateData && translateData.length > 0 ? translateData : data}
                pagination={pageProps}
                loading={loading}
                data-uc-id="DnCRhbCf2G"
                data-uc-ct="table"
              /> */}
            </div>
          </div>
          {/* 下载超限提醒 */}
          <LimitNotice
            visible={limitNoticeVisible}
            changeVisible={changeLimitNoticeVisible}
            postFn={(from, size, to, total) => {
              const measureIds = [
                { field: 'corp_id', title: t('455039', '企业id') },
                { field: 'corp_name', title: t('138677', '企业名称') },
              ]
              indicators.forEach((item) => {
                measureIds.push({
                  field: item,
                  title: AllIndicators.find((i) => i.indicator === item)?.name,
                })
              })
              if (Math.ceil(total / pageSize) < to) {
                message.warn(t('455040', '导出页码输入超出上限，请调整页码'))
                return
              }
              exportFile(from, size, to, total, compIds.slice((from - 1) * pageSize, to * pageSize), measureIds, false)
            }}
            total={total}
          />
        </div>
      </div>
      {transferVisible && (
        <TreeTransfer
          visible={transferVisible}
          changeVisible={changeTransferVisible}
          dataSource={AllIndicators}
          targetKeys={indicators}
          onChange={changeIndicators}
          data-uc-id="-tEBMBkycpv"
          data-uc-ct="treetransfer"
        />
      )}
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    filterRes: state.filterRes,
    config: state.config,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getIndicator: (data) => {
      return getIndicator(data).then((res) => {
        dispatch(FindCustomerActions.getIndicator({ ...res, ...data }))
        return res.data
      })
    },
    getMySusById: (data) => {
      return getCustomerSubList(data).then((res) => {
        // dispatch(FindCustomerActions.getMySusList({ ...res, ...data }))
        return res
      })
    },
    measureSearch: (data) => {
      return measureSearchFuse(data).then((res) => {
        dispatch(FindCustomerActions.measureSearch({ ...res, ...data }))
        return res
      })
    },
  }
}

export default connectZustand(useConditionFilterStore, (state) => ({}))(
  connect(mapStateToProps, mapDispatchToProps)(QueryDetailEnterpriseInOneSentence)
)
