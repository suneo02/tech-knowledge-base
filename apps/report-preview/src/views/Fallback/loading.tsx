import { Spin } from '@wind/wind-ui'

const Loading = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100vw', height: '100vh' }}>
      <Spin size="large" />
    </div>
  )
}

export default Loading
