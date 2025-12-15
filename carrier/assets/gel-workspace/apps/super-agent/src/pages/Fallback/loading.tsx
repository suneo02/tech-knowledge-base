import { Skeleton } from '@wind/wind-ui'

const Loading = () => {
  return (
    <Skeleton animation>
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100vw', height: '100vh' }}
      ></div>
    </Skeleton>
  )
}

export default Loading
