import { requestToSuperlistFcs, requestToWFCSuperlistFcs } from '@/api'
import { FormInstance, message } from 'antd'
import { nanoid } from 'nanoid'
import { useCallback, useEffect, useRef, useState } from 'react'
// import { useVisTableContext } from '@/components/VisTable/context/VisTableContext'
import { CModal } from '@/components/Modal'
import { RunTypeEnum } from '@/components/VisTable/components/SmartFillModal/config/formConfig'
import { COLUMN_GENERATING_TEXT, GENERATE_TEXT } from '@/components/VisTable/config/status'
import { useSuperChatRoomContext } from '@/contexts/SuperChat'
import { useTableOperations } from '@/contexts/SuperChat/tableActions'
import { postPointBuried } from '@/utils/common/bury'
import { generateUniqueName } from '@/utils/common/data'
import { processMentions } from '@/utils/prompt-processor'
import { AiInsertColumnRequest, AiToolEnum, RowData, SourceTypeEnum } from 'gel-api'
import { t } from 'gel-util/intl'
import { superListTools } from '../../../index.json'
import { FOOTER_CONSTANTS } from '../constants'

const AI_INSERT_COLUMN_API = 'superlist/excel/aiInsertColumn'
const AI_GENERATE_COLUMN_NAME_API = 'intelligentFill/generateColumnName'
const BATCH_SIZE = FOOTER_CONSTANTS.BATCH.SIZE
const BATCH_DELAY = FOOTER_CONSTANTS.BATCH.DELAY

const STRINGS = {
  CREDITS_CHANGED_ERROR: t('464167', '积分因行数调整变更，请重新确认'),
  CREDITS_PRECHECK_FAILED: t('464169', '积分预检失败，请重试'),
  FORM_VALIDATION_ERROR: t('464203', '请至少@一列'),
  SAVE_FAILED_ERROR: t('215345', '保存失败'),
  RUN_ALL_FAILED_ERROR: t('464220', '运行全部失败'),
}

const BURY_NAME = {
  SAVE_NO_RUN: '保存不运行',
  RUN_ALL: '运行全部',
}

interface BatchUpdateItem {
  rowData: Omit<RowData, 'rowId'>
  updateIndex: number
}

interface UseFooterLogicProps {
  credits: number
  form: FormInstance
  columns: { value: string; label: string; field: string }[]
  onClose: () => void
  updateChecked: (checked: boolean) => void
  checked: boolean
}

