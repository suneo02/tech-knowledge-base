import { createWFCSuperlistRequestFcs } from '@/api/handleFcs'
import { CoinsIcon } from '@/assets/icon'
import { SplTableModal } from '@/components/SplTable/components/SplTableModal'
import { fetchPoints, selectVipStatus, useAppDispatch, useAppSelector, VipStatusEnum } from '@/store'
import { postPointBuried } from '@/utils/common/bury'
import { FullscreenO } from '@wind/icons'
import { Button, Card, Divider, message } from '@wind/wind-ui'
import Table, { ColumnProps } from '@wind/wind-ui-table'
import { useRequest } from 'ahooks'
import { SplTable } from 'gel-api'
import { t } from 'gel-util/intl'
import { FC, memo, useEffect, useMemo, useRef, useState } from 'react'
import { InsertTableButton } from '../../../SplTable/components/InsertTableButton'
import styles from './index.module.less'
import type { HeaderItem, RowItem } from './components'
import { buildColumns, buildDataSource, DEFAULT_COLUMN_WIDTH } from './components'
import type { ISheetInfo } from '@/contexts/SuperChat/TableContext'
import { useSuperChatRoomContext } from '@/contexts/SuperChat'

const PREFIX = 'super-chat-ai-table'
const STRINGS = {
  INSERT_TABLE_SUCCESS: t('464156', '插入成功'),
  // INSERT_TABLE_ERROR: t('464144', '插入失败'),
  NO_TABLE_SELECTED: t('464151', '无法确定要插入的表格，请先选择一个表格标签页'),
  SHOW_ROWS: (total: number) => t('464111', '展示10条数据，查看全量数据（共{{total}}条）请插入到表格', { total }),
  INSERT_BUSY: t('', '您已有一个表格正在插入中，请稍候'),
}

const addDataToSheetFunc = createWFCSuperlistRequestFcs('superlist/excel/addDataToSheet')

