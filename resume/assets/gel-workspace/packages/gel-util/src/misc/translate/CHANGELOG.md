# 翻译模块更新日志

## [简化] 移除 throwOnError 配置 - 2024-10-13

### 变更说明

移除了 `throwOnError` 配置项，统一采用不抛出异常的错误处理方式。

### 变更原因

1. **简化 API**：减少配置项，降低使用复杂度
2. **统一行为**：所有错误统一通过返回值的 `success` 和 `error` 字段传递
3. **更安全**：避免未捕获的异常导致程序中断
4. **降低代码复杂度**：移除多处条件判断，减少约 20 行代码

### 受影响的文件

- `core.ts` - 移除 `throwOnError` 参数和相关逻辑
- `apiAdapter.ts` - 移除默认值设置
- `fieldFilter.ts` - 移除错误抛出逻辑
- `README.md` - 更新文档，强调不抛异常的设计
- `__tests__/concurrent-dedup.test.ts` - 移除测试中的 throwOnError

### 迁移指南

如果你的代码之前使用了 `throwOnError: true`：

```typescript
// 旧代码（使用 try-catch）
try {
  const result = await translateDataWithApi(data, api, {
    targetLocale: 'en-US',
    throwOnError: true,  // ❌ 已移除
  })
  handleSuccess(result.data)
} catch (error) {
  handleError(error)
}

// 新代码（检查 success 字段）
const result = await translateDataWithApi(data, api, {
  targetLocale: 'en-US',
})

if (result.success) {
  handleSuccess(result.data)
} else { 
  handleError(result.error)
}
```

### 优势

1. **API 更简洁**：少一个配置项需要理解
2. **代码更统一**：所有调用方式一致，降低心智负担
3. **更容易维护**：错误处理逻辑集中，代码量减少
4. **不会遗漏错误**：不需要 try-catch，通过类型系统强制检查 success 字段

---

## [优化] 并发请求去重 - 2024-10-13

### 问题描述

在高并发场景下，当多个翻译请求同时触发且字段相同时，存在重复 API 调用的问题：

- **场景**：请求 A 开始翻译某些字段，请求 B 随后到达需要翻译相同的字段
- **问题**：因为 A 还未完成，缓存未更新，导致 B 也会发起相同的翻译请求
- **影响**：造成不必要的 API 调用浪费和性能开销

### 解决方案

新增**进行中请求管理器**（Pending Translation Manager），追踪正在进行的翻译请求：

1. **查询进行中请求**：在缓存未命中后，检查是否有相同的文本正在翻译中
2. **复用 Promise**：如果发现相同请求正在进行，直接等待已有的 Promise
3. **自动清理**：请求完成后自动从管理器中移除，避免内存泄漏
4. **错误处理**：正确处理进行中请求失败的情况

### 技术实现

#### 新增文件修改

**`cache.ts`**
- 新增 `PendingTranslationManager` 类
- 新增全局实例 `pendingTranslationManager`
- 提供批量查询和设置进行中请求的方法

**`core.ts`**
- 在翻译流程中集成进行中请求检查
- 优化翻译流程：缓存查询 → 进行中请求查询 → 发起新请求
- 正确处理进行中请求失败的情况

**`README.md`**
- 新增"并发请求去重"章节
- 提供详细的流程图和使用说明
- 更新缓存特性说明

### 优化效果

| 场景 | 优化前 | 优化后 | 效果 |
|-----|-------|-------|------|
| 2 个并发请求翻译相同文本 | 2 次 API 调用 | 1 次 API 调用 | 减少 50% |
| 10 个并发请求翻译相同字段 | 10 次 API 调用 | 1 次 API 调用 | 减少 90% |
| 高频页面快速切换 | 每次都调用 API | 复用进行中的请求 | 显著降低延迟 |

### 测试覆盖

新增测试文件 `__tests__/concurrent-dedup.test.ts`，包含以下测试用例：

1. ✅ 应该避免并发重复请求
2. ✅ 应该在请求完成后自动清理进行中的记录
3. ✅ 应该正确处理部分缓存命中的情况
4. ✅ 应该处理多个并发请求的混合场景
5. ✅ 应该正确处理 API 失败的情况

### 向后兼容性

- ✅ **完全兼容**：该功能自动启用，无需修改任何现有代码
- ✅ **无配置变更**：不引入新的配置项
- ✅ **行为一致**：翻译结果和错误处理逻辑保持不变

### 使用示例

该功能**自动启用**，开发者无需做任何修改：

```typescript
import { translateDataWithApi } from 'gel-util/misc/translate'

// 同时发起两个相同的翻译请求
const [result1, result2] = await Promise.all([
  translateDataWithApi(data1, apiService, { targetLocale: 'en-US' }),
  translateDataWithApi(data2, apiService, { targetLocale: 'en-US' }),
])

// ✅ 自动去重：如果 data1 和 data2 包含相同的文本，只会发起一次 API 请求
// ✅ 结果正确：两个请求都会得到正确的翻译结果
```

### 性能影响

- **内存开销**：极小，仅在请求进行时临时存储 Promise 引用
- **CPU 开销**：可忽略，仅增加 Map 查询操作
- **网络优化**：显著减少重复的 API 调用

### 后续优化建议

1. 考虑添加进行中请求的超时机制，防止异常情况下的长时间等待
2. 可以添加监控指标，统计去重命中率
3. 考虑支持自定义的请求合并策略

---

## 相关文档

- [翻译模块 README](./README.md)
- [翻译模块 REVIEW](./REVIEW.md)