export const useFooterLogic = ({ credits, form, columns, onClose, updateChecked, checked }: UseFooterLogicProps) => {
  const { activeSheetId, sheetRefs } = useSuperChatRoomContext()
  const { addColumn, updateColumn, updateRecordsStatus } = useTableOperations()
  // const { addColumn, updateRecords, selectCell, setCellValue, runColumn } = useTableActions()

  // 用于取消批处理的ref
  const batchCancelRef = useRef<(() => void) | null>(null)

  // 按钮loading状态
  const [saveLoading, setSaveLoading] = useState(false)
  const [runAllLoading, setRunAllLoading] = useState(false)

  // 积分显示状态 - 用于处理积分变化的情况
  const [displayCredits, setDisplayCredits] = useState<number | null>(null)

  // 监听积分相关数据变化，重置积分显示状态
  useEffect(() => {
    if (displayCredits !== null) {
      // 当积分或行数发生变化时，重置到统计展示
      setDisplayCredits(null)
    }
  }, [credits, sheetRefs?.[activeSheetId]?.recordsCount])

  /**
   * 批量更新单元格数据，使用requestAnimationFrame优化性能
   */
  const batchUpdateCells = useCallback(
    (
      batchData: BatchUpdateItem[],
      onComplete?: () => void,
      onProgress?: (processed: number, total: number) => void
    ) => {
      if (batchData.length === 0) {
        onComplete?.()
        return
      }

      let currentIndex = 0
      let rafId: number | null = null
      let isCancelled = false

      const processBatch = () => {
        if (isCancelled) return

        const endIndex = Math.min(currentIndex + BATCH_SIZE, batchData.length)
        const currentBatch = batchData.slice(currentIndex, endIndex)

        if (currentBatch.length > 0) {
          // const rowData = currentBatch.map((item) => item.rowData)
          // const updateIndexes = currentBatch.map((item) => item.updateIndex)

          // 批量更新当前批次
          // updateRecords(rowData, updateIndexes)

          currentIndex = endIndex
          onProgress?.(currentIndex, batchData.length)

          // 如果还有数据需要处理，继续下一批
          if (currentIndex < batchData.length) {
            rafId = requestAnimationFrame(() => {
              setTimeout(processBatch, BATCH_DELAY)
            })
          } else {
            // 处理完成
            onComplete?.()
          }
        } else {
          onComplete?.()
        }
      }

      // 设置取消函数
      batchCancelRef.current = () => {
        isCancelled = true
        if (rafId) {
          cancelAnimationFrame(rafId)
          rafId = null
        }
      }

      // 开始处理
      processBatch()
    },
    []
    // [updateRecords]
  )

  const insertAIColumnHandler = async ({
    Data,
    columnId,
    runType,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Data: any
    columnId: string
    runType: RunTypeEnum
  }) => {
    const displayRowIds = sheetRefs?.[activeSheetId]?.records.map((item) => item.rowId) || []

    const resultDataMap = Data.data.reduce(
      (map, item) => {
        if (item.rowId) {
          map[item.rowId] = item
        }
        return map
      },
      {} as Record<string, (typeof Data.data)[0]>
    )

    // 构建批处理数据
    const batchData: BatchUpdateItem[] = []

    displayRowIds.forEach((rowId, index) => {
      if (resultDataMap[rowId]) {
        batchData.push({
          rowData: {
            [columnId]: runType === RunTypeEnum.RUN_ALL ? GENERATE_TEXT : '',
            [`${columnId}&`]: {
              ...resultDataMap[rowId],
              sourceType: SourceTypeEnum.AI_GENERATE_COLUMN,
            },
          },
          updateIndex: index,
        })
      }
    })

    // 使用批处理更新
    if (batchData.length > 0) {
      batchUpdateCells(batchData, () => {
        // selectCell(columns.length + 1, 0)
      })
    }
  }

  const generateColumnName = async ({ prompt, columnId }: { prompt: string; columnId: string }) => {
    const { Data } = await requestToSuperlistFcs(AI_GENERATE_COLUMN_NAME_API, {
      promptText: prompt as string,
      sheetId: Number(activeSheetId),
      columnId,
    })
    if (Data?.msg) {
      updateColumn(columnId, generateUniqueName({ name: Data?.msg, list: columns, key: 'label' }))
    }
  }

  /**
   * 构建工具配置
   */
  const buildToolsConfig = (values: {
    enableLinkTool?: boolean
    enableWindBrowser?: boolean
    enableWindDPU?: boolean
  }) => {
    const { enableLinkTool, enableWindBrowser, enableWindDPU } = values || {}
    const constructedTools = {} as Record<AiToolEnum, object>

    const linkToolConfig = superListTools.find((res) => res.key === 'enableLinkTool')
    if (linkToolConfig?.id && enableLinkTool) {
      constructedTools[linkToolConfig.id as AiToolEnum] = {}
    }

    const browserToolConfig = superListTools.find((res) => res.key === 'enableWindBrowser')
    if (browserToolConfig?.id && enableWindBrowser) {
      constructedTools[browserToolConfig.id as AiToolEnum] = {}
    }

    const dpuToolConfig = superListTools.find((res) => res.key === 'enableWindDPU')
    if (dpuToolConfig?.id && enableWindDPU) {
      constructedTools[dpuToolConfig.id as AiToolEnum] = {}
    }

    return constructedTools
  }

  /**
   * 预检积分数量
   */
  const preCheckCredits = async (): Promise<boolean> => {
    if (displayCredits !== null) {
      return true
    }
    const currentTotal = credits * (sheetRefs?.[activeSheetId]?.recordsCount ?? 0)
    const values = form.getFieldsValue()
    const constructedTools = buildToolsConfig(values)

    try {
      const { Data } = await requestToWFCSuperlistFcs('superlist/excel/customerPointCountByAIColumn', {
        sheetId: Number(activeSheetId),
        aiModel: values.aiModel,
        tool: constructedTools,
      })

      if (!Data) {
        return false
      }

      if (Data?.pointTotal !== currentTotal) {
        // 更新显示的积分数量，让用户看到变化
        setDisplayCredits(Data.pointTotal)
        message.error(STRINGS.CREDITS_CHANGED_ERROR)
        return false
      }

      // 预检通过，重置显示状态
      setDisplayCredits(null)
      return true
    } catch (error) {
      console.error('积分预检失败:', error)
      // message.error(STRINGS.CREDITS_PRECHECK_FAILED)
      return false
    }
  }

  /**
   * 表单验证
   */
  const validateForm = (): boolean => {
    const values = form.getFieldsValue()
    const { prompt } = values || {}

    if (!prompt || !prompt.includes('@')) {
      message.error(STRINGS.FORM_VALIDATION_ERROR)
      return false
    }

    return true
  }

  const aiInsertColumn = async (runType: RunTypeEnum): Promise<{ prompt: string; columnId: string }> => {
    const columnId = nanoid(FOOTER_CONSTANTS.BUSINESS.COLUMN_ID_LENGTH)
    const values = form.getFieldsValue()
    const { prompt, aiModel, enableAutoUpdate } = values || {}

    const promptPattern = processMentions(prompt as string, columns)
    const constructedTools = buildToolsConfig(values)

    const options: AiInsertColumnRequest = {
      prompt,
      aiModel,
      columnId,
      columnIndex: columns.length + FOOTER_CONSTANTS.BUSINESS.COLUMN_INDEX_OFFSET,
      sheetId: Number(activeSheetId),
      promptPattern,
      enableAutoUpdate,
      tool: constructedTools,
    }

    const { Data } = await requestToWFCSuperlistFcs(AI_INSERT_COLUMN_API, options)

    if (values) {
      // addColumn(columns.length, {
      //   columnId,
      //   title: COLUMN_GENERATING_TEXT,
      //   initSourceType: SourceTypeEnum.AI_GENERATE_COLUMN,
      //   width: FOOTER_CONSTANTS.BUSINESS.COLUMN_DEFAULT_WIDTH,
      // })
    }

    if (Data?.data?.length) {
      insertAIColumnHandler({ columnId, Data, runType })
    }

    return { prompt, columnId }
  }

  const handleSaveNoRun = async () => {
    // 表单验证
    if (!validateForm()) {
      return
    }

    setSaveLoading(true)

    try {
      // 取消之前可能的批处理任务
      if (batchCancelRef.current) {
        batchCancelRef.current()
        batchCancelRef.current = null
      }

      const res = await aiInsertColumn(RunTypeEnum.SAVE_BUT_NOT_RUN)
      if (res) {
        onClose()
      }
      addColumn({
        columnId: res.columnId,
        width: FOOTER_CONSTANTS.BUSINESS.COLUMN_DEFAULT_WIDTH,
        columnName: COLUMN_GENERATING_TEXT,
        initSourceType: SourceTypeEnum.AI_GENERATE_COLUMN,
      })
      if (typeof res !== 'boolean') {
        generateColumnName({ prompt: res.prompt, columnId: res.columnId })
      }
      postPointBuried('922604570306', { run: BURY_NAME.SAVE_NO_RUN })
    } catch (error) {
      console.error('保存失败:', error)
      message.error(STRINGS.SAVE_FAILED_ERROR)
    } finally {
      setSaveLoading(false)
    }
  }

  const handleRunAll = async () => {
    // 表单验证
    if (!validateForm()) {
      return
    }

    const executeRunAll = async () => {
      updateChecked(true)
      setRunAllLoading(true)
      try {
        // 积分预检
        const preCheckPassed = await preCheckCredits()
        if (!preCheckPassed) {
          return
        }

        // 取消之前可能的批处理任务
        if (batchCancelRef.current) {
          batchCancelRef.current()
          batchCancelRef.current = null
        }

        const res = await aiInsertColumn(RunTypeEnum.RUN_ALL)
        if (res) {
          onClose()
        }

        setTimeout(() => {
          addColumn({
            columnId: res.columnId,
            width: FOOTER_CONSTANTS.BUSINESS.COLUMN_DEFAULT_WIDTH,
            columnName: COLUMN_GENERATING_TEXT,
            initSourceType: SourceTypeEnum.AI_GENERATE_COLUMN,
          })
          updateRecordsStatus(res.columnId)
          if (typeof res !== 'boolean') {
            generateColumnName({ prompt: res.prompt, columnId: res.columnId })
          }
          // runColumn({ col: columns.length + 1 })
        }, 1000)
        postPointBuried('922604570306', { run: BURY_NAME.RUN_ALL })
      } catch (error) {
        console.error('运行全部失败:', error)
        message.error(STRINGS.RUN_ALL_FAILED_ERROR)
      } finally {
        setRunAllLoading(false)
      }
    }

    // 使用须知弹窗：若未勾选“后续默认为我勾中提示”，则先提示
    if (checked) {
      await executeRunAll()
      return
    }

    CModal.confirm({
      modalType: 'AI_GENERATE_COLUMN',
      onOk: () => executeRunAll(),
    })
  }

  return {
    saveLoading,
    runAllLoading,
    displayCredits,
    handleSaveNoRun,
    handleRunAll,
  }
}