const SuperListTableCard: FC<{
  tableIndex: number
  tableInfo: SplTable
  answer?: string
  rawSentence?: string
  rawSentenceID?: string
  getActiveSheetId: () => string
  getTableId: () => string
  getChatId: () => string
  addDataToCurrentSheet: (placement: 'bottom' | 'right') => (newSheetInfos: ISheetInfo[]) => void
}> = ({
  tableIndex,
  tableInfo,
  answer,
  rawSentence,
  rawSentenceID,
  getActiveSheetId,
  getTableId,
  getChatId,
  addDataToCurrentSheet,
}) => {
  console.log('🚀 ~ SuperListTableCard ~ tableIndex:', tableIndex)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const dispatch = useAppDispatch()
  const [enableInsert, setEnableInsert] = useState(true)
  const { isInsertTableInProgress, setInsertTableInProgress } = useSuperChatRoomContext()

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
      setInsertTableInProgress(true)
    },
    onFinally: () => {
      setEnableInsert(true)
      setInsertTableInProgress(false)
    },
    manual: true,
  })

  const columns: ColumnProps<Record<string, unknown>>[] = useMemo(() => {
    const headers = (tableInfo.headers || []) as HeaderItem[]
    const rows = (tableInfo.rows || []) as RowItem[]
    return buildColumns(headers, rows, { enableLinking: true, defaultWidth: DEFAULT_COLUMN_WIDTH })
  }, [tableInfo.headers, tableInfo.rows])

  const dataSource = useMemo(() => {
    const headers = (tableInfo.headers || []) as HeaderItem[]
    const rows = (tableInfo.rows || []) as RowItem[]
    return buildDataSource(headers, rows)
  }, [tableInfo.rows, tableInfo.headers])

  if (!tableInfo || !tableInfo.rows) return null

  const vipStatus = useAppSelector(selectVipStatus)
  const grade = useMemo(
    () => (vipStatus === VipStatusEnum.SVIP ? 'svip' : vipStatus === VipStatusEnum.VIP ? 'vip' : 'free'),
    [vipStatus]
  )
  const onInsertTable = () => {
    if (isInsertTableInProgress) {
      message.warning(STRINGS.INSERT_BUSY)
      return
    }
    if (!tableInfo) return
    const currentActiveSheetId = getActiveSheetId()
    if (!currentActiveSheetId) {
      message.error(STRINGS.NO_TABLE_SELECTED)
      return
    }
    const headers = (tableInfo.headers || []) as HeaderItem[]
    const names = headers.map((h) => h.title).join(',')
    postPointBuried('922604570288', {
      title: tableInfo.title,
      name: names,
      credit: tableInfo.rows.length,
      grade,
    })
    addDataToSheet({
      tableId: getTableId(),
      dataType: 'AI_CHAT_SPL_TABLE',
      rawSentenceID: rawSentenceID || '',
      rawSentence: rawSentence || '',
      answers: answer || '',
      sheetId: Number(currentActiveSheetId),
      sheetName: tableInfo.title,
      chatId: getChatId(),
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

const MemoSuperListTableCard = memo(SuperListTableCard)

export const SplTableCard: FC<{
  splTables: SplTable[]
  answer?: string
  rawSentence?: string
  rawSentenceID?: string
  getActiveSheetId: () => string
  getTableId: () => string
  getChatId: () => string
  addDataToCurrentSheet: (placement: 'bottom' | 'right') => (newSheetInfos: ISheetInfo[]) => void
}> = ({
  splTables,
  answer,
  rawSentence,
  rawSentenceID,
  getActiveSheetId,
  getTableId,
  getChatId,
  addDataToCurrentSheet,
}) => {
  const hasSplTables = splTables && splTables.length > 0
  if (!hasSplTables) return null
  return (
    <div style={{ width: '100%' }}>
      {splTables.map((tableInfo, index) => (
        <MemoSuperListTableCard
          key={`spl-table-${tableInfo.tableIndex || index}`}
          tableIndex={tableInfo.tableIndex || index}
          tableInfo={tableInfo}
          answer={answer}
          rawSentence={rawSentence}
          rawSentenceID={rawSentenceID}
          getActiveSheetId={getActiveSheetId}
          getTableId={getTableId}
          getChatId={getChatId}
          addDataToCurrentSheet={addDataToCurrentSheet}
        />
      ))}
    </div>
  )
}

SuperListTableCard.displayName = 'SuperListTableCard'
MemoSuperListTableCard.displayName = 'SuperListTableCard'
SplTableCard.displayName = 'SplTableCard'

export const SplTableRoleComp: FC<{ content: SplTable[] }> = ({ content }) => {
  const { chatId, tableId, addDataToCurrentSheet, activeSheetId } = useSuperChatRoomContext()

  const chatIdRef = useRef(chatId)
  const tableIdRef = useRef(tableId)
  const activeSheetIdRef = useRef(activeSheetId)
  const addDataToCurrentSheetRef = useRef(addDataToCurrentSheet)

  useEffect(() => {
    chatIdRef.current = chatId
  }, [chatId])

  useEffect(() => {
    tableIdRef.current = tableId
  }, [tableId])

  useEffect(() => {
    activeSheetIdRef.current = activeSheetId
  }, [activeSheetId])

  useEffect(() => {
    addDataToCurrentSheetRef.current = addDataToCurrentSheet
  }, [addDataToCurrentSheet])

  const getChatId = () => chatIdRef.current
  const getTableId = () => tableIdRef.current
  const getActiveSheetId = () => activeSheetIdRef.current
  const addDataToCurrentSheetStable = (placement: 'bottom' | 'right') => addDataToCurrentSheetRef.current(placement)

  return (
    <SplTableCard
      splTables={content}
      getActiveSheetId={getActiveSheetId}
      getTableId={getTableId}
      getChatId={getChatId}
      addDataToCurrentSheet={addDataToCurrentSheetStable}
    />
  )
}
