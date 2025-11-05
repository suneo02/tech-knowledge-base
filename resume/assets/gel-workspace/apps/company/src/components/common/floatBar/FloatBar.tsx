import * as globalActions from '@/actions/global'
import store from '@/store/store'
import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils'
import { HomeO, NoteO, QuestionCircleO } from '@wind/icons'
import { Button } from '@wind/wind-ui'
import { FloatButton } from 'antd'
import React from 'react'
import './index.less'

const LazyCompanyFloatingWindow = () => React.lazy(() => import('@/components/company/CompanyFloatingWindow'))

const FloatBar = ({ target, scrollToTopFinish }) => {
  const backToHome = () => {
    wftCommon.jumpJqueryPage('SearchHome.html')
  }
  const help = () => {
    window.open('//UnitedWebServer/helpcenter/helpCenter/redirect/document?id=30', '_blank')
  }
  const showFeedParam = (fn) => {
    // console.log(fn)
    // console.log(props.feedParam)
    // if (props.feedParam.message.length == 0) {
    //   message.warning('请填写反馈描述!', 2)
    // } else {
    //   myWfcAjax('addfeedback', props.feedParam).then((res) => {
    //     if (res.Data.ErrorCode == 0) {
    //       message.success('感谢您的反馈!', 2)
    //       fn()
    //     } else {
    //       message.warning('提交失败，请稍后重试!', 2)
    //     }
    //   })
    // }
  }

  /** 老代码抄的，太恶心了 */
  const showFeedBackModel = () => {
    const CompanyFloatingWindowComp = LazyCompanyFloatingWindow()
    store.dispatch(
      globalActions.setGolbalModal({
        className: 'companyIntroductionTagModal',
        width: 720,
        visible: true,
        onCancel: () => store.dispatch(globalActions.clearGolbalModal()),
        title: intl('97058', '意见反馈'),
        content: <React.Suspense fallback={<div></div>}>{<CompanyFloatingWindowComp />}</React.Suspense>,
        footer: [
          // @ts-expect-error ttt
          <Button type="grey" onClick={() => store.dispatch(globalActions.clearGolbalModal())}>
            {intl('19405', '取消')}
          </Button>,
          <Button type="primary" onClick={() => showFeedParam(store.dispatch(globalActions.clearGolbalModal()))}>
            {intl('14108', '提交')}
          </Button>,
        ],
      })
    )
  }
  return (
    <>
      <FloatButton.Group className="wind-float" shape="square" style={{ bottom: 100 }}>
        <FloatButton
          icon={<HomeO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
          // @ts-expect-error ttt
          title="返回首页"
          onClick={backToHome}
        />
        <FloatButton
          icon={<QuestionCircleO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
          // @ts-expect-error ttt
          title="帮助"
          onClick={help}
        />
        {/* <FloatButton icon={<StarO />} title="点击收藏" /> */}
        <FloatButton
          icon={<NoteO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
          // @ts-expect-error ttt
          title="点击反馈"
          onClick={showFeedBackModel}
        />
      </FloatButton.Group>
      <FloatButton.BackTop
        target={() => target}
        onClick={() => setTimeout(() => scrollToTopFinish(), 500)}
        duration={500}
      />
    </>
  )
}

export default FloatBar
