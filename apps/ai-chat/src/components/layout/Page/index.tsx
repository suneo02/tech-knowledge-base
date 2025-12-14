import { useRef } from 'react'
import classNames from 'classnames'
import styles from './index.module.less'
import { Button } from '@wind/wind-ui'
import { VerticalAlignTopOutlined } from '@ant-design/icons'
import { usePageScroll } from './usePageScroll' // 导入自定义 Hook

const PREFIX = 'page'

interface PageProps {
  children: React.ReactNode
  scrollable?: boolean // 控制内容区域是否滚动
  header?: React.ReactNode // 头部内容
  footer?: React.ReactNode // 底部内容
  fixedHeader?: boolean // 头部是否固定，默认为 false
}

const Page = ({ children, scrollable = true, header, footer, fixedHeader = false }: PageProps) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const { showBackToTop, showHeaderShadow, scrollToTop } = usePageScroll({
    contentRef,
    scrollable,
    fixedHeader,
  })

  // 容器 class，只负责 flex 布局框架
  const containerClass = classNames(styles[`${PREFIX}-container`], {
    [styles.scrollable]: scrollable,
  })

  // 内容区域 class，负责滚动和 flex:1 填充
  const contentAreaClass = classNames(styles[`${PREFIX}-content-area`])

  return (
    <div className={containerClass} ref={contentRef}>
      {fixedHeader && header && (
        <header
          className={classNames(styles[`${PREFIX}-fixed-header`], {
            [styles['show-shadow']]: showHeaderShadow,
          })}
        >
          {header}
        </header>
      )}
      <main className={contentAreaClass}>
        {!fixedHeader && header && <header className={styles[`${PREFIX}-scrollable-header`]}>{header}</header>}
        <div className={styles[`${PREFIX}-children-wrapper`]}>{children}</div>
        {footer && <footer className={styles[`${PREFIX}-scrollable-footer`]}>{footer}</footer>}
      </main>
      <Button
        className={classNames(styles[`${PREFIX}-back-to-top`], { [styles.show]: showBackToTop })}
        icon={<VerticalAlignTopOutlined />}
        shape="circle"
        size="large"
        onClick={scrollToTop}
      ></Button>
    </div>
  )
}

export default Page
