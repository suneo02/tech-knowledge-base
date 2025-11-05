import { requestToSuperlistFcs } from '@/api'
import coins from '@/assets/image/coins@3x.png'
import avatar from '@/assets/image/user-avatar-default.png'
import Page from '@/components/layout/Page'
import PageBreadcrumb from '@/components/layout/Page/Breadcrumb'
import { ExclamationCircleF } from '@wind/icons'
import { Result } from '@wind/wind-ui'
import { useRequest } from 'ahooks'
import { Spin, StatisticProps } from 'antd'
import dayjs from 'dayjs'
import { GetUserPointsInfoResponse } from 'gel-api'
import CountUp from 'react-countup'
import { useLocation } from 'react-router-dom'
import styles from './index.module.less'
import CreditsRecords from './Records'

const PREFIX = 'credits-home-page'

const formatter: StatisticProps['formatter'] = (value) => <CountUp end={value as number} separator="," />
const CreditsHomePage = () => {
  const location = useLocation()
  const [creditsInfo, setCreditsInfo] = useState<GetUserPointsInfoResponse>({} as GetUserPointsInfoResponse)
  const getCreditsInfo = async () => {
    const { Data } = await requestToSuperlistFcs('points/getUserPointsInfo', {})
    return Data
  }
  const { run, loading } = useRequest(getCreditsInfo, {
    loadingDelay: 200,
    onSuccess: (data) => setCreditsInfo(data!),
    onError: () => setCreditsInfo({} as GetUserPointsInfoResponse),
  })
  useEffect(() => {
    console.log('location.search', location.search)
    run()
  }, [location.search])
  return (
    <Spin spinning={loading}>
      <Page
        header={
          <div className={styles[`${PREFIX}-header`]}>
            <PageBreadcrumb items={[{ name: '我的积分' }]} />
          </div>
        }
        fixedHeader={true} // Header 不固定，会滚动
        //   scrollable={false} // 整个内容区域（包括非固定 Header）不可滚动
      >
        {/* 主要内容 */}
        <div className={styles[`${PREFIX}-container`]}>
          <div className={styles[`${PREFIX}-banner`]}>
            <div className={styles[`${PREFIX}-banner-left`]}>
              <div className={styles[`${PREFIX}-banner-left-icon`]}>
                <img src={coins} alt="" />
              </div>
            </div>
            <div className={styles[`${PREFIX}-banner-center`]}>
              {formatter(creditsInfo?.pointTotal)}
              <p>当前积分</p>
            </div>
            <div className={styles[`${PREFIX}-banner-right`]}>
              有<span>{creditsInfo?.latestExpiringPoints?.pointSurplus}</span>
              积分将于{dayjs(creditsInfo?.latestExpiringPoints?.endTime).format('YYYY-MM-DD')}到期，请尽快使用～
            </div>
          </div>
          {/* <Divider dashed /> */}
          <h3>积分购买</h3>
          <p>安全便捷的积分专业服务，助力您实现商业目标</p>
          <div className={styles[`${PREFIX}-buy`]}>
            <div className={styles[`${PREFIX}-buy-tip`]}>
              <ExclamationCircleF
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                style={{ color: '#fa8628', marginInlineEnd: 8 }}
              />
              积分不可兑换会员，不可转赠与提现，充值后有效期为1年，不支持退换或反向兑换成人民币
            </div>
            <div>
              <Result
                className={styles[`${PREFIX}-buy-result`]}
                status={'developing'}
                title={'敬请期待'}
                subTitle={'如需充值请联系客户经理！'}
              />
            </div>
          </div>
          {/* <Divider dashed /> */}
          <h3>积分明细记录</h3>
          <CreditsRecords />
        </div>
      </Page>
    </Spin>
  )
}

export default CreditsHomePage
