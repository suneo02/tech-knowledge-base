import { axiosInstance } from '@/api/axios'
import { entWebAxiosInstance } from '@/api/entWeb'
import { createWFCSuperlistRequestFcs } from '@/api/handleFcs'
import { CoinsIcon } from '@/assets/icon'
import { useChatRoomSuperContext } from '@/contexts/ChatRoom/super'
import { getActiveSheet } from '@/pages/VisTable/utils/localStorage'
import { fetchPoints, useAppDispatch } from '@/store'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Card, Divider, message } from '@wind/wind-ui'
import Table from '@wind/wind-ui-table'
import { useRequest } from 'ahooks'
import { AICopyButton, AIDislikeButton, AILikeButton, AIRetryButton, MessageRaw, MessageRawSuper } from 'ai-ui'
import { RefTableData } from 'gel-api'
import { FC, useMemo, useState } from 'react'
import styles from './index.module.less'

const PREFIX = 'super-chat-ai-table'

/**
 * 插入到表格按钮组件
 */
const InsertTableButton: FC<{
  onClick: () => void
  loading: boolean
  id: string
  disabled: boolean
}> = ({ onClick, loading, id, disabled }) => (
  <Button key={id} type="primary" onClick={onClick} loading={loading} disabled={disabled}>
    {disabled ? (
      '已插入至表格'
    ) : (
      <>
        <PlusOutlined />
        添加至新表格
      </>
    )}
  </Button>
)

const addDataToSheetFunc = createWFCSuperlistRequestFcs('superlist/excel/addDataToSheet')

/**
 * 智能表格卡片组件
 */
