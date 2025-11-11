import { useIntl } from '@/common'
import { Tag, Tooltip } from '@wind/wind-ui'
import cn from 'classnames'
import { CorpTag, CorpTagType } from 'gel-api'
import { getCorpTagConfig, getRiskTagCfg } from 'gel-util/biz'
import { isNil } from 'lodash-es'
import { CSSProperties, FC, useCallback, useMemo } from 'react'
import { CorpIndustryTag } from './CorpIndustryTag'
import styleModule from './CorpTag.module.less'

export type CorpTagProps = {
  corpTag: CorpTag
  /**
   * 标签原始名称，用于判断是否是小微企业标签
   * 因为小微企业的标签名称是“小微企业”，这个名称没有被翻译过
   */
  tagNameOriginal: string
  className?: string
  style?: CSSProperties
  /** 小微企业 wrapper style */
  smallMicroEnterpriseWrapperStyle?: CSSProperties
  onClick?: (corpTag: CorpTag, e: React.MouseEvent<HTMLDivElement>) => void
  size?: 'large' | 'default'
}

/**
 * 根据标签类型获取标签配置的 hook
 * @param type 标签类型
 * @returns 标签配置（颜色和类型）
 */
export const useCorpTagConfigByType = (type: CorpTagType) => {
  return useMemo(() => {
    // 使用对象获取配置，现在的实现也不需要空值检查
    return getCorpTagConfig(type)
  }, [type])
}

/**
 * 基础企业标签组件
 */
const BaseCorpTag: FC<CorpTagProps> = ({
  corpTag,
  tagNameOriginal,
  className,
  style,
  onClick,
  size = 'default',
  smallMicroEnterpriseWrapperStyle,
}) => {
  const t = useIntl()

  if (isNil(corpTag)) {
    return null
  }

  const config = useCorpTagConfigByType(corpTag.type)

  const nameParsed = useMemo(() => {
    // 风险标签 需要根据 id 获取名称
    if (corpTag.type === 'RISK') {
      const riskTagCfg = getRiskTagCfg(t)
      const riskTag = riskTagCfg[corpTag.id]
      if (riskTag) {
        return riskTag.name
      }
    }
    // 如果标签类型是 STOCK  需要拼接 股票代码
    if (corpTag.type === 'STOCK') {
      return `${corpTag.name}|${corpTag.id}`
    }
    // 如果是 投资机构 拼接 type 和 name
    if (corpTag.type === 'INVESTMENT_INSTITUTION') {
      return `${t('451231', '投资机构')}|${corpTag.name}`
    }
    return corpTag.name
  }, [corpTag.name, corpTag.type, corpTag.id, t])

  const { color, type } = config

  // 处理标签点击事件
  const handleClick = useCallback(
    (e) => {
      // 优先使用外部传入的onClick
      if (onClick) {
        onClick(corpTag, e)
        return
      }
      return
    },
    [corpTag, onClick]
  )

  // 行业标签单独处理，因为行业标签的置信度需要单独处理
  if (corpTag.type === 'INDUSTRY') {
    return <CorpIndustryTag corpTag={corpTag} />
  }

  const isSmallMicroEnterprise = useMemo(() => tagNameOriginal === '小微企业', [tagNameOriginal])

  const classNames = cn(className, styleModule['corp-tag'], {
    [styleModule['corp-tag-can-click']]: !!onClick,
  })
  /**
   * 小微企业标签单独处理，因为小微企业标签的样式需要单独处理
   */
  if (isSmallMicroEnterprise) {
    return (
      <Tooltip title={t('361294', '依据国家市场监督管理总局公布的小微企业库，结合万得大数据模型进行判定。')}>
        {/* 使用div包裹，避免Tooltip的样式影响，并修复2px偏移问题 */}
        <div
          style={{
            display: 'inline-block',
            verticalAlign: 'top',
            lineHeight: 'normal',
            ...smallMicroEnterpriseWrapperStyle,
          }}
        >
          <Tag
            className={classNames}
            style={{ ...style, margin: 0 }}
            color={color}
            type={type as 'primary' | 'secondary'}
            size={size}
            onClick={handleClick}
          >
            {nameParsed}
          </Tag>
        </div>
      </Tooltip>
    )
  }

  return (
    <Tag
      className={classNames}
      style={style}
      color={color}
      type={type as 'primary' | 'secondary'}
      size={size}
      onClick={handleClick}
    >
      {nameParsed}
    </Tag>
  )
}

/**
 * 企业详情页的标签 默认用 large 大小
 * @param props 标签属性
 * @returns 企业详情标签组件
 */
export const CorpTagInDetail: FC<Omit<CorpTagProps, 'size'>> = (props) => {
  return <BaseCorpTag {...props} size="large" />
}

/**
 * 企业搜索页的标签，用 default 大小
 * @param props 标签属性
 * @returns 企业搜索标签组件
 */
export const CorpTagInSearch: FC<Omit<CorpTagProps, 'size'>> = (props) => {
  return <BaseCorpTag {...props} size="default" />
}
