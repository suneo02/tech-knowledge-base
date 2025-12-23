import { Steps } from '@wind/wind-ui'
import { isArray } from 'lodash'
import queryString from 'qs'
import React, { useEffect, useMemo } from 'react'
import { pointBuriedGel } from '../../api/configApi'
import Tables from '../../components/detail/singleTable'
import { usePageTitle } from '../../handle/siteTitle'
import { useTranslateService } from '../../hook'
import intl from '../../utils/intl'
import { wftCommon } from '../../utils/utils'
import { useApiGetStandardDetail } from './api'
import { standardTableColumn } from './columns'
import { StandardDetailTags } from './comp/StandardDetailTags'
import './index.less'

const Step = Steps.Step

const StandardInfoDetail = () => {
  const { standardData, filingsInfo, draft, loading } = useApiGetStandardDetail()
  const [standardDataIntl] = useTranslateService(standardData, true, true)

  usePageTitle('StandardInfoDetails', standardDataIntl?.standardName)

  const tableConfig = useMemo(
    () => ({
      standard: {
        data: standardDataIntl,
        loading,
      },
      filing: {
        data: filingsInfo,
        loading,
      },
      draft,
    }),
    [standardDataIntl, filingsInfo, draft]
  )

  let location = window.location
  let param = queryString.parse(location.search, { ignoreQueryPrefix: true })
  let type = String(param['type'])
  let rows = standardTableColumn[type] || {}

  const breadCrumb = wftCommon.isBaiFenTerminalOrWeb() ? null : (
    <div className="bread-crumb">
      <div className="bread-crumb-content">
        <span
          className="last-rank"
          onClick={() => wftCommon.jumpJqueryPage('SearchHome.html')}
          data-uc-id="mkRQ997O7cU"
          data-uc-ct="span"
        >
          {intl('19475', '首页')}
        </span>
        <i></i>
        <span>{intl('326113', '标准信息')}</span>
      </div>
    </div>
  )

  const statusSteps = useMemo(() => {
    let release = !!(standardData?.releaseDate && standardData?.releaseDate.length)
    let implementation = !!(standardData?.implementationDate && standardData?.implementationDate.length)
    let replaced = !!(standardData?.replacedDate && standardData?.replacedDate.length)
    let abolish = !!(standardData?.abolishDate && standardData?.abolishDate.length)
    let releaseText = release
      ? intl('328156', '发布于') + wftCommon.formatTime(standardData?.releaseDate)
      : intl('328201', '发布')
    let implementationText = implementation
      ? intl('328178', '实施于') + wftCommon.formatTime(standardData?.implementationDate)
      : intl('328213', '实施')
    let abolishText = abolish
      ? intl('328236', '废止于') + wftCommon.formatTime(standardData?.abolishDate)
      : intl('207805', '废止')
    let replaceText = wftCommon.formatTime(standardData?.replacedDate)
    let htmlArr = replaced
      ? [releaseText, implementationText, intl('328179', '被代替于') + replaceText, abolishText]
      : [releaseText, implementationText, abolishText]

    var end = -1
    if (replaced) {
      end = 1
      if (abolish) {
        end = 3
      } else {
        end = 2
      }
    } else {
      if (release) {
        end = 0 // 发布
      }
      if (implementation) {
        end = 1 // 实施
      }
      if (abolish) {
        end = 2 //废止
      }
    }

    return (
      // @ts-expect-error 类型错误
      <Steps size="small" current={end} style={{ margin: '0 120px' }}>
        {htmlArr.map((i, index) => (
          <Step
            key={i}
            icon={<span className={end >= index ? 'step__icon--finished' : 'step__icon--unfinished'} />}
            title={i}
            data-uc-id="CQ4PuqzLqvf"
            data-uc-ct="step"
            data-uc-x={i}
          />
        ))}
      </Steps>
    )
  }, [standardData])

  const processSteps = useMemo(() => {
    let process = standardData?.standardStatus
    // green red black
    var end = -1
    let list = [
      intl('328163', '网上公示'),
      intl('328197', '起草'),
      intl('328198', '征求意见'),
      intl('328199', '审查'),
      intl('328200', '批准'),
      intl('312854', '终止'),
      intl('328201', '发布'),
    ]
    if (process?.length) {
      switch (process) {
        case '修订':
          end = 1
          break
        case '正在起草':
        case '起草':
          end = 1
          break
        case '正在征求意见':
        case '征求意见':
          end = 2
          break
        case '正在审查':
        case '审查':
          end = 3
          break
        case '正在批准':
        case '批准':
          end = 4
          break
        case '暂缓':
          end = 5
          break
        case '网上公示':
          end = 0
          break
        case '发布':
          end = 7
          break
        case '终止':
          end = 6
          break
      }
    }
    return (
      // @ts-expect-error 类型错误
      <Steps size="small" current={end} style={{ margin: '0 120px' }}>
        {list.map((i, index) => (
          <Step
            icon={<span className={end >= index ? 'step__icon--finished' : 'step__icon--unfinished'} />}
            title={i}
            data-uc-id="i1_QKerqYlP"
            data-uc-ct="step"
          />
        ))}
      </Steps>
    )
  }, [standardData])

  useEffect(() => {
    pointBuriedGel('922602100844', '标准信息', 'standardDetail')
  }, [])

  return (
    <div className="standardinfo-detail">
      {breadCrumb}
      <div className="each-div single-module" id="brandDetail">
        <p className="standardinfo-title">{standardDataIntl?.standardName}</p>
        <StandardDetailTags standardData={standardDataIntl} />
      </div>
      {/**标准状态 */}
      <div className="each-div logo__steps">
        <p className="standardinfo-title">
          {type == 'standardPlan' ? intl('326114', '标准状态') : intl('317161', '项目进度')}
        </p>
        {type == 'standardPlan' ? processSteps : statusSteps}
      </div>
      {/**标准信息和备案信息和起草单位表格 */}
      {Object.keys(rows).map((i) => (
        <Tables
          className="each-div"
          key={i}
          title={rows[i].name}
          horizontal={rows[i].horizontal}
          info={tableConfig[i].data}
          isLoading={false}
          columns={rows[i].columns}
          hideTableConstruct={true}
          data-uc-id="YvrWOfPpCsY"
          data-uc-ct="tables"
          data-uc-x={i}
        />
      ))}
      {/**起草人 */}
      {isArray(standardData?.drafter) && standardData?.drafter.length > 0 && (
        <div className="each-div">
          <p className="standardinfo-title">{intl('328160', '起草人')}</p>
          <p>{standardData?.drafter?.map((i) => i.drafterName).join(',')}</p>
        </div>
      )}
      {/**文件下载 */}
      {standardData?.file && (
        <div className="each-div">
          <span className="standardinfo-title">{intl('328190', '标准文件下载')}</span>
          <span className="append-tip">
            {intl('328192', '点击下方链接将跳转该标准公布的文件地址，为第三方地址，可能存在失效或安全风险，请谨慎操作')}
          </span>
          <div className="downloadAppend">
            <button id="downloadAppend">
              <a href={standardData?.file} target="_blank" rel="noreferrer" data-uc-id="nS9yI9mBE-x" data-uc-ct="a">
                {intl('328191', '下载附件')}
              </a>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default StandardInfoDetail
