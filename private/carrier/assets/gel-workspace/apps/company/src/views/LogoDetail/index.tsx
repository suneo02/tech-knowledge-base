import { getUrlByLinkModule, LinksModule } from '@/handle/link'
import { Card, Steps } from '@wind/wind-ui'
import { StepsProps } from '@wind/wind-ui/lib/steps'
import { BrandDetail } from 'gel-api'
import { TagsModule, TagWithModule } from 'gel-ui'
import { formatText } from 'gel-util/format'
import { isEn } from 'gel-util/intl'
import queryString from 'qs'
import { useEffect, useMemo, useState } from 'react'
import { pointBuriedGel } from '../../api/configApi'
import { geLogoDetail } from '../../api/singleDetail'
import placeHolderPic from '../../assets/imgs/logo/other.png'
import Tables from '../../components/detail/table'
import { usePageTitle } from '../../handle/siteTitle'
import intl, { translateToEnglish } from '../../utils/intl'
import { wftCommon } from '../../utils/utils'
import './index.less'
import { getLogoDetailRows } from './rows'

const Step = Steps.Step
const StylePrefix = 'logo-detail'
const LogoDetail = () => {
  const [dataRaw, setDataRaw] = useState<{ info: Partial<BrandDetail> }>({
    info: {},
  })
  const [data, setData] = useState<{ info: Partial<BrandDetail> }>({
    info: {},
  })

  useEffect(() => {
    if (isEn()) {
      translateToEnglish(dataRaw.info, {
        skipFields: ['brand_agent_org', 'applicant_chinese_name'],
      })
        .then((res) => {
          setData({ info: res.data })
        })
        .catch(() => {
          setData(dataRaw)
        })
    } else {
      setData(dataRaw)
    }
  }, [dataRaw])
  usePageTitle('TrademarkDetail', data?.info?.brand_name)
  const [loading, setLoading] = useState(true)

  const breadCrumb = (
    <div className="bread-crumb">
      <div className="bread-crumb-content">
        <span
          className="last-rank"
          onClick={() => window.open(getUrlByLinkModule(LinksModule.HOME))}
          data-uc-id="hbw3hftL_M"
          data-uc-ct="span"
        >
          {intl('19475', '首页')}
        </span>
        <i></i>
        <span>{intl('138799', '商标')}</span>
      </div>
    </div>
  )

  const rows = getLogoDetailRows(data.info)

  useEffect(() => {
    let location = window.location
    let params = queryString.parse(location.search, {
      ignoreQueryPrefix: true,
    })
    setLoading(true)
    geLogoDetail({
      detailid: params['detailid'],
    })
      .then((res) => {
        if (res && Number(res.ErrorCode) === 0) {
          setDataRaw({
            info: res.Data || {},
          })
        }
      })
      .finally(() => {
        setLoading(false)
      })
    pointBuriedGel('922602100851', '商标', 'brandDetail')
  }, [])

  const dotStatus = useMemo<StepsProps['status'][]>(() => {
    var end_time = data.info.special_term?.split('~')[1]
    var today = new Date()
    var y = today.getFullYear().toString()
    var m = today.getMonth() < 10 ? '0' + (today.getMonth() + 1) : today.getMonth()
    var d = today.getDate().toString()
    var date = Number(y + m + d)

    const processState = 'process' // 过程中
    const waitState = 'wait' // 等待中
    const finishState = 'finish' // 已完成

    // 有终止时间
    if (end_time) {
      let end_time_num = Number(end_time.replace(/-/g, ''))
      if (date > end_time_num) {
        return [finishState, finishState, finishState, finishState]
      } else {
        return [finishState, finishState, finishState, processState]
      }
    } else {
      // 有已注册时间
      if (data.info.brand_reg_report_time) {
        return [finishState, finishState, finishState, waitState]
      } else {
        // 有初审公告时间
        if (data.info.brand_audit_report_time) {
          return [finishState, finishState, waitState, waitState]
        } else {
          // 有商标申请时间
          if (data.info.apply_date) {
            return [finishState, waitState, waitState, waitState]
          } else {
            return [waitState, waitState, waitState, waitState]
          }
        }
      }
    }
  }, [data])

  return (
    <div className="logo-detail">
      {breadCrumb}
      <div className="each-div single-module" id="brandDetail">
        <div className="each-module">
          <div className="module-brand-header">
            <div className="module-brand-header-img">
              {data.info.brand_graphic_link ? (
                <img
                  className="logo-pic"
                  width="170"
                  src={wftCommon.addWsidForImg(data.info.brand_graphic_link)}
                  onError={(e) => {
                    const img = e.currentTarget
                    img.src = placeHolderPic
                    img.onerror = null
                  }}
                  alt=""
                  data-uc-id="1WRb8tBFPMg"
                  data-uc-ct="img"
                />
              ) : (
                <img className="logo-pic" width="170" src={placeHolderPic} alt="" />
              )}
            </div>
            <div className="module-brand-header-content">
              <div style={{ marginBottom: '12px' }}>
                <h5 id="header-brand-name">{wftCommon.formatCont(data.info.brand_name)}</h5>
                <TagWithModule module={TagsModule.BRAND_STATE}>{formatText(data.info.brand_state)}</TagWithModule>
              </div>
              <div className="header-brand-message">
                <span>
                  <span>{intl('138660', '申请时间')}</span>：
                  <span id="header-brand-applydate">{wftCommon.formatTime(data.info.apply_date)}</span>
                </span>
                <span className="second-message">
                  <span>{intl('58656', '申请人')}</span>：
                  <span id="header-brand-person">{wftCommon.formatCont(data.info.applicant_chinese_name)}</span>
                </span>
              </div>
              <div className="header-brand-message">
                <span>
                  <span>{intl('138476', '注册号')}</span>：
                  <span id="header-brand-number">{wftCommon.formatCont(data.info.brand_reg_no)}</span>
                </span>
                <span className="second-message">
                  <span>{intl('138349', '国际类别')}</span>：
                  <span id="header-brand-type">{wftCommon.formatCont(data.info.inner_type)}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="each-div logo__steps">
        <Card title={'商标申请进度'} styleType="block">
          {/* @ts-expect-error wind ui */}
          <Steps className={`${StylePrefix}--steps`} size="small" progressDot style={{ margin: '0 120px' }}>
            <Step
              // icon={<span className={currentStep >= 0 ? 'step__icon--finished' : 'step__icon--unfinished'} />}
              status={dotStatus[0]}
              title="商标申请"
              description={data.info.apply_date && wftCommon.formatTime(data.info.apply_date)}
              data-uc-id="b1s8EvVGIR"
              data-uc-ct="step"
            />
            <Step
              // icon={<span className={currentStep >= 1 ? 'step__icon--finished' : 'step__icon--unfinished'} />}
              status={dotStatus[1]}
              title="初审公告"
              description={data.info.brand_audit_report_time && wftCommon.formatTime(data.info.brand_audit_report_time)}
              data-uc-id="KVdaoi-3Ak"
              data-uc-ct="step"
            />
            <Step
              // icon={<span className={currentStep >= 2 ? 'step__icon--finished' : 'step__icon--unfinished'} />}
              status={dotStatus[2]}
              title="已注册"
              description={data.info.brand_reg_report_time && wftCommon.formatTime(data.info.brand_reg_report_time)}
              data-uc-id="NBef1NT4fR"
              data-uc-ct="step"
            />
            <Step
              // icon={<span className={currentStep >= 3 ? 'step__icon--finished' : 'step__icon--unfinished'} />}
              status={dotStatus[3]}
              title="终止"
              description={
                data.info.special_term && wftCommon.formatTime(data.info.special_term?.split('~')[1] || '--')
              }
              data-uc-id="rOq_x5dvF8"
              data-uc-ct="step"
            />
          </Steps>
        </Card>
      </div>
      <div className="each-div">{<Tables info={data} isLoading={loading} rows={rows} />}</div>
    </div>
  )
}

export default LogoDetail
