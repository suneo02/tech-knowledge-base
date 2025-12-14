import { useEffect, useRef, useState } from 'react'
import { getAiGraphChatHistory } from '@/api/ai-graph'
import { useAIChartsStore } from '../store'
import { hashParams } from '@/utils/links'
import { localStorageManager } from '@/utils/storage'
import { AI_GRAPH_TYPE } from '../contansts'

const DEFAULT_PAGE_SIZE = 10
const INITIAL_PAGE_SIZE = 30

function useChatList(historyPanelShow: boolean, handleClick?: (chatId: string) => void) {
  const { addHistoryChatList, setActiveChatId } = useAIChartsStore()
  const [loading, setLoading] = useState(false)
  const listContainerRef = useRef<HTMLDivElement>(null)
  const loadingRef = useRef(false)
  const pageRef = useRef(0)
  const totalRef = useRef(0)

  function getToChoseChatId(list: any[]) {
    // TODO 从agent平台AI探查中跳转过来，带上chatId
    const { getParamValue } = hashParams()
    const chatIdFromUrl = getParamValue('chatIdFromAiAgent')
    if (chatIdFromUrl) {
      return chatIdFromUrl
    }

    // 从图谱平台页面点击”历史记录“跳转过来，默认选中第一条历史
    const localData = localStorageManager.get('gel_ai_graph_content')
    const parsedLocalData = localData ? JSON.parse(localData) : null
    if (parsedLocalData?.[AI_GRAPH_TYPE.AI_GRAPH_HISTORY]) {
      localStorageManager.remove('gel_ai_graph_content')
      return list?.[0]?.chatId
    }
  }

  // 初始加载
  useEffect(() => {
    getList(true)
  }, [])

  // 滚动加载处理
  useEffect(() => {
    const handleScroll = () => {
      const hasMore = pageRef.current * DEFAULT_PAGE_SIZE <= totalRef.current
      if (!listContainerRef.current || loadingRef.current || !hasMore) return

      const container = listContainerRef.current
      const scrollBottom = container.scrollTop + container.clientHeight
      const threshold = container.scrollHeight - 100 // 距离底部100px时触发加载

      if (scrollBottom >= threshold) {
        getList()
      }
    }

    const container = listContainerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [historyPanelShow])

  async function getList(init?: boolean) {
    const pageSize = init ? INITIAL_PAGE_SIZE : DEFAULT_PAGE_SIZE
    loadingRef.current = true
    setLoading(true)
    try {
      const res = await getAiGraphChatHistory(pageRef.current, pageSize)
      setLoading(false)
      loadingRef.current = false
      pageRef.current = init ? 3 : pageRef.current + 1
      if (res.data.data) {
        addHistoryChatList(res.data.data)
        totalRef.current = res.data.total
        if (init) {
          const toChoseChatId = getToChoseChatId(res.data.data)
          if (!toChoseChatId) {
            return
          }
          setActiveChatId(toChoseChatId)
          handleClick?.(toChoseChatId)
        }
      }
    } catch (err) {
      loadingRef.current = false
      setLoading(false)
    }
  }

  return {
    listContainerRef,
    loading,
  }
}

export default useChatList
