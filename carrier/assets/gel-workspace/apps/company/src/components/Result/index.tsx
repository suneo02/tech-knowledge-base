import React, { Suspense } from 'react'
import { WindResultSVGs } from './WindResultSVGs'
import styles from './index.module.less'

/**
 * Wind UI 风格 Result 组件
 *
 * 经过分析发现 @wind/wind-ui 的 Result 组件包含大量base64图片资源：
 * - light/dataLimit.js: 261KB
 * - dark/dataLimit.js: 98KB
 * - 其他状态文件也包含大量图片
 *
 * 解决方案：
 * 1. 提取并重构 @wind/wind-ui 的原版SVG设计
 * 2. 移除复杂的渐变和滤镜效果，保持核心视觉元素
 * 3. 大幅减少文件体积（从400KB+降至约10KB）
 * 4. 保持与原版相似的视觉风格和用户体验
 */

// 按需懒加载原始@wind/wind-ui组件（仅在用户明确需要原始UI时）
// const OriginalResultComponent = React.lazy(() =>
//   import(/* webpackChunkName: "wind-ui-result-original" */ '@wind/wind-ui').then((module) => ({
//     default: module.Result,
//   }))
// )

// 超轻量级 Result 组件实现
const LightweightResult: React.FC<{
  status?: string
  title?: React.ReactNode
  subTitle?: React.ReactNode
  extra?: React.ReactNode
  style?: React.CSSProperties
  className?: string
  [key: string]: any
}> = ({ status = '404', title, subTitle, extra, style, className, ...props }) => {
  // 获取对应的Wind UI SVG组件
  const WindSVGComponent = WindResultSVGs[status as keyof typeof WindResultSVGs] || WindResultSVGs['404']

  // 状态默认配置（文本信息）
  const statusConfig = {
    developing: {
      defaultTitle: '功能开发中',
      defaultSubTitle: '敬请期待',
    },
    '404': {
      defaultTitle: '页面不存在',
      defaultSubTitle: '请检查地址是否正确',
    },
    'no-data': {
      defaultTitle: '暂无数据',
      defaultSubTitle: '请确认数据是否正确',
    },
    'data-limit': {
      defaultTitle: '访问受限',
      defaultSubTitle: '您没有权限访问此内容',
    },
    '500': {
      defaultTitle: '服务器错误',
      defaultSubTitle: '服务暂时不可用，请稍后重试',
    },
  }

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['404']

  return (
    <div
      className={`${styles.windResult} ${className || ''}`}
      style={{
        // display: 'flex',
        // flexDirection: 'column',
        // alignItems: 'center',
        // justifyContent: 'center',
        // padding: '48px 24px',
        // textAlign: 'center',
        // minHeight: '350px', // 增加高度以适应Wind UI的SVG
        ...style,
      }}
      {...props}
    >
      {/* Wind UI SVG 图标 */}
      <div className={styles.windResultSVG}>
        <WindSVGComponent />
      </div>

      {/* 标题 */}
      <div className={styles.windResultTitle}>{title || config.defaultTitle}</div>

      {/* 副标题 defaultSubTitle 先不开启，如果需要展示副标题从调用方带入 */}
      {subTitle && <div className={styles.windResultSubTitle}>{subTitle}</div>}

      {/* 额外内容 */}
      {extra && <div className={styles.windResultExtra}>{extra}</div>}
    </div>
  )
}

// 主要的 Result 组件接口
export interface LazyResultProps {
  status?: 'developing' | '404' | 'no-data' | 'data-limit' | '500'
  title?: React.ReactNode
  subTitle?: React.ReactNode
  extra?: React.ReactNode
  style?: React.CSSProperties
  className?: string
  /** 是否使用原始@wind/wind-ui组件（会加载大图片） */
  useOriginal?: boolean
  [key: string]: any
}

/**
 * 主要的 Result 组件
 *
 * 默认使用轻量级实现（SVG图标 + CSS样式，约2KB）
 * 可选择使用原始@wind/wind-ui组件（包含高清图片，约400KB+）
 */
const Result: React.FC<LazyResultProps> = ({
  status = '404',
  title,
  subTitle,
  extra,
  style,
  className,
  useOriginal = false,
  ...props
}) => {
  // 如果明确要求使用原始组件，则懒加载@wind/wind-ui
  // if (useOriginal) {
  //   return (
  //     <Suspense
  //       fallback={
  //         <LightweightResult status={status} title={title || '加载原始组件中...'} style={style} className={className} />
  //       }
  //     >
  //       <OriginalResultComponent
  //         status={status === '500' ? 'error' : (status as any)}
  //         title={title}
  //         subTitle={subTitle}
  //         extra={extra}
  //         style={style}
  //         className={className}
  //         {...props}
  //       />
  //     </Suspense>
  //   )
  // }

  // 默认使用轻量级实现
  return (
    <LightweightResult
      status={status}
      title={title}
      subTitle={subTitle}
      extra={extra}
      style={style}
      className={className}
      {...props}
    />
  )
}

export default Result
