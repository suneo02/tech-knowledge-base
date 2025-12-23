import { createWFCSuperlistRequestFcs } from '@/api/handleFcs'
import { CoinsIcon } from '@/assets/icon'
import { SplTableModal } from '@/components/SplTable/components/SplTableModal'
import { useSuperChatRoomContext } from '@/contexts/SuperChat'
import { fetchPoints, useAppDispatch } from '@/store'
import { postPointBuried } from '@/utils/common/bury'
import { FullscreenO } from '@wind/icons'
import { Button, Card, Divider, message } from '@wind/wind-ui'
import Table from '@wind/wind-ui-table'
import { useRequest } from 'ahooks'
import { SplTable } from 'gel-api'
import { SPAgentMsg } from 'gel-ui'
import { t } from 'gel-util/intl'
import { FC, useMemo, useState } from 'react'
import { InsertTableButton } from '../../../SplTable/components/InsertTableButton'
import styles from './index.module.less'

const PREFIX = 'super-chat-ai-table'
const STRINGS = {
  INSERT_TABLE_SUCCESS: t('464156', '插入成功'),
  // INSERT_TABLE_ERROR: t('464144', '插入失败'),
  NO_TABLE_SELECTED: t('464151', '无法确定要插入的表格，请先选择一个表格标签页'),
  SHOW_ROWS: (total: number) => t('464111', '展示10条数据，查看全量数据（共{{total}}条）请插入到表格', { total }),
}

const addDataToSheetFunc = createWFCSuperlistRequestFcs('superlist/excel/addDataToSheet')

const SuperListTableCard: FC<{
  tableIndex: number
  agentMessage: SPAgentMsg
  tableInfo: SplTable
}> = ({ tableIndex, agentMessage, tableInfo }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const dispatch = useAppDispatch()
  const [enableInsert, setEnableInsert] = useState(true)
  const { tableId, chatId, addDataToCurrentSheet, activeSheetId } = useSuperChatRoomContext()

  const { run: addDataToSheet, loading } = useRequest(addDataToSheetFunc, {
    onSuccess: (data) => {
      // @ts-expect-error ttt
      addDataToCurrentSheet('bottom')(data.Data.data)
      message.success(STRINGS.INSERT_TABLE_SUCCESS)

      dispatch(fetchPoints())
      setIsModalOpen(false)
    },
    onBefore: () => {
      setEnableInsert(false)
    },
    onFinally: () => {
      setEnableInsert(true)
    },
    // onError: (e) => {
    //   console.error(e)
    //   message.error(STRINGS.INSERT_TABLE_ERROR)
    // },
    manual: true,
  })

  const columns = useMemo(() => {
    if (!tableInfo.headers) return []
    return tableInfo.headers
      .filter((res) => res.isShow !== false)
      .map((res) => ({
        title: res.title,
        dataIndex: res.columnId.toString(),
        width: 150,
        ellipsis: true,
      }))
  }, [tableInfo.headers])

  const dataSource = useMemo(() => {
    if (!tableInfo?.rows) return []
    return tableInfo.rows.map((row) => {
      const item: Record<string, unknown> = {}
      tableInfo.headers.forEach((header, index) => {
        if (header.isShow === false) {
          return // Skip hidden columns to prevent data misalignment
        }

        const dataIndex = header.columnId.toString()
        const val = row[index]

        if (typeof val === 'string' && (val.includes('Label') || val.includes('answer'))) {
          try {
            item[dataIndex] = JSON.parse(val).Label || JSON.parse(val).answer || '--'
          } catch {
            item[dataIndex] = val || '--'
          }
        } else {
          item[dataIndex] = val || '--'
        }
      })
      return item
    })
  }, [tableInfo.rows, tableInfo.headers])

  if (!tableInfo || !tableInfo.rows) return null

  const onInsertTable = () => {
    const rawSentence = agentMessage.rawSentence || ''
    const rawSentenceID = agentMessage.rawSentenceID || ''

    // @ts-expect-error
    if (!agentMessage.splTable || !tableInfo) return
    if (!activeSheetId) {
      message.error(STRINGS.NO_TABLE_SELECTED)
      return
    }
    postPointBuried('922604570288', {
      title: tableInfo.title,
      credit: tableInfo.rows.length,
    })
    addDataToSheet({
      tableId,
      dataType: 'AI_CHAT_SPL_TABLE',
      rawSentenceID,
      rawSentence,
      answers: agentMessage.content,
      sheetId: Number(activeSheetId),
      sheetName: tableInfo.title,
      chatId,
      splHeaders: tableInfo.headers,
      splContent: tableInfo.rows.map((row) =>
        row.map((item) => {
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
      ),
      enablePointConsumption: 1,
    })
  }
  return (
    <>
      <Card
        title={
          <div className={styles[`${PREFIX}-card-title`]}>
            <div className={styles[`${PREFIX}-card-title-text`]}>{tableInfo.title}</div>

            {tableInfo.rows.length > 10 ? (
              <Button
                style={{ minWidth: 28 }}
                // @ts-expect-error wind-ui-icons
                icon={<FullscreenO />}
                onClick={() => setIsModalOpen(true)}
                type="text"
              />
            ) : null}
          </div>
        }
        styleType="block"
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
        <div className={styles[`${PREFIX}-card-footer`]}>
          {tableInfo.rows.length > 10 && (
            <div className={styles[`${PREFIX}-card-footer-info`]}>{STRINGS.SHOW_ROWS(tableInfo.rows.length)}</div>
          )}
          <div className={styles[`${PREFIX}-card-footer-actions`]}>
            <div className={styles[`${PREFIX}-card-footer-points`]}>
              <CoinsIcon style={{ width: 16, height: 16, marginInlineEnd: 4 }} />
              {tableInfo.rows.length}
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
      <SplTableModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tableInfo={tableInfo}
        tableIndex={tableIndex}
        onInsert={onInsertTable}
        loading={loading}
        enableInsert={enableInsert}
      />
    </>
  )
}

export const SplTableCard: FC<{
  agentMessage: SPAgentMsg
}> = ({ agentMessage }) => {
  const getSplTableData = () => {
    // @ts-expect-error
    if (agentMessage?.splTable?.length) {
      // @ts-expect-error
      return agentMessage.splTable
    }
    const messageWithData = agentMessage as SPAgentMsg & {
      data?: { result?: { splTable?: SplTable[] } }
    }
    if (messageWithData?.data?.result?.splTable?.length) {
      return messageWithData.data.result.splTable
    }
    return null
  }

  const splTableData = getSplTableData()
  const hasSplTables = splTableData && splTableData.length > 0

  if (!hasSplTables) return null

  return (
    <div style={{ width: '100%' }}>
      {splTableData?.map((tableInfo, index) => (
        <SuperListTableCard
          key={`spl-table-${tableInfo.tableIndex || index}`}
          tableIndex={tableInfo.tableIndex || index}
          agentMessage={agentMessage}
          tableInfo={tableInfo}
        />
      ))}
    </div>
  )
}
