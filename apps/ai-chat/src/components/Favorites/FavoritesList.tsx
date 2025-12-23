import { postPointBuried } from '@/utils/common/bury'
import { CloseO, RetreatO, StarF, StarO } from '@wind/icons'
import { Button, Checkbox, Empty, message, Modal, Spin } from '@wind/wind-ui'
import { useChatRoomContext, useFavorites } from 'ai-ui'
import { ERROR_TEXT } from 'gel-util/config'
import { t } from 'gel-util/intl'
import React, { useEffect, useState } from 'react'
import styles from './index.module.less'

export const FavoritesList: React.FC = () => {
  const {
    favorites,
    removeFavorite,
    removeFavorites,
    selectedFavoriteIds,
    setSelectedFavoriteIds,
    isSelectionMode,
    setSelectionMode,
    clearSelection,
    setShowFavorites,
    loading,
  } = useFavorites()
  const [hoveredItemId, setHoveredItemId] = useState<number | null | undefined>(null)

  const { updateRoomId } = useChatRoomContext()

  // 当选中项变化时，自动更新选择模式
  useEffect(() => {
    if (selectedFavoriteIds.length > 0 && !isSelectionMode) {
      setSelectionMode(true)
    } else if (selectedFavoriteIds.length === 0 && isSelectionMode) {
      setSelectionMode(false)
    }
  }, [selectedFavoriteIds, isSelectionMode, setSelectionMode])

  const handleSelectItem = (id: number) => {
    if (selectedFavoriteIds.includes(id)) {
      setSelectedFavoriteIds(selectedFavoriteIds.filter((itemId) => itemId !== id))
    } else {
      setSelectedFavoriteIds([...selectedFavoriteIds, id])
    }
  }

  const handleBatchDelete = () => {
    if (selectedFavoriteIds.length === 0) {
      message.warning(t('', '请先选择要取消收藏的项目'))
      return
    }

    Modal.confirm({
      title: t('', '确认取消收藏'),
      content: t('', `确定要取消收藏选中的 ${selectedFavoriteIds.length} 项内容吗？`),
      onOk: async () => {
        await removeFavorites(selectedFavoriteIds)
        postPointBuried('922610370025')
      },
    })
  }

  if (loading && favorites.length === 0) {
    return (
      <div className={styles['favorites-loading']}>
        <Spin />
      </div>
    )
  }

  if (favorites.length === 0) {
    return (
      <div className={styles['favorites-empty']}>
        <Empty description={t('', '暂无收藏内容')} />
      </div>
    )
  }

  // 重置状态
  const reset = () => {
    setSelectedFavoriteIds([])
    setHoveredItemId(null)
    setSelectionMode(false)
    setShowFavorites(false)
  }

  return (
    <div className={styles.favorites}>
      <div className={styles['favorites-header']}>
        <div className={styles['favorites-title-row']}>
          <h2 className={styles['favorites-title']}>{t('248022', '我的收藏')}</h2>
          <div className={styles['favorites-actions']}>
            <>
              {/* @ts-expect-error windui */}
              <CloseO
                style={{ fontSize: 24 }}
                onClick={() => {
                  reset()
                }}
              />
            </>
          </div>
        </div>
      </div>
      <div className={styles['favorites-list']}>
        {loading && favorites.length > 0 && (
          <div className={styles['favorites-list-loading']}>
            <Spin />
          </div>
        )}
        {favorites.map((favorite) => (
          <div
            className={styles['favorites-item-wrapper']}
            key={favorite.id}
            onMouseEnter={() => setHoveredItemId(favorite.id)}
            onMouseLeave={() => setHoveredItemId(null)}
          >
            <div
              className={`${styles['favorites-item-checkbox']} ${isSelectionMode || hoveredItemId === favorite.id || selectedFavoriteIds.includes(favorite.id) ? styles['favorites-item-checkbox--visible'] : ''}`}
              onClick={(e) => {
                // 阻止事件冒泡，避免重复触发父元素的点击事件
                e.stopPropagation()
                handleSelectItem(favorite.id)
              }}
            >
              <Checkbox
                checked={selectedFavoriteIds.includes(favorite.id)}
                onChange={() => {}} // 由上层div的onClick处理
              />
            </div>
            <div
              className={styles['favorites-item']}
              onClick={
                isSelectionMode
                  ? () => handleSelectItem(favorite.id)
                  : () => {
                      updateRoomId(favorite.groupId || '')
                      postPointBuried('922610370026')
                      setShowFavorites(false)
                    }
              }
              role={isSelectionMode ? 'checkbox' : undefined}
              aria-checked={isSelectionMode ? selectedFavoriteIds.includes(favorite.id) : undefined}
            >
              <div className={styles['favorites-item-content']}>
                <div className={styles['favorites-item-header']}>
                  <h3 className={styles['favorites-item-title']}>{favorite.title}</h3>
                  <div className={styles['favorites-item-date']}>
                    {t('', '收藏时间：')}
                    {favorite.collectTime?.split(' ')[0] || '--'}
                  </div>
                </div>
                <p className={styles['favorites-item-text']}>
                  {favorite.answers || ERROR_TEXT[favorite.questionStatus ?? 0]}
                </p>
              </div>
            </div>
            <div className={styles['favorites-item-actions']}>
              <StarF
                onPointerEnterCapture={() => {}}
                onPointerLeaveCapture={() => {}}
                className={styles['favorites-item-delete']}
                onClick={() => {
                  Modal.confirm({
                    title: t('', '确认取消收藏'),
                    content: t('', '确定要取消收藏该项内容吗？'),
                    onOk: async () => {
                      await removeFavorite(favorite.id)
                    },
                  })
                }}
              />
            </div>
          </div>
        ))}
      </div>
      {isSelectionMode && (
        <div className={styles['favorites-footer']}>
          <div className={styles['favorites-footer-actions']}>
            {/* <Button
              type="text"
              onClick={toggleSelectAll}
              icon={selectedFavoriteIds.length === favorites.length ? <MinusCircleO /> : <PlusCircleO />}
            >
              {selectedFavoriteIds.length === favorites.length ? t('', '取消全选') : t('', `全选(${favorites.length})`)}
            </Button> */}
            {/* @ts-expect-error windui */}
            <Button type="text" onClick={clearSelection} icon={<RetreatO />}>
              {t('', '取消')}
            </Button>
            {selectedFavoriteIds.length > 0 && (
              // @ts-expect-error windui
              <Button type="text" onClick={handleBatchDelete} icon={<StarO />}>
                {t('', `取消收藏(${selectedFavoriteIds.length})`)}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
