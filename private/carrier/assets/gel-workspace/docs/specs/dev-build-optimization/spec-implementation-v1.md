---
title: 开发环境依赖包构建优化 - 实施计划
version: v1
status: 🚧 进行中
---

[← 返回任务概览](/docs/specs/dev-build-optimization/README.md)

# 开发环境依赖包构建优化 - 实施计划 v1

## 1. 任务拆解

| 任务编号 | 任务描述                            | 负责人 | 预计工时 | 依赖 | 状态    |
| -------- | ----------------------------------- | ------ | -------- | ---- | ------- |
| T1       | 更新 turbo.json 添加 build:dev 任务 | -      | 0.5h     | -    | ✅ 完成 |
| T2       | 更新所有 packages 的 package.json   | -      | 1h       | T1   | ✅ 完成 |
| T3       | 添加根 package.json dev:debug 脚本  | -      | 0.5h     | T2   | ✅ 完成 |
| T4       | 更新 scripts/run-app.js 支持 debug  | -      | 1h       | T3   | ✅ 完成 |
| T5       | 测试验证（gel-ui、gel-api）         | -      | 2h       | T4   | 待测试  |
| T6       | 更新开发文档                        | -      | 1h       | T5   | 待开始  |

## 2. 关键文件

| 文件路径                   | 修改内容                             |
| -------------------------- | ------------------------------------ |
| `/turbo.json`              | 新增 build:dev 和 dev:debug 任务配置 |
| `/packages/*/package.json` | 新增 build:dev 脚本                  |
| `/apps/*/package.json`     | 新增 dev:debug 脚本                  |
| `/package.json`            | 新增 dev:debug:\* 脚本               |
| `/scripts/run-app.js`      | 支持 dev:debug 模式                  |
| `/docs/development.md`     | 更新开发模式说明                     |

## 3. 实施步骤

### 3.1 T1: 更新 turbo.json

@see /turbo.json

新增任务：

```json
"build:dev": {
  "dependsOn": ["^build:dev"],
  "outputs": ["dist/**"]
},
"dev:debug": {
  "dependsOn": ["^build:dev"],
  "cache": false,
  "persistent": true
}
```

关键点：

- `dev:debug` 任务依赖 `^build:dev`，确保先构建 packages
- turbo 会自动处理依赖顺序，避免重复构建

### 3.2 T2: 更新 packages 脚本

@see /packages/\*/package.json

所有 packages 新增：

```json
"build:dev": "vite build --mode development"
```

### 3.3 T3: 更新根 package.json 和 apps

@see /package.json
@see /apps/\*/package.json

根 package.json 新增脚本：

```json
"dev:debug:report-ai": "pnpm app dev:debug report-ai",
"dev:debug:ai-chat": "pnpm app dev:debug ai-chat",
"dev:debug:company": "pnpm app dev:debug company"
```

apps 新增脚本（与 dev 相同）：

```json
"dev:debug": "vite"  // 或 "node scripts/start.js" (company)
```

### 3.4 T4: 更新 run-app.js

@see /scripts/run-app.js

支持 `dev:debug` 命令，调用 turbo 任务：

```javascript
case 'dev:debug':
  cmd = `turbo dev:debug --filter=${appName}`
  break
```

关键点：

- 不再手动编排构建顺序，交给 turbo 管理
- turbo 根据 `dependsOn: ["^build:dev"]` 自动先构建 packages
- 避免了 dev 任务的 `^build` 依赖覆盖 build:dev 产物

### 3.5 T5: 测试验证

测试场景：

- [ ] 执行 `pnpm dev:debug:report-ai`
- [ ] 检查 packages/gel-ui/dist 产物未压缩
- [ ] 检查 sourcemap 文件生成
- [ ] 在浏览器 DevTools 中调试 packages 代码
- [ ] 验证 app 正常启动和 HMR

### 3.6 T6: 更新文档

@see /docs/development.md

补充开发模式说明：

- dev 模式：快速开发，packages 使用 production 构建
- dev:debug 模式：调试 packages，使用 development 构建
- 完整模式：同时修改 packages 和 apps

## 4. 验收标准

### 4.1 功能验收

- [ ] `pnpm dev:debug:report-ai` 可正常启动
- [ ] packages 构建产物代码未压缩
- [ ] 变量名、函数名保持原始命名
- [ ] 生成 sourcemap 文件
- [ ] apps 可正常引用 packages
- [ ] 现有 dev 模式不受影响

### 4.2 性能验证

- [ ] packages 构建时间记录（development vs production）
- [ ] apps 启动时间无明显增加
- [ ] HMR 响应速度正常

### 4.3 调试验证

- [ ] Chrome DevTools 可正确映射源码
- [ ] 断点调试可定位到原始代码
- [ ] 错误堆栈显示真实文件路径

## 5. 回滚方案

如遇问题可快速回滚：

1. 删除 turbo.json 中的 build:dev 任务
2. 删除 packages 中的 build:dev 脚本
3. 删除根 package.json 中的 dev:debug 脚本
4. 恢复 scripts/run-app.js

## 6. 更新记录

| 日期       | 修改人 | 更新内容                   |
| ---------- | ------ | -------------------------- |
| 2025-11-20 | -      | 从核心方案拆分实施计划文档 |
| 2025-11-20 | -      | 细化 dev:debug 实施步骤    |
| 2025-11-20 | -      | 完成 T1-T4 实施            |

## 相关文档

- [需求分析 v1](/docs/specs/dev-build-optimization/spec-requirements-v1.md)
- [方案设计 v1](/docs/specs/dev-build-optimization/spec-design-v1.md)
