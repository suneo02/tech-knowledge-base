# 前端面试高频场景题

> 本目录整理前端开发中的高频面试场景题，按**场景分类**组织，注重思路和原理，精简代码示例。

## 目录

- [文档导航](#document-navigation)
- [使用指南](#usage-guide)
- [答题技巧](#answering-techniques)
- [学习建议](#study-advice)
- [相关资源](#related-resources)

---

## 📚 文档导航 {#document-navigation}

### 核心场景文档

**[认证与会话](auth-and-session.md)** (~650行)  
Cookie/Session、Token、JWT、SSO、OAuth、扫码登录、Cookie 构成

**[页面交互](page-interaction.md)** (~600行)  
路由导航、Hash/History、下拉刷新、无限滚动、输入监听、PC/H5 适配、换肤

**[性能优化](performance-optimization.md)** (~620行)  
QPS处理、并发控制、预加载、懒加载、代码分割、虚拟列表、加载进度条、耗时统计

### 专题文档

**[网络与通信](network-communication.md)**  
DNS 协议、SSE vs HTTP vs WebSocket、Chat 对话技术选型

**[系统设计](system-design.md)**  
前端截图、弹窗组件、前端水印、大文件上传

**[工程化与调试](engineering-and-debugging.md)**  
前后端联调、线上调试、本地后端服务、移动端适配、Markdown 配置化

**[AI 相关](ai-related.md)**  
Agent 服务、Agent 通信、Agent vs LLM、对话上下文

**[手撕代码](coding-challenges.md)**  
千分位、EventEmitter、子串、大数相加、柯里化、BigInt、函数式编程

### 补充文档

**[用户体验优化](user-experience-optimization.md)**  
感知性能、交互反馈、无障碍设计

**[国际化](internationalization-language-switching.md)**  
i18next、运行时切换、按需加载

**[样式规范化](style-guidelines-standardization.md)**  
BEM 命名、CSS 变量、主题切换

**[代码扫描设计](static-code-scanning-design.md)**  
ESLint、Prettier、Husky、CI 门禁

---

## 🎯 使用指南 {#usage-guide}

### 按场景查找

如果你知道题目属于哪个场景：

1. **认证相关** → [auth-and-session.md](auth-and-session.md)
   - 登录方式、Token、SSO、OAuth、Cookie
   
2. **交互相关** → [page-interaction.md](page-interaction.md)
   - 路由、滚动、输入处理、适配、换肤
   
3. **性能相关** → [performance-optimization.md](performance-optimization.md)
   - 加载优化、渲染优化、网络优化、监控

4. **网络通信** → [network-communication.md](network-communication.md)
   - DNS、SSE、WebSocket、通信协议选型

5. **系统设计** → [system-design.md](system-design.md)
   - 组件设计、功能实现、架构设计

6. **工程化** → [engineering-and-debugging.md](engineering-and-debugging.md)
   - 联调、调试、构建、适配

7. **AI 相关** → [ai-related.md](ai-related.md)
   - Agent、LLM、上下文管理

8. **代码实现** → [coding-challenges.md](coding-challenges.md)
   - 算法、数据结构、手撕代码

### 按公司查找

文档中标注了题目来源：
- **腾讯**：扫码登录、Hash/History路由、弹窗组件、截图、换肤、水印、PC/H5适配等
- **字节**：输入监听、虚拟列表、资源预加载、UX优化、请求耗时统计、DNS协议等
- **美团**：路由原理、代码分割、样式规范、移动端适配、换肤等
- **百度**：无限滚动、虚拟列表、大文件上传、Cookie、加载进度条等
- **京东**：图片懒加载、函数式编程等

### 学习路径

**新手入门**：
1. [认证与会话](auth-and-session.md) - 理解登录认证的各种方式
2. [页面交互](page-interaction.md) - 掌握常见交互场景的实现
3. [网络通信](network-communication.md) - 了解网络协议和通信方式
4. [用户体验优化](user-experience-optimization.md) - 了解体验优化方向

**进阶提升**：
1. [性能优化](performance-optimization.md) - 深入性能优化各个方面
2. [系统设计](system-design.md) - 锻炼系统设计能力
3. [工程化与调试](engineering-and-debugging.md) - 提升工程化水平
4. [AI 相关](ai-related.md) - 了解 AI 应用开发

**算法能力**：
1. [手撕代码](coding-challenges.md) - 常见算法和编程题
2. 结合 LeetCode 刷题

**面试准备**：
1. 按场景逐个突破
2. 准备每道题的追问
3. 结合实际项目经验
4. 模拟手撕代码练习

---

## 💡 答题技巧 {#answering-techniques}

### 回答结构

```
1. 问题分析（30秒）
   - 理解题目考察点
   - 明确需求和约束
   
2. 方案设计（2分钟）
   - 说明实现思路
   - 对比多种方案
   - 选择合适方案
   
3. 技术细节（2分钟）
   - 关键技术点
   - 可能的坑
   - 优化方向
   
4. 代码实现（可选）
   - 核心逻辑代码
   - 简洁清晰
   
5. 回答追问（1-2分钟）
   - 准备常见追问
   - 结合项目经验
```

### 黄金法则

✅ **DO（应该做的）**：
- 先说思路，后写代码
- 多种方案对比，说明优缺点
- 关注边界情况和性能
- 结合实际项目经验
- 主动提及可能的问题和优化
- 使用图表辅助说明（如时序图、流程图）

❌ **DON'T（不要做的）**：
- 不要上来就写代码
- 不要只说一种方案
- 不要忽略细节和追问
- 不要说"不知道"（可以说思路和猜测）
- 不要过度追求完美（关注核心逻辑）

### 追问应对

每道题都准备 2-3 个常见追问：

**示例（JWT 认证）**：
- Q: JWT 和普通 Token 的区别？
- Q: JWT 如何实现主动失效？
- Q: JWT 如何防止被盗用？

**技巧**：
- 提前思考"面试官会问什么"
- 准备技术对比和选型理由
- 结合实际项目中遇到的问题

---

## 📖 学习建议 {#study-advice}

### 基础必备

1. **JavaScript 核心**
   - 闭包、原型链、异步编程
   - ES6+ 新特性
   - 常见设计模式

2. **浏览器原理**
   - DOM 事件、渲染流程
   - 事件循环、宏任务微任务
   - 缓存机制、存储方案

3. **网络协议**
   - HTTP/HTTPS、状态码
   - WebSocket、SSE
   - CORS、安全防护

4. **算法数据结构**
   - 常见算法（排序、搜索）
   - 数据结构（数组、链表、树、图）
   - 时间空间复杂度分析

### 进阶提升

1. **系统设计能力**
   - 组件设计（API 设计、状态管理）
   - 工具设计（插件机制、扩展性）
   - 架构设计（模块划分、通信方式）

2. **性能优化实践**
   - 加载优化（懒加载、预加载、分割）
   - 渲染优化（虚拟列表、防抖节流）
   - 网络优化（缓存、合并、压缩）

3. **工程化能力**
   - 构建工具（Webpack、Vite）
   - 代码规范（Lint、Format）
   - 测试（单元测试、E2E测试）

4. **框架源码理解**
   - React（Fiber、Hooks、合成事件）
   - Vue（响应式、虚拟DOM、编译优化）

### 面试准备清单

- [ ] 每个题目准备完整答案（思路+原理+代码）
- [ ] 结合实际项目经验（说具体场景）
- [ ] 准备常见追问（每题2-3个）
- [ ] 了解最新技术趋势（如 React 18、Vue 3）
- [ ] 手撕代码练习（LeetCode 中等难度）
- [ ] 模拟面试练习（找朋友互相提问）

---

## 🔗 相关资源 {#related-resources}

### 基础知识
- [浏览器基础](../foundations/browser.md) - 理解浏览器工作机制
- [网络基础](../foundations/network.md) - HTTP、WebSocket 等
- [Web 安全](../foundations/security/README.md) - XSS、CSRF 防护

### 框架相关
- [React 指南](../frameworks/react.md) - React 生态和最佳实践
- [Vue 指南](../frameworks/vue/README.md) - Vue 响应式和组件化

### 性能优化
- [性能优化](../performance/README.md) - 全面的性能优化指南

### 工具链
- [Webpack](../tooling/webpack.md) - 模块打包
- [Vite](../tooling/vite.md) - 下一代构建工具
- [测试工具](../tooling/testing/README.md) - 测试策略

### 外部资源
- [MDN Web Docs](https://developer.mozilla.org/) - 权威的 Web 技术文档
- [JavaScript.info](https://javascript.info/) - 现代 JavaScript 教程
- [LeetCode](https://leetcode.com/) - 算法练习

---

## ✨ 文档特点

根据项目根目录 `meta/writing-guidelines.md` 中的"面试题文档编写规范"：

1. **文字为主（70%），代码为辅（30%）**
   - 重点讲解实现思路、原理和技术要点
   - 代码仅展示核心逻辑，每段 ≤ 30 行

2. **图表说明流程**
   - 使用 Mermaid 时序图、流程图
   - 清晰展示复杂的交互过程

3. **完整答题思路**
   - 问题背景
   - 多种解决方案对比
   - 技术要点
   - 常见追问

4. **简洁聚焦**
   - 核心文档：560-626 行
   - 避免过度详细的教程式代码

---

**最后更新**：2024-10  
**维护者**：Hidetoshi Dekisugi  
**文档规范**：参考项目根目录 `meta/writing-guidelines.md` 中的"面试题文档编写规范"  
**说明**：题目持续更新中，欢迎补充
