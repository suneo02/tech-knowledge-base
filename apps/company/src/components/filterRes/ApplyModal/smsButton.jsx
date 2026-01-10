/**
 * 遮罩层组件
 */

import React, { useState, useEffect } from 'react'
import { Button } from '@wind/wind-ui'
import './index.less'
import intl from '../../../utils/intl'

const SmsButton = ({ onSmsCodeButtonClick }) => {
  const [time, setTime] = useState(0)

  const onClick = () => {
    if (time) {
      return
    }
    onSmsCodeButtonClick(() => {
      setTime(60)
    })
  }

  useEffect(() => {
    //如果设置倒计时且倒计时不为0
    if (time && time !== 0) {
      setTimeout(() => {
        setTime((time) => time - 1)
      }, 1000)
    }
  }, [time])

  return (
    <Button
      className={'smsButton'}
      onClick={() => {
        onClick(time)
      }}
      disabled={time}
      data-uc-id="gQh7w574d"
      data-uc-ct="button"
    >
      {!time ? intl('421619', '获取验证码') : `${time}${intl('420209', '后重试')}`}
    </Button>
  )
}

export default SmsButton
