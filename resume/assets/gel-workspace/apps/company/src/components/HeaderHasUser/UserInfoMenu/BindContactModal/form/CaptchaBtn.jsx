import { Button } from '@wind/wind-ui'
import { useContext, useMemo, useState } from 'react'
import { CaptchaComp } from '../../../../common/captcha'
import { BindContactModalCtx } from '../handle/Ctx'
import intl from '../../../../../utils/intl'

export const CaptchaBtn = () => {
  const {
    captchaState: { secRemain, ifSent, loading },
    dispatch,
  } = useContext(BindContactModalCtx)
  const [captchaOpen, setCaptchaOpen] = useState(false)

  const buttonDisabled = secRemain > 0
  /**
   * button content
   */
  const content = useMemo(() => {
    if (typeof secRemain === 'number' && secRemain > 0) {
      return String(secRemain) + 'S'
    } else {
      if (ifSent) {
        return intl('417206', '重新获取')
      } else {
        return intl('421619', '获取验证码')
      }
    }
  }, [secRemain, ifSent])

  const onClick = () => {
    setCaptchaOpen(true)
  }

  const onCloseCaptcha = () => {
    setCaptchaOpen(false)
  }

  const onCaptchaSunccess = (result) => {
    console.log('🚀 ~ CaptchaBtn onCaptchaSunccess ~ result:', result)
    setCaptchaOpen(false)
    dispatch({
      type: 'setCaptchaResult',
      payload: result,
    })
  }

  return (
    <>
      <Button onClick={onClick} loading={loading} disabled={buttonDisabled} data-uc-id="vS0xFSL97" data-uc-ct="button">
        {content}
      </Button>
      <CaptchaComp
        open={captchaOpen}
        onSuccess={onCaptchaSunccess}
        onClose={onCloseCaptcha}
        data-uc-id="Y90ih58l5D"
        data-uc-ct="captchacomp"
      />
    </>
  )
}
