import { ICorpTableCfg } from '@/components/company/type'
import { InfoCircleButton } from '@/components/icons/InfoCircle'
import { Tooltip } from '@wind/wind-ui'
import { FinancialIndicatorData } from 'gel-types'
import React, { FC } from 'react'
import intl from '../../../../utils/intl'
import { wftCommon } from '../../../../utils/utils'
import { getEmptyFinanceTableColumns } from './handleFinanceTableEmpty'

interface FinancialAnalysisProps {
  /** 接口返回的原始数据 */
  data: any[]
  /** 用于设置格式化后的财务指标列表数据 */
  setFinacialindicatorList: (list: any[]) => void
  /** 用于设置财务指标表格的列定义 */
  setFinacialindicatorColumn: (columns: any[]) => void
  /** 用于设置数据是否加载完成的状态 */
  setDataLoaded: (loaded: boolean) => void
  /** 当前表格的配置项 */
  eachTable: ICorpTableCfg
}

/**
 * 根据是否为海外上市公司，获取不同的财务指标配置
 * @param {boolean} isOverseas - 是否为海外上市公司
 * @returns {{defaultData: {reportDate: string}[], indexArr: string[]}} - 返回包含默认行数据和指标key数组的配置对象
 */
const getFinancialAnalysisColumns = (
  res: FinancialIndicatorData[]
): { defaultData: { reportDate: string; tooltip?: string }[]; indexArr: (keyof FinancialIndicatorData)[] } => {
  let isOverseas = false
  try {
    if (res && res.length) {
      isOverseas = res.some((item) => item.stockType === 'overseas')
    }
  } catch (error) {
    isOverseas = false
  }
  if (!isOverseas) {
    return {
      // 财务指标
      // 预设的表格行数据，每行代表一个财务指标
      defaultData: [
        { reportDate: intl('452477', '资产负债率(%)') },
        {
          reportDate: intl('437679', '净利润增长率') + '(%)',
          tooltip: intl('365156', '净利润增长率指单季度净利润同比增长率'),
        },
        { reportDate: intl('452474', '销售毛利率(%)') },
        {
          reportDate: intl('437694', '净资产收益率') + '(%)',
          tooltip: intl('365157', '净资产收益率指净资产收益率（年化）'),
        },
        {
          reportDate: intl('437695', '总资产回报率') + '(%)',
          tooltip: intl('365145', '总资产报酬率指总资产报酬率（年化）'),
        },
        { reportDate: intl('437696', '流动比率') },
        { reportDate: intl('437697', '速动比率') },
      ],
      // 与`defaultData`中的指标一一对应的API数据字段名（key）
      indexArr: [
        'assentDebtRate',
        'singQuarterNetProfitGrowth',
        'rawProfitOfSaling',
        'yearNetAssetProfitRate',
        'yearNetAssetGuerdonRate',
        'floatingProporting',
        'speedProportiong',
      ],
    }
  } else {
    return {
      // 财务指标
      // 预设的表格行数据，每行代表一个财务指标
      defaultData: [
        { reportDate: intl('452477', '资产负债率(%)') },
        { reportDate: intl('452474', '销售毛利率(%)') },
        { reportDate: intl('452475', '营业利润率(%)') },
        { reportDate: intl('452494', '净利润率(%)') },
        {
          reportDate: intl('437694', '净资产收益率') + '(%)',
          tooltip: intl('365157', '净资产收益率指净资产收益率（年化）'),
        },
        {
          reportDate: intl('452476', '投入资本回报率(%)'),
          tooltip: intl('453174', '投入资本回报率指投入资本回报率（年化）'),
        },
        { reportDate: intl('437696', '流动比率') },
        { reportDate: intl('437697', '速动比率') },
      ],
      // 与`defaultData`中的指标一一对应的API数据字段名（key）
      indexArr: [
        'assentDebtRate',
        'rawProfitOfSaling',
        'manageProfitDivideTaking',
        'saleNetProfit',
        'yearNetAssetProfitRate',
        'yearOfInvestAssetIncome',
        'floatingProporting',
        'speedProportiong',
      ],
    }
  }
}

