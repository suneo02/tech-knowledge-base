import { Modal } from 'antd'
import { useEffect, useRef, useState } from 'react'

import { requestToSuperlistFcs, requestToWFCSuperlistFcs } from '@/api'
import PageTransition, { PageTransitionRef } from '@/components/common/PageTransition'
// @ts-expect-error
import { ExtendedColumnDefine } from '@/components/MultiTable/utils/columnsUtils'
import { nanoid } from '@reduxjs/toolkit'
import type { FormInstance } from 'antd/es/form'
import { AiModelEnum, AiToolEnum, RowData, SourceTypeEnum } from 'gel-api'
import { useVisTableContext } from '../../context/VisTableContext'
import { ModalFooter, ModalHeader, TemplateFormData, TemplateHome, TemplateInfo, TemplateSearch } from './components'
import { RunTypeEnum } from './config/formConfig'
import { taskTemplates } from './data'
import { PageTitleConfig, SmartFillModalProps, TaskTemplate, TemplateItem } from './types'
// @ts-expect-error
import { processAdvancedTags } from '@/utils'
import { GENERATE_TEXT } from '../../config/status'
import { useTableActions } from '../../hooks/useTableActions'

// 路由路径常量
const ROUTES = {
  HOME: '/',
  TEMPLATE_LIST: '/templates',
  TEMPLATE_DETAIL: '/template-detail',
}

const DEFAULT_HOME_FORM_DATA: TemplateFormData = {
  prompt: '',
  enableLinkTool: false,
  enableWindBrowser: true,
  enableWindDPU: true,
  enableAutoUpdate: false,
  aiModel: AiModelEnum.ALICE,
}

// 创建一个全局表单引用对象
const globalFormRef = { current: null as FormInstance<TemplateFormData> | null }

/**
 * AI生成列Modal组件
 * 用于配置AI生成列的相关参数
 */
