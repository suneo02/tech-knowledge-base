import { createSuperlistRequestFcs } from '@/api/handleFcs'
import { useNavigateWithLangSource } from '@/hooks/useLangSource'
import { fetchPoints, useAppDispatch } from '@/store'
import { message } from '@wind/wind-ui'
import { useRequest } from 'ahooks'
import { ApiCodeForWfc } from 'gel-api'
import { useNavigate } from 'react-router-dom'

const addConversationFunc = createSuperlistRequestFcs('conversation/addConversation')

type AddConversationFuncReturn = Awaited<ReturnType<typeof addConversationFunc>>

type Options = {
  /** Function to call on successful API request. Overrides the default success handling (message + navigation). */
  onSuccess?: (data: AddConversationFuncReturn) => void
  isManual?: boolean
}

const defaultOnSuccess = (data: AddConversationFuncReturn, navigate: ReturnType<typeof useNavigate>) => {
  if (data?.ErrorCode === ApiCodeForWfc.SUCCESS && data?.Data?.data) {
    message.success('创建会话成功')
    navigate(`/super/chat/${data.Data.data.conversationId}`)
  } else {
    if (data?.ErrorCode === ApiCodeForWfc.INSUFFICIENT_POINTS) return
    message.error(data?.ErrorMessage || '创建会话失败')
  }
}

/**
 * Hook for adding a conversation using the 'conversation/addConversation' endpoint.
 * Provides independent loading and error states for each usage.
 * If no custom `onSuccess` handler is provided, the default handler will show a success message and navigate to the new chat.
 * @param options - Configuration options for the hook.
 */
export const useAddConversation = (options?: Options) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigateWithLangSource()
  const { onSuccess: customOnSuccess, isManual = true } = options || {}

  const handleSuccess = (data: AddConversationFuncReturn) => {
    if (customOnSuccess) {
      customOnSuccess(data)
    } else {
      // Use default handler if no custom one is provided
      // @ts-expect-error
      defaultOnSuccess(data, navigate)
    }
    dispatch(fetchPoints())
  }

  const {
    run: addConversation,
    runAsync: addConversationAsync,
    loading: addConversationLoading,
    error,
  } = useRequest<AddConversationFuncReturn, Parameters<typeof addConversationFunc>>(addConversationFunc, {
    onSuccess: handleSuccess,
    onError: (e) => {
      console.error(e)
      // message.error(`创建会话失败: ${e?.message}`)
    },
    onFinally: () => {
      dispatch(fetchPoints())
    },
    manual: isManual,
  })

  return { addConversation, addConversationAsync, addConversationLoading, error }
}
