import { createSuperlistRequestFcs } from '@/api/handleFcs'
import { useModal } from '@/components/GlobalModalProvider'
import { useAddConversation } from '@/hooks/useAddConversation'
import { message } from '@wind/wind-ui'
import { useRequest } from 'ahooks'
import { MessageRaw } from 'ai-ui'
import { ApiCodeForWfc, SuperListPresetQuestion } from 'gel-api'
import { IndicatorImportTransformedData } from 'indicator'
import qs from 'qs'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { SuperListChatSender } from '../ChatSender'
import { HomeHeader } from './Header'
import { HomeLogoSection } from './LogoSection'
import { QuickBtnGroup } from './QuickBtnGroup'
import { RecommendQuestion } from './RecommendQuestion'
import styles from './style/index.module.less'

export const HomeContent = () => {
  const navigate = useNavigate()
  const {
    data: presetQuestionsRes,
    run: fetchPresetQuestions,
    loading: fetchPresetQuestionLoading,
  } = useRequest(createSuperlistRequestFcs('chat/presetQuestion'), {
    onError: console.error,
    manual: true,
  })
  useEffect(() => {
    fetchPresetQuestions({
      rawSentenceType: 'HOME',
      pageNo: 1,
      pageSize: 6,
    })
  }, [])

  // Hook for sending a message - Custom success handling within handleSendMessage
  const { addConversationAsync: addConversationForSend, addConversationLoading: sendLoading } = useAddConversation({
    // 去除默认成功处理
    onSuccess: () => {},
  })

  // Hook for preset questions - Uses default success handling (message + navigate)
  const { addConversation: addConversationForPreset, addConversationLoading: clickPresetQuestionLoading } =
    useAddConversation()

  useEffect(() => {
    if (clickPresetQuestionLoading) {
      message.loading('正在创建会话...')
    }
  }, [clickPresetQuestionLoading])

  // Hook for uploading clue excel - Uses default success handling (message + navigate)
  const { addConversation: addConversationForUpload, addConversationLoading: uploadLoading } = useAddConversation()

  // Hook for CDE filter - Uses default success handling (message + navigate)
  const { addConversation: addConversationForCDE, addConversationLoading: cdeLoading } = useAddConversation()
  const { openModal } = useModal()

  const modalRef = useRef<HTMLDivElement>(null)

  const handleSendMessage = async (msg: string, think?: MessageRaw['think']) => {
    try {
      const res = await addConversationForSend({
        conversationType: 'AI_CHAT',
        rawSentence: msg,
      })
      if (res?.ErrorCode === ApiCodeForWfc.SUCCESS && res?.Data?.data) {
        const queryString = qs.stringify({
          initialMsg: msg,
          initialDeepthink: think,
        })
        navigate(`/super/chat/${res.Data.data.conversationId}?${queryString}`)
      } else {
        // Error message is handled within the hook
      }
    } catch (e) {
      console.error(e)
      message.error(`创建会话失败: ${e instanceof Error ? e.message : ''}`)
    }
  }

  const handleQuestionClick = (question: SuperListPresetQuestion) => {
    addConversationForPreset({
      conversationType: 'PRESET_QUESTION',
      rawSentenceID: question.rawSentenceID,
    })
  }

  const handleUploadFinish = (result: IndicatorImportTransformedData, clueExcelName?: string) => {
    addConversationForUpload({
      conversationType: 'CLUE_EXCEL',
      clueExcelCondition: result,
      clueExcelName,
    })
  }
  const handleCDEfinish = (cdeDescription, cdeFilterCondition) => {
    addConversationForCDE({
      conversationType: 'CDE_FILTER',
      cdeDescription,
      cdeFilterCondition,
    })
  }

  const openCdeModal = () => {
    openModal('cdeHome', {
      // container: modalRef.current,
      confirmLoading: cdeLoading,
      onFinish: handleCDEfinish,
      confirmText: '添加至表格',
    })
  }

  const openUploadModal = () => {
    openModal('bulkImportHome', {
      loading: uploadLoading,
      onFinish: handleUploadFinish,
    })
  }

  return (
    <div className={styles.homeContent} ref={modalRef}>
      <div className={styles.homeContentInner}>
        <HomeHeader className={styles.homeHeader} />
        <div className={styles.homeContentContainer}>
          <div>
            <HomeLogoSection className={styles.homeLogoSection} />

            <div className={styles.homeContentCenter}>
              <QuickBtnGroup
                className={styles.quickBtnGroup}
                onClickCDE={openCdeModal}
                onClickUpload={openUploadModal}
                uploadLoading={uploadLoading} // Pass specific loading state (though modal has its own)
                cdeLoading={cdeLoading} // Pass specific loading state (though modal has its own)
              />
              <RecommendQuestion
                questions={presetQuestionsRes?.Data?.list}
                className={styles.recommendQuestion}
                onQuestionClick={handleQuestionClick}
                loading={fetchPresetQuestionLoading} // Use specific loading state
              />
            </div>
            <SuperListChatSender
              className={styles.chatSender}
              sendMessage={handleSendMessage}
              loading={sendLoading} // Use specific loading state
            />
          </div>
        </div>
      </div>
    </div>
  )
}
