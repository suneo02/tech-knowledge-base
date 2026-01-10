import { getServerApi } from '@/api/serverApi'
import { TitleAttachmentRender } from '@/components/company/info/comp/misc'
import InnerHtml from '@/components/InnerHtml'
import intl from '@/utils/intl'
import { InfoCircleO } from '@wind/icons'
import { Button, Tooltip } from '@wind/wind-ui'
import Table from '@wind/wind-ui-table' // 根据实际路径调整
import { HorizontalTableProps } from '@wind/wind-ui-table/lib/HorizontalTable'
import React, { useState } from 'react'

const { HorizontalTable } = Table

const STRINGS = {
  LOADING: intl('421580', '加载中…'),
}

export const getIndustry = (dataIndex: string) => {
  return getServerApi({
    api: `detail/industriesInfo/listIndustries/${dataIndex}`,
    noExtra: true,
    params: {
      industryId: dataIndex,
    },
  })
}

// 修改 fetchTooltipData 以正确使用 axios 并处理响应
const fetchTooltipData = async (dataIndex: string): Promise<string> => {
  try {
    const response = await getIndustry(dataIndex)
    if (window.en_access_config) {
      const str = response?.Data?.records[0]?.industryDescriptionEn
      return str || ''
    }
    const str = response?.Data?.records[0]?.industryDescription
    return str || ''
  } catch (error) {
    console.error(`获取 ${dataIndex} 的 tooltip 数据失败:`, error)
    return ''
  }
}

// 扩展行项目接口，添加description属性
interface RowItemWithDescription {
  title: string
  dataIndex: string
  titleWidth?: number
  contentWidth?: number
  tooltip?: string
  download?: {
    fileName: string
    filePath: string
  }
  noTooltip?: boolean
}

interface SmartHorizontalTableProps extends HorizontalTableProps {
  hideRowIfEmpty?: boolean
  rows: RowItemWithDescription[][]
}

/**
 * 智能水平表格组件
 * @author Calvin
 * @description
 *  `SmartHorizontalTable` 是一个增强的水平表格组件，它允许您：
 *  1. 灵活定义表格的行和列结构：通过 `rows` 属性，您可以指定每一行包含的单元格数量和各自的配置（如 `title`, `dataIndex`, `titleWidth`, `contentWidth`）。
 *     `rows` 是一个二维数组，外层数组的每个元素代表一行，内层数组的每个元素代表该行中的一个单元格配置对象。
 *     例如：`[[{ title: 'A', dataIndex: 'a' }, { title: 'B', dataIndex: 'b' }], [{ title: 'C', dataIndex: 'c' }]]` 表示第一行有两列，第二行有一列。
 *  2. 嵌套数据显示：支持通过点号（`.`）访问 `dataSource` 中的嵌套数据，例如 `item.dataIndex`可以是 `'user.name'`。
 *  3. 自动隐藏空行：当 `hideRowIfEmpty` 设置为 `true` 时，如果某一行中的所有单元格的 `dataIndex` 在 `dataSource` 中都没有对应的值（或对应的值为空），则该行将被隐藏。
 *  4. 标题提示：当配置项中包含 `tooltip` 属性时，标题将显示为带有提示的形式，鼠标悬停时显示描述信息。
 *
 * @example
 * ```tsx
 * const dataSource = {
 *   companyName: '示例公司',
 *   address: {
 *     city: '上海',
 *     street: '示例街道123号',
 *   },
 *   contact: '张三',
 *   // phone: '13800138000' // 第二行的phone数据缺失
 * };
 *
 * const rowsConfig = [
 *   [
 *     { title: '公司名称', dataIndex: 'companyName', titleWidth: 100, contentWidth: 200 },
 *     { title: '城市', dataIndex: 'address.city', titleWidth: 100, contentWidth: 150 },
 *   ],
 *   [
 *     { title: '联系人', dataIndex: 'contact', titleWidth: 100, contentWidth: 200 },
 *     { title: '联系电话', dataIndex: 'phone', titleWidth: 100, contentWidth: 150 }, // 该单元格对应的phone在dataSource中无值
 *   ],
 *   [
 *     { title: '街道', dataIndex: 'address.street', titleWidth: 100, contentWidth: 350 },
 *   ]
 * ];
 *
 * // 示例1: 展示所有行 (hideRowIfEmpty = false 或不传)
 * <SmartHorizontalTable dataSource={dataSource} rows={rowsConfig} />
 * // 结果: 会展示三行，第二行的"联系电话"单元格内容为空
 *
 * // 示例2: 隐藏空行 (hideRowIfEmpty = true)
 * // 假设 dataSource 为 { companyName: '示例公司', address: { city: '上海', street: '示例街道123号' }, contact: '张三' }
 * // 此时，rowsConfig 的第二行 (联系人、联系电话) 中，'contact' 有值，但 'phone' 无值。由于该行至少有一个单元格有值，所以不会被隐藏。
 * // 如果 dataSource 为 { companyName: '示例公司', address: { city: '上海', street: '示例街道123号' } }
 * // 此时，rowsConfig 的第二行 (联系人、联系电话) 中，'contact' 和 'phone' 均无值，则该行会被隐藏。
 *
 * // 示例3: 带有描述信息的行业分类
 * const industryRowsWithTooltip = [
 *   [
 *     {
 *       title: 'WIND行业分类',
 *       dataIndex: 'windIndustry',
 *       titleWidth: 150,
 *       contentWidth: 200,
 *       tooltip: '基于万得金融终端的行业分类标准，提供了一套覆盖全市场的细分行业分类体系，广泛应用于证券投资及研究分析。'
 *     },
 *     {
 *       title: '来觅赛道',
 *       dataIndex: 'laimiTrack',
 *       titleWidth: 150,
 *       contentWidth: 200,
 *       tooltip: '来觅提供的热门新兴赛道分类，助力发现投资机会。'
 *     }
 *   ],
 *   [
 *     {
 *       title: 'WIND产业链',
 *       dataIndex: 'windIndustryChain',
 *       titleWidth: 150,
 *       contentWidth: 200,
 *       tooltip: '基于WIND数据构建的产业链图谱和分类体系。'
 *     }
 *   ]
 * ];
 * // 当配置项中包含tooltip属性时，title会被包装成Tooltip组件，鼠标悬停时显示描述信息
 * ```
 */

