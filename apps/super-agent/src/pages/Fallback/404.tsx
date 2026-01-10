import { Button, Result } from '@wind/wind-ui'
import { t } from 'gel-util/intl'
import { useNavigate } from 'react-router-dom'

const Fallback404 = () => {
  const navigate = useNavigate()
  return (
    <Result
      style={{ marginTop: '10vh' }}
      status={404}
      extra={
        <Button style={{ width: 82 }} onClick={() => navigate('/')}>
          {t('464221', '返回')}
        </Button>
      }
      title={t('482226', '页面失踪了')}
      subTitle={t('482227', '您浏览的页面失踪了, 请返回上一级页面吧')}
    />
  )
}

export default Fallback404
