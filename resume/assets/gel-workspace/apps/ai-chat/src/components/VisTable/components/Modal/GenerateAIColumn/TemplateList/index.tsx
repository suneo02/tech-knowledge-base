import type { InjectedRouteProps } from '@/components/common/RouteModal'
import { ScrollableNavView, type ScrollableNavItem } from '@/components/ScrollableNavView'
import { Empty, Button } from '@wind/wind-ui'
import classNames from 'classnames'
import React from 'react'
import { superListTemplates } from '../index.json'
import styles from './index.module.less'

const PREFIX = 'template-list'

const STRINGS = {
  BACK_BUTTON: '返回配置',
  USE_TEMPLATE_BUTTON: '使用此模板',
  NO_TEMPLATES_FOUND: '未找到可用模板',
  DESCRIPTION_LABEL: '描述:',
  PROMPT_LABEL: '提示语:',
}

// Define a more specific type for the raw template data from JSON
interface RawTemplateData {
  id: string | number // ID can be number or string initially
  name: string
  description: string
  prompt: string
  aiModel?: string | number
  enableLinkTool?: boolean
  enableWindBrowser?: boolean
  enableWindDPU?: boolean
  // ... any other fields that might exist in the JSON
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any // To accommodate any other fields from JSON
}
enum TemplateType {
  RECOMMEND = 'recommend',
  CUSTOM = 'custom',
  AGENT = 'agent',
}

interface TemplateData {
  id: string // ID will be explicitly string after processing
  name: string
  description?: string
  type?: TemplateType
  icon?: string
  children?: TemplateData[]
}

const TemplateTypeMap = {
  [TemplateType.RECOMMEND]: '推荐',
  [TemplateType.CUSTOM]: '自定义',
  [TemplateType.AGENT]: 'agent',
}

const originalTemplates: TemplateData[] = superListTemplates.map(
  (t: RawTemplateData): TemplateData => ({
    ...t, // Spread all properties
    id: t.id.toString(), // Ensure ID is a string
    // Explicitly list properties for TemplateData to ensure type correctness
    name: t.name,
    description: t.description,
    type: t.type || TemplateType.RECOMMEND,
    icon: t.icon,
  })
)

const DEFAULT_TEMPLATE = [
  // {
  //   id: 'default',
  //   name: '最近使用',
  //   icon: 'recent',
  //   children: [
  //     originalTemplates[2],
  //     {
  //       id: 'default',
  //       name: '自定义模板',
  //       description: '自定义模板',
  //       type: TemplateType.CUSTOM,
  //       icon: 'custom',
  //     },
  //   ],
  // },
  {
    id: 'recommend',
    name: '推荐模板',
    children: originalTemplates,
    icon: 'recommend',
  },
  // {
  //   id: 'custom',
  //   name: '自定义',
  //   icon: 'custom',
  //   children: [
  //     {
  //       id: 'custom1',
  //       name: '自定义模板11111111111111111111111111111',
  //       description: '自定义模板1',
  //       type: TemplateType.CUSTOM,
  //       icon: 'custom',
  //     },
  //     {
  //       id: 'custom2',
  //       name: '自定义模板2',
  //       description: '自定义模板2',
  //       type: TemplateType.CUSTOM,
  //       icon: 'custom',
  //     },
  //     {
  //       id: 'custom3',
  //       name: '自定义模板3',
  //       description: '自定义模板3',
  //       type: TemplateType.CUSTOM,
  //       icon: 'custom',
  //     },
  //   ],
  // },
  // {
  //   id: 'agent',
  //   name: 'agent',
  //   icon: 'custom',
  //   children: [
  //     {
  //       id: 'agent1',
  //       name: 'agent1',
  //       description: 'agent1',
  //       type: TemplateType.AGENT,
  //       icon: 'agent',
  //     },
  //     {
  //       id: 'agent2',
  //       name: 'agent2',
  //       description: 'agent2',
  //       type: TemplateType.AGENT,
  //       icon: 'agent',
  //     },
  //     {
  //       id: 'agent3',
  //       name: 'agent3',
  //       description: 'agent3',
  //       type: TemplateType.AGENT,
  //       icon: 'agent',
  //     },
  //   ],
  // },
]
export const TemplateList: React.FC<InjectedRouteProps> = ({ navigate, location }) => {
  const handleSelectTemplate = (template: TemplateData) => {
    // Navigate to the detail page with the template ID
    // Ensuring template.id is a string for the path parameter
    navigate!('/generate-ai-column/template-detail', {
      state: { ...(location?.state || {}), id: template.id.toString() }, // Pass current state and where we came from
    })
  }

  const handleGoBack = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { selectedTemplate, ...restOfPreviousState } = location?.state || {}
    navigate!('/generate-ai-column/home', { state: restOfPreviousState })
  }

  // Prepare items for ScrollableNavView
  const scrollableNavItems: ScrollableNavItem<TemplateData>[] = DEFAULT_TEMPLATE.map((template) => ({
    id: template.id,
    navTitle: template.name,
    data: template, // Pass the original template data
    content: (
      <div>
        <div className={styles[`${PREFIX}-card-title-icon`]}>
          <img src={`src/assets/icon/super/menu/${template.icon}.svg`} alt={template.name} />
          {template.name}
        </div>
        <div className={styles[`${PREFIX}-card`]}>
          {template.children.map((child) => (
            <div key={child.id} onClick={() => handleSelectTemplate(child)}>
              <div
                className={classNames(styles[`${PREFIX}-card-type`], {
                  [styles.recommend]: child.type === 'recommend',
                  [styles.custom]: child.type === 'custom',
                  [styles.agent]: child.type === 'agent',
                })}
              >
                {TemplateTypeMap[child.type!]}
              </div>
              {child.icon && (
                <div className={styles[`${PREFIX}-card-icon`]}>
                  <img
                    src={`src/assets/icon/super/template/${child.icon}.svg`}
                    alt={child.name}
                    onError={(e) => {
                      e.currentTarget.src = 'src/assets/icon/super/template/default.svg'
                    }}
                  />
                </div>
              )}
              <div className={styles[`${PREFIX}-card-content`]}>
                <div className={styles[`${PREFIX}-card-content-title`]}>{child.name}</div>
                <p>{child.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  }))

  if (!originalTemplates || originalTemplates.length === 0) {
    return (
      <div style={{ padding: 20 }}>
        <Empty description={STRINGS.NO_TEMPLATES_FOUND} style={{ marginTop: 20 }} />
      </div>
    )
  }

  const initialActiveId = originalTemplates.length > 0 ? originalTemplates[0].id : undefined

  return (
    <div className={styles[`${PREFIX}-container`]}>
      <div className={styles[`${PREFIX}-content`]}>
        <ScrollableNavView<TemplateData> items={scrollableNavItems} defaultActiveId={initialActiveId} />
      </div>

      <div className={styles[`${PREFIX}-footer`]}>
        <Button onClick={handleGoBack}>{STRINGS.BACK_BUTTON}</Button>
      </div>
    </div>
  )
}
