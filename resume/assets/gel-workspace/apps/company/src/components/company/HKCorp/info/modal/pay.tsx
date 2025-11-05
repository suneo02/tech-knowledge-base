import React, { ChangeEventHandler, FC, ReactNode, useEffect, useState } from 'react'
import { Button, Checkbox, message, Modal } from '@wind/wind-ui'
import styles from './style/pay.module.less'
import { SearcherForm } from './searcherForm'
import cn from 'classnames'
import classNames from 'classnames'
import { createHKPayOrder, IHKOrderInfo, IHKSearcherInfo } from '@/api/corp/HKCorp/pay.ts'
import { FormInstance } from '@wind/wind-ui-form'
import { useCreatePayOrder } from '@/api/pay.ts'
import { usePollingPaymentStatus } from '@/components/company/HKCorp/handlePay.ts'
import { useHKCorpInfoCtx } from '../ctx.tsx'
import { InvoiceSample, PrivacyPolicyBtn, UserAgreementBtn } from '@/components/pay/tip.tsx'
import intl from '@/utils/intl'
import { HKInfoQueryAggreBtn } from './HKInfoQueryAggre.tsx'

const tips: ReactNode[] = [
  <>
    {intl(414544, '万得企业库香港企业查询服务自完成支付起生效，一经开通不可退款，支持开具发票')} <InvoiceSample />
  </>,
  intl(414541, '查询结果以实际为准，若某维度为空代表企业未披露该维度数据'),
  intl(414542, '查询结果将在5个工作日内显示在本页面'),
]

export const HKCorpPay: FC<{
  className?: string
}> = () => {
  const { state, dispatch } = useHKCorpInfoCtx()
  const [searcherForm, setSearcherForm] = useState<FormInstance<IHKSearcherInfo> | null>(null)
  const [isCheckedStatement, setIsCheckedStatement] = useState(false) // 查册人声明复选框状态
  const [isCheckedTerms, setIsCheckedTerms] = useState(false) // 服务条款复选框状态
  const [isModalVisible, setIsModalVisible] = useState(false) // 控制查册人表单的 Modal 显示状态

  const { createPayOrder, orderData, success } = useCreatePayOrder<IHKOrderInfo>(createHKPayOrder)

  const handlePaySuccess = () => {
    message.info('支付成功, 正在为您重新加载页面')
    dispatch({ type: 'SET_MODAL_TYPE', payload: 'processing' })
  }
  const handlePayError = () => {
    console.log('支付异常!(-2)')
  }
  const { startPolling } = usePollingPaymentStatus(orderData?.orderId, handlePaySuccess, handlePayError)

  useEffect(() => {
    if (success && orderData?.orderId) {
      // 轮询查询订单状态
      startPolling()
    }
  }, [success, orderData])

  // 表单提交后的处理逻辑
  const handleFormSubmit = () => {
    setIsCheckedStatement(true) // 自动勾选声明复选框
    setIsModalVisible(false) // 关闭 Modal
  }

  // 点击声明复选框时触发
  const handleCheckboxChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!state.searcherFormValues) {
      setIsModalVisible(true) // 未完成表单时显示 Modal
    } else {
      setIsCheckedStatement(e.target.checked)
    }
  }

  // 支付按钮点击逻辑
  const handlePayment = async () => {
    if (!(isCheckedStatement && isCheckedTerms)) {
      message.error(intl(0, '请阅读并同意相关协议'))
      return
    }
    // check form 以防万一
    if (!searcherForm?.validateFields() || !state.searcherFormValues || !state.corpCode) {
      console.error('form validate failed', searcherForm?.getFieldsError(), searcherForm?.getFieldsValue(), state)
      return
    }
    await createPayOrder({
      ...state.searcherFormValues,
      companyCode: state.corpCode,
      dataModule: 'companyInfo',
    })
  }

  return (
    <div className={cn(styles.paymentContainer, 'flex', 'flex-column', 'align-center')}>
      <h2 className={styles.title}>{intl(414513, '公司资料')}</h2>
      <h3 className={styles.titleSecond}>{intl(414545, '包括股东结构、股东资料、董事信息、秘书资料')}</h3>

      <div className={cn(styles.descContainer, 'flex', 'justify-space-between', 'align-center')}>
        <span className={cn(styles.descCorp)}>
          【{state.corpName}】{intl(414513, '公司资料')}
        </span>
        <span>
          <span className={cn(styles.descPrice)}>{window.en_access_config ? 'CNY 50' : '50元'}</span>
          {window.en_access_config ? '' : '/份'}
        </span>
      </div>
      <div className={cn(styles.checkboxAndPay, 'flex', 'align-center')}>
        {/* 服务条款复选框 */}
        <div className={styles.checkboxWrapper}>
          <Checkbox checked={isCheckedStatement} onChange={handleCheckboxChange} className={styles.checkbox}>
            {intl(415013, '我已填写')}
            {/* TODO 需要国际化 */}
            <Button className={classNames('p-0', 'border-0')} type={'link'} onClick={() => setIsModalVisible(true)}>
              《{intl(414533, '查册人信息及声明')}》
            </Button>
          </Checkbox>
          <Checkbox
            checked={isCheckedTerms}
            onChange={(e) => setIsCheckedTerms(e.target.checked)}
            className={styles.checkbox}
          >
            {intl('150315', '我已阅读并同意')}
            <UserAgreementBtn text={`《${intl(209659, '用户协议')}》`} />
            、 <PrivacyPolicyBtn text={`《${intl(242146, '隐私政策')}》`} />、<HKInfoQueryAggreBtn />
          </Checkbox>
        </div>

        <Button type="primary" onClick={handlePayment} className={styles.paymentButton}>
          {intl(392560, '立即支付')}
        </Button>
      </div>

      <div className={styles.tipsContainer}>
        {tips.map((tip, i) => (
          <p key={i} className={styles.tipWrapper}>
            * <span className={styles.tipText}>{tip}</span>
          </p>
        ))}
      </div>

      {/* 查册人表单 Modal */}
      {/*@ts-expect-error ttt*/}
      <Modal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        className={styles.searcherFormModal}
      >
        <SearcherForm
          onFinish={handleFormSubmit}
          onFormReady={setSearcherForm}
          onCancel={() => {
            setIsCheckedStatement(false)
            setIsModalVisible(false)
          }}
        />
      </Modal>
    </div>
  )
}
