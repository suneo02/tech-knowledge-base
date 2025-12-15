import { useIndicator } from '@/ctx/indicatorCfg'
// Import the moved components
import { FileUploadTab } from './FileUpload'
import { TextInputTab } from './TextInput'
// Import styles
import { Tabs } from '@wind/wind-ui'
import { t } from 'gel-util/intl'
import styles from './style.module.less'

interface BatchIdFormProps {
  handleChange: (idList: string[], excelData?: any[]) => void
  onCancel: () => void
}

// Main Component
export function BulkImportUpload({ handleChange, onCancel }: BatchIdFormProps) {
  const { config } = useIndicator()
  const { matchCount = 2000 } = config || {}

  // Define tab items
  const tabItems = [
    {
      key: '1',
      label: t('370261', '文本粘贴'),
      children: (
        <TextInputTab
          className={styles['upload-form-tab-content']}
          handleChange={(idList) => handleChange(idList)}
          onCancel={onCancel}
          matchCount={matchCount}
        />
      ),
    },
    {
      key: '2',
      label: t('437889', '文件导入'),
      children: (
        <FileUploadTab
          className={styles['upload-form-tab-content']}
          handleChange={handleChange}
          onCancel={onCancel}
          matchCount={matchCount}
        />
      ),
    },
  ]

  return (
    <Tabs defaultActiveKey="1" className={styles['upload-form']} animated={false}>
      {tabItems.map((item) => (
        <Tabs.TabPane tab={item.label} key={item.key}>
          {item.children}
        </Tabs.TabPane>
      ))}
    </Tabs>
  )
}
