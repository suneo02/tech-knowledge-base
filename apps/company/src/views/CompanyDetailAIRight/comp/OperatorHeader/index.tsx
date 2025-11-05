import ToolsBar from '@/components/toolsBar'
import intl from '@/utils/intl'
import { Layout } from '@wind/wind-ui'
import React, { memo } from 'react'

import styles from './index.module.less'
const { Operator } = Layout

interface OperatorHeaderProps {
  entityName: string // 企业名称
  companyCode: string // 企业编码
  collectState: boolean // 收藏状态
  setCollectState: (state: boolean) => void // 设置收藏状态
  backTopWrapClass?: string // 滚动容器类名
  onClickReport?: () => void // 点击导出报告
  onAliceClick?: (show?: boolean) => void // 点击AI商业查询助手
  showRight: boolean
}

const prefix = 'company-detail-ai__operation'

export const OperatorHeader: React.FC<OperatorHeaderProps> = memo(
  ({
    entityName,
    collectState,
    companyCode,
    setCollectState,
    backTopWrapClass,
    onClickReport,
    onAliceClick,
    showRight,
  }: OperatorHeaderProps) => {
    return (
      // @ts-expect-error
      <Operator className={styles[prefix]}>
        <div className={styles[`${prefix}-left`]}>
          <span className={styles[`${prefix}-left-name`]} title={entityName}>
            {entityName}
          </span>
          <span className={styles[`${prefix}-left-desc`]}>&nbsp;&nbsp;{intl('451245', '企业详情')}</span>
        </div>

        <div className={styles[`${prefix}-right`]}>
          <div className={styles[`${prefix}-tool`]}>
            <ToolsBar
              isHorizon={true}
              isShowAlice={true}
              isShowReport={true}
              isShowCollect={true}
              isShowFeedback={true}
              isShowBackTop={false}
              backTopWrapClass={backTopWrapClass}
              collectState={collectState}
              setCollectState={setCollectState}
              companyCode={companyCode}
              onClickReport={onClickReport}
              onAliceClick={onAliceClick}
              showRight={showRight}
            />
          </div>
        </div>
      </Operator>
    )
  }
)

OperatorHeader.displayName = 'OperatorHeader'
