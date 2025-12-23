// 3. 配置控制台输出
// 屏蔽某些控制台输出
console.error = jest.fn()
console.warn = jest.fn()

// 7. 设置测试超时时间
jest.setTimeout(10000)
