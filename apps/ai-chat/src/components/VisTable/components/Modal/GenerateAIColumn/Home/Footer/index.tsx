import { CoinsIcon } from '@/assets/icon'
import { Button } from '@wind/wind-ui'
import { FormInstance } from 'antd'
import styles from './index.module.less'
import { requestToSuperlistFcs, requestToWFCSuperlistFcs } from '@/api'
import { useVisTableContext } from '@/components/VisTable/context/VisTableContext'
import { nanoid } from 'nanoid'
import { processMentions } from '@/utils/prompt-processor'
import { AiInsertColumnRequest, AiToolEnum, RowData, SourceTypeEnum } from 'gel-api'
import { useTableActions } from '@/components/VisTable/hooks/useTableActions'
import { COLUMN_GENERATING_TEXT, GENERATE_TEXT } from '@/components/VisTable/config/status'
import { RunTypeEnum } from '@/components/VisTable/components/SmartFillModal/config/formConfig'
import { generateUniqueName } from '@/utils/common/data'
import { superListTools } from '../../index.json'

const STRINGS = {
  SAVE_NO_RUN_BUTTON: '保存不运行',
  RUN_ALL_BUTTON: '运行全部',
  RUN_TOP_10_BUTTON: '运行前10条',
  CREDITS_PER_ITEM: '/ 条',
}

const PREFIX = 'generate-ai-column-home-footer'

const AI_INSERT_COLUMN_API = 'superlist/excel/aiInsertColumn'
const AI_GENERATE_COLUMN_NAME_API = 'intelligentFill/generateColumnName'
const Footer = ({
  credits,
  form,
  columns,
  onClose,
}: {
  credits: number
  form: FormInstance
  columns: { value: string; label: string; field: string }[]
  onClose: () => void
}) => {
  const { sheetId, getDisplayRowIds, getColByColumnId } = useVisTableContext()
  const { addColumn, updateRecords, selectCell, setCellValue, runColumn } = useTableActions()

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
    const displayRowIds = getDisplayRowIds()

    const resultDataMap = Data.data.reduce(
      (map, item) => {
        if (item.rowId) {
          map[item.rowId] = item
        }
        return map
      },
      {} as Record<string, (typeof Data.data)[0]>
    )

    // 根据显示行ID的顺序创建要更新的数据
    const rowData: Omit<RowData, 'rowId'>[] = []
    const updateIndexes: number[] = []

    // 遍历显示行ID，按正确顺序构建数据
    displayRowIds.forEach((rowId, index) => {
      // 如果该行ID在结果数据中存在
      if (resultDataMap[rowId]) {
        rowData.push({
          [columnId]: runType === RunTypeEnum.RUN_ALL ? GENERATE_TEXT : '',
          [`${columnId}&`]: {
            ...resultDataMap[rowId],
            sourceType: SourceTypeEnum.AI_GENERATE_COLUMN,
          },
        })
        updateIndexes.push(index)
      }
    })
    // 只有在有数据需要更新时才更新
    if (rowData.length > 0) {
      updateRecords(rowData, updateIndexes)
      selectCell(columns.length + 1, 0)
    }
  }

  const generateColumnName = async ({ prompt, columnId }) => {
    const { Data } = await requestToSuperlistFcs(AI_GENERATE_COLUMN_NAME_API, {
      promptText: prompt as string,
      sheetId: sheetId as number,
      columnId,
    })
    if (Data?.msg) {
      const colIndex = getColByColumnId(columnId)
      if (colIndex !== null) {
        setCellValue(colIndex, 0, generateUniqueName({ name: Data?.msg, list: columns, key: 'label' }))
      }
    }
  }

  const aiInsertColumn = async (runType: RunTypeEnum): Promise<boolean | { prompt: string; columnId: string }> => {
    const columnId = nanoid(14)
    const values = form.getFieldsValue()
    const { prompt, aiModel, enableLinkTool, enableWindBrowser, enableWindDPU, enableAutoUpdate } = values || {}
    if (!prompt || !prompt.includes('@')) {
      message.error('请至少@一列')
      return false
    }
    const promptPattern = processMentions(prompt as string, columns)

    const constructedTools = {} as Record<AiToolEnum, object>
    const linkToolConfig = superListTools.find((res) => res.key === 'enableLinkTool')
    if (linkToolConfig?.id && enableLinkTool) {
      constructedTools[linkToolConfig.id as AiToolEnum] = {} // 这里的逻辑有点恶心，是为了方便以后拓展使用额外字段
    }

    const browserToolConfig = superListTools.find((res) => res.key === 'enableWindBrowser')
    if (browserToolConfig?.id && enableWindBrowser) {
      constructedTools[browserToolConfig.id as AiToolEnum] = {}
    }

    const dpuToolConfig = superListTools.find((res) => res.key === 'enableWindDPU')
    if (dpuToolConfig?.id && enableWindDPU) {
      constructedTools[dpuToolConfig.id as AiToolEnum] = {}
    }

    const options: AiInsertColumnRequest = {
      prompt,
      aiModel,
      columnId,
      columnIndex: columns.length + 1,
      sheetId: sheetId as number,
      promptPattern,
      enableAutoUpdate,
      tool: constructedTools,
    }
    const { Data } = await requestToWFCSuperlistFcs(AI_INSERT_COLUMN_API, options)
    if (values) {
      addColumn(columns.length, {
        columnId,
        title: COLUMN_GENERATING_TEXT,
        initSourceType: SourceTypeEnum.AI_GENERATE_COLUMN,
        width: 200,
      })
    }
    if (Data?.data?.length) {
      insertAIColumnHandler({ columnId, Data, runType })
    }
    return { prompt, columnId }
  }
  const handleSaveNoRun = async () => {
    console.log('save no run', form.getFieldsValue())
    const res = await aiInsertColumn(RunTypeEnum.SAVE_BUT_NOT_RUN)
    if (res) {
      onClose()
    }
    if (typeof res !== 'boolean') {
      generateColumnName({ prompt: res.prompt, columnId: res.columnId })
    }
  }

  const handleRunAll = async () => {
    console.log('run all', form.getFieldsValue())
    if (!form.validateFields()) {
      return
    }
    const res = await aiInsertColumn(RunTypeEnum.RUN_ALL)
    if (res) {
      onClose()
    }
    if (typeof res !== 'boolean') {
      generateColumnName({ prompt: res.prompt, columnId: res.columnId })
    }

    setTimeout(() => {
      runColumn({ col: columns.length + 1 })
    }, 1000)
  }

  //   const handleRunTop10 = () => {
  //     console.log('run top 10', form.getFieldsValue())
  //   }

  return (
    <div className={styles[`${PREFIX}`]}>
      <div className={styles[`${PREFIX}-credits`]}>
        <CoinsIcon style={{ marginInlineEnd: 4 }} /> {credits} {STRINGS.CREDITS_PER_ITEM}
      </div>
      <Button onClick={handleSaveNoRun}>{STRINGS.SAVE_NO_RUN_BUTTON}</Button>
      <Button type="primary" onClick={handleRunAll} variant="alice" style={{ height: 28 }}>
        {STRINGS.RUN_ALL_BUTTON}
      </Button>
      {/* <Button type="primary" onClick={handleRunTop10} variant="alice" style={{ height: 28 }}>
    {STRINGS.RUN_TOP_10_BUTTON}
  </Button> */}
    </div>
  )
}

export default Footer
