import { Button, Checkbox, message, Popover } from '@wind/wind-ui'
import { IndicatorCorpMatchItem } from 'gel-api'
import { ErrorBoundary } from 'gel-ui'
import { t } from 'gel-util/intl'
import { useMemo, useState } from 'react'
import { CompanyMatchTable } from '../CorpMatchTable'
import { IndicatorBulkImportData } from '../FileUpload/utils'
import styles from '../style/listConform.module.less'
import { IndicatorBulkImportApi } from '../type'
import { CompanyCountStats, filterBothArrays } from './handle'
import { MatchStatsDisplayWithCountStats } from './MatchStatsDisplay'

const CheckboxGroup = Checkbox.Group

/**
 * 企业匹配确认组件属性接口
 */
interface CompanyMatchConfirmProps extends Pick<IndicatorBulkImportApi, 'searchCompanies'> {
  dataSource?: IndicatorCorpMatchItem[]
  loading: boolean
  confirmLoading?: boolean
  countStats: CompanyCountStats
  onGoBack: () => void
  onConfirm: (matchedData: IndicatorCorpMatchItem[], excelData?: IndicatorBulkImportData[]) => void
  setCountStats: (updater: (prev: CompanyCountStats) => CompanyCountStats) => void
  setCompanyMatchInfo: (data: IndicatorCorpMatchItem[] | undefined) => void
  isEn: boolean
  isFromTextInput: boolean
  excelFullData: IndicatorBulkImportData[]
  setExcelFullData: (data: IndicatorBulkImportData[]) => void
  matchCount?: number
}

/**
 * 企业匹配确认组件
 *
 * 将企业匹配表格和操作按钮组整合在一起，提供完整的匹配确认功能
 */
