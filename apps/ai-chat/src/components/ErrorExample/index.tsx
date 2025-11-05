import React from 'react'
import { Button, Space, Card, Typography } from 'antd'
import { useErrorHandler } from '../../hooks/useErrorHandler'
import { ErrorActionType } from '../../api/error/errorConfig'
import styles from './styles.module.less'

const { Title, Paragraph } = Typography

const ErrorExample: React.FC = () => {
  const { displayError, displayCustomError, createErrorAction } = useErrorHandler()

  // 显示积分不足错误
  const showInsufficientPointsError = () => {
    displayError(100001)
  }

  // 显示支付失败错误
  const showPaymentFailedError = () => {
    displayError(100002)
  }

  // 显示操作成功通知
  const showOperationSuccessNotice = () => {
    displayError(100003)
  }

  // 显示无需确认的提示
  const showInfoNotice = () => {
    displayError(100004)
  }

  // 显示自定义错误
  const showCustomError = () => {
    displayCustomError(100001, {
      title: '自定义积分不足提示',
      message: '您当前积分仅剩10分，该操作需要消耗50积分，请先充值',
      actions: [
        createErrorAction(ErrorActionType.RECHARGE, '立即充值', () => {
          console.log('跳转到自定义充值页面')
          // 可以在这里添加自定义的充值逻辑
        }),
        createErrorAction(ErrorActionType.CANCEL, '稍后再说'),
      ],
    })
  }

  return (
    <Card className={styles.errorExample}>
      <Title level={3}>错误处理示例</Title>
      <Paragraph>点击下面的按钮测试不同类型的错误提示</Paragraph>

      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Button type="primary" onClick={showInsufficientPointsError}>
          测试积分不足错误
        </Button>

        <Button type="primary" danger onClick={showPaymentFailedError}>
          测试支付失败错误
        </Button>

        <Button type="primary" style={{ background: '#52c41a' }} onClick={showOperationSuccessNotice}>
          测试操作成功通知
        </Button>

        <Button type="default" onClick={showInfoNotice}>
          测试无需确认的提示
        </Button>

        <Button type="dashed" onClick={showCustomError}>
          测试自定义错误
        </Button>
      </Space>
    </Card>
  )
}

export default ErrorExample
