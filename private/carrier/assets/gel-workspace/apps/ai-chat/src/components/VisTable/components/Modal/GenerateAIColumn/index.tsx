import { RouteModal } from '@/components/common/RouteModal'
import { AiModelEnum } from 'gel-api'
import { RunTypeEnum } from '../../SmartFillModal/config/formConfig'
import { GenerateAIColumnHome } from './Home'
import { TemplateDetail } from './TemplateDetail'
import { TemplateList } from './TemplateList'
import { AIBox } from 'gel-ui'
import { t } from 'gel-util/intl'

interface ModalRoutesProps {
  columns: {
    label: string
    value: string
    key: string
  }[]
  mentionsOptions: { value: string; label: string; field: string }[]
  onClose: () => void
}

const STRINGS = {
  MODAL_TITLE: t('464190', '生成列'),
}
const getModalRoutes = ({ columns, mentionsOptions, onClose }: ModalRoutesProps) => [
  {
    path: '/generate-ai-column/home',
    element: <GenerateAIColumnHome mentionsOptions={mentionsOptions} onClose={onClose} />,
  },
  {
    path: '/generate-ai-column/templates',
    element: <TemplateList />,
  },
  {
    path: '/generate-ai-column/template-detail',
    element: <TemplateDetail columns={columns} />,
  },
]

const modalInternalTitle = (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <AIBox size="small" />
    <span>AI{STRINGS.MODAL_TITLE}</span>
  </div>
)

export interface GenerateAIColumnProps {
  open: boolean
  onCancel: () => void
  onOk: (data?: unknown) => void
  width?: number
  mentionsOptions: { value: string; label: string; field: string }[]
  initParams?: InitParams
  columns: {
    label: string
    value: string
    key: string
  }[]
}

type InitParams = {
  prompt?: string
  credits?: number
  enableLinkTool?: boolean
  enableWindBrowser?: boolean
  enableWindDPU?: boolean
  aiModel?: AiModelEnum
  runType?: RunTypeEnum
  templateName?: string
  columnId?: string | null
}

const GenerateAIColumn = ({
  open,
  onCancel,
  onOk,
  // width = 1000,
  mentionsOptions,
  columns,
  initParams,
}: GenerateAIColumnProps) => {
  const handleClose = () => {
    onCancel()
  }
  return (
    <RouteModal
      destroyOnClose={true}
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      initialRoutePath="/generate-ai-column/home"
      routes={getModalRoutes({ mentionsOptions, columns, onClose: handleClose })}
      modalTitle={modalInternalTitle}
      // style={width ? { minWidth: width, padding: 0 } : { padding: 0 }}
      contentStyle={{
        height: 600,
      }}
      initParams={initParams} // Added credits to initParams
    />
  )
}

export default GenerateAIColumn
