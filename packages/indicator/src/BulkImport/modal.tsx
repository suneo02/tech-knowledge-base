import { useIndicator } from '@/ctx/indicatorCfg'
import { Modal } from '@wind/wind-ui'
import { IndicatorCorpMatchItem } from 'gel-api'
import { ErrorBoundary } from 'gel-ui'
import { t } from 'gel-util/intl'
import { FC, useEffect, useMemo, useState } from 'react'
import { CompanyMatchConfirm } from './CorpMatchConfirm'
import { useCompanyMatch } from './CorpMatchConfirm/handle'
import { IndicatorBulkImportData } from './FileUpload/utils'
import styles from './style/listConform.module.less'
import { IndicatorBulkImportApi } from './type'
import { BulkImportUpload } from './uploadFile'

/**
 * 批量导入模态框的属性接口
 * @interface BulkImportModalProps
 * @property {boolean} open - 控制模态框是否显示
 * @property {Function} handleOk - 确认按钮回调函数，接收匹配的企业数据和Excel数据（如果存在）
 * @property {Function} handleCancel - 取消按钮回调函数
 * @property {boolean} isEn - 是否为英文界面
 */
interface BulkImportModalProps extends IndicatorBulkImportApi {
  open: boolean
  handleOk: (data: IndicatorCorpMatchItem[], excelData?: IndicatorBulkImportData[], clueExcelName?: string) => void
  handleCancel: () => void
  isEn: boolean
  confirmLoading?: boolean
}

/**
 * 批量导入企业ID的主组件
 *
 * 该组件包含两个模态框：
 * 1. 上传模态框 - 用于上传包含企业ID的文件或输入文本
 * 2. 确认模态框 - 用于确认匹配的企业信息
 *
 * 流程：
 * 1. 文本导入流程: 用户填写文本 -> 系统匹配企业 -> 用户确认匹配结果 -> 导入确认的企业
 * 2. 文件导入流程: 用户上传文件 -> 系统匹配企业 -> 用户确认匹配结果 ->
 *    导入确认的企业 (导入用户确认的Excel数据并同步匹配结果的修改)
 */
export const BulkImportModals: FC<BulkImportModalProps> = ({
  open,
  handleOk,
  handleCancel,
  isEn,
  confirmLoading,
  matchCompanies,
  searchCompanies,
}) => {
  // 模态框类型枚举
  type ModalType = 'upload' | 'confirm'

  // 使用企业匹配钩子获取相关状态和方法
  const {
    loading, // 加载状态
    countStats, // 企业数量统计对象
    companyMatchInfo, // 企业匹配信息
    fetchCompanyMatchInfo, // 获取企业匹配信息的方法
    setCompanyMatchInfo, // 设置企业匹配信息
    resetAllCounts, // 重置所有计数器
    setCountStats, // 设置整个计数对象
  } = useCompanyMatch(matchCompanies)

  // 组件内部状态
  const [modalType, setModalType] = useState<ModalType>('upload') // 当前显示的模态框类型
  const [excelFullData, setExcelFullData] = useState<IndicatorBulkImportData[]>([]) // 存储Excel全量数据
  const [clueExcelName, setClueExcelName] = useState<string | undefined>(undefined) // 存储Excel全量数据
  const [isFromTextInput, setIsFromTextInput] = useState(false) // 是否来自文本输入

  // 从指标上下文中获取配置信息
  const { config } = useIndicator()
  const { matchCount } = config ?? {} // 获取最大匹配数量限制

  /**
   * 处理文件上传或文本输入后的ID变更
   * @param {string[]} ids - 上传文件解析出的企业ID数组或文字解析出的企业名称/ID数组
   * @param {IndicatorBulkImportData[]} excelData - 上传文件解析出的完整Excel数据，文本输入时为undefined
   */
  const handleChange = (ids: string[], excelData?: IndicatorBulkImportData[], clueExcelName?: string) => {
    if (ids.length < 1) {
      return
    }

    // 判断来源是文本输入还是文件上传
    setIsFromTextInput(!excelData)

    setClueExcelName(clueExcelName)
    // 仅在文件上传时保存 Excel 全量数据
    if (excelData) {
      setExcelFullData(excelData)
    } else {
      // 文本输入时清空 Excel 数据
      setExcelFullData([])
    }

    // 获取企业匹配信息并显示确认模态框
    fetchCompanyMatchInfo({
      queryTextList: ids,
    })
    setModalType('confirm')
  }

  /**
   * 处理确认回调
   */
  const handleConfirmCallback = (matchedData: IndicatorCorpMatchItem[], excelData?: IndicatorBulkImportData[]) => {
    handleOk(matchedData, excelData, clueExcelName)
  }

  /**
   * 副作用：重置企业匹配状态
   * 当上传模态框打开时，重置所有计数器和匹配信息
   */
  useEffect(() => {
    if (open && modalType === 'upload') {
      if (companyMatchInfo) setCompanyMatchInfo(undefined)
      // 使用重置方法一次性重置所有计数器
      resetAllCounts()
      // 清空Excel全量数据
      setExcelFullData([])
      // 重置来源状态
      setIsFromTextInput(false)
    }
  }, [open, modalType])

  const corpMathTableData = useMemo(() => {
    return companyMatchInfo?.map((item: IndicatorCorpMatchItem) => ({
      ...item,
      corpName: item.matched === 0 ? t('', '匹配失败') : item.corpName,
    }))
  }, [companyMatchInfo])

  // 当外部open变为false时，重置modalType为upload，以便下次打开时默认显示上传模态框
  useEffect(() => {
    if (!open) {
      setModalType('upload')
    }
  }, [open])

  return (
    <ErrorBoundary>
      {/* 上传模态框 - 用于上传文件或输入文本 */}
      {/* @ts-expect-error wind-ui */}
      <Modal
        className={styles['list-confirm--upload-modal']}
        visible={open && modalType === 'upload'}
        onCancel={handleCancel}
        maskClosable={false} // 禁止点击蒙层关闭
        destroyOnClose={true} // 关闭时销毁子元素
        footer={null} // 不显示默认底部按钮
        width={900} // 设置宽度为900px
      >
        <BulkImportUpload handleChange={handleChange} onCancel={handleCancel} />
      </Modal>

      {/* 确认模态框 - 用于确认匹配的企业信息 */}
      {/* @ts-expect-error wind-ui */}
      <Modal
        title={t('', '企业匹配结果')} // 使用国际化文本作为标题
        visible={open && modalType === 'confirm'}
        onCancel={() => {
          setModalType('upload') // 返回上传模态框
        }}
        destroyOnClose={true} // 关闭时销毁子元素
        maskClosable={false} // 禁止点击蒙层关闭
        className={styles['list-confirm--modal']}
        footer={null} // 不使用默认底部，使用 CompanyMatchConfirm 内置的底部
        width={1200} // 设置宽度为1000px
      >
        <CompanyMatchConfirm
          dataSource={corpMathTableData}
          loading={loading}
          confirmLoading={confirmLoading}
          countStats={countStats}
          onGoBack={() => setModalType('upload')}
          onConfirm={handleConfirmCallback}
          setCountStats={setCountStats}
          setCompanyMatchInfo={setCompanyMatchInfo}
          isEn={isEn}
          isFromTextInput={isFromTextInput}
          excelFullData={excelFullData}
          matchCount={matchCount}
          setExcelFullData={setExcelFullData}
          searchCompanies={searchCompanies}
        />
      </Modal>
    </ErrorBoundary>
  )
}
