import AIIcon from '@/assets/icon/AI-icon.svg'
import CompanyIcon from '@/assets/icon/ui/company.svg'
import IndexIcon from '@/assets/icon/ui/index.svg'
import { useModal } from '@/components/GlobalModalProvider'
import { useSmartFill } from '@/components/VisTable/context/SmartFillContext'
import { useVisTableContext } from '@/components/VisTable/context/VisTableContext'
import { useVisTableOperationContext } from '@/components/VisTable/context/VisTableOperationContext'
import { ColumnHeightOutlined } from '@ant-design/icons'
import { Button, Tooltip } from '@wind/wind-ui'
import { useState } from 'react'
import styles from './index.module.less'

const PREFIX = 'toolbar'

const PAGE_ID = 'super-excel'

const STRINGS = {
  FIND_COMPANY: '找企业',
  QUERY_INDICATOR: '查询指标',
  COLUMN_INDICATOR: '列指标',
  AUTO_WRAP: '自动换行',
  GENERATE_COLUMN: '生成列',
  NEED_ENTITY_COLUMN: '需要有实体列才能查询列指标',
  AI_GENERATE_COLUMN: 'AI生成列',
}

// 工具栏组件，使用context获取表格引用 - 测试PR提交
const Toolbar = ({ sheetId, tableId }: { sheetId: number; tableId: string }) => {
  const { openModal } = useModal()
  // 使用SmartFill钩子
  const { openSmartFillModal } = useSmartFill()
  const { refreshRef, getTableInstance } = useVisTableContext()
  const { state } = useVisTableOperationContext()
  const [autoHeight, setAutoHeight] = useState(false)
  console.log('🚀 ~ Toolbar ~ state:', state)
  // 处理AI生成列按钮点击事件 - 不保留之前填写的信息
  const handleSmartFill = () => {
    // 调用钩子打开模态框，不传列ID表示新建列，始终不会显示之前的模板 测试保护分支
    openSmartFillModal()
  }

  const handleCdeFinish = () => {
    refreshRef.current.refresh({ position: 'bottom' })
  }

  const handleIndicatorFinish = () => {
    console.log('🚀 ~ IndicatorTreePanelLocal ~ onAddFinish:')
    refreshRef.current.refresh({ position: 'right' })
  }

  /**
   * AI生成列按钮
   */
  const AiGenerateColumnButton = () => {
    return (
      <Button
        data-id="super-excel-ai-generate-column"
        onClick={handleSmartFill}
        className={`${styles[`${PREFIX}-ai-generate-button`]}`}
      >
        <div className={styles['button-content']}>
          <img src={AIIcon} alt={STRINGS.AI_GENERATE_COLUMN} className={styles.icon} />
          <div className={styles.text}>{STRINGS.GENERATE_COLUMN}</div>
        </div>
      </Button>
    )
  }

  /**
   * 找企业按钮
   */
  const FindCompanyButton = () => {
    return (
      <Button
        data-id="super-excel-find-company"
        onClick={() =>
          openModal('chatCDE', {
            tableId,
            sheetId,
            onFinish: handleCdeFinish,
            canAddCdeToCurrent: state.canAddCdeToCurrent,
          })
        }
        className={styles[`${PREFIX}-action-button`]}
      >
        <div className={styles['button-content']}>
          <img src={CompanyIcon} alt={STRINGS.FIND_COMPANY} className={styles.icon} />
          <div className={styles.text}>{STRINGS.FIND_COMPANY}</div>
        </div>
      </Button>
    )
  }

  /**
   * 查询指标按钮
   */
  const QueryIndicatorButton = () => {
    return (
      <Button
        data-id="super-excel-query-indicator"
        onClick={() =>
          openModal('indicatorTree', { tableId, sheetId, width: '85%', height: '80%', onFinish: handleIndicatorFinish })
        }
        className={styles[`${PREFIX}-action-button`]}
      >
        <div className={styles['button-content']}>
          <img src={IndexIcon} alt={STRINGS.QUERY_INDICATOR} className={styles.icon} />
          <div>{STRINGS.COLUMN_INDICATOR}</div>
        </div>
      </Button>
    )
  }

  /**
   * 自动换行按钮
   */
  const AutoWrapButton = () => {
    return (
      <Button
        className={`${PREFIX}-auto-wrap-button`}
        type={autoHeight ? 'primary' : undefined}
        onClick={() => {
          const pre = !autoHeight
          const tableInstance = getTableInstance()!
          if (pre) {
            tableInstance.heightMode = 'autoHeight'
            tableInstance.autoWrapText = true
          } else {
            // @ts-expect-error heightMode 类型为 HeightModeDef | null
            tableInstance.heightMode = undefined
            // @ts-expect-error autoWrapText 类型为 boolean | null
            tableInstance.autoWrapText = undefined
          }
          tableInstance.renderWithRecreateCells()
          setAutoHeight(pre) // 使用 pre 来设置状态，因为它代表了点击后的期望状态
        }}
        icon={<ColumnHeightOutlined />}
      >
        {STRINGS.AUTO_WRAP}
      </Button>
    )
  }
  return (
    <div data-id={PAGE_ID}>
      <div className={`${styles[`${PREFIX}-container`]}`}>
        <AiGenerateColumnButton />
        <FindCompanyButton />
        <Tooltip title={!state.canQueryIndicator ? STRINGS.NEED_ENTITY_COLUMN : ''}>
          <QueryIndicatorButton />
        </Tooltip>
        <AutoWrapButton />
      </div>
    </div>
  )
}

export default Toolbar
