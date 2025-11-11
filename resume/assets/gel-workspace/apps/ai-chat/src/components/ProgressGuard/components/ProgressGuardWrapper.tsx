import { ProgressGuardProvider, useProgressGuard, ProgressBar, GuardedButton } from '@/components/ProgressGuard'

// This is a helper function to simulate an API call
const fetchData = () => new Promise((resolve) => setTimeout(resolve, 3000))

const DemoContent = () => {
  const { startProgress, endProgress } = useProgressGuard()

  const handleProcess = async () => {
    startProgress()
    try {
      await fetchData()
    } finally {
      endProgress()
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>Progress Guard Demo</h1>
      <p style={{ margin: '20px 0' }}>Click the buttons below to see the progress bar and guarded button in action.</p>
      <GuardedButton onClick={handleProcess}>提交数据 (模拟3秒延迟)</GuardedButton>
      <hr style={{ margin: '40px 0' }} />
      <DeeplyNestedComponent />
    </div>
  )
}

const DeeplyNestedComponent = () => (
  <div>
    <h2>这是一个深度嵌套的组件</h2>
    <p style={{ margin: '20px 0' }}>这个按钮同样会受全局加载状态的控制。</p>
    <GuardedButton
      toastMessage="全局处理中，此操作已被禁止"
      onClick={() => {
        alert('嵌套的按钮被点击')
      }}
    >
      嵌套的按钮
    </GuardedButton>
  </div>
)

const ProgressBarWrapper = () => {
  const { inProgress } = useProgressGuard()
  return <ProgressBar visible={inProgress} />
}

const ProgressGuardWrapper = () => {
  return (
    <ProgressGuardProvider>
      <ProgressBarWrapper />
      <DemoContent />
    </ProgressGuardProvider>
  )
}

export default ProgressGuardWrapper
