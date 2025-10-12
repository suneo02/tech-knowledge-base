# 前端面试高频场景题

> 本文档收集了前端开发中的高频面试题，涵盖实际场景、系统设计、性能优化、算法实现等多个方面。

## 目录

- [前端实现类问题](#前端实现类问题)
- [性能与优化](#性能与优化)
- [系统设计](#系统设计)
- [网络与通信](#网络与通信)
- [框架与工具](#框架与工具)
- [编程基础与算法](#编程基础与算法)
- [代码实现题](#代码实现题)

---

## 前端实现类问题

### 1. 前端如何实现截图？

**来源**：腾讯一面

**相关知识点**：
- Canvas API
- html2canvas 库
- SVG 转换
- DOM 渲染

### 2. 使用同一个链接，如何实现 PC 打开是 web 应用、手机打开是 H5 应用？

**来源**：腾讯二面

**相关知识点**：
- User-Agent 检测
- 响应式设计
- 服务端渲染
- 重定向策略

### 3. H5 如何解决移动端适配问题？

**来源**：美团一面

**相关知识点**：
- viewport 设置
- rem/vw 单位
- flexible.js
- 媒体查询

**相关文档**：
- [用户体验优化](user-experience-optimization.md)

### 4. 点击一键换肤的实现方式有哪些？

**来源**：美团一面

**相关知识点**：
- CSS 变量（CSS Custom Properties）
- 主题切换
- 动态样式注入
- localStorage 持久化

**相关文档**：
- [样式规范标准化](style-guidelines-standardization.md)

### 5. 如何实现网页加载进度条？

**来源**：百度一面

**相关知识点**：
- PerformanceObserver API
- 资源加载监控
- 进度计算
- UI 实现

**相关文档**：
- [认证与加载](auth-and-loading.md)

### 6. 常见图片懒加载方式有哪些？

**来源**：京东一面

**相关知识点**：
- Intersection Observer API
- scroll 事件监听
- loading="lazy" 属性
- 虚拟列表

**相关文档**：
- [数据展示优化](data-display-optimization.md)
- [下拉刷新与无限滚动](pull-to-refresh-and-infinite-scroll.md)

### 7. 前端水印了解多少？

**来源**：腾讯二面

**相关知识点**：
- Canvas 水印
- SVG 水印
- 明水印与暗水印
- 防删除策略
- MutationObserver

---

## 性能与优化

### 8. 当 QPS 达到峰值时，如何处理？

**标签**：必会

**相关知识点**：
- 请求限流
- 请求队列
- 降级策略
- CDN 缓存
- 服务端优化

### 9. 如何保证用户的使用体验？

**来源**：字节一面

**相关知识点**：
- 性能优化
- 交互反馈
- 错误处理
- 离线可用
- 渐进式增强

**相关文档**：
- [用户体验优化](user-experience-optimization.md)
- [性能优化](../performance/README.md)

### 10. 如何解决页面请求接口大规模并发问题？

**标签**：必会

**相关知识点**：
- 请求合并
- 请求池控制
- Promise.allSettled
- 并发限制
- 缓存策略

### 11. 性能优化

**相关知识点**：
- 代码分割
- 懒加载
- Tree Shaking
- 资源压缩
- 缓存策略
- 渲染优化

**相关文档**：
- [性能优化](../performance/README.md)
- [资源预加载](resource-preloading.md)

---

## 系统设计

### 12. 设计一套全站请求耗时统计工具

**相关知识点**：
- Performance API
- 拦截器设计
- 数据采集
- 上报机制
- 数据可视化

### 13. 大文件上传了解多少？

**来源**：百度一面

**相关知识点**：
- 文件切片
- 断点续传
- 并发上传
- MD5 计算
- 秒传功能

### 14. 设计一个弹窗组件

**相关知识点**：
- 组件设计
- API 设计
- 状态管理
- 事件处理
- 可访问性

### 15. 弹窗组件如何挂载到 body 最后而不是调用位置

**相关知识点**：
- Portal 机制
- createPortal（React）
- Teleport（Vue）
- appendChild
- 组件挂载位置

### 16. 如何将 target.onclose 挂到弹窗组件原型链上

**相关知识点**：
- 原型链
- 事件委托
- 生命周期钩子
- 自定义事件

---

## 网络与通信

### 17. Cookie 构成部分有哪些？

**来源**：百度一面

**相关知识点**：
- Cookie 属性
- 安全属性（HttpOnly, Secure, SameSite）
- 作用域（Domain, Path）
- 过期时间

**相关文档**：
- [网络基础](../foundations/network.md)

### 18. 扫码登录实现方式

**来源**：腾讯一面

**相关知识点**：
- 二维码生成
- 轮询/长轮询
- WebSocket
- 状态同步

**相关文档**：
- [二维码登录](qr-code-login.md)

### 19. DNS 协议了解多少？

**来源**：字节一面

**相关知识点**：
- DNS 解析过程
- DNS 缓存
- DNS 预解析
- CDN 调度

**相关文档**：
- [网络基础](../foundations/network.md)

### 20. SSE、HTTP、WebSocket 的区别

**相关知识点**：
- 协议特性
- 连接方式
- 使用场景
- 性能对比

**相关文档**：
- [网络基础](../foundations/network.md)

### 21. Chat 对话为什么不优先用 WebSocket

**相关知识点**：
- Server-Sent Events (SSE)
- WebSocket vs SSE
- 单向通信场景
- 兼容性考虑

---

## 框架与工具

### 22. 前后端联调方式 & 如何让线上页面连本地 JS/HTML 文件构建

**相关知识点**：
- 代理配置
- 本地调试
- Source Map
- Charles/Fiddler
- Webpack DevServer

**相关文档**：
- [Webpack](../tooling/webpack.md)
- [Vite](../tooling/vite.md)

### 23. Markdown 配置化

**相关知识点**：
- Markdown 解析
- 自定义渲染器
- 插件系统
- 配置管理

### 24. 打包过程中如何做代码分割

**相关知识点**：
- 动态 import
- Code Splitting
- Chunk 策略
- 懒加载路由

**相关文档**：
- [Webpack](../tooling/webpack.md)
- [模块系统](../tooling/module-systems.md)

### 25. Router 哈希模式与非哈希模式的区别

**相关知识点**：
- Hash Router
- History Router
- 路由原理
- 服务端配置

**相关文档**：
- [页面导航](page-navigation.md)
- [Vue Router](../frameworks/vue/router.md)

### 26. 本地启动后端服务

**相关知识点**：
- Node.js 服务
- Express/Koa
- Mock 服务
- 代理配置

---

## AI 相关

### 27. 有没有自己搭过 Agent 服务

**相关知识点**：
- Agent 架构
- LLM 集成
- 工具调用
- 流式输出

### 28. Agent 之间如何通信

**相关知识点**：
- 消息队列
- 事件驱动
- 状态共享
- 协议设计

### 29. Agent 和 LLM 区别与优缺点

**相关知识点**：
- Agent 概念
- LLM 能力
- 应用场景
- 技术选型

### 30. 同一个对话内如何传递上下文

**相关知识点**：
- 上下文管理
- Token 限制
- 摘要策略
- 状态持久化

---

## 编程基础与算法

### 31. JS 超过 Number 最大值的数怎么处理？

**相关知识点**：
- BigInt
- 数值精度
- 字符串运算
- 第三方库（big.js）

### 32. 函数式编程了解多少？

**来源**：京东一面

**相关知识点**：
- 纯函数
- 高阶函数
- 不可变性
- 函数组合
- Currying

---

## 代码实现题

> 以下为手撕代码题，通常要求在 30 分钟内完成 5 选 2

### 33. 千分位分隔符实现

**难度**：中等

**相关知识点**：
- 正则表达式
- 字符串处理
- 数字格式化
- 边界情况处理

**示例输入输出**：
```
输入: 1234567.89
输出: "1,234,567.89"
```

### 34. EventEmitter 实现

**难度**：中等

**相关知识点**：
- 发布订阅模式
- 事件系统
- 类设计
- 内存管理

**需要实现的方法**：
- `on(event, listener)` - 监听事件
- `emit(event, ...args)` - 触发事件
- `off(event, listener)` - 移除监听
- `once(event, listener)` - 一次性监听

### 35. 最大不重复子串

**难度**：中等

**相关知识点**：
- 滑动窗口
- 哈希表
- 字符串算法
- 时间复杂度优化

**示例输入输出**：
```
输入: "abcabcbb"
输出: 3 (abc)
```

### 36. 大数相加

**难度**：中等

**相关知识点**：
- 字符串处理
- 进位计算
- 边界情况
- BigInt 替代方案

**示例输入输出**：
```
输入: "123456789", "987654321"
输出: "1111111110"
```

### 37. 函数柯里化

**难度**：中高

**相关知识点**：
- 闭包
- 函数式编程
- 参数收集
- 递归

**示例实现目标**：
```javascript
// 实现 curry 函数
function add(a, b, c) {
  return a + b + c;
}

const curriedAdd = curry(add);
curriedAdd(1)(2)(3); // 6
curriedAdd(1, 2)(3); // 6
curriedAdd(1)(2, 3); // 6
```

---

## 相关资源

### 内部文档
- [认证与加载](auth-and-loading.md)
- [页面导航](page-navigation.md)
- [二维码登录](qr-code-login.md)
- [用户体验优化](user-experience-optimization.md)
- [数据展示优化](data-display-optimization.md)
- [性能优化](../performance/README.md)
- [网络基础](../foundations/network.md)

### 学习建议

**基础必备**：
1. 深入理解 JavaScript 核心概念
2. 掌握常见算法和数据结构
3. 熟悉浏览器工作原理
4. 了解网络协议和通信机制

**进阶提升**：
1. 系统设计能力
2. 性能优化实践
3. 工程化能力
4. 框架源码理解

**面试准备**：
1. 每个问题准备完整答案
2. 结合实际项目经验
3. 准备代码实现
4. 了解最新技术趋势

---

**最后更新**：2024-10  
**维护者**：Hidetoshi Dekisugi  
**说明**：题目来源于真实面试经验，持续更新中

