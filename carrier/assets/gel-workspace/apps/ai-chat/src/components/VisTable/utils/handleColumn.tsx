import { parseLocaleNumber } from '@/utils/common/data'
import { ColumnDefine } from '@visactor/vtable'
import { MenuListItem, StylePropertyFunctionArg } from '@visactor/vtable/es/ts-types'
import { Column, ColumnDataTypeEnum, SourceTypeEnum } from 'gel-api'
import { COLUMN_GENERATING_TEXT, ERROR_TEXT, GENERATE_TEXT, REFERENCE_EMPTY_TEXT } from '../config/status'
import { IconTypeEnum } from '../types/iconTypes'
import { buildCompanyNameColumn } from './customLayouts/companyNameColumn'
import { buildLinkColumn } from './customLayouts/linkColumn'

/**
 * 表格列配置参数
 */
export type ColumnConfig = Pick<
  Column,
  'columnId' | 'columnName' | 'initSourceType' | 'isFrozen' | 'width' | 'columnDataType'
>

export type ColumnReturnType = ColumnDefine & {
  isFrozen?: boolean
  initSourceType?: SourceTypeEnum
  autoWrapText?: boolean
  isCompanyNameColumn?: boolean // 新增：标识是否为企业名称列
}

const MATCH_COLUMN_NAME = '企业名称'

/**
 * 生成企业详情页链接
 * @param companyName 企业名称
 * @returns 企业详情页URL
 */
// 企业详情链接生成逻辑已移动至 customLayouts/companyNameColumn.tsx

const getDropDownMenu = (initSourceType?: SourceTypeEnum): MenuListItem[] => {
  const defaultMenu: MenuListItem[] = [
    {
      text: 'AI生成列',
      menuKey: 'AI_GENERATE_COLUMN',
    },
    { text: '提取列指标', menuKey: 'RUN_PENDING' },
  ]

  if (initSourceType === SourceTypeEnum.AI_GENERATE_COLUMN) {
    return [
      {
        text: 'AI生成列',
        menuKey: 'AI_GENERATE_COLUMN',
      },
      {
        text: '编辑AI列',
        menuKey: 'EDIT_AI_COLUMN',
      },
      { text: '运行全部', menuKey: 'RUN_ALL' },
      { text: '运行待处理行', menuKey: 'RUN_PENDING' },
    ]
  }
  return defaultMenu
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
  columnDataType,
}: ColumnConfig): ColumnReturnType => {
  // 源类型判断
  const isCompanySource = initSourceType === SourceTypeEnum.CDE || initSourceType === SourceTypeEnum.INDICATOR
  const isAiChatSource = initSourceType === SourceTypeEnum.AI_CHAT
  const isAiGenerateSource = initSourceType === SourceTypeEnum.AI_GENERATE_COLUMN

  // 功能启用状态
  const enableRun = isAiGenerateSource
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
    if (value && value !== '--' && columnDataType === ColumnDataTypeEnum.WEB) return '#0596b3'
    return '#333'
  }

  const getTextStyle = (value: string): string => {
    if ([GENERATE_TEXT, COLUMN_GENERATING_TEXT].includes(value)) return 'italic'
    return 'normal'
  }

  const getSortByNumber = (v1: string, v2: string, order: string) => {
    try {
      const v1Num = parseLocaleNumber(v1)
      const v2Num = parseLocaleNumber(v2)
      console.log('🚀 ~ getSort ~ v1Num:', v1Num, v2Num, order)
      if (order === 'desc') {
        return v2Num - v1Num
      }
      return v1Num - v2Num
    } catch (error) {
      console.error('🚀 ~ error:', error)
      return 0
    }
  }

  const getSortByLocale = (a: string, b: string, order: string) => {
    try {
      if (order === 'desc') {
        return b.localeCompare(a, 'zh-CN')
      }
      return a.localeCompare(b, 'zh-CN')
    } catch (error) {
      console.error('🚀 ~ error:', error)
      return 0
    }
  }

  // 默认文本处理，确保值不为undefined
  const defaultText = (text: string | undefined): string => {
    return text || ''
  }

  // 获取文本对齐方式
  const getTextAlign = (dataType: ColumnDataTypeEnum = ColumnDataTypeEnum.TEXT) => {
    return dataType === ColumnDataTypeEnum.INTEGER ||
      dataType === ColumnDataTypeEnum.FLOAT ||
      dataType === ColumnDataTypeEnum.PERCENT
      ? 'right'
      : 'left'
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const defaultColumn: any = {
    field: columnId,
    autoWrapText: true,
    // headerEditor: 'input',
    editor: enableEdit ? 'input' : '',
    title: defaultText(columnName),
    width: typeof width === 'number' ? width : 200,
    headerIcon: getHeaderIcon(),
    icon: getActionIcon(),
    initSourceType,
    headerStyle: {
      fontStyle: ({ dataValue }: StylePropertyFunctionArg) => getTextStyle(dataValue),
      textAlign: getTextAlign(columnDataType),
    },
    style: {
      color: ({ dataValue }: StylePropertyFunctionArg) => getTextColor(dataValue),
      fontStyle: ({ dataValue }: StylePropertyFunctionArg) => getTextStyle(dataValue),
      linkColor: ({ dataValue }: StylePropertyFunctionArg) => getTextColor(dataValue),
      textAlign: getTextAlign(columnDataType),
    },
    isFrozen,
    sort:
      columnDataType === ColumnDataTypeEnum.INTEGER || columnDataType === ColumnDataTypeEnum.FLOAT
        ? (v1, v2, order) => getSortByNumber(v1, v2, order)
        : (a, b, order) => getSortByLocale(a, b, order),
    tooltip: {
      isShowOverflowTextTooltip: false,
    },
  }

  if (columnName === MATCH_COLUMN_NAME) {
    return buildCompanyNameColumn(defaultColumn) as unknown as ColumnReturnType
  } else if (columnDataType === ColumnDataTypeEnum.WEB || columnDataType === ColumnDataTypeEnum.MAIL) {
    return buildLinkColumn(defaultColumn) as unknown as ColumnReturnType
  } else {
    // defaultColumn.dropDownMenu = getDropDownMenu(initSourceType)
  }

  return defaultColumn
}
