import { createSuperlistRequestFcs } from '@/api/handleFcs'
import { ChatRoomSuperProvider, useChatRoomSuperContext } from '@/contexts/ChatRoom/super'
import Loading from '@/pages/Fallback/loading'
import { Layout, Resizer } from '@wind/wind-ui'
import { useRequest } from 'ahooks'
import { ConversationsSuperProvider, PresetQuestionSuperProvider, usePresetQuestionSuperContext } from 'ai-ui'
import { Tour, TourProps } from 'antd'
import cn from 'classnames'
import { isArray } from 'lodash'
import React, { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { CdeProvider } from '../CDE/context/CdeContext'
import styles from './index.module.less'

// 懒加载组件
const ChatMessageSuper = lazy(() =>
  import('@/components/SuperList/ChatMessage').then((module) => ({ default: module.ChatMessageSuper }))
)
const VisTablePage = lazy(() => import('@/pages/VisTable'))

const ChatContent: React.FC = () => {
  const { data: chatQuestionRes, run: fetchChatQuestion } = useRequest(
    createSuperlistRequestFcs('chat/presetQuestion'),
    {
      manual: true,
    }
  )
  useEffect(() => {
    fetchChatQuestion({
      rawSentenceType: 'AI_CHAT',
      pageNo: 1,
      pageSize: 3,
    })
  }, [])

  const { roomId, tableId, visTableRef } = useChatRoomSuperContext()

  const { setChatQuestions } = usePresetQuestionSuperContext()

  const [panelFolded, setPanelFolded] = useState<'left' | 'right' | false>(false)

  const chatMessageSuperRef = useRef<HTMLDivElement>(null)
  const visTablePageDivRef = useRef<HTMLDivElement>(null)
  const [openTour, setOpenTour] = useState(false)

  // ... existing code ...
  const steps: TourProps['steps'] = [
    {
      title: 'AI 对话',
      description: (
        <div style={{ maxWidth: 380 }}>
          <p style={{ lineHeight: '1.6' }}>
            与我们的高级AI助手进行实时、深度交流。它能助您高效提炼并总结右侧表格中的核心数据与潜在洞察，为您的战略决策提供有力支持。
          </p>
        </div>
      ),
      target: chatMessageSuperRef.current,
      placement: 'right',
    },
    {
      title: '智能表格',
      description: (
        <div style={{ maxWidth: 400 }}>
          <p style={{ lineHeight: '1.6' }}>
            体验我们强大的智能表格区域。它不仅支持通过高级智能搜索快速定位企业、实现高效的数据批量导入与精细化管理，更能通过与AI的深度对话，充分挖掘表格数据的内在价值。
          </p>
          <p style={{ marginTop: '8px', lineHeight: '1.6' }}>请点击右侧的工具按钮，探索并启用这些卓越功能。</p>
        </div>
      ),
      target: visTablePageDivRef.current,
      placement: 'left',
    },
    {
      title: (
        <p style={{ fontSize: '1.1em', fontWeight: 'bold', color: '#1677ff', marginBottom: '8px' }}>
          🚀 隆重介绍：AI生成列
        </p>
      ),
      description: (
        <div style={{ maxWidth: 420 }}>
          <p style={{ lineHeight: '1.6' }}>
            在完成企业搜索与数据导入之后，您可一键启用AI驱动的&quot;生成列&quot;功能。这项革命性技术能为您智能生成深度分析所需的关键列数据，自动提取核心指标，并全面支持自定义分析维度。让复杂的数据洞察过程，化繁为简，智能高效。
          </p>
        </div>
      ),
      target: () => document.querySelector('[data-id="super-excel-ai-generate-column"]') as HTMLElement,
      placement: 'bottom',
    },
    // {
    //   title: '找企业对标',
    //   description: (
    //     <div style={{ maxWidth: 400 }}>
    //       <p style={{ lineHeight: '1.6' }}>
    //         借助&quot;找企业对标&quot;功能，您可以轻松访问我们海量的企业数据库。通过先进的智能算法，系统能够精准识别企业的多维特征，助您快速锁定行业内的理想对标企业。支持模糊匹配查询及多维度筛选，确保高效获取目标企业信息，赋能您的市场分析与战略规划。
    //       </p>
    //     </div>
    //   ),
    //   target: () => document.querySelector('[data-id="super-excel-find-company"]') as HTMLElement,
    //   placement: 'bottom',
    // },
    {
      title: '新增列',
      description: (
        <div style={{ maxWidth: 400 }}>
          <p style={{ lineHeight: '1.6' }}>
            通过&quot;列指标&quot;功能，您可以为表格轻松添加多样化的企业分析维度。我们预设了包括财务状况、市场表现、运营效率在内的丰富指标库，助力您从多角度审视企业，构建全面的数据视图，从而深化数据分析能力，为精准决策提供坚实基础。
          </p>
        </div>
      ),
      target: () => document.querySelector('[data-id="super-excel-query-indicator"]') as HTMLElement,
      placement: 'bottom',
    },
  ]
  // ... existing code ...

  useEffect(() => {
    if (isArray(chatQuestionRes?.Data?.list)) {
      setChatQuestions(chatQuestionRes.Data.list)
    }
  }, [chatQuestionRes])

  useEffect(() => {
    if (
      tableId &&
      chatMessageSuperRef.current &&
      visTablePageDivRef.current &&
      !openTour &&
      localStorage.getItem('openTour') !== 'true'
    ) {
      setTimeout(() => {
        setOpenTour(true)
        localStorage.setItem('openTour', 'true')
      }, 1000)
    }
  }, [tableId, chatMessageSuperRef?.current, visTablePageDivRef?.current])

  return (
    // @ts-expect-error wind-ui
    <Layout style={{ height: '100vh', width: '100%', flexDirection: 'row' }}>
      {/* <Button type="primary" onClick={() => setOpenTour(true)} style={{ margin: '0 16px' }}>
        开始引导
      </Button> */}
      {/* 如果sider 收起 */}

      <div
        className={cn(styles['chat-container'], {
          [styles['chat-container-folded']]: panelFolded === 'left',
        })}
        ref={chatMessageSuperRef}
      >
        <Suspense fallback={<Loading />}>
          <ChatMessageSuper key={`chat-messages-${roomId}`} />
        </Suspense>
      </div>
      <Resizer
        direction="w"
        folded={panelFolded === 'left'}
        onResize={(_e, { folded }) => {
          setPanelFolded(folded ? 'left' : false)
        }}
      />
      {tableId ? (
        <div className={styles['content-wrapper']} style={panelFolded === 'right' ? { display: 'none' } : {}}>
          <div
            className={cn(styles['right-panel'], {
              [styles['right-panel-folded']]: panelFolded === 'right',
            })}
            ref={visTablePageDivRef}
          >
            <Suspense fallback={<Loading />}>
              <VisTablePage key={tableId} tableId={tableId} ref={visTableRef} />
            </Suspense>
          </div>
        </div>
      ) : null}
      <Tour open={openTour} onClose={() => setOpenTour(false)} steps={steps} gap={{ radius: 2 }} disabledInteraction />
    </Layout>
  )
}

const SuperChat: React.FC = () => {
  return (
    <ChatRoomSuperProvider>
      <PresetQuestionSuperProvider>
        <ConversationsSuperProvider>
          <CdeProvider>
            <ChatContent />
          </CdeProvider>
        </ConversationsSuperProvider>
      </PresetQuestionSuperProvider>
    </ChatRoomSuperProvider>
  )
}

export default SuperChat
