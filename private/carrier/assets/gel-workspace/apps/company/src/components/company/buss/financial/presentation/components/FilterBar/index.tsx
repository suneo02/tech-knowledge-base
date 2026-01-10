/**
 * 筛选条组件：单位、时间范围、报告期、报表类型与空行控制，内部表单变更200ms防抖。
 * @author yxlu.calvin
 * @example
 * <FilterBar
 *   filters={filters}
 *   variant="domestic"
 *   onFiltersChange={(u) => setFilters((p) => ({ ...p, ...u }))}
 * />
 * @remarks
 * - 服务端优先：若提供 `options`（reportTemplate/reportType），将以其为准构建选择项
 * - 选择修正：`useVariantSelectionGuard` 保证在变体切换后选择值仍然有效，必要时回退到首项
 * - 年份输入：使用 `DatePicker.YearRangePicker`，外部以 `[YYYY?,YYYY?]` 形式承接并转换
 * - 防抖机制：`onValuesChange` → `useDebounceFn(wait=200ms)` 合并增量更新，降低频繁刷新
 */
import { Checkbox, DatePicker, Select } from '@wind/wind-ui'
import { OptionProps } from '@wind/wind-ui/lib/select'
import { useDebounceFn } from 'ahooks'
import type { FormInstance } from 'antd'
import { Form } from 'antd'
import { useForm } from 'antd/es/form/Form'
import dayjs from 'dayjs'
import { t } from 'gel-util/intl'
import React, { useEffect } from 'react'
import { financialVariants } from '../../../config/variants'
import { UNIT_SCALES } from '../../../domain/value-objects/unitScale'
import { FinancialFilters } from '../../../types'
import styles from './index.module.less'

