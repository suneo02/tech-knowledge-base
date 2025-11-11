import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import { AutoComplete, Button, Card, Input, message, Radio } from '@wind/wind-ui'

import { getVipInfo, parseQueryString } from '../lib/utils'
import { debounce, wftCommon } from '../utils/utils'

import './BankingWorkbench.less'

import { FolderO } from '@wind/icons'
import { getCorpHeaderInfo, getCorpInfo, myWfcAjax } from '../api/companyApi'
import CompanyIntroduction from '../components/company/CompanyIntroduction.tsx'
import intl from '../utils/intl'

import * as companyActions from '../actions/company'

import { handleJumpTerminalCompatibleAndCheckPermission } from '@/handle/link/index.ts'
import { generateUrlByModule, LinkModule } from 'gel-util/link'
import { pointBuriedGel } from '../api/configApi'
import { getPreCorpSearchNew } from '../api/homeApi'
import bg07 from '../assets/imgs/bankingWorkbench/bg-report07.png'
import xls from '../assets/imgs/bankingWorkbench/excel.png'
import pdf from '../assets/imgs/bankingWorkbench/pdf.png'

const Option = AutoComplete.Option

//再次封装防抖函数
const debounceSearch = debounce((key, fn) => {
  getPreCorpSearchNew({
    queryText: key,
    hasBid: 1,
    pageSize: 5,
  }).then((res) => {
    return fn(res?.Data?.corplist || [])
  })
}, 300)

