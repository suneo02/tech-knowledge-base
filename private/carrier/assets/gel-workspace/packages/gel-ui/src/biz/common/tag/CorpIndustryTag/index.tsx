import { Tag, Tooltip } from '@wind/wind-ui'
import cn from 'classnames'
import { CorpTag } from 'gel-api'
import { TagsModule } from 'gel-util/biz'
import { t } from 'gel-util/intl'
import { CSSProperties, FC, useMemo } from 'react'
import { TagWithModule, useTagConfigByModule } from '../TagWithModule'
import styleModule from './index.module.less'

export const CorpIndustryTag: FC<{
  corpTag: CorpTag
  style?: CSSProperties
  className?: string
}> = ({ corpTag, style, className }) => {
  const config = useTagConfigByModule(TagsModule.CORP_INDUSTRY)
  const { color, type, size } = config

  const CALIBER_CONFIG = useMemo(
    () => [
      {
        key: 'PBOC',
        // 符合中国人民银行统计标准
        standard: t('481295', '符合中国人民银行统计标准'),
      },
      {
        key: 'NFSA',
        // 符合国家金融监督管理总局统计标准
        standard: t('481296', '符合国家金融监督管理总局统计标准'),
      },
      {
        key: 'CIR',
        // 符合中保保险资产登记交易系统有限公司统计标准
        standard: t('481275', '符合中保保险资产登记交易系统有限公司统计标准'),
      },
      {
        key: 'LCR',
        // 符合银行业理财登记托管中心有限公司统计标准
        standard: t('481297', '符合银行业理财登记托管中心有限公司统计标准'),
      },
    ],
    [t]
  )

  const caliberTooltipContent = useMemo(() => {
    const { caliberConfidence, name } = corpTag
    if (!caliberConfidence) return null
    const { PBOC, NFSA, CIR, LCR } = caliberConfidence
    if (!PBOC && !NFSA && !CIR && !LCR) return null

    return (
      <div>
        <div style={{ marginBottom: 8 }}>{t('481298', '满足如下管理机构的{{name}}认定标准', { name })}</div>
        {CALIBER_CONFIG.map((conf) => {
          const value = caliberConfidence[conf.key]
          if (!value) return null
          return (
            <div key={conf.key} style={{ marginBottom: 4 }}>
              {/* 展示口径说明：严口径/宽口径 + 对应标准 */}
              <div>
                {value === 1 ? t('481294', '严口径：') : t('481274', '宽口径：')}
                {conf.standard}
              </div>
            </div>
          )
        })}
      </div>
    )
  }, [corpTag, t, CALIBER_CONFIG])

  const fullTooltipContent = useMemo(() => {
    const showConfidenceWarning = corpTag.confidence !== 1
    if (!showConfidenceWarning && !caliberTooltipContent) return null

    return (
      <div>
        {showConfidenceWarning && (
          <div style={{ marginBottom: caliberTooltipContent ? 8 : 0 }}>
            {t('449724', '* 表示基于企业库大数据计算的结果')}
          </div>
        )}
        {caliberTooltipContent}
      </div>
    )
  }, [corpTag.confidence, caliberTooltipContent, t])

  if (corpTag.confidence === 1) {
    const tagNode = (
      <TagWithModule
        module={TagsModule.CORP_INDUSTRY}
        key={corpTag.id}
        className={styleModule['corp-industry-tag']}
        value={corpTag.name}
      >
        {corpTag.name}
      </TagWithModule>
    )

    if (caliberTooltipContent) {
      return (
        <Tooltip title={caliberTooltipContent} key={corpTag.id}>
          {/* TagWithModule doesn't support wrapping directly if it's not forwarding ref properly or if we want to be safe */}
          <div style={{ display: 'inline-block' }}>{tagNode}</div>
        </Tooltip>
      )
    }
    return tagNode
  } else {
    return (
      <Tooltip title={fullTooltipContent} key={corpTag.id}>
        {/* TODO 单独处理 样式 */}
        <Tag
          value={corpTag.name}
          color={color}
          type={type}
          size={size}
          className={cn(styleModule['corp-industry-tag'], className)}
          style={style}
          onClick={() => {
            console.log(corpTag, 'corpTag')
          }}
          data-uc-id="53UtupxslKH"
          data-uc-ct="tag"
        >
          <span className="industry-tag-title">{corpTag.name}</span>
          <sup>*</sup>
        </Tag>
      </Tooltip>
    )
  }
}
