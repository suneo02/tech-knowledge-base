import { useAddConversation } from '@/hooks/useAddConversation'
import { useNavigateWithLangSource } from '@/hooks/useLangSource'
import { postPointBuried } from '@/utils/common/bury'
import { message } from '@wind/wind-ui'
import { ApiCodeForWfc, ChatQuestion, ChatThinkSignal } from 'gel-api'
import qs from 'qs'
import { useEffect, useState } from 'react'
import { SuperListChatSender } from '../ChatSender'
import { HomeHeader } from './HomeHeader'
import { HomeLogoSection } from './HomeLogoSection'
import { usePresetQuestions } from './hooks/usePresetQuestions'
import styles from './index.module.less'
import { RecommendQuestion } from './RecommendQuestion'

const PREFIX = 'home-content'

export const HomeContent = () => {
  // const [CDEModal, contextHolder] = useCDEModal()
  const navigate = useNavigateWithLangSource()
  const { presetQuestions, loading: fetchPresetQuestionLoading } = usePresetQuestions()
  const [deepSearch, setDeepSearch] = useState(false)
  // const { openModal } = useModal()

  const { addConversationAsync: addConversationForSend, addConversationLoading: sendLoading } = useAddConversation({
    onSuccess: () => {}, // Custom success handling
  })

  const { addConversationLoading: clickPresetQuestionLoading } = useAddConversation()

  // const { addConversationLoading: uploadLoading } = useAddConversation()

  useEffect(() => {
    if (clickPresetQuestionLoading) {
      message.loading('正在创建会话...')
    }
  }, [clickPresetQuestionLoading])

  const handleSendMessage = async (
    msg: string,
    options?: { think?: ChatThinkSignal['think']; deepSearch?: boolean }
  ) => {
    console.log('🚀 ~ handleSendMessage ~ deepSearch:', options)
    try {
      const res = await addConversationForSend({
        conversationType: 'AI_CHAT',
        rawSentence: msg,
      })
      if (res?.ErrorCode === ApiCodeForWfc.SUCCESS && res?.Data?.data) {
        const resolvedDeepSearch = options?.deepSearch ?? deepSearch
        const queryString = qs.stringify({
          initialMsg: msg,
          initialDeepthink: options?.think,
          deepSearch: resolvedDeepSearch,
        })
        navigate(`/super/chat/${res.Data.data.conversationId}?${queryString}`)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleQuestionClick = (question: ChatQuestion) => {
    postPointBuried('922604570273', {
      click: question.questions,
    })
    handleSendMessage(question.questions, { deepSearch })
  }

  // 备用：上传结束处理（暂未开放）

  // const openCdeModal = () => {
  //   postPointBuried('922604570274')
  //   CDEModal.show()
  // }

  // const handleUploadFinish = (result: IndicatorImportTransformedData, clueExcelName?: string) => {
  //   addData({
  //     conversationType: 'CLUE_EXCEL',
  //     clueExcelCondition: result,
  //     clueExcelName,
  //     sheetId,
  //     enablePointConsumption: 1,
  //   })
  // }

  // const openUploadModal = () => {
  //   message.info('敬请期待')
  // }

  return (
    <div className={styles[`${PREFIX}-container`]}>
      <div className={styles[`${PREFIX}-header-section`]}>
        <HomeHeader />
      </div>

      <div className={styles.scrollableContent}>
        <div>
          <div className={styles[`${PREFIX}-centered-content`]}>
            <div>
              <HomeLogoSection />
            </div>
            {/* <QuickBtnGroup onClickCDE={openCdeModal} onClickUpload={openUploadModal} /> */}
            <div className={styles[`${PREFIX}-recommend-question`]}>
              <RecommendQuestion
                questions={presetQuestions}
                onQuestionClick={handleQuestionClick}
                loading={fetchPresetQuestionLoading}
              />
            </div>
            <SuperListChatSender
              className={styles[`${PREFIX}-chat-sender`]}
              sendMessage={handleSendMessage}
              loading={sendLoading}
              deepSearch={deepSearch}
              onDeepSearchChange={setDeepSearch}
              focus
            />
          </div>
        </div>
      </div>

      {/* {contextHolder} */}
    </div>
  )
}
