import * as globalActions from '@/actions/global'
import { myWfcAjax } from '@/api/companyApi'
import { CorpState, FeedBackPara } from '@/reducers/company'
import store from '@/store/store'
import { Button, message } from '@wind/wind-ui'
import { t } from 'gel-util/intl'
import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'

const CompanyFloatingWindow = React.lazy(() => import('@/components/company/CompanyFloatingWindow'))

// 公共：生成提交处理函数
const createSubmitFeedback = (feedParam?: FeedBackPara) => async (): Promise<void> => {
  if (feedParam?.type === '异议处理') {
    message.info('异议处理将通过其他渠道进行处理', 2)
    return Promise.resolve()
  }

  if (!feedParam || !feedParam.message || feedParam?.message?.length == 0) {
    message.warning('请填写反馈描述!', 2)
    throw new Error('请填写反馈描述')
  }

  try {
    const res = await myWfcAjax('addfeedback', feedParam)
    if (res.ErrorCode == 0) {
      message.success('感谢您的反馈!', 2)
      return Promise.resolve()
    } else {
      message.warning('提交失败，请稍后重试!', 2)
      throw new Error('提交失败')
    }
  } catch (e) {
    console.error(e)
    throw e
  }
}

// 公共：生成弹窗底部按钮
const createFooterButtons = (
  feedParam: FeedBackPara | undefined,
  submitFeedback: () => Promise<void>
): React.ReactNode[] => {
  const footerButtons: React.ReactNode[] = [
    <Button
      key={19405}
      onClick={() => store.dispatch(globalActions.clearGolbalModal())}
      data-uc-id="HZ2ktFe4OH-"
      data-uc-ct="button"
      data-uc-x={19405}
    >
      {t('19405', '取消')}
    </Button>,
  ]

  if (feedParam?.type !== '异议处理') {
    footerButtons.push(
      <Button
        key={14108}
        type="primary"
        onClick={async () => {
          try {
            await submitFeedback()
            store.dispatch(globalActions.clearGolbalModal())
          } catch (error) {
            console.error(error)
          }
        }}
        data-uc-id="Ghuu7TV-j4u"
        data-uc-ct="button"
        data-uc-x={14108}
      >
        {t('14108', '提交')}
      </Button>
    )
  }

  return footerButtons
}

// 公共：调度弹窗
const dispatchFeedbackModal = (initialCompanyName: string | undefined, footerButtons: React.ReactNode[]) => {
  store.dispatch(
    globalActions.setGolbalModal({
      className: 'companyIntroductionTagModal',
      width: 720,
      visible: true,
      onCancel: () => store.dispatch(globalActions.clearGolbalModal()),
      title: t('97058', '意见反馈'),
      content: (
        <React.Suspense fallback={<div></div>}>
          <CompanyFloatingWindow initialCompanyName={initialCompanyName} />
        </React.Suspense>
      ),
      footer: footerButtons,
    })
  )
}

export const useFeedbackModal = () => {
  const feedParam = useSelector((state: { company: CorpState }) => state.company?.feedBackPara)

  const openFeedbackModal = useCallback(
    (initialCompanyName?: string) => {
      const submitFeedback = createSubmitFeedback(feedParam)
      const footerButtons = createFooterButtons(feedParam, submitFeedback)
      dispatchFeedbackModal(initialCompanyName, footerButtons)
    },
    [feedParam]
  )

  return { openFeedbackModal }
}

// 供类组件或非 React 环境调用的便捷方法
export const openFeedbackModal = (initialCompanyName?: string): void => {
  const state = store.getState()
  const feedParam = state?.company?.feedBackPara

  const submitFeedback = createSubmitFeedback(feedParam)
  const footerButtons = createFooterButtons(feedParam, submitFeedback)
  dispatchFeedbackModal(initialCompanyName, footerButtons)
}
