import { createRequest } from '@/api/request'
import { LinksModule } from '@/handle/link'
import useIframeCommunication from '@/hook/iframe'
import { ReportHomeIframeAction } from '@/utils/iframe/paths/report'
import { Button, Card, Form, Input } from 'antd'
import React, { useEffect, useState } from 'react'

const module = LinksModule.REPORT_HOME

const ReportInfo: React.FC = () => {
  const [params, setParams] = useState<any>()
  const { messages, sendMessage } = useIframeCommunication(null)
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue(params)
  }, [params])
  const initialParams = () => {
    const params = new URLSearchParams(window.location.search)
    const companyCode = params.get('companyCode') // 公司代码
    const reportId = params.get('id') // 报告ID
    const templateId = params.get('templateId') // 模板ID
    setParams({ companyCode, reportId, templateId })
  }

  const getReportInfoByServerApi = async () => {
    const api = createRequest({ noExtra: true })
    // 模仿接口
    const result = await api('search/company/getSearchNum')
    console.log(result)
  }

  useEffect(() => {
    getReportInfoByServerApi()
    initialParams()
  }, [])
  useEffect(() => {
    if (!messages?.payload) return
    setParams((pre) => ({ ...messages?.payload, reportId: pre.reportId }))
  }, [messages])
  return (
    <div style={{ width: '100%', height: '100%', padding: 12 }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <Card className="text-sm font-semibold" title="Report ID">
          {params?.reportId}
        </Card>
        <Card className="text-sm font-semibold" title="Report Company">
          {params?.companyCode}
        </Card>
        <Card className="text-sm font-semibold" title="Report Template">
          {params?.templateId}
        </Card>
        <Card className="text-sm font-semibold" title="接收到的消息">
          {JSON.stringify(messages)}
        </Card>
      </div>
      <div>
        {params?.reportId ? (
          <Card title="新增模板">
            <Form
              onFinish={(values) =>
                sendMessage({
                  module,
                  action: ReportHomeIframeAction.SAVE_REPORT_TEMPLATE_DATA,
                  payload: { ...values, type: params?.reportId },
                })
              }
            >
              <Form.Item label="类型" name={'type'}>
                {params?.reportId === '0' ? '尽调报告' : '信用报告'}
              </Form.Item>
              <Form.Item label="名称" name={'name'}>
                <Input></Input>
              </Form.Item>
              <Form.Item label="设置" name={'setting'}>
                <Input></Input>
              </Form.Item>
              <Button type="primary" htmlType="submit">
                新增模板
              </Button>
            </Form>
          </Card>
        ) : null}

        <Card title="更新模板">
          <Form
            form={form}
            onFinish={(values) =>
              sendMessage({
                module,
                action: ReportHomeIframeAction.SAVE_REPORT_TEMPLATE_DATA,
                payload: { ...values, id: params.templateId, type: params?.reportId },
              })
            }
          >
            <Form.Item label="ID" name={'templateId'}>
              <Input disabled></Input>
            </Form.Item>
            <Form.Item label="类型" name={'reportId'}>
              {params?.reportId === '0' ? '尽调报告' : '信用报告'}
            </Form.Item>
            <Form.Item label="名称" name={'name'}>
              <Input></Input>
            </Form.Item>
            <Form.Item label="设置" name={'setting'}>
              <Input></Input>
            </Form.Item>
            <Button type="primary" htmlType="submit">
              更新模板
            </Button>
          </Form>
        </Card>

        <Card title="删除模板">
          <Form
            onFinish={(value) =>
              sendMessage({
                module,
                action: ReportHomeIframeAction.DELETE_REPORT_TEMPLATE_DATA,
                payload: value,
              })
            }
          >
            <Form.Item label="ID" name={'id'}>
              <Input></Input>
            </Form.Item>
            <Button type="primary" htmlType="submit">
              删除模板
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  )
}

export default ReportInfo
