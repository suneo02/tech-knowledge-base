import { CoinsIcon } from '@/assets/icon'
import { aiModels } from '../../index.json'
import { Select } from '@wind/wind-ui'
import { Form } from 'antd'
import { t } from 'gel-util/intl'

const STRINGS = {
  SELECT_MODEL_PLACEHOLDER: t('464205', '请选择模型')
}
const ModelSelector = () => {
  return (
    <Form.Item name="aiModel">
      <Select
        placeholder={STRINGS.SELECT_MODEL_PLACEHOLDER}
        style={{ width: '100%' }}
        options={aiModels.map((modal) => ({
          label: (
            <span style={{ display: 'inline-flex', width: '100%' }}>
              <span>{modal.name}</span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  width: '30px',
                  marginInlineStart: 8,
                  color: 'var(--orange-6)',
                  fontWeight: 700,
                  fontSize: 13,
                }}
              >
                <CoinsIcon style={{ width: 12, height: 12, marginInlineEnd: 2 }} />
                {modal.baseCredits}
              </span>
            </span>
          ),
          value: modal.id,
        }))}
      />
    </Form.Item>
  )
}

export default ModelSelector
