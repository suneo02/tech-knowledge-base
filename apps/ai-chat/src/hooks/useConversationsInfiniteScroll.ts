import { usePageInfiniteScroll } from '@/hooks/usePageInfiniteScroll'
import { message } from '@wind/wind-ui'
import { useEffect } from 'react'

/**
 * 会话类型接口，支持 base 和 super 两种类型的会话
 */
export interface BaseConversation {
  // 会话 ID
  groupId?: string
  conversationId?: string
}

/**
 * 会话无限滚动 hook 配置选项
 */
export interface ConversationsInfiniteScrollOptions<T extends BaseConversation, TApiResponse> {
  /**
   * 请求函数，用于获取会话列表
   */
  requestFn: (params: any) => Promise<TApiResponse>
  /**
   * 删除会话的请求函数
   */
  deleteConversationFn: (params: string) => Promise<void>

  /**
   * 从请求结果中提取数据列表的函数
   */
  getDataFromResult: (result: TApiResponse) => T[]

  /**
   * 判断是否有更多数据的函数
   */
  hasMoreFn?: (result: TApiResponse) => boolean

  /**
   * 更新 Context 中的会话列表数据的函数
   */
  updateConversationsItems: (items: T[]) => void

  /**
   * 当前选中的会话 ID
   */
  currentId?: string

  /**
   * 当需要更新选中的会话 ID 时的回调函数
   */
  onCurrentIdChange?: (id: string) => void

  /**
   * 当会话列表为空时创建新会话的函数
   */
  createNewConversation?: () => void

  /**
   * 请求参数字段配置
   */
  paramConfig?: {
    pageNoKey?: string
    pageSizeKey?: string
    pageSize?: number
  }
}

/**
 * 会话无限滚动 hook 返回值
 */
export interface ConversationsInfiniteScrollResult<T extends BaseConversation> {
  /**
   * 会话列表数据
   */
  list: T[]

  /**
   * 是否正在初始加载
   */
  loading: boolean

  /**
   * 是否正在加载更多
   */
  loadingMore: boolean

  /**
   * 是否还有更多数据
   */
  hasMore: boolean

  /**
   * 加载更多数据的方法
   */
  loadMore: () => void

  /**
   * 重新加载数据的方法
   */
  reload: () => void

  /**
   * 处理删除会话的方法
   */
  handleDeleteConversation: (id: string) => Promise<void>
}

/**
 * 会话无限滚动 hook
 * 统一管理会话的加载、删除等操作，支持 base 和 super 两种类型的会话
 *
 * @param options 配置选项
 * @returns 会话无限滚动相关的状态和方法
 */
export function useConversationsInfiniteScroll<T extends BaseConversation, TApiResponse>(
  options: ConversationsInfiniteScrollOptions<T, TApiResponse>
): ConversationsInfiniteScrollResult<T> {
  const {
    requestFn,
    deleteConversationFn,
    getDataFromResult,
    hasMoreFn,
    updateConversationsItems,
    currentId,
    onCurrentIdChange,
    createNewConversation,
    paramConfig = {},
  } = options

  const { pageNoKey = 'pageNo', pageSizeKey = 'pageSize', pageSize = 20 } = paramConfig

  /**
   * 使用分页加载会话列表
   */
  const { list, loading, loadingMore, hasMore, loadMore, reload, mutate } = usePageInfiniteScroll({
    // 请求函数
    requestFn: async (params: any) => {
      // 构建请求参数
      const requestParams: any = {}
      requestParams[pageNoKey] = params[pageNoKey]
      requestParams[pageSizeKey] = params[pageSizeKey]

      return await requestFn(requestParams)
    },
    // 从结果中提取数据
    getDataFromResult,
    // 判断是否有更多数据 - 直接使用传入的函数，避免循环引用
    hasMoreFn: hasMoreFn,
    // 页码和页大小字段名
    pageNoKey,
    pageSizeKey,
    // 页大小
    pageSize,
    // 自动加载第一页
    initialLoad: true,
  })

  // 当历史列表数据更新时，同步更新到 context
  useEffect(() => {
    if (list.length > 0) {
      updateConversationsItems(list)
    }
  }, [list])

  /**
   * 获取会话 ID，适配不同的会话类型
   */
  const getConversationId = (item: T): string => {
    return item.conversationId || item.groupId || ''
  }

  /**
   * 处理删除会话
   * @param id 会话ID
   */
  const handleDeleteConversation = async (id: string) => {
    try {
      // 删除会话
      await deleteConversationFn(id)

      // 使用 mutate 直接更新内存中的数据，过滤掉已删除的会话
      mutate((oldData) => {
        if (!oldData) return oldData

        // 过滤掉已删除的会话
        const filteredList = oldData.list.filter((item: T) => getConversationId(item) !== id)

        return {
          ...oldData,
          list: filteredList,
        }
      })

      // 同步更新 context 中的数据
      const updatedList = list.filter((item) => getConversationId(item) !== id)
      updateConversationsItems(updatedList)

      // 处理选中的会话
      if (id === currentId && onCurrentIdChange) {
        if (updatedList.length > 0) {
          // 如果有会话，选中第一条
          onCurrentIdChange(getConversationId(updatedList[0]))
        } else if (createNewConversation) {
          // 如果没有会话，创建新会话
          createNewConversation()
        }
      }

      message.success('删除会话成功')
    } catch (error) {
      console.error('删除会话失败:', error)
      message.error('删除会话失败')
    }
  }

  return {
    list,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    reload,
    handleDeleteConversation,
  }
}
