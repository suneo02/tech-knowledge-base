import { useFeedbackModal } from '@/components/company/feedback/useFeedbackModal'
import { wftCommon } from '@/utils/utils'
import { HomeO, NoteO, QuestionCircleO } from '@wind/icons'
import { FloatButton } from 'antd'
import React from 'react'
import './index.less'

const FloatBar = ({ target, scrollToTopFinish }) => {
  const backToHome = () => {
    wftCommon.jumpJqueryPage('SearchHome.html')
  }
  const help = () => {
    window.open('//UnitedWebServer/helpcenter/helpCenter/redirect/document?id=30', '_blank')
  }
  const { openFeedbackModal } = useFeedbackModal()

  /** 统一复用反馈弹窗逻辑 */
  const showFeedBackModel = () => {
    openFeedbackModal()
  }
  return (
    <>
      <FloatButton.Group className="wind-float" shape="square" style={{ bottom: 100 }}>
        <FloatButton
          icon={
            <HomeO
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              data-uc-id="7Nxw_BQLYtl"
              data-uc-ct="homeo"
            />
          }
          // @ts-expect-error ttt
          title="返回首页"
          onClick={backToHome}
          data-uc-id="Sw0gJQWuraW"
          data-uc-ct="floatbutton"
        />
        <FloatButton
          icon={
            <QuestionCircleO
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              data-uc-id="57ORrBz8EEH"
              data-uc-ct="questioncircleo"
            />
          }
          // @ts-expect-error ttt
          title="帮助"
          onClick={help}
          data-uc-id="isXod9zCs3a"
          data-uc-ct="floatbutton"
        />
        {/* <FloatButton icon={<StarO />} title="点击收藏" /> */}
        <FloatButton
          icon={
            <NoteO
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              data-uc-id="dYP9r_ZkJNM"
              data-uc-ct="noteo"
            />
          }
          // @ts-expect-error ttt
          title="点击反馈"
          onClick={showFeedBackModel}
          data-uc-id="XJhQUvkhCVT"
          data-uc-ct="floatbutton"
        />
      </FloatButton.Group>
      <FloatButton.BackTop
        target={() => target}
        onClick={() => setTimeout(() => scrollToTopFinish(), 500)}
        duration={500}
        data-uc-id="y7yrOTkK0xB"
        data-uc-ct=""
      />
    </>
  )
}

export default FloatBar
