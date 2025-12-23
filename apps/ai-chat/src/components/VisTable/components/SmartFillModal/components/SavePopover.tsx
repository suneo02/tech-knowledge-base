import { Button, Divider, Form, Radio, Select, Space } from 'antd'
import { DataRange } from 'gel-ui'
import { SaveFormValues } from '../types'

interface SavePopoverProps {
  /**
   * 表单实例
   */
  // form: FormInstance<SaveFormValues>
  /**
   * 表单提交回调
   */
  onSubmit: (values: SaveFormValues) => void
}

// 模拟已存在的sheet数据
const existingSheets = [
  { id: 'sheet1', name: '销售数据' },
  { id: 'sheet2', name: '客户信息' },
  { id: 'sheet3', name: '产品目录' },
  { id: 'sheet4', name: '市场分析' },
  { id: 'sheet5', name: '财务报表' },
]

/**
 * 保存设置弹窗内容组件
 */
export const SavePopover = ({ onSubmit }: SavePopoverProps) => {
  const [form] = Form.useForm()
  const targetSheetValue = Form.useWatch('targetSheet', form)

  return (
    <div style={{ width: 320 }}>
      <Divider style={{ marginBlockStart: 12, marginBlockEnd: 12 }} />
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <DataRange />
        <Divider dashed style={{ marginBlockStart: 12, marginBlockEnd: 12 }} />
        <Form.Item name="targetSheet" label={targetSheetValue} initialValue="current">
          <Radio.Group>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Radio value="current">当前sheet</Radio>
              <Radio value="new">新的sheet</Radio>
              <Radio value="existing">
                已存在sheet
                {targetSheetValue === 'existing' && (
                  <Form.Item
                    name="existingSheetId"
                    noStyle
                    rules={[{ required: true, message: '请选择已存在的sheet' }]}
                  >
                    <Select
                      style={{ width: 180, marginLeft: 10 }}
                      placeholder="请选择sheet"
                      options={existingSheets.map((sheet) => ({
                        label: sheet.name,
                        value: sheet.id,
                      }))}
                    />
                  </Form.Item>
                )}
              </Radio>
            </Space>
          </Radio.Group>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            确认
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
