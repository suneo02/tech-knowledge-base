import { Column, SourceTypeEnum } from 'gel-api'
import { IconTypeEnum } from '../types/iconTypes'
import { COLUMN_GENERATING_TEXT, ERROR_TEXT, GENERATE_TEXT, REFERENCE_EMPTY_TEXT } from '../config/status'
import { ColumnDefine } from '@visactor/vtable'
import { StylePropertyFunctionArg } from '@visactor/vtable/es/ts-types'
// import { VGroup, VImage, VText } from '@visactor/vtable'

/**
 * 表格列配置参数
 */
export type ColumnConfig = Pick<Column, 'columnId' | 'columnName' | 'initSourceType' | 'isFrozen' | 'width'>

export type ColumnReturnType = ColumnDefine & {
  isFrozen?: boolean
  initSourceType?: SourceTypeEnum
  autoWrapText?: boolean
}

/**
 * 根据列的配置生成表格列定义
 */
export const handleColumnUtils = ({
  columnId,
  columnName,
  initSourceType,
  isFrozen,
  width = 200,
}: ColumnConfig): ColumnReturnType => {
  // 源类型判断
  const isCompanySource = initSourceType === SourceTypeEnum.CDE || initSourceType === SourceTypeEnum.INDICATOR
  const isAiChatSource = initSourceType === SourceTypeEnum.AI_CHAT
  const isAiGenerateSource = initSourceType === SourceTypeEnum.AI_GENERATE_COLUMN

  // 功能启用状态
  const enableRun = isCompanySource || isAiGenerateSource
  const enableEdit =
    !initSourceType || initSourceType === SourceTypeEnum.UPLOAD_FILE || initSourceType === SourceTypeEnum.USER

  // 获取表头图标类型
  const getHeaderIcon = (): IconTypeEnum => {
    if (isAiGenerateSource) return IconTypeEnum.AI
    if (isCompanySource) return initSourceType === SourceTypeEnum.INDICATOR ? IconTypeEnum.INDEX : IconTypeEnum.COMPANY
    if (isAiChatSource) return IconTypeEnum.AI_CHAT
    return IconTypeEnum.USER
  }

  // 获取操作图标类型
  const getActionIcon = (): IconTypeEnum | undefined => {
    if (enableRun && !isFrozen) return IconTypeEnum.RUN
    if (!isFrozen && enableEdit) return IconTypeEnum.EDIT
    if (enableEdit) return IconTypeEnum.EDIT
    return undefined
  }

  // 样式处理函数
  const getTextColor = (value: string): string => {
    if ([GENERATE_TEXT, COLUMN_GENERATING_TEXT].includes(value)) return '#ccc'
    if ([REFERENCE_EMPTY_TEXT, ERROR_TEXT].includes(value)) return '#f4b9b9'
    return '#000'
  }

  const getTextStyle = (value: string): string => {
    if ([GENERATE_TEXT, COLUMN_GENERATING_TEXT].includes(value)) return 'italic'
    return 'normal'
  }

  // 默认文本处理，确保值不为undefined
  const defaultText = (text: string | undefined): string => {
    return text || ''
  }

  return {
    field: columnId,
    autoWrapText: true,
    headerEditor: 'input',
    editor: enableEdit ? 'input' : '',
    title: defaultText(columnName),
    width: typeof width === 'number' ? width : 200,
    headerIcon: getHeaderIcon(),
    icon: getActionIcon(),
    initSourceType,
    headerStyle: {
      color: ({ dataValue }: StylePropertyFunctionArg) => getTextColor(dataValue),
      fontStyle: ({ dataValue }: StylePropertyFunctionArg) => getTextStyle(dataValue),
    },
    style: {
      color: ({ dataValue }: StylePropertyFunctionArg) => getTextColor(dataValue),
      fontStyle: ({ dataValue }: StylePropertyFunctionArg) => getTextStyle(dataValue),
    },
    isFrozen,
    dropDownMenu: ['测试', '开始'],
  }
}