export const SmartFillModal = ({ open, onCancel, columns, onSubmitTemplate }: SmartFillModalProps) => {
  const { visTableRef, sheetId, getColByColumnId, getAllColumns, getDisplayRowIds } = useVisTableContext()
  const { addColumn, setCellValue, updateRecords, runColumn, selectCell } = useTableActions()

  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem>()
  const [selectedTaskTemplate, setSelectedTaskTemplate] = useState<TaskTemplate>(taskTemplates[0])
  const [columnMappings, setColumnMappings] = useState<Record<string, string>>({})
  const [currentPath, setCurrentPath] = useState<string>(ROUTES.HOME)
  const [savePopoverVisible, setSavePopoverVisible] = useState<boolean>(false)
  // 添加预览内容状态
  const [previewContent, setPreviewContent] = useState<string>('')

  // 添加首页表单状态
  const [homeFormData, setHomeFormData] = useState<TemplateFormData>(DEFAULT_HOME_FORM_DATA)

  // 使用 ref 直接控制路由
  const routerRef = useRef<PageTransitionRef>(null)

  // 添加 loading 状态
  const [loading, setLoading] = useState<boolean>(false)

  // 处理列映射变更
  const handleColumnMappingChange = (fieldName: string, columnField: string) => {
    setColumnMappings((prev) => ({
      ...prev,
      [fieldName]: columnField,
    }))
  }

  // 处理选择模板
  function handleSelectTemplate(template: TemplateItem, taskTemplate: TaskTemplate) {
    setSelectedTemplate(template)
    setSelectedTaskTemplate(taskTemplate)
    // 重置列映射
    setColumnMappings({})
    // 导航到模板详情页 - 使用 next 方法前进
    routerRef.current?.next(ROUTES.TEMPLATE_DETAIL)
  }

  // 处理表单值变更
  const handleFormChange = (field: string, value: string | boolean) => {
    setHomeFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // 路由配置
  const routeConfig = [
    {
      path: ROUTES.HOME,
      element: (
        <HomeRoute
          columns={columns}
          onNavigate={(path) => routerRef.current?.next(path)}
          initialValues={homeFormData}
          onFormChange={handleFormChange}
        />
      ),
    },
    {
      path: ROUTES.TEMPLATE_LIST,
      element: <TemplateListRoute taskTemplates={taskTemplates} onSelectTemplate={handleSelectTemplate} />,
    },
    {
      path: ROUTES.TEMPLATE_DETAIL,
      element: (
        <TemplateDetailRoute
          selectedTaskTemplate={selectedTaskTemplate}
          columnMappings={columnMappings}
          onColumnMappingChange={handleColumnMappingChange}
          columns={columns}
          onPreviewChange={setPreviewContent}
        />
      ),
    },
  ]

  // 页面标题配置
  const pageTitleConfigs: Record<string, PageTitleConfig> = {
    [ROUTES.HOME]: {
      title: '生成列',
      showBack: false,
    },
    [ROUTES.TEMPLATE_LIST]: {
      title: '查看模板',
      showBack: true,
      onBack: () => {
        // 使用 back 方法回退
        routerRef.current?.back(ROUTES.HOME)
      },
    },
    [ROUTES.TEMPLATE_DETAIL]: {
      title: selectedTemplate?.name || '',
      showBack: true,
      onBack: () => {
        setSelectedTemplate(undefined)
        // 使用 back 方法回退
        routerRef.current?.back(ROUTES.TEMPLATE_LIST)
      },
    },
  }

  // 处理首页的确认操作
  const handleOk = async () => {
    // console.log('🚀 ~ handleOk ~ globalFormRef.current:', getAllColumns())
    // console.log('🚀 ~ handleOk ~ visTableRef.current:', getDisplayRowIds())

    if (globalFormRef.current) {
      const values = globalFormRef.current.getFieldsValue()
      const currentColumns = visTableRef.current?.columns || []
      // 构建工具配置
      const tool = values.enableLinkTool ? { [AiToolEnum.PC]: {} } : undefined

      // 设置 loading 状态为 true
      setLoading(true)

      try {
        // 获取处理后的 prompt，替换 @标记为 {field}
        const promptPattern = processAdvancedTags(values.prompt as string, currentColumns as ExtendedColumnDefine[])
        const enableRun = values.runType === RunTypeEnum.RUN_ALL

        // 生成唯一的列ID
        const columnId = nanoid(14)

        // 调用AI插入列接口
        const { Data } = await requestToWFCSuperlistFcs('superlist/excel/aiInsertColumn', {
          prompt: values.prompt as string,
          // @ts-expect-error
          tool: tool as { [AiToolEnum.PC]: unknown },
          aiModel: values.aiModel as AiModelEnum,
          columnId,
          columnIndex: getAllColumns().length,
          sheetId: sheetId as number,
          promptPattern,
          enableAutoUpdate: values.enableAutoUpdate || false,
        })
        if (values) {
          // runColumns()
          addColumn(getAllColumns().length - 1, {
            columnId,
            columnName: 'AI生成列名中...',
            initSourceType: SourceTypeEnum.AI_GENERATE_COLUMN,
            width: 200,
          })
        }

        if (Data?.data?.length) {
          // 获取当前表格显示的行ID顺序
          const displayRowIds = getDisplayRowIds()
          // 创建一个映射来存储 result.data 根据 rowId 的数据
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
              // @ts-expect-error
              rowData.push({
                [columnId]: enableRun ? GENERATE_TEXT : '',
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
            selectCell(getAllColumns().length, 0)
          }
        }
        // 执行提交模板操作
        if (onSubmitTemplate) {
          onSubmitTemplate(promptPattern, {
            tools: tool,
            runType: values.runType || RunTypeEnum.SAVE_BUT_NOT_RUN,
            aiModel: values.aiModel,
          })
        }
        onCancel()
        // 调用生成列名接口，获取更适合的列名
        try {
          if (enableRun) {
            // 等待表格初始化完成
            setTimeout(() => {
              runColumn({ col: getAllColumns().length - 1 })
            }, 1000)
          }
          // 使用any类型暂时绕过类型检查
          const { Data } = await requestToSuperlistFcs('intelligentFill/generateColumnName', {
            promptText: values.prompt as string,
            sheetId: sheetId as number,
            columnId,
          })

          if (Data?.msg) {
            // console.log('🚀 ~ 生成的列名:', getColByColumnId(columnId))
            const colIndex = getColByColumnId(columnId)
            if (colIndex !== null) {
              setCellValue(colIndex, 0, Data?.msg)
            }

            // 更新列
          }
        } catch (nameError) {
          console.error('生成列名失败:', nameError)
          // 失败时不阻止流程继续
        }
      } catch (error) {
        console.error('AI插入列失败:', error)
        // 这里可以添加错误提示
      } finally {
        // 完成后恢复 loading 状态
        setLoading(false)
      }
    }
  }

  // 处理使用此模板按钮点击
  const handleUseTemplate = () => {
    // 使用当前的预览内容
    if (previewContent) {
      // 更新首页表单数据
      setHomeFormData({
        ...homeFormData,
        prompt: previewContent,
        enableLinkTool: !!selectedTaskTemplate.enableLinkTool,
        enableWindBrowser: !!selectedTaskTemplate.enableWindBrowser,
        enableWindDPU: !!selectedTaskTemplate.enableWindDPU,
        enableAutoUpdate: selectedTaskTemplate?.enableAutoUpdate || false,
        aiModel: selectedTaskTemplate?.aiModel || AiModelEnum.ALICE,
        runType: selectedTaskTemplate?.runType || RunTypeEnum.RUN_ALL,
      })

      // 回退到首页
      routerRef.current?.back(ROUTES.HOME)

      // 获取当前列并处理 prompt 中的 @标记
      const currentColumns = visTableRef.current?.columns || []
      const processedPrompt = processAdvancedTags(previewContent, currentColumns as ExtendedColumnDefine[])

      // promptColumnIds
      if (onSubmitTemplate) {
        onSubmitTemplate(processedPrompt, {
          tools: selectedTaskTemplate?.enableLinkTool ? { [AiToolEnum.PC]: {} } : undefined,
          runType: selectedTaskTemplate?.runType || RunTypeEnum.RUN_TOP_10,
          aiModel: selectedTaskTemplate?.aiModel || AiModelEnum.ALICE,
        })
      }
    }
  }

  // 同步路由状态
  const handlePathChange = (path: string) => {
    setCurrentPath(path)
  }

  useEffect(() => {
    if (!open) {
      setHomeFormData({
        ...homeFormData,
        prompt: '',
        enableLinkTool: false,
        enableWindBrowser: true,
        enableWindDPU: true,
        enableAutoUpdate: false,
        aiModel: AiModelEnum.ALICE,
        runType: RunTypeEnum.RUN_ALL,
      })
      setCurrentPath(ROUTES.HOME)
    }
  }, [open])

  return (
    <Modal
      destroyOnClose
      style={{ top: 88, marginRight: 12 }}
      width={500}
      open={open}
      onCancel={onCancel}
      maskProps={{ style: { background: 'transparent' } }}
      footer={
        <ModalFooter
          currentPage={currentPath === ROUTES.HOME ? 0 : currentPath === ROUTES.TEMPLATE_LIST ? 1 : 2}
          savePopoverVisible={savePopoverVisible}
          setSavePopoverVisible={setSavePopoverVisible}
          onCancel={onCancel}
          onOk={handleOk}
          selectedTaskTemplate={selectedTaskTemplate}
          columnMappings={columnMappings}
          onUseTemplate={handleUseTemplate}
          previewContent={previewContent}
          loading={loading}
          formRef={globalFormRef}
        />
      }
      styles={{
        body: {
          height: 740,
          overflow: 'hidden',
        },
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* 标题区域 */}
        <ModalHeader currentPageConfig={pageTitleConfigs[currentPath]} />

        {/* 内容区域 - 使用PageTransition组件 */}
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          <PageTransition
            ref={routerRef}
            routes={routeConfig}
            initialPath={ROUTES.HOME}
            onPathChange={handlePathChange}
          />
        </div>
      </div>
    </Modal>
  )
}

// 首页路由组件
const HomeRoute = ({
  columns,
  onNavigate,
  initialValues,
  onFormChange,
}: {
  columns: ExtendedColumnDefine[]
  onNavigate: (path: string) => void
  initialValues: TemplateFormData
  onFormChange: (field: string, value: string | boolean) => void
}) => {
  // 创建本地表单实例
  const localFormRef = useRef<FormInstance<TemplateFormData>>(null)

  // 将本地表单实例同步到全局
  useEffect(() => {
    if (localFormRef.current) {
      globalFormRef.current = localFormRef.current
    }
  }, [localFormRef.current])

  return (
    <div style={{ height: '100%', overflow: 'auto', padding: '0 4px' }}>
      <TemplateHome
        columns={columns}
        onNextPage={() => {
          // 直接导航到模板列表页面
          // console.log('点击查看模板按钮，准备导航到:', ROUTES.TEMPLATE_LIST)
          onNavigate(ROUTES.TEMPLATE_LIST)
        }}
        initialValues={initialValues}
        onFormChange={onFormChange}
        formRef={localFormRef}
      />
    </div>
  )
}

// 模板列表路由组件
const TemplateListRoute = ({
  taskTemplates,
  onSelectTemplate,
}: {
  taskTemplates: TaskTemplate[]
  onSelectTemplate: (template: TemplateItem, taskTemplate: TaskTemplate) => void
}) => {
  return (
    <div style={{ height: '100%', overflow: 'auto', padding: '0 4px' }}>
      <TemplateSearch
        onSelectTemplate={(template, taskTemplate) => {
          onSelectTemplate(template, taskTemplate)
          // 导航由onSelectTemplate处理
        }}
        onNextPage={() => {}} // 不再需要，由onSelectTemplate处理
        taskTemplates={taskTemplates}
      />
    </div>
  )
}

// 模板详情路由组件
const TemplateDetailRoute = ({
  selectedTaskTemplate,
  columnMappings,
  onColumnMappingChange,
  columns,
  onPreviewChange,
}: {
  selectedTaskTemplate: TaskTemplate | null
  columnMappings: Record<string, string>
  onColumnMappingChange: (fieldName: string, columnField: string) => void
  columns: ExtendedColumnDefine[]
  onPreviewChange?: (content: string) => void
}) => {
  return (
    <div style={{ height: '100%', overflow: 'auto', padding: '0 4px' }}>
      <TemplateInfo
        selectedTaskTemplate={selectedTaskTemplate}
        columnMappings={columnMappings}
        onColumnMappingChange={onColumnMappingChange}
        columns={columns}
        onPreviewChange={onPreviewChange}
      />
    </div>
  )
}

export default SmartFillModal
