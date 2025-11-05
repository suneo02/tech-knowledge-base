// 模拟获取积分的 API
export const fetchPointsApi = async (): Promise<{ count: number }> => {
  console.log('API Call: Fetching points...')
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 500))
  // 模拟成功响应
  const randomPoints = Math.floor(Math.random() * 1000)
  console.log(`API Response: Fetched ${randomPoints} points.`)
  return { count: randomPoints }
  // 模拟失败响应 (可以取消注释来测试错误处理)
  // throw new Error('Failed to fetch points')
}

// 模拟消耗积分的 API
export const consumePointsApi = async (amount: number): Promise<void> => {
  console.log(`API Call: Consuming ${amount} points...`)
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 800))
  // 模拟成功响应
  console.log(`API Response: Successfully consumed ${amount} points.`)
  return
  // 模拟失败响应 (可以取消注释来测试错误处理)
  // throw new Error('Failed to consume points')
}