const PREFIX = 'filter-bar'
const STRINGS = {
  REPORT_PERIOD: t('1794', '报告期'),
  YEAR_RANGE: t('13235', '时间范围'),
  REPORT_TYPE: t('479474', '报表类型'),
  UNIT: t('478635', '单位'),
  HIDE_EMPTY_ROWS: t('16421', '隐藏空行'),
  // // 报告期
  // PERIOD_ANNUAL_CUMULATIVE: t('', ReportTemplateEnum.ANNUAL_CUMULATIVE),
  // PERIOD_ANNUAL_SINGLE: t('', ReportTemplateEnum.ANNUAL_QUARTERLY),
  // // 报告类型
  // TYPE_CONSOLIDATED: t('', ReportTypeEnum.MERGE),
  // TYPE_CONSOLIDATED_ADJUSTED: t('', ReportTypeEnum.ADJUSTMENT),
} as const
export const FilterBar: React.FC<{
  filters: FinancialFilters
  onFiltersChange: (updates: Partial<FinancialFilters>) => void
  variant: keyof typeof financialVariants
  options?: { reportTemplate?: OptionProps[]; reportType?: OptionProps[] }
  fields?: {
    reportTemplate?: boolean
    yearRange?: boolean
    reportType?: boolean
    unitScale?: boolean
    hideEmptyRows?: boolean
  }
}> = ({ filters, onFiltersChange, variant, options, fields }) => {
  const [form] = useForm<any>()

  const unitOptions = [
    { label: UNIT_SCALES.YUAN.label, value: 'YUAN' },
    { label: UNIT_SCALES.THOUSAND.label, value: 'THOUSAND' },
    { label: UNIT_SCALES.TEN_THOUSAND.label, value: 'TEN_THOUSAND' },
    { label: UNIT_SCALES.MILLION.label, value: 'MILLION' },
    { label: UNIT_SCALES.BILLION.label, value: 'BILLION' },
    { label: UNIT_SCALES.TEN_BILLION.label, value: 'TEN_BILLION' },
  ]

  // 报告期（优先使用服务端 options）
  const reportPeriodOptions = (() => {
    if (options?.reportTemplate && Array.isArray(options.reportTemplate)) {
      return options.reportTemplate.map((v) => ({ label: v.label, value: v.value }))
    }
    return []
  })()

  // 报告类型（优先使用服务端 options）
  const reportTypeOptions = (() => {
    if (options?.reportType && Array.isArray(options.reportType)) {
      return options.reportType.map((v) => ({ label: v.label, value: v.value }))
    }
    return []
  })()

  const { run: onValuesChangeDebounced } = useDebounceFn((values) => onFiltersChange(values as any), { wait: 200 })

  const showReportTemplate = fields?.reportTemplate ?? true
  const showYearRange = fields?.yearRange ?? true
  const showReportType = fields?.reportType ?? true
  const showUnitScale = fields?.unitScale ?? true
  const showHideEmptyRows = fields?.hideEmptyRows ?? false

  useVariantSelectionGuard(
    form,
    reportPeriodOptions,
    reportTypeOptions,
    onFiltersChange,
    variant,
    showReportTemplate,
    showReportType
  )

  useEffect(() => {
    console.log('🚀 ~ FilterBar ~ filters:', filters)
    form.setFieldsValue({
      unitScale: filters.unitScale,
      hideEmptyRows: filters.hideEmptyRows,
      reportTemplate: filters.reportTemplate,
      reportType: filters.reportType,
      reportDate:
        Array.isArray(filters.reportDate) && (filters.reportDate[0] || filters.reportDate[1])
          ? [
              filters.reportDate[0] ? dayjs(String(filters.reportDate[0]), 'YYYY') : undefined,
              filters.reportDate[1] ? dayjs(String(filters.reportDate[1]), 'YYYY') : undefined,
            ]
          : undefined,
    })
  }, [filters.unitScale, filters.hideEmptyRows, filters.reportTemplate, filters.reportType, filters.reportDate])

  return (
    <div className={styles[`${PREFIX}-container`]}>
      <Form
        form={form}
        layout="inline"
        initialValues={{
          unitScale: filters.unitScale,
          hideEmptyRows: filters.hideEmptyRows,
          reportTemplate: filters.reportTemplate,
          reportType: filters.reportType,
          reportDate: (Array.isArray(filters.reportDate) && (filters.reportDate[0] || filters.reportDate[1])
            ? [
                filters.reportDate[0] ? dayjs(String(filters.reportDate[0]), 'YYYY') : undefined,
                filters.reportDate[1] ? dayjs(String(filters.reportDate[1]), 'YYYY') : undefined,
              ]
            : undefined) as any,
        }}
        onValuesChange={(values) => onValuesChangeDebounced(values)}
      >
        {showReportTemplate && (
          <Form.Item name="reportTemplate" label={STRINGS.REPORT_PERIOD}>
            <Select
              style={{ width: 140 }}
              options={reportPeriodOptions}
              data-uc-id="RpPeriodMask"
              data-uc-ct="select"
              disabled={reportPeriodOptions.length === 1}
            />
          </Form.Item>
        )}

        {showReportType && (
          <Form.Item name="reportType" label={STRINGS.REPORT_TYPE}>
            <Select
              style={{ width: 160 }}
              options={reportTypeOptions}
              data-uc-id="StmtType"
              data-uc-ct="select"
              disabled={reportTypeOptions.length === 1}
            />
          </Form.Item>
        )}
        {showYearRange && (
          <Form.Item name="reportDate" label={STRINGS.YEAR_RANGE}>
            <DatePicker.YearRangePicker style={{ width: 240 }} data-uc-id="YrRangeFS" data-uc-ct="yearrangepicker" />
          </Form.Item>
        )}
        {/* <Form.Item name={'reportPeriod'} label="报表类型">
          <Select style={{ width: 120 }} options={periodOptions} />
        </Form.Item>
        <Form.Item name={'reportForm'} label="报表形式">
          <Select style={{ width: 120 }} options={formOptions} />
        </Form.Item> */}
        {showUnitScale && (
          <Form.Item name="unitScale" label={STRINGS.UNIT}>
            <Select style={{ width: 80 }} options={unitOptions} data-uc-id="z2IVpkH8Uq" data-uc-ct="select" />
          </Form.Item>
        )}
        {showHideEmptyRows && (
          <Form.Item name="hideEmptyRows" valuePropName="checked" style={{ marginRight: 0 }}>
            <Checkbox>{STRINGS.HIDE_EMPTY_ROWS}</Checkbox>
          </Form.Item>
        )}
      </Form>
    </div>
  )
}

function useVariantSelectionGuard(
  form: FormInstance<FinancialFilters>,
  reportPeriodOptions: OptionProps[],
  reportTypeOptions: OptionProps[],
  onFiltersChange: (updates: Partial<FinancialFilters>) => void,
  variant: keyof typeof financialVariants,
  enableTemplate: boolean,
  enableType: boolean
) {
  useEffect(() => {
    if (!enableTemplate && !enableType) return
    const validTemplate = reportPeriodOptions.map((o) => o.value)
    const validTypes = reportTypeOptions.map((o) => o.value)

    const currentData = form.getFieldValue('reportTemplate')
    const currentType = form.getFieldValue('reportType')

    const updates: Partial<FinancialFilters> = {}

    if (enableTemplate) {
      if (!validTemplate.includes(currentData)) {
        const fallbackTemplate = validTemplate[0]
        form.setFieldsValue({ reportTemplate: fallbackTemplate })
        updates.reportTemplate = fallbackTemplate
      }
    }

    if (enableType) {
      if (!validTypes.includes(currentType)) {
        const fallbackType = validTypes[0]
        form.setFieldsValue({ reportType: fallbackType })
        updates.reportType = fallbackType
      }
    }

    if (Object.keys(updates).length > 0) {
      onFiltersChange(updates)
    }
  }, [variant, reportPeriodOptions.length, reportTypeOptions.length, enableTemplate, enableType])
}
