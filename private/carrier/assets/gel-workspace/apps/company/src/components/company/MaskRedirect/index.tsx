import { CorpDetailNodeCfgCommon, CorpMaskRedirectNodeCfg } from '@/types/corpDetail'
import { CorpBasicNumFront } from '@/types/corpDetail/basicNum.ts'
import { Card, Link } from '@wind/wind-ui'
import { TCorpDetailSubModule } from 'gel-types'
import { getLocale } from 'gel-util/intl'
import React, { MouseEventHandler } from 'react'
import { CorpModuleNum } from '../detail/comp/CorpNum'
import styles from './index.module.less'

export interface MaskRedirectProps extends Pick<CorpDetailNodeCfgCommon, 'modelNum'> {
  title: string
  basicNum: CorpBasicNumFront
  maskRedirect: CorpMaskRedirectNodeCfg['maskRedirect']
  companyCode: string
  moduleKey: TCorpDetailSubModule
}
/**
 * 蒙版引流组件
 * 显示背景色卡片，中间显示引导文案和跳转链接
 * 参考 HKCorpInfo 实现，使用 Card 包裹，标题显示在 Card title 上
 */
export const MaskRedirect: React.FC<MaskRedirectProps> = ({
  title,
  modelNum,
  basicNum,
  maskRedirect,
  companyCode,
  moduleKey,
}) => {
  // 生成跳转链接
  const url = maskRedirect.url(companyCode)

  const handleClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault()
    if (url) {
      window.open(url, '_blank')
    }
  }

  return (
    <div data-custom-id={moduleKey} className={`table-custom-module-readyed ${styles.maskRedirectWrapper}`}>
      <Card
        divider={null}
        title={
          <div className="has-child-table">
            <span className="corp-module-title">{title}</span>
            <CorpModuleNum modelNum={modelNum} basicNum={basicNum} numHide={false} />
          </div>
        }
      >
        <div className={styles.maskRedirect}>
          <div className={styles.maskRedirect__content}>
            {getLocale() === 'en-US' ? 'Go to' : '前往'}
            {getLocale() !== 'zh-CN' ? ' ' : null}
            {/* @ts-expect-error */}
            <Link href={url} className={styles.maskRedirect__link} onClick={handleClick}>
              {getLocale() === 'en-US' ? 'Risk' : '风险监控'}
            </Link>
            {getLocale() !== 'zh-CN' ? ' ' : null}
            {getLocale() === 'en-US' ? 'to view detailed data' : '查看详细数据'}
          </div>
        </div>
      </Card>
    </div>
  )
}
