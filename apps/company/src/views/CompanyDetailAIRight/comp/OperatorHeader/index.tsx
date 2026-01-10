/**
 * 企业详情页顶部操作栏组件
 *
 * 提供企业信息展示、收藏管理、报告导出和AI面板控制功能
 * 支持企业名称国际化、收藏状态同步和操作控制
 *
 * @see ../../../../docs/CorpDetail/layout-header.md - 顶部操作栏设计文档
 */

import ToolsBar from '@/components/toolsBar'
import intl from '@/utils/intl'
import { Layout } from '@wind/wind-ui'
import React, { memo } from 'react'
import { isEmpty } from 'gel-util/common'

import styles from './index.module.less'
import { isFromRimePEVC } from 'gel-util/link'
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
  corpNameIntl: string
  corpHeaderInfo?: Record<string, unknown> // 企业卡片数据未获取到时，不展示收藏、导出报告toolbar工具栏
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
    corpNameIntl,
    corpHeaderInfo,
  }: OperatorHeaderProps) => {
    return (
      // @ts-expect-error
      <Operator className={styles[prefix]} data-uc-id="lOw8l1OZRW" data-uc-ct="operator">
        <div className={styles[`${prefix}-left`]}>
          <span className={styles[`${prefix}-left-name`]} title={entityName}>
            {entityName}
          </span>
          <span className={styles[`${prefix}-left-desc`]}>&nbsp;&nbsp;{intl('451245', '企业详情')}</span>
        </div>
        {isEmpty(corpHeaderInfo) ? null : (
          <div className={styles[`${prefix}-right`]}>
            <div className={styles[`${prefix}-tool`]}>
              <ToolsBar
                isHorizon={true}
                isShowAlice={true}
                isShowReport={!isFromRimePEVC()}
                isShowCollect={!isFromRimePEVC()}
                isShowFeedback={true}
                isShowBackTop={false}
                backTopWrapClass={backTopWrapClass}
                collectState={collectState}
                setCollectState={setCollectState}
                companyCode={companyCode}
                onClickReport={onClickReport}
                onAliceClick={onAliceClick}
                showRight={showRight}
                companyName={corpNameIntl}
                data-uc-id="xYLWBLj2o4"
                data-uc-ct="toolsbar"
              />
            </div>
          </div>
        )}
      </Operator>
    )
  }
)

OperatorHeader.displayName = 'OperatorHeader'
