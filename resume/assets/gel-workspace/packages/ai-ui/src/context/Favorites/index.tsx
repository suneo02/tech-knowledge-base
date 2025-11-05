import { Button, message } from '@wind/wind-ui'
import { AxiosInstance } from 'axios'
import { requestToChatWithAxios, requestToWFCWithAxios } from 'gel-api'
import { t } from 'gel-util/intl'
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'

// API返回的收藏项结构
export interface ApiResponseItem {
  id: number
  groupId: string
  title?: string
  // questions?: string
  content?: string
  answers?: string
  collectTime?: string
  questionStatus?: string
  // [key: string]: unknown
}

// API响应类型
interface ApiResponse<T> {
  Data?: T
  Status?: number
  Message?: string
  status?: number
  message?: string
  [key: string]: unknown
}

interface FavoritesContextType {
  favorites: ApiResponseItem[]
  setFavorites: React.Dispatch<React.SetStateAction<ApiResponseItem[]>>
  showFavorites: boolean
  setShowFavorites: React.Dispatch<React.SetStateAction<boolean>>
  addFavorite: (groupId: number) => Promise<boolean>
  removeFavorite: (id: number) => Promise<boolean>
  removeFavorites: (ids: number[]) => Promise<boolean>
  loading: boolean
  selectedFavoriteIds: number[]
  setSelectedFavoriteIds: React.Dispatch<React.SetStateAction<number[]>>
  isSelectionMode: boolean
  setSelectionMode: React.Dispatch<React.SetStateAction<boolean>>
  toggleSelectAll: () => void
  clearSelection: () => void
  fetchFavorites: () => Promise<boolean>
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export const FavoritesProvider: React.FC<{ children: ReactNode; axiosInstance: AxiosInstance }> = ({
  children,
  axiosInstance,
}) => {
  const [favorites, setFavorites] = useState<ApiResponseItem[]>([])
  const [showFavorites, setShowFavorites] = useState(false)
  const [selectedFavoriteIds, setSelectedFavoriteIds] = useState<number[]>([])
  const [isSelectionMode, setSelectionMode] = useState(false)
  const [loading, setLoading] = useState(false)

  // 获取收藏列表
  const fetchFavorites = async (): Promise<boolean> => {
    try {
      setLoading(true)
      const response = (await requestToChatWithAxios(axiosInstance, 'selectChatAIConversation', {
        collectFlag: true,
        pageSize: 10,
        pageIndex: 1,
      })) as unknown as ApiResponse<ApiResponseItem[]>

      if (response && Array.isArray(response.Data)) {
        // 处理API返回的数据，转换为FavoriteItem格式
        const items: ApiResponseItem[] = response.Data.map((item: ApiResponseItem) => ({
          id: item.id,
          groupId: item.groupId,
          title: item.title || t('', '未命名收藏'),
          answers: item.answers || '',
          questionStatus: item.questionStatus || '',
          collectTime: item.collectTime || new Date().toISOString(),
        }))
        setFavorites(items)
      } else {
        setFavorites([])
      }
      return true
    } catch (error) {
      console.error('Failed to fetch favorites:', error)
      message.error(t('', '获取收藏列表失败'))
      return false
    } finally {
      setLoading(false)
    }
  }

  // 添加收藏
  const addFavorite = async (groupId: number) => {
    try {
      setLoading(true)
      const entityID = groupId

      const response = await requestToWFCWithAxios(
        axiosInstance,
        'operation/insert/addtomycustomer',
        {
          entityID: String(entityID),
          termTyp: 'GELAICHAT',
          groupIdArray: 'mycustomer',
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      if (response && response.ErrorCode === '0' && response.Data === true) {
        message.success(
          <>
            <span>{t('', '收藏成功')}，</span>
            <span>{t('', '点此查看')}</span>
            <Button type="link" style={{ padding: 0 }} onClick={() => setShowFavorites(true)}>
              {t('248022', '我的收藏')}
            </Button>
          </>,
          5 // 5秒后自动关闭
        )
        // 更新收藏列表
        await fetchFavorites()
        return true
      } else {
        message.error(t('', '添加收藏失败'))
        return false
      }
    } catch (error) {
      console.error('Failed to add favorite:', error)
      message.error(t('', '添加收藏失败'))
      return false
    } finally {
      setLoading(false)
    }
  }

  // 删除单个收藏
  const removeFavorite = async (id: number) => {
    try {
      setLoading(true)
      const response = (await requestToWFCWithAxios(
        axiosInstance,
        'operation/delete/deleteCustomer',
        {
          entityID: `${id}`,
          termTyp: 'GELAICHAT',
          groupId: 'all',
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )) as unknown as ApiResponse<boolean>

      if (response && response.ErrorCode === '0' && response.Data === true) {
        message.success(t('', '取消收藏成功'))
        // 更新收藏列表
        await fetchFavorites()
        // 更新本地状态
        setFavorites((prev) => prev.filter((item) => item.id !== id))
        setSelectedFavoriteIds((prev) => prev.filter((itemId) => itemId !== id))
        return true
      } else {
        message.error(t('', '取消收藏失败'))
        return false
      }
    } catch (error) {
      console.error('Failed to remove favorite:', error)
      message.error(t('', '取消收藏失败'))
      return false
    } finally {
      setLoading(false)
    }
  }

  // 批量删除收藏
  const removeFavorites = async (ids: number[]) => {
    if (ids.length === 0) return false

    try {
      setLoading(true)
      // 依次删除每个收藏
      const results = (await requestToWFCWithAxios(
        axiosInstance,
        'operation/delete/deleteCustomer',
        {
          entityID: ids.join(','),
          termTyp: 'GELAICHAT',
          groupId: 'all',
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )) as unknown as ApiResponse<boolean>
      //
      if (results && results.ErrorCode === '0' && results.Data === true) {
        message.success(t('', '批量取消收藏成功'))
        // 更新收藏列表
        await fetchFavorites()
        // 更新本地状态
        setFavorites((prev) => prev.filter((item) => !ids.includes(item.id ?? 0)))
        setSelectedFavoriteIds([])
        return true
      } else {
        // 部分成功
        message.warning(t('', '部分收藏取消失败，请刷新重试'))
        // 刷新列表
        await fetchFavorites()
        return false
      }
    } catch (error) {
      console.error('Failed to remove favorites:', error)
      message.error(t('', '批量取消收藏失败'))
      return false
    } finally {
      setLoading(false)
    }
  }

  const toggleSelectAll = () => {
    if (selectedFavoriteIds.length === favorites.length) {
      // 如果已全选，则取消全选
      setSelectedFavoriteIds([])
    } else {
      // 如果未全选，则全选
      setSelectedFavoriteIds(favorites.map((item) => item.id ?? 0))
    }
  }

  const clearSelection = () => {
    setSelectedFavoriteIds([])
    setSelectionMode(false)
  }

  // 初始化时获取收藏列表
  useEffect(() => {
    if (showFavorites) {
      fetchFavorites()
    }
  }, [showFavorites])

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        setFavorites,
        showFavorites,
        setShowFavorites,
        addFavorite,
        removeFavorite,
        removeFavorites,
        loading,
        selectedFavoriteIds,
        setSelectedFavoriteIds,
        isSelectionMode,
        setSelectionMode,
        toggleSelectAll,
        clearSelection,
        fetchFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}