const SmartHorizontalTable: React.FC<SmartHorizontalTableProps> = ({
  rows,
  dataSource,
  hideRowIfEmpty = false,
  ...restProps
}) => {
  const [tooltipData, setTooltipData] = useState<
    Record<string, { loading: boolean; data: string | null; loaded: boolean }>
  >({})

  // 处理嵌套数据结构（支持形如 'a.b.c' 的 dataIndex）
  const getNestedValue = (obj: Record<string, any>, path: string) => {
    return path.split('.').reduce((acc, key) => acc?.[key], obj)
  }

  // 判断值是否为空（根据业务需求扩展空值判断逻辑）
  const isValueEmpty = (value: any): boolean => {
    if (value === null || value === undefined) return true
    if (typeof value === 'string' && value.trim() === '') return true
    if (Array.isArray(value) && value.length === 0) return true
    if (typeof value === 'object' && Object.keys(value).length === 0) return true
    return false
  }

  // 过滤空行逻辑
  const filteredRows = hideRowIfEmpty
    ? rows.filter((row) =>
        row.some((item) => {
          const value = getNestedValue(dataSource, item.dataIndex)
          return !isValueEmpty(value)
        })
      )
    : rows

  // 处理带有description的title，使用Tooltip包装
  const processedRows = filteredRows.map((row) =>
    row.map((item) => {
      console.log('🚀 ~ row.map ~ item:', item)
      if (item.noTooltip) {
        return {
          ...item,
          titleWidth: 240,
        }
      }
      const currentTooltipState = tooltipData[item.dataIndex] || { loading: false, data: null, loaded: false }

      const handleTooltipVisibleChange = async (visible: boolean) => {
        console.log('🚀 ~ handleTooltipVisibleChange ~ visible:', visible)
        if (visible && !currentTooltipState.loaded && !currentTooltipState.loading && dataSource) {
          setTooltipData((prev) => ({
            ...prev,
            [item.dataIndex]: { ...currentTooltipState, loading: true, data: null, loaded: false },
          }))
          try {
            console.log('dataSource', dataSource)
            const data = await fetchTooltipData(dataSource[item.dataIndex]?.id)
            setTooltipData((prev) => ({
              ...prev,
              [item.dataIndex]: { loading: false, data, loaded: true },
            }))
          } catch (error) {
            console.error('Failed to fetch tooltip data:', error)
            setTooltipData((prev) => ({
              ...prev,
              [item.dataIndex]: { loading: false, data: '加载失败', loaded: true }, // 标记为已加载，避免重试
            }))
          }
        }
      }

      const getTooltipTitle = () => {
        console.log('🚀 ~ getTooltipTitle ~ currentTooltipState:', currentTooltipState)
        let element: React.ReactNode = null
        if (currentTooltipState.loading) {
          element = STRINGS.LOADING
        } else if (currentTooltipState.loaded && currentTooltipState.data) {
          element = <InnerHtml html={currentTooltipState.data} visible={true} />
        } else if (item.tooltip) {
          // 初始状态或加载前，可以显示原始的 item.tooltip 作为占位符
          element = <InnerHtml html={item.tooltip} visible={true} />
        }

        if (item.download) {
          element = (
            <>
              {element}
              <TitleAttachmentRender fileName={item.download.fileName} filePath={item.download.filePath} title="" />
            </>
          )
        }

        return <>{element}</>
      }

      return {
        ...item,
        title: (
          <div>
            {item.title}
            <Tooltip title={getTooltipTitle()} onVisibleChange={handleTooltipVisibleChange}>
              <Button
                type="text"
                size="small"
                icon={
                  <InfoCircleO
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    data-uc-id="Ty8MrZ-sVK"
                    data-uc-ct="infocircleo"
                  />
                }
                data-uc-id="CvplbKqJMb"
                data-uc-ct="button"
              />
            </Tooltip>
          </div>
        ),
        titleWidth: 240, // 可以根据需要调整
      }
    })
  )

  return (
    <HorizontalTable
      rows={processedRows}
      dataSource={dataSource}
      {...restProps}
      data-uc-id="pcoPI_7u_6"
      data-uc-ct="horizontaltable"
    />
  )
}

export default SmartHorizontalTable
