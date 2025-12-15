import { HomeO } from '@wind/icons'
import styles from './index.module.less'
import { Breadcrumb } from '@wind/wind-ui'
import { useNavigateWithLangSource } from '@/hooks/useLangSource'

const PREFIX = 'page-breadcrumb'

// 定义面包屑项的接口
interface BreadcrumbItem {
  name: React.ReactNode
  href?: string
}

// 定义组件 Props 接口
interface PageBreadcrumbProps {
  items?: BreadcrumbItem[] // items 现在是可选的，因为可能只显示首页
  /**
   * 控制首页项的行为。
   * - undefined (默认): 显示默认首页 { name: '首页', href: '#/super' }。
   * - BreadcrumbItem 对象: 使用提供的对象作为首页项。
   * - null: 不显示任何首页项。
   */
  customHomeItem?: BreadcrumbItem | null
}

// 默认的首页项
const DEFAULT_HOME_ITEM: BreadcrumbItem = {
  name: (
    // @ts-expect-error Wind-ui
    <HomeO />
  ),
  href: '/super',
}

const PageBreadcrumb = ({ items = [], customHomeItem }: PageBreadcrumbProps) => {
  const navigate = useNavigateWithLangSource()
  let finalItems: BreadcrumbItem[] = []

  // 根据 customHomeItem 决定如何处理首页
  if (customHomeItem === undefined) {
    // 默认情况：添加默认首页
    finalItems = [DEFAULT_HOME_ITEM, ...items]
  } else if (customHomeItem === null) {
    // 特殊情况2: 不显示首页
    finalItems = [...items]
  } else {
    // 特殊情况1: 使用自定义首页
    finalItems = [customHomeItem, ...items]
  }

  // 如果最终列表为空（例如 customHomeItem=null 且 items=[]），则不渲染
  if (finalItems.length === 0) {
    return null
  }

  return (
    <div className={styles[`${PREFIX}-container`]}>
      <Breadcrumb>
        {finalItems.map((item, index) =>
          item.href ? (
            <Breadcrumb.Item key={index} onClick={() => navigate(item.href!)} style={{ cursor: 'pointer' }}>
              {item.name}
            </Breadcrumb.Item>
          ) : (
            <Breadcrumb.Item key={index}>{item.name}</Breadcrumb.Item>
          )
        )}
      </Breadcrumb>
    </div>
  )
}

export default PageBreadcrumb
