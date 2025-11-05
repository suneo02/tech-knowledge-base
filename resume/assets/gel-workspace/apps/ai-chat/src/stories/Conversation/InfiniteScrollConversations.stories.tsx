import { DeleteOutlined } from '@ant-design/icons'
import type { Meta, StoryObj } from '@storybook/react'
import { InfiniteScrollConversations } from '../../components/Conversation/InfiniteScrollConversations'
import { ConversationItemProps } from '../../components/Conversation/type'
import { conversationsMock } from './conversationsMock'

// Mock action creator to simulate Storybook's addon-actions

// 样式容器，使组件在 Storybook 中正常展示
const StoryContainer = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      height: '600px',
      width: '300px',
      border: '1px solid #f0f0f0',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '8px',
      overflow: 'hidden',
      background: '#fff',
    }}
  >
    {children}
  </div>
)

const meta = {
  title: 'Conversation/InfiniteScrollConversations',
  component: InfiniteScrollConversations,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <StoryContainer>
        <Story />
      </StoryContainer>
    ),
  ],
} satisfies Meta<typeof InfiniteScrollConversations>

export default meta
type Story = StoryObj<typeof InfiniteScrollConversations>

// 为了避免类型错误，直接定义一个空函数作为 loadMoreItems
const noop = () => {}

/**
 * 基础示例 - 展示具有固定数量对话的滚动列表
 */
export const Basic: Story = {
  args: {
    items: conversationsMock.slice(0, 10),
    hasMore: false,
    loading: false,
    loadMoreItems: noop,
    activeKey: conversationsMock[2].key,
    onActiveChange: (key: string) => {
      console.log('[onActiveChange]', key)
    },
    menu: (conversation) => ({
      items: [
        {
          label: '删除',
          key: 'delete',
          icon: <DeleteOutlined />,
          danger: true,
        },
      ],
      onClick: ({ key }: { key: string }) => {
        console.log('[menuClick]', { conversationId: conversation.groupId, action: key })
      },
    }),
  },
}

/**
 * 加载中状态 - 展示加载指示器
 */
export const Loading: Story = {
  args: {
    ...Basic.args,
    loading: true,
  },
}

/**
 * 空列表状态 - 没有对话项
 */
export const Empty: Story = {
  args: {
    ...Basic.args,
    items: [],
  },
}

/**
 * 无限滚动 - 实时加载更多内容
 */
export const InfiniteLoadingExample: StoryObj<typeof InfiniteScrollConversations> = {
  render: function Render(args) {
    const [items, setItems] = useState<ConversationItemProps[]>(conversationsMock.slice(0, 5))
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)

    const loadMore = () => {
      if (loading) return

      setLoading(true)

      // 模拟加载更多数据的异步操作
      setTimeout(() => {
        const nextPage = page + 1
        const newItems = [...items, ...conversationsMock.slice(page * 5, nextPage * 5)]

        setItems(newItems)
        setPage(nextPage)
        setLoading(false)

        // 当加载到所有内容时，设置 hasMore 为 false
        if (newItems.length >= conversationsMock.length) {
          setHasMore(false)
        }
      }, 1000)
    }

    return (
      <InfiniteScrollConversations
        items={items}
        hasMore={hasMore}
        loading={loading}
        loadMoreItems={loadMore}
        activeKey={args.activeKey}
        onActiveChange={args.onActiveChange}
        menu={args.menu}
      />
    )
  },
  args: {
    activeKey: conversationsMock[2].key,
    onActiveChange: (key: string) => {
      console.log('[onActiveChange]', key)
    },
    menu: Basic.args.menu,
  },
}

/**
 * 大量数据 - 测试性能和滚动行为
 */
export const ManyItems: Story = {
  args: {
    ...Basic.args,
    items: Array(100)
      .fill(null)
      .map((_, index) => ({
        groupId: `group-${index}`,
        questions: `对话 ${index + 1}`,
        updateTime: new Date().toISOString(),
        id: index,
        userId: '7167342',
        group: index < 10 ? '近7天' : '近30天',
        key: `group-${index}`,
        label: `对话 ${index + 1}`,
        questionsNum: 1,
        isDelete: 0,
      })),
  },
}

/**
 * 自定义菜单 - 展示更多菜单选项
 */
export const CustomMenu: Story = {
  args: {
    ...Basic.args,
    menu: (conversation) => ({
      items: [
        {
          label: '重命名',
          key: 'rename',
        },
        {
          label: '置顶',
          key: 'pin',
        },
        {
          label: '分享',
          key: 'share',
        },
        {
          label: '导出',
          key: 'export',
        },
        {
          type: 'divider',
        },
        {
          label: '删除',
          key: 'delete',
          icon: <DeleteOutlined />,
          danger: true,
        },
      ],
      onClick: ({ key }: { key: string }) => {
        console.log('[menuClick]', { conversationId: conversation.groupId, action: key })
      },
    }),
  },
}

/**
 * 不同项目状态 - 包含已读、未读、活跃状态的混合
 */
export const MixedItemStates: Story = {
  args: {
    ...Basic.args,
    items: [
      // 活跃项
      {
        groupId: 'active-item',
        questions: '当前活跃会话',
        updateTime: new Date().toISOString(),
        id: 1001,
        userId: '7167342',
        group: '近7天',
        key: 'active-item',
        label: '当前活跃会话',
        questionsNum: 1,
        isDelete: 0,
      },
      // 未读消息项
      {
        groupId: 'unread-item',
        questions: '有未读消息的会话',
        updateTime: new Date(Date.now() - 60000).toISOString(),
        id: 1002,
        userId: '7167342',
        group: '近7天',
        key: 'unread-item',
        label: '有未读消息的会话',
        questionsNum: 5,
        isDelete: 0,
      },
      // 长标题项
      {
        groupId: 'long-title-item',
        questions: '这是一个非常非常长的会话标题，测试标题溢出时的显示效果',
        updateTime: new Date(Date.now() - 120000).toISOString(),
        id: 1003,
        userId: '7167342',
        group: '近7天',
        key: 'long-title-item',
        label: '这是一个非常非常长的会话标题，测试标题溢出时的显示效果',
        questionsNum: 1,
        isDelete: 0,
      },
      // 普通项
      {
        groupId: 'normal-item',
        questions: '普通会话',
        updateTime: new Date(Date.now() - 300000).toISOString(),
        id: 1004,
        userId: '7167342',
        group: '近30天',
        key: 'normal-item',
        label: '普通会话',
        questionsNum: 1,
        isDelete: 0,
      },
    ],
    activeKey: 'active-item',
  },
}
