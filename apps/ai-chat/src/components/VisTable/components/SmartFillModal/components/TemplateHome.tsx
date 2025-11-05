import type { FormInstance } from 'antd/es/form'
import { ConfigurableForm, TemplateFormData } from './ConfigurableForm'
import { getFormFieldConfigs, RunTypeEnum } from '../config/formConfig'
import { Button, ConfigProvider } from 'antd'
import { Divider, Tooltip } from 'antd'
import { AiModelEnum } from 'gel-api'
import { ExtendedColumnDefine } from '@/components/MultiTable/utils/columnsUtils'
import { CoinsIcon } from '@/assets/icon'
import styles from './styles.module.less'

interface TemplateHomeProps {
  /**
   * 表格列配置
   */
  columns: ExtendedColumnDefine[]
  /**
   * 跳转到下一页的回调
   */
  onNextPage: (page: number) => void
  /**
   * 表单初始值
   */
  initialValues?: Partial<TemplateFormData>
  /**
   * 表单值变更回调
   */
  onFormChange?: (field: string, value: string | boolean) => void
  /**
   * 表单实例引用
   */
  formRef?: React.MutableRefObject<FormInstance<TemplateFormData> | null>
}

/**
 * 模板首页组件
 */
export const TemplateHome = ({
  columns,
  onNextPage,
  initialValues = {
    prompt: '',
    enableLinkTool: false,
    enableAutoUpdate: false,
    aiModel: AiModelEnum.ALICE,
    runType: RunTypeEnum.RUN_ALL,
  },
  onFormChange,
  formRef,
}: TemplateHomeProps) => {
  // 获取表单字段配置
  const fieldConfigs = getFormFieldConfigs()

  // 处理查看模板按钮点击
  const handleViewTemplate = () => {
    // 直接跳转到下一页，表单验证由保存按钮处理
    onNextPage(1)
  }

  // 自定义渲染字段标签
  const renderCustomLabel = (name: string, label: string) => {
    // 为联网提取网页数据添加积分标识
    if (name === 'enableLinkTool') {
      const credits = fieldConfigs.find((config) => config.name === 'enableLinkTool')?.credits || 0
      return (
        <div className={styles.labelContainer}>
          <span>{label}</span>
          <Tooltip title="需要消耗积分">
            <div className={styles.creditsContainer}>
              <CoinsIcon style={{ width: 16, height: 16, marginRight: 4 }} />
              <span style={{ fontSize: 12, color: '#f06f13' }}>{credits}</span>
            </div>
          </Tooltip>
        </div>
      )
    }
    return label
  }

  return (
    <>
      <div>
        <ConfigProvider
          theme={{
            components: {
              Button: {
                borderRadius: 2,
                colorBorder: '#c3c5c9',
              },
            },
          }}
        >
          <Button block onClick={handleViewTemplate}>
            查看模板
          </Button>
        </ConfigProvider>
      </div>
      <Divider style={{ marginBlock: 12 }} />
      <ConfigurableForm
        columns={columns}
        initialValues={initialValues}
        onFormChange={onFormChange}
        formRef={formRef}
        fieldConfigs={fieldConfigs}
        renderCustomLabel={renderCustomLabel}
      />
    </>
  )
}