function BankingWorkbench(props) {
  const qsParam = parseQueryString()
  const selType = qsParam['selType'] || '' // selType:detail  仅展示detail

  const [value, setValue] = useState('')
  const [result, setResult] = useState([])
  const [companycode, setCompanycode] = useState(qsParam['companycode'] || '1047934153')
  const [companyid, setCompanyid] = useState('')
  const [baseInfo, setBaseInfo] = useState<any>({})

  const [route, setRoute] = useState(selType || 'report')
  const [reportClicked, setReportClicked] = useState(selType ? true : false)

  let url =
    process.env.NODE_ENV === 'production' ? `Company.html?&notoolbar=1` : `?r=${new Date().getTime()}#/?&notoolbar=1`

  if (window.en_access_config) {
    url = url + '&lang=en'
  }

  const [corpUrl, setcorpUrl] = useState('')

  useEffect(() => {
    setcorpUrl(`${url}&companycode=${companycode}`)
    if (selType) return
    props.getCorpHeaderInfo(companycode, (res) => {
      setBaseInfo(res.data)
      !companyid && setCompanyid(res.data.corp_old_id)
    })
  }, [companycode])

  const handleChange = (e) => {
    if (!reportClicked) {
      setReportClicked(true)
    }
    setRoute(e.target.value)
  }

  const handleClickPic = (hash, type) => {
    if (type == 'Shareholder') {
      window.open('ShareholderChart.html?companycode=' + companycode)
    } else if (type == 'ddreport') {
      const url = generateUrlByModule({
        module: LinkModule.CREDIT_RP_PREVIEW,
        params: {
          companyCode: companycode,
        },
      })
      handleJumpTerminalCompatibleAndCheckPermission(url)
    } else {
      window.open('CompanyChart.html?companycode=' + companycode + '#' + hash)
    }
  }

  const downloadReport = (id, onlysvip?) => {
    const userVipInfo = getVipInfo()

    if (onlysvip) {
      if (!userVipInfo.isSvip) {
        message.info('很抱歉，该功能仅SVIP用户可用。')

        return
      }
    } else if (!userVipInfo.isVip) {
      message.info('很抱歉，该功能仅VIP/SVIP用户可用。')
      return
    }

    let downType = 'corp'
    let downTypeName = intl('222467', '企业信用报告')

    const lang = window.en_access_config ? 'en' : 'cn'
    const entityName = window.en_access_config ? baseInfo?.eng_name : baseInfo?.corp_name
    const entityId = companycode
    let noAccessTips: string[] = []
    let noMoreAccessTips: string[] = []
    let downUrl =
      'http://host/Wind.WFC.Enterprise.Web/PC.Front/Company/CompanyRP.html?companycode=' +
      companycode +
      '&from=openBu3&lang=cn&ver=20201023'
    let pdfCmd = ''
    let selVal = ''
    switch (id) {
      case 'share':
        pdfCmd = 'createtrackdoctask'
        selVal = '6'
        downType = 'stocktrack'
        downTypeName = '股东深度穿透报告'
        downUrl = ''
        noAccessTips = [
          '购买SVIP，每年可导出10000家企业的股东深度穿透报告',
          '购买SVIP，每年可导出10000家企业的股东深度穿透报告',
          '购买SVIP，每年可导出10000家企业的股东深度穿透报告',
        ]
        noMoreAccessTips = ['您本年度导出企业股东深度穿透报告的额度已用完。', '本年度额度已用完']
        pointBuriedGel('922602100653', '股东深度穿透报告', 'reportEx')
        break
      case 'creditReport':
        pdfCmd = 'createcorppdf'
        downType = 'corp'
        downTypeName = intl('222467', '企业信用报告')
        downUrl =
          'http://host/Wind.WFC.Enterprise.Web/PC.Front/Company/CompanyRP.html?companycode=' +
          companycode +
          `&from=openBu3&lang=${lang}`
        noAccessTips = [
          intl('224218', '购买VIP，每年可导出5000家企业的信用报告'),
          intl('224221', '购买SVIP，每年可导出10000家企业的信用报告'),
          intl('224224', '购买VIP/SVIP企业套餐，每年可导出5000/10000家企业的信用报告'),
        ]
        noMoreAccessTips = [intl('24268', '您本年度导出企业报告的额度已用完。'), intl('224262', '本年度额度已用完')]
        pointBuriedGel('922602100653', '企业信用报告', 'reportEx')
        break
      case 'stockReport':
        pdfCmd = 'createsharepdf'
        downType = 'share'
        downTypeName = intl('224217', '股权穿透分析报告')
        downUrl =
          'http://host/Wind.WFC.Enterprise.Web/PC.Front/Company/GQCTRP.html?companycode=' +
          companycode +
          '&from=openBu3&lang=cn&sssss=1230'
        noAccessTips = [
          intl('224219', '购买VIP，每年可导出5000家企业的股权穿透分析报告'),
          intl('224222', '购买SVIP，每年可导出10000家企业的股权穿透分析报告'),
          intl('224225', '购买VIP/SVIP企业套餐，每年可导出5000/10000家企业的股权穿透分析报告'),
        ]
        noMoreAccessTips = [intl('24268', '您本年度导出企业报告的额度已用完。'), intl('224262', '本年度额度已用完')]
        pointBuriedGel('922602100653', '股权穿透分析报告', 'reportEx')
        break
      case 'userPortraitReport':
        pdfCmd = 'createmarketguidetask'
        pointBuriedGel('922602100653', '企业客户画像报告', 'reportEx')
        break
      default:
        return
    }
    let params: any =
      pdfCmd === 'createmarketguidetask'
        ? {
            companycode: entityId,
            companyname: entityName,
          }
        : {
            url: downUrl,
            entityName: entityName,
            entityId: entityId,
            // type: downType,
          }
    if (id == 'creditReport') {
      params = {
        url: downUrl,
        entityName: entityName,
        entityId: entityId,
        lang,
      }
    }
    if (pdfCmd == 'createtrackdoctask') {
      params.depth = selVal
    }
    if (downType == 'stocktrack') {
      params.type = downType
    }
    myWfcAjax(pdfCmd, params).then((res) => {
      if (res.ErrorCode == '0') {
        wftCommon.jumpJqueryPage('index.html#/customer?type=mylist')
      }
    })
  }

  const handleAutoChange = (val) => {
    setValue(val)
    debounceSearch(val, setResult)
  }
  const handleSelect = (_val, option) => {
    // console.log('🚀 ~handleSearch ~ value:', val, option)
    setValue('')
    setCompanycode(option.key)
  }

  const children = result.map((i) => {
    return (
      <Option
        key={i.corp_id}
        value={i.corp_id}
        data-uc-id={`p3XrzcVffRb${i.corp_id}`}
        data-uc-ct="option"
        data-uc-x={i.corp_id}
      >
        {i.corp_name} <span className="comIntro"> {intl('138677', '企业名称') + ' ' + intl('233028', '匹配')}</span>
      </Option>
    )
  })

  return (
    <React.Fragment>
      <div className="BankingWorkbench" id="BankingWorkbench">
        <div className="toolbar-for-invest">
          <div className="toolbar-wrapper">
            <AutoComplete
              value={value}
              className="toolbar-search-invest"
              onSelect={handleSelect}
              onSearch={handleAutoChange}
              dataSource={children}
              data-uc-id="KX4KxIGkHg"
              data-uc-ct="autocomplete"
            >
              <Input.Search placeholder={intl('225183', '请输入公司名称')} data-uc-id="HwC5ovNQas" data-uc-ct="input" />
            </AutoComplete>
            {!selType ? (
              <div className="title-all">
                <Radio.Group value={route} onChange={handleChange} data-uc-id="acyXrSKNVE" data-uc-ct="radio">
                  <Radio.Button
                    value="report"
                    style={{ height: '32px', lineHeight: '32px' }}
                    data-uc-id="3FiYcP4mrV"
                    data-uc-ct="radio"
                  >
                    {intl('421605', '尽职调查报告')}
                  </Radio.Button>
                  <Radio.Button
                    value="detail"
                    style={{ height: '32px', lineHeight: '32px' }}
                    data-uc-id="x1ApeO_FCO"
                    data-uc-ct="radio"
                  >
                    {intl('451245', '企业详情')}
                  </Radio.Button>
                </Radio.Group>
              </div>
            ) : null}
            <a href="SearchHome.html" target="_blank" className="go2home" data-uc-id="UiURooSJMcm" data-uc-ct="a">
              {intl('358755', '进入企业库')}
            </a>
          </div>
        </div>

        {!selType ? (
          <div
            className="jd-report"
            style={{
              display: route == 'report' ? 'block' : 'none',
            }}
          >
            <div className="company-card">
              <CompanyIntroduction
                key={companycode}
                companyname={baseInfo.corp_name}
                companycode={companycode}
                onlyCompanyIntroduction={true}
                companyid={companyid}
                data-uc-id={`TiB0GVdfRXl${companycode}`}
                data-uc-ct="companyintroduction"
                data-uc-x={companycode}
              />
            </div>
            <div className="contentb">
              <Card
                title={intl('313233', '尽调报告')}
                extra={
                  <Button
                    icon={
                      <FolderO
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                        data-uc-id="BtkSaL5--GG"
                        data-uc-ct="foldero"
                      />
                    }
                    type="text"
                    onClick={() => wftCommon.jumpJqueryPage('index.html#/customer?type=mylist')}
                    data-uc-id="E88-nWuj8u"
                    data-uc-ct="button"
                  >
                    {intl('358753', '我的历史尽调报告')}
                  </Button>
                }
              >
                <div className="reportMain">
                  <div className="each-report">
                    <img className="report-pic" src={pdf} alt="" />
                    <div className="tips-report">
                      <h3>{intl('338873', '企业深度信用报告')}</h3>
                      <p>{intl('265688', '快速了解企业基本信用情况')}</p>
                    </div>
                    <Button
                      className="download-area"
                      type="primary"
                      onClick={() => downloadReport('creditReport')}
                      data-uc-id="ZDn2wCoTLc"
                      data-uc-ct="button"
                    >
                      {intl('440315', '导出报告')}
                    </Button>
                  </div>
                  <div className="each-report">
                    <img className="report-pic" src={pdf} alt="" />
                    <div className="tips-report">
                      <h3>{intl('224217', '股权穿透分析报告')}</h3>
                      <p>{intl('265703', '层层挖掘企业股东信息')}</p>
                    </div>
                    <Button
                      className="download-area"
                      type="primary"
                      onClick={() => downloadReport('stockReport', 'svip')}
                      data-uc-id="8vclaGwdoN"
                      data-uc-ct="button"
                    >
                      {intl('440315', '导出报告')}
                    </Button>
                  </div>
                  <div className="each-report shareDepthReport">
                    <img className="report-pic" src={xls} alt="" />
                    <div className="tips-report">
                      <h3 className="each-report-h3-new">{intl('273233', '股东深度穿透报告')}</h3>
                      <p>{intl('358774', '深度核查股东结构，无限层级穿透数据')}</p>
                    </div>
                    <Button
                      className="download-area"
                      type="primary"
                      onClick={() => downloadReport('share', 'svip')}
                      data-uc-id="vV6OIxrzvv"
                      data-uc-ct="button"
                    >
                      {intl('440315', '导出报告')}
                    </Button>
                  </div>
                  <div className="each-report">
                    <div className="pic_holder">
                      <span className="pic_holder_text1">{intl('32959', '股东')}</span>
                      <span className="pic_holder_text2">{intl('358759', '调查表与承诺函')}</span>
                      <img className="report-pic " src={bg07} alt="" />
                    </div>
                    <div className="tips-report">
                      <h3>{intl('358773', '股东调查表与承诺函')}</h3>
                      <p>{intl('358754', '快速生成股东调查确认函')}</p>
                    </div>

                    <Button
                      className="download-area"
                      type="primary"
                      onClick={() => handleClickPic('', 'Shareholder')}
                      data-uc-id="5vl8LPHWzy"
                      data-uc-ct="button"
                    >
                      {intl('440315', '导出报告')}
                    </Button>
                  </div>
                  <div className="each-report ddreport">
                    <img className="report-pic" src={pdf} alt="" />
                    <div className="tips-report">
                      <h3 className="each-report-h3-new">{intl('421605', '尽职调查报告')}</h3>
                      <p>{intl('308753', '深度挖掘企业信息，及时预警企业关键信息变更，一站式尽调解决方案')}</p>
                    </div>
                    <span className="svip-label">
                      <i></i>
                      <span className="batch-output-svip">
                        <b>SVIP</b>
                        {window.en_access_config ? '' : '限时免费'}
                      </span>
                    </span>
                    <Button
                      className="download-area"
                      type="primary"
                      onClick={() => handleClickPic('', 'ddreport')}
                      data-uc-id="QZRZNxQ8cc"
                      data-uc-ct="button"
                    >
                      {intl('440315', '导出报告')}
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="report-t" title={intl('358758', '图谱报告')} style={{ margin: '12px 0' }}>
                <div className="reportMain">
                  <div className="each-report">
                    <img className="report-pic" src={require('../assets/imgs/bankingWorkbench/gqjg2.png')} alt="" />
                    <div className="tips-report">
                      <h3>{intl('260212', '股权结构图')}</h3>
                      <p title={intl('358793', '一图查看企业实控人、高管、分支机构和竞争对手等信息')}>
                        {intl('358793', '一图查看企业实控人、高管、分支机构和竞争对手等信息')}
                      </p>
                    </div>
                    <Button
                      className="download-area"
                      type="primary"
                      onClick={() => handleClickPic('chart_newtzct', 'pic')}
                      data-uc-id="dY7naylH-I"
                      data-uc-ct="button"
                    >
                      {intl('222886', '查看图谱')}
                    </Button>
                  </div>
                  <div className="each-report">
                    <img className="report-pic" src={require('../assets/imgs/bankingWorkbench/gqct.png')} alt="" />
                    <div className="tips-report">
                      <h3>{intl('138279', '股权穿透图')}</h3>
                      <p title={intl('358757', '查看企业受益人信息图谱')}>{intl('358757', '查看企业受益人信息图谱')}</p>
                    </div>
                    <Button
                      className="download-area"
                      type="primary"
                      onClick={() => handleClickPic('chart_gqct', 'pic')}
                      data-uc-id="JrGJ5yhDt6"
                      data-uc-ct="button"
                    >
                      {intl('222886', '查看图谱')}
                    </Button>
                  </div>
                  <div className="each-report">
                    <img className="report-pic" src={require('../assets/imgs/bankingWorkbench/qysyr.png')} alt="" />
                    <div className="tips-report">
                      <h3>{intl('214864', '企业受益人图')}</h3>
                      <p title={intl('358756', '一图查看企业各层级股东股权结构信息')}>
                        {intl('358756', '一图查看企业各层级股东股权结构信息')}
                      </p>
                    </div>
                    <Button
                      className="download-area"
                      type="primary"
                      onClick={() => handleClickPic('chart_qysyr', 'pic')}
                      data-uc-id="uTSViNGXXd"
                      data-uc-ct="button"
                    >
                      {intl('222886', '查看图谱')}
                    </Button>
                  </div>
                  <div className="each-report">
                    <img className="report-pic" src={require('../assets/imgs/bankingWorkbench/ysgx.png')} alt="" />
                    <div className="tips-report">
                      <h3>{intl('138485', '疑似关系图')}</h3>
                      <p title={intl('358794', '逐级查看企业各股东与投资公司股权结构穿透图')}>
                        {intl('358794', '逐级查看企业各股东与投资公司股权结构穿透图')}
                      </p>
                    </div>
                    <Button
                      className="download-area"
                      type="primary"
                      onClick={() => handleClickPic('chart_ysgx', 'pic')}
                      data-uc-id="-kNs939OaG3"
                      data-uc-ct="button"
                    >
                      {intl('222886', '查看图谱')}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        ) : null}

        {reportClicked && corpUrl ? (
          <div
            style={{
              marginTop: '38px',
              display: route == 'report' ? 'none' : 'block',
            }}
          >
            <iframe
              src={corpUrl}
              id="corp_iframe"
              frameBorder="0"
              style={{
                width: '100vw',
                height: 'calc(100vh - 48px)',
              }}
            ></iframe>
          </div>
        ) : (
          ''
        )}
      </div>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    baseInfo: state.company.baseInfo.corp,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getCorpInfo: (data, fn) => {
      getCorpInfo(data).then((res) => {
        const newRes = { ...res }
        newRes.Data.corp = res.Data
        newRes.Data.usednames = res.Data.usednames
        const xxIndustryList = res.Data.xxIndustryList
        newRes.Data.xxIndustryListEn = ''
        try {
          let d = ''
          if (xxIndustryList) {
            xxIndustryList[0].map((t) => {
              d = d ? d + '-' + t.industryName : t.industryName
            })
            newRes.Data.xxIndustryListEn = d
          }
        } catch (e) {}
        dispatch(companyActions.getCorpInfo(newRes))
        fn && fn(newRes)
        window.__GELCORPID__ = newRes.data.corp_id
      })
    },
    getCorpHeaderInfo: (data, fn) => {
      getCorpHeaderInfo(data).then((res) => {
        dispatch(companyActions.getCorpHeaderInfo(res))
        fn && fn(res)
      })
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BankingWorkbench)
