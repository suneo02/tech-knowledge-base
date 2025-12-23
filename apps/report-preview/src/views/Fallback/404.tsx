import { Button, Result } from '@wind/wind-ui'

const Fallback404 = () => (
  <Result
    status={404}
    extra={<Button style={{ width: 82 }}>返回</Button>}
    title={'页面失踪了'}
    subTitle={'您浏览的页面失踪了, 请返回上一级页面吧'}
  />
)

export default Fallback404