/**
 * @description 渲染财务分析模块的核心逻辑组件。
 * 该组件不直接渲染UI，而是负责处理从API获取的财务数据，
 * 将其转换成表格所需的列定义（columns）和行数据（list），
 * 并通过props中的回调函数将处理后的数据传递给父组件进行渲染。
 * @param {FinancialAnalysisProps} props - 组件属性
 * @returns {null} 该组件不渲染任何DOM元素
 */
export const renderFinanceanalysis: FC<FinancialAnalysisProps> = ({
  data: res,
  setFinacialindicatorList,
  setFinacialindicatorColumn,
  setDataLoaded,
  eachTable,
}) => {
  // 根据是否为海外公司获取财务指标的配置，目前硬编码为`false`（非海外）
  const { defaultData, indexArr } = getFinancialAnalysisColumns(res)

  // 如果接口没有返回数据，则清空列表并直接返回，不进行后续处理
  if (!res?.length) {
    const columns = getEmptyFinanceTableColumns()
    setFinacialindicatorColumn(columns)
    setFinacialindicatorList([])
    setDataLoaded(true)
    return null
  }

  // 初始化表格列配置，第一列是固定的"报告期"列
  const columns: any[] = [
    {
      title: intl('1794', '报告期'),
      dataIndex: 'reportDate',
      width: window.en_access_config ? '24%' : '22%',
      // 自定义渲染第一列的内容
      render: (text: string, record: { tooltip?: string }) => {
        // 如果行数据中包含tooltip字段，则渲染带提示的图标
        if (record.tooltip) {
          return (
            <>
              {text}{' '}
              <Tooltip overlayClassName="corp-tooltip" title={<div>{record.tooltip}</div>}>
                <InfoCircleButton />
              </Tooltip>
            </>
          )
        }
        // 否则直接返回文本
        return text
      },
    },
  ]

  // 遍历接口返回的数据（`res`），`res`中的每个`item`代表一个报告期（一列）的数据
  res.forEach((item, index) => {
    // 为每个报告期动态添加一列
    columns.push({
      title: item?.reportDate, // 列头是报告期日期
      dataIndex: indexArr[index], // `dataIndex`使用`indexArr`中对应的值，用于关联行数据
      width: (window.en_access_config ? 76 : 80) / res.length + '%',
      align: 'right',
      // 渲染单元格数据，使用`wftCommon.formatMoneyTemp`进行格式化
      render: (txt: any) => {
        return wftCommon.formatMoneyTemp(txt, [2, ' '])
      },
    })
    // `reportDate`已用作列标题，从原始数据中删除，避免影响后续处理
    delete item['reportDate']

    // --- 核心数据转换逻辑 ---
    // `res` 的数据结构是: `[{ reportDate: '2023-12-31', assentDebtRate: 1, ... }, { reportDate: '2023-09-30', assentDebtRate: 2, ... }]` (按列组织)
    // `defaultData` 的目标结构是: `[{ reportDate: '资产负债率%', 'assentDebtRate': 1, ... }, { reportDate: '净利润增长率%', 'singQuarterNetProfitGrowth': 2, ... }]` (按行组织)
    // 此处遍历`indexArr`（所有财务指标的key），将`item`（某一列的数据）中的值，填充到`defaultData`（所有行）中对应的位置
    indexArr.forEach((item1, index1) => {
      // `defaultData[index1]` 是某一个指标所在的行
      // `indexArr[index]` 是当前报告期（列）的 `dataIndex`
      // `item[item1]` 是当前报告期（列）下，`item1`这个指标的值
      defaultData[index1][indexArr[index]] = item[item1]
    })
  })

  // 通过回调函数更新父组件的状态
  // 更新表格的列定义
  setFinacialindicatorColumn(columns)
  // 更新表格的行数据
  setFinacialindicatorList(defaultData)
  // 标记数据已加载完成
  setDataLoaded(true)
  if (eachTable.financialDataFilterFunc) {
    eachTable.financialDataFilterFunc(eachTable.financialDataUnitFilter)
  }

  // 组件本身不渲染任何内容
  return null
}

export default renderFinanceanalysis