const SmartTableCard: FC<{
  tableIndex: number
  agentMessage: MessageRawSuper
  info: RefTableData
}> = ({ tableIndex, agentMessage, info }) => {
  const dispatch = useAppDispatch()
  const [enableInsert, setEnableInsert] = useState(true)
  const { tableId, chatId, visTableRef } = useChatRoomSuperContext()
  const table = agentMessage?.refTable?.[tableIndex]

  const { run: addDataToSheet, loading } = useRequest(addDataToSheetFunc, {
    onSuccess: (data) => {
      if (visTableRef.current && data.Data && data.Data.data) {
        visTableRef.current.refresh({ sheets: data.Data.data.map((item) => item.sheetId) })
      }
      message.success('插入成功')
      setEnableInsert(false)
      dispatch(fetchPoints())
    },
    onError: (e) => {
      console.error(e)
      message.error('插入失败')
    },
    manual: true,
  })

  const columns = useMemo(() => {
    if (!table?.Headers) return []
    return table.Headers.map((res, index) => ({
      title: res.Name,
      dataIndex: index.toString(),
      width: 150,
      ellipsis: true,
      // render: (text: string | number | null) => {
      //   let content: React.ReactNode
      //   let tooltipText = ''

      //   if (res.DataType === 'composite') {
      //     try {
      //       const obj = JSON.parse(text as string)
      //       tooltipText = obj?.Label || ''
      //       const windcode = typeof obj?.Id === 'string' ? obj?.Id?.split('.')?.[0] : obj?.Id
      //       if (!windcode) {
      //         content = '-'
      //       } else {
      //         content = (
      //           <Link
      //             underline
      //             href={
      //               getTerminalCommandLink(ETerminalCommandId.F9, {
      //                 windcode,
      //               }) || '#'
      //             }
      //           >
      //             {obj?.Label}
      //           </Link>
      //         )
      //       }
      //     } catch {
      //       content = text
      //       tooltipText = text?.toString() ?? ''
      //     }
      //   } else {
      //     if (text === null) {
      //       content = '-'
      //     } else {
      //       content = text.toString()
      //       tooltipText = text.toString()
      //     }
      //   }

      //   return <Tooltip title={tooltipText}>{content}</Tooltip>
      // },
    }))
  }, [table?.Headers])

  const dataSource = useMemo(() => {
    if (!table?.Content) return []
    return table.Content.map((row) => {
      const item = {}
      row.forEach((content, index) => (item[index] = content || '--'))
      return item
    })
  }, [table?.Content])

  if (!table || !table.Headers || !table.Content) return null

  const onInsertTable = () => {
    const rawSentence = agentMessage.rawSentence || ''
    const rawSentenceID = agentMessage.rawSentenceID || ''

    if (!agentMessage.refTable || !table) return
    const activeSheetId = getActiveSheet(tableId)?.sheetId
    console.log('🚀 ~ onInsertTable ~ activeSheetId:', activeSheetId)
    if (!activeSheetId) {
      message.error('无法确定要插入的表格，请先选择一个表格标签页')
      return
    }
    addDataToSheet({
      tableId,
      dataType: 'AI_CHAT_DPU',
      rawSentenceID,
      rawSentence,
      answers: agentMessage.content,
      sheetId: activeSheetId,
      sheetName: table.NewName,
      chatId,
      dpuHeaders: info.Headers,
      dpuContent: info.Content.map((row) => {
        return row.map((item) => {
          if (typeof item === 'string' && item.startsWith('{')) {
            try {
              const parsed = JSON.parse(item)
              return parsed.Label || item
            } catch {
              return item
            }
          }
          return item
        })
      }),
      enablePointConsumption: 1,
    })
  }

  return (
    <Card
      title={<div style={{ fontSize: 14, fontWeight: 'bold' }}>{table.NewName}</div>}
      key={`card-${tableIndex}`}
      bordered
      className={styles[`${PREFIX}-card`]}
    >
      <Table
        resizable
        dataSource={dataSource.slice(0, 10)}
        columns={columns}
        pagination={false}
        scroll={{ x: '100%' }}
        bordered="dotted"
        striped={true}
        className={styles[`${PREFIX}-table`]}
      />
      <div style={{ marginTop: '1rem' }}>
        {table.Content.length > 10 && (
          <div style={{ textAlign: 'right', fontSize: 14, color: '#999', marginBlockEnd: 6 }}>
            当前展示前10条数据，查看全量数据（共{table.Content.length}条）请插入到表格
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <div style={{ color: '#f06f13', display: 'flex', alignItems: 'center' }}>
            <CoinsIcon style={{ width: 16, height: 16, marginRight: 4 }} />
            {table.Content.length}
          </div>
          <Divider type="vertical" />
          <InsertTableButton
            id={`InsertTableButton-${tableIndex}`}
            onClick={onInsertTable}
            loading={loading}
            disabled={!enableInsert}
          />
        </div>
      </div>
    </Card>
  )
}

/**
 * AI消息底部组件
 */
export const AIFooterSuper: FC<{
  content: string
  agentMessage: MessageRawSuper
  sendMessage?: (message: string, agentId?: MessageRaw['agentId'], think?: MessageRaw['think']) => void
}> = ({ content, agentMessage, sendMessage }) => {
  const hasTables = agentMessage.refTable && agentMessage.refTable.length > 0
  console.log('🚀 ~ agentMessage:', agentMessage)
  // 如果问答状态不是1，则展示重试按钮
  if (agentMessage.questionStatus && agentMessage.questionStatus !== '1') {
    return (
      <div style={{ display: 'flex', gap: '0' }}>
        <AIRetryButton
          content={content}
          isBury
          rawSentence={agentMessage.rawSentence}
          rawSentenceID={agentMessage.rawSentenceID}
          onRetry={() => {
            // 调用sendMessage重新发送原始问题
            if (sendMessage && agentMessage.rawSentence) {
              sendMessage(agentMessage.rawSentence, agentMessage.agentId, agentMessage.think)
            }
          }}
        />
      </div>
    )
  }
  return (
    <div style={{ width: '100%' }}>
      {hasTables && (
        <>
          <Divider />
          <div style={{ fontWeight: 'bold', marginBlockEnd: 12 }}>以下为涉及的数据，可以添加至表格查看/分析内容：</div>
          {agentMessage.refTable?.map((tableInfo, index) => (
            <SmartTableCard key={`table-${index}`} tableIndex={index} agentMessage={agentMessage} info={tableInfo} />
          ))}
        </>
      )}

      <div style={{ display: 'flex' }}>
        <AICopyButton axiosEntWeb={entWebAxiosInstance} content={content} />
        <AILikeButton axiosEntWeb={entWebAxiosInstance} content={content} question={agentMessage.rawSentence} />
        <AIDislikeButton
          axiosChat={axiosInstance}
          axiosEntWeb={entWebAxiosInstance}
          content={content}
          question={agentMessage.rawSentence}
        />
      </div>
    </div>
  )
}
