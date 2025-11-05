import { InfoCircleButton } from '@/components/icons/InfoCircle'
import intl from '@/utils/intl'
import { Button } from '@wind/wind-ui'
import classNames from 'classnames'
import { FC, default as React } from 'react'
import { useHKCorpInfoCtx } from '../ctx'
import styles from './style/instruction.module.less'

const instructions = [
  intl(414540, '根据香港特区政府公司注册处规定，查询香港企业公司资料需缴纳一定费用，并提供查册人信息'),
  intl(414541, '查询结果以实际为准，若某维度为空代表企业未披露该维度数据'),
  intl(414542, '查询结果将在5个工作日内返回，请届时至当前页面查看'),
] // TODO: 翻译
export const HKCorpInstruction: FC<{
  className?: string
}> = () => {
  const { dispatch } = useHKCorpInfoCtx()

  const handlePay = () => {
    dispatch({
      type: 'SET_MODAL_TYPE',
      payload: 'pay',
    })
  }
  return (
    <div className={classNames(styles.container)}>
      <h4 className={classNames(styles.titleContainer)}>
        <span className={classNames(styles.title)}>{intl(414543, '公司资料购买说明')}</span>
      </h4>
      <div className={classNames(styles.instructionList)}>
        {instructions.map((item, i) => (
          <span key={i}>{`${i + 1}. ${item}`}</span>
        ))}
      </div>
      <Button className={styles.payBtn} type={'primary'} onClick={handlePay}>
        <InfoCircleButton />
        <span>{intl(414525, '在线购买')}</span>
      </Button>
    </div>
  )
}
