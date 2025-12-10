import { DeleteOutlined } from '@ant-design/icons'
import { ConversationsProps } from '@ant-design/x'
import { ConversationsItemProps } from '@ant-design/x/es/conversations/Item'
import { AddStarO, PencilO, StarF } from '@wind/icons'
import { AxiosInstance } from 'axios'
import { postPointBuriedWithAxios } from 'gel-api'
import { t } from 'gel-util/intl'

/**
 * Build conversation context menu.
 *
 * Deprecated: superList. Use enableFavorite/enableRename instead for granular control.
 */
export const getConversationMenu = ({
  onDelete,
  editingId,
  onRename,
  onAddFavorite,
  entWebAxiosInstance,
  enableFavorite,
  enableRename,
}: {
  onDelete?: (id: string) => void
  editingId?: string
  onRename?: (id: string) => void
  onAddFavorite?: (conversation: {
    key: string
    id?: number
    label?: React.ReactNode
    content?: string
    collectFlag?: boolean
  }) => void
  entWebAxiosInstance: AxiosInstance
  /** whether to show favorite menu item, default true (or false if superList=true) */
  enableFavorite?: boolean
  /** whether to show rename menu item, default true (or false if superList=true) */
  enableRename?: boolean
}) => {
  // Back-compat: if superList passed, default to disabling favorite/rename unless explicitly enabled
  const showFavorite = enableFavorite ?? true
  const showRename = enableRename ?? true
  const menuConfig: ConversationsProps['menu'] = (conversation) => {
    const items: NonNullable<ConversationsItemProps['menu']>['items'] = []

    if (showFavorite) {
      items.push({
        label: conversation?.collectFlag ? t('257657', '取消收藏') : t('265408', '收藏'),
        key: 'favorite',
        icon: conversation?.collectFlag ? (
          <StarF style={{ fontSize: 16 }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
        ) : (
          <AddStarO style={{ fontSize: 16 }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
        ),
      })
    }

    if (showRename) {
      items.push({
        label: t('18507', '重命名'),
        key: 'rename',
        icon: <PencilO style={{ fontSize: 16 }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
      })
    }

    items.push({
      label: t('232203', '删除'),
      key: 'delete',
      icon: <DeleteOutlined style={{ fontSize: 16 }} />,
      danger: true,
    })

    return {
      items,
      onClick: ({ key, domEvent }) => {
        // 阻止事件冒泡，防止触发 onActiveChange

        domEvent.stopPropagation()

        if (key === 'delete') {
          if (onDelete) {
            onDelete(conversation.key)
            postPointBuriedWithAxios(entWebAxiosInstance, '922610370021')
          } else {
            console.error('onDelete is not defined')
          }
        }
        if (key === 'rename') {
          if (editingId === conversation.key) {
            return
          }
          postPointBuriedWithAxios(entWebAxiosInstance, '922610370020')
          onRename?.(conversation.key)
        }

        if (key === 'favorite') {
          onAddFavorite?.(conversation)
        }
      },
    }
  }
  return menuConfig
}