export const CompanyMatchConfirm = ({
  dataSource = [],
  loading,
  confirmLoading,
  countStats,
  onGoBack,
  onConfirm,
  setCountStats,
  setCompanyMatchInfo,
  isEn,
  isFromTextInput,
  excelFullData,
  setExcelFullData,
  matchCount = 2000,
  searchCompanies,
}: CompanyMatchConfirmProps) => {
  // 组件内部状态
  const [confirmSelected, setConfirmSelected] = useState([1, 2, 3]) // 选中的企业来源类型（1:大陆, 2:香港, 3:台湾）

  // 企业来源类型选项
  const CONFIRM_OPTIONS = [
    { label: t('412513', '大陆企业'), value: 1 },
    { label: t('145882', '香港企业'), value: 2 },
    { label: t('', '台湾企业'), value: 3 },
  ]

  /**
   * 更新来源类型计数
   */
  const updateSourceTypeCount = (stats: CompanyCountStats, sourceType: number, delta: number): CompanyCountStats => {
    const newStats = { ...stats }
    switch (sourceType) {
      case 1:
        newStats.cnNum = Math.max(0, newStats.cnNum + delta)
        break
      case 2:
        newStats.hongkongNum = Math.max(0, newStats.hongkongNum + delta)
        break
      case 3:
        newStats.twNum = Math.max(0, newStats.twNum + delta)
        break
    }
    return newStats
  }

  /**
   * 更新匹配状态计数
   */
  const updateMatchStatusCount = (
    prevStats: CompanyCountStats,
    oldData: IndicatorCorpMatchItem,
    newData: IndicatorCorpMatchItem
  ): CompanyCountStats => {
    const oldMatched = oldData.matched ?? 0
    const newMatched = newData.matched ?? 0
    const oldSource = oldData.source ?? 0
    const newSource = newData.source ?? 0

    let newStats = { ...prevStats }

    // 处理匹配状态变化
    if (oldMatched !== newMatched) {
      // 更新错误计数
      newStats.errNum += newMatched ? -1 : 1

      // 更新来源类型计数
      if (newMatched) {
        // 从未匹配变为匹配，增加新来源计数
        newStats = updateSourceTypeCount(newStats, newSource, 1)
      } else {
        // 从匹配变为未匹配，减少原来源计数
        newStats = updateSourceTypeCount(newStats, oldSource, -1)
      }
    } else if (oldMatched && newMatched && oldSource !== newSource) {
      // 匹配状态未变，但来源类型改变
      newStats = updateSourceTypeCount(newStats, oldSource, -1)
      newStats = updateSourceTypeCount(newStats, newSource, 1)
    }

    return newStats
  }

  /**
   * 编辑匹配项信息
   */
  const editItem = (oldData: IndicatorCorpMatchItem, newData: IndicatorCorpMatchItem, index: number | undefined) => {
    if (!dataSource || index === undefined) return

    // 更新匹配信息
    const updatedMatchInfo = dataSource.map((item, idx) => {
      if (idx === index) {
        return newData
      }
      return item
    })

    // 更新计数器
    setCountStats((prev) => updateMatchStatusCount(prev, oldData, newData))

    // 更新匹配信息
    setCompanyMatchInfo(updatedMatchInfo)

    // 同步更新 Excel 数据
    if (!isFromTextInput) {
      const updatedExcelData = [...excelFullData]
      updatedExcelData[index] = {
        ...updatedExcelData[index],
        企业名称: newData.corpName || oldData.queryText || '',
      }
      setExcelFullData(updatedExcelData)
    }
  }

  /**
   * 删除一行匹配数据
   */
  const deleteItem = (record: IndicatorCorpMatchItem) => {
    if (!dataSource) return

    // 更新计数器
    setCountStats((prev) => {
      let newStats = { ...prev }

      // 如果是未匹配的记录，减少错误计数
      if (record.matched === 0) {
        newStats.errNum = Math.max(0, prev.errNum - 1)
      } else if (record.source) {
        // 如果是匹配的记录，减少对应来源类型的计数
        newStats = updateSourceTypeCount(newStats, record.source, -1)
      }

      return newStats
    })

    // 更新匹配结果
    setCompanyMatchInfo(dataSource.filter((item) => item !== record))

    // 同步更新 Excel 数据
    if (!isFromTextInput) {
      const index = dataSource.indexOf(record)
      if (index >= 0 && index < excelFullData.length) {
        const updatedExcelData = [...excelFullData]
        updatedExcelData.splice(index, 1)
        setExcelFullData(updatedExcelData)
      }
    }
  }

  /**
   * 根据选中的企业来源类型过滤匹配结果
   */
  const filteredData = useMemo(() => {
    // 过滤匹配的数据
    const matchDataFromInput = dataSource.filter(
      (item) => item.matched && item.source && confirmSelected.includes(item.source)
    )

    // 如果是文本输入，不需要 Excel 数据
    if (isFromTextInput) {
      return { matchData: matchDataFromInput, excelData: [] }
    }

    // 对于文件上传，同步 matchData 数据
    const [matchDataFromExcel, excelData] = filterBothArrays(
      dataSource,
      excelFullData,
      (item) => Boolean(item.matched) && Boolean(item.source) && confirmSelected.includes(item.source || 0)
    )

    return { matchData: matchDataFromExcel, excelData }
  }, [dataSource, confirmSelected, isFromTextInput, excelFullData])

  /**
   * 处理确认按钮点击
   */
  const handleConfirm = () => {
    try {
      const { matchData, excelData } = filteredData

      // 检查是否超过单次导入限制
      if (matchData.length > matchCount) {
        message.error(`单次最多导入${matchCount}家企业`)
        return
      }

      // 根据来源调用确认回调
      if (isFromTextInput) {
        onConfirm(matchData)
      } else {
        onConfirm(matchData, excelData)
      }
    } catch (error) {
      console.error('确认导入企业时出错:', error)
      message.error('导入失败，请重试')
    }
  }

  // 计算是否有匹配成功的数据
  const hasMatchedData = useMemo(() => {
    return dataSource && dataSource.some((item) => item.matched)
  }, [dataSource])

  return (
    <ErrorBoundary>
      <div className={styles['company-match-confirm']}>
        {/* 企业匹配表格 */}
        <div className={styles['company-match-confirm__table']}>
          <CompanyMatchTable
            dataSource={dataSource}
            loading={loading}
            setCountStats={setCountStats}
            editItem={editItem}
            deleteItem={deleteItem}
            searchCompanies={searchCompanies}
          />
        </div>

        {/* 底部操作区域 */}
        <div className={styles['company-match-confirm__footer']}>
          <span className={styles['list-confirm--footer-text']}>
            <MatchStatsDisplayWithCountStats countStats={countStats} isEn={isEn} />
          </span>

          <div className={styles['company-match-confirm__actions']}>
            <Button onClick={onGoBack} className={styles['company-match-confirm__btn']}>
              {t('120218', '返回上一步')}
            </Button>
            <Popover
              content={
                <CheckboxGroup
                  options={CONFIRM_OPTIONS}
                  value={confirmSelected}
                  onChange={(e) => {
                    setConfirmSelected(e as number[])
                  }}
                />
              }
            >
              <Button
                type="primary"
                disabled={!hasMatchedData}
                className={styles['company-match-confirm__btn-primary']}
                onClick={handleConfirm}
                loading={confirmLoading}
              >
                {t('', '确认导入')}
              </Button>
            </Popover>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
