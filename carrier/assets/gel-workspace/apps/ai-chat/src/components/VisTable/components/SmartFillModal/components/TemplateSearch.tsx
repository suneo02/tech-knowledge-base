import { List, Input } from '@wind/wind-ui'
import { TaskTemplate, TemplateItem } from '../types'

interface TemplateSearchProps {
  /**
   * 选择模板的回调
   */
  onSelectTemplate: (template: TemplateItem, taskTemplate: TaskTemplate) => void
  /**
   * 跳转到下一页的回调
   */
  onNextPage: (page: number) => void
  /**
   * 任务模板数据
   */
  taskTemplates: TaskTemplate[]
}

/**
 * 模板搜索组件
 */
export const TemplateSearch = ({ onSelectTemplate, onNextPage, taskTemplates }: TemplateSearchProps) => {
  return (
    <div style={{ height: '100%', overflow: 'auto', paddingBottom: 16 }}>
      <Input.Search placeholder="搜索模板" style={{ marginBottom: 12 }} />
      <List
        dataSource={taskTemplates}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            onClick={() => {
              // 根据选择的模板ID设置对应的任务模板
              const taskTemplate = taskTemplates.find((t) => t.id === item.id)
              if (taskTemplate) {
                onSelectTemplate(item, taskTemplate)
                onNextPage(2)
              }
            }}
            style={{ cursor: 'pointer' }}
          >
            <List.Item.Meta title={item.name} description={item.description} style={{ padding: '12px 0' }} />
          </List.Item>
        )}
      />
    </div>
  )
}
