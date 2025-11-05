/* eslint-disable @typescript-eslint/no-explicit-any */
import { local } from '@/utils'
import { Divider, Modal } from 'antd'
import { ExtendedColumnDefine } from '../../../utils/columnsUtils'
import { UnorderedListOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { AIIcon, CoinsIcon } from '@/assets/icon'
import { useState, useEffect } from 'react'
import { Flex, Tag, Space, Table, Tooltip } from 'antd'

interface SmartFillModalProps {
  /**
   * 控制Modal是否显示
   */
  open: boolean
  /**
   * 关闭Modal的回调函数
   */
  onCancel?: () => void
  /**
   * 确认按钮的回调函数
   */
  onOk?: () => void
  /**
   * 表格列配置
   */
  id: string
}

/**
 * @deprecated
 * AI生成列Modal组件
 * 用于配置AI生成列的相关参数
 */
export const EnterpriseDataBrowserInfoModal = ({ open, onCancel, onOk, id }: SmartFillModalProps) => {
  const [columns, setColumns] = useState<ExtendedColumnDefine[]>([])
  const [data, setData] = useState<any[]>([])
  const [from, setFrom] = useState<string>('')
  const content =
    '麻烦给我一个关于小米科技有限公司的表格数据，数据需要包含公司名称、成立时间、注册资本、法定代表人、注册地址、经营范围、联系方式'

  useEffect(() => {
    if (!open) return
    const data = (local.get('multi-table-data') || []) as any[]
    const currentData = data.find((item) => item.id === id)
    setColumns(currentData.columns)
    setData(currentData.data)
    setFrom(currentData.from)
  }, [open])
  return (
    <Modal
      destroyOnClose
      title={
        <>
          <UnorderedListOutlined />
          单元格详情
        </>
      }
      style={{ top: 100, marginRight: 18 }}
      width={from === 'CDE' ? 1200 : 400}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      maskProps={{ style: { background: 'transparent' } }}
      footer={null}
    >
      <Divider style={{ marginBlock: 12 }} />
      <div style={{ marginBlockEnd: 12 }}>
        <Flex align="center" justify="space-between" style={{ width: '100%', marginBlockEnd: 12 }}>
          <Flex style={{ fontWeight: 600 }}>
            数据来源：{' '}
            {from !== 'CDE' ? (
              <Tag color="purple">CDE</Tag>
            ) : (
              <>
                <AIIcon /> AI获取
              </>
            )}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(240, 111, 19, 0.08)',
                borderRadius: 16,
                padding: '4px 10px',
                marginLeft: 12,
              }}
            >
              <CoinsIcon style={{ width: 16, height: 16, marginRight: 4, color: '#f06f13' }} />
              <span style={{ fontSize: 14, color: '#f06f13', marginInlineEnd: 4 }}>10</span>
              <span style={{ fontSize: 14, color: '#f06f13' }}>{`积分`}</span>
            </div>
          </Flex>
          <Flex align="center">
            {from !== 'CDE' && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(240, 111, 19, 0.08)',
                  borderRadius: 16,
                  padding: '4px 10px',
                  marginRight: 12,
                }}
              >
                <CoinsIcon style={{ width: 16, height: 16, marginRight: 4, color: '#f06f13' }} />
                <span style={{ fontSize: 14, color: '#f06f13', marginInlineEnd: 4 }}>15</span>
                <span style={{ fontSize: 14, color: '#f06f13' }}>{`/ 行`}</span>
              </div>
            )}
            <Flex style={{ fontSize: 12 }}>{dayjs().format('YYYY-MM-DD HH:mm')}</Flex>
          </Flex>
        </Flex>
        <Space>
          {from === 'CDE' ? (
            <>
              <p>筛选项：</p>
              {columns.map((item) => (
                <Tag key={item.title}>{item.title}</Tag>
              ))}
            </>
          ) : null}
        </Space>
        {/* <Button
          size="small"
          type="primary"
          onClick={() =>
            Modal.info({
              content: '敬请期待...',
            })
          }
        >
          {from === 'CDE' ? '前往数据浏览器' : '定位对话内容'}
        </Button> */}
      </div>

      {from === 'CDE' ? (
        <Table size="small" columns={columns} dataSource={data} />
      ) : (
        <Tooltip placement="topRight" title="点击定位对话内容">
          <div
            style={{ backgroundColor: '#f5f5f5', borderRadius: 4, padding: 12, cursor: 'pointer' }}
            onClick={() =>
              Modal.info({
                content: '敬请期待...',
              })
            }
          >
            <p>
              <strong>问题：</strong>
              {content}
            </p>
          </div>
        </Tooltip>
      )}
    </Modal>
  )
}

export default EnterpriseDataBrowserInfoModal
