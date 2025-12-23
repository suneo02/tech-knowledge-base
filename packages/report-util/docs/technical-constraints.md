# 技术约束与实现说明

## 🚨 wkhtmltopdf 兼容性要求

**关键约束**: 此包是 `report-print` 的核心依赖，所有代码在 `wkhtmltopdf` 的ES5 JavaScript 引擎中执行。

### 语法限制
- ❌ **ES6+语法**: 禁用 `let`, `const`, `() => {}`, `...spread` 等
- ❌ **现代API**: 禁用 `Promise`, `Array.prototype.includes`, `Object.values`
- ✅ **ES5兼容**: 必须使用原生ES5语法，自包含实现

### 环境约束
- ❌ **无Polyfill**: `wkhtmltopdf` 环境无 `core-js` 或类似库
- ❌ **无Node.js API**: 不可使用 `fs`, `path` 等Node.js特有API
- ✅ **原生依赖**: 仅依赖浏览器原生支持的JavaScript特性

## 🔧 开发规范

### 代码编写要求
```javascript
// ❌ 错误 - ES6语法
const format = (value) => value.toFixed(2);

// ✅ 正确 - ES5语法
function format(value) {
  return value.toFixed(2);
}
```

### 数组操作限制
```javascript
// ❌ 错误 - 现代API
array.includes(item);
Object.values(obj);

// ✅ 正确 - ES5实现
array.indexOf(item) !== -1;
Object.keys(obj).map(key => obj[key]);
```

## 🎯 性能要求

### 渲染性能
- **PDF生成时间**: 控制在合理范围内，避免长时间阻塞
- **内存使用**: 避免大对象深度拷贝，及时释放引用
- **循环优化**: 避免嵌套循环，使用高效的遍历算法

### 压缩效率
- **URL参数压缩**: 压缩率需达到50%以上
- **数据传输**: 减少页面间传递的数据体积
- **编解码速度**: 压缩/解压操作应在100ms内完成

## 🛡️ 安全要求

### XSS防护
- **强制过滤**: 所有用户输入HTML必须通过 `replaceScript` 处理
- **移除标签**: script, iframe, form, object, embed 等危险标签
- **属性过滤**: 移除 onclick, onerror, onfocus 等事件属性

### 输入验证
```javascript
// 安全处理示例
export const replaceScript = (str) => {
  if (!str) return str;

  return str
    .replace(/\<script>/gi, '')
    .replace(/\<\/script>/gi, '')
    .replace(/onclick|onerror/gi, '');
};
```

## 📦 依赖管理

### 运行时依赖最小化
- **严格控制**: 仅保留必要的运行时依赖
- **核心依赖**: `lz-string` 用于URL参数压缩
- **类型依赖**: `gel-types` 为peer依赖，不参与运行时

### 构建配置
```json
{
  "dependencies": {
    "lz-string": "^1.5.0"
  },
  "peerDependencies": {
    "gel-types": "workspace:*"
  }
}
```

## 🔄 错误处理策略

### 格式化模块
- **容错设计**: 无效数值返回 `'--'`，不抛出异常
- **类型检查**: 严格输入类型验证
- **默认值**: 提供合理的默认配置

### 树操作模块
- **类型安全**: 节点类型不匹配时抛出 `TypeError`
- **边界处理**: 处理空数组、undefined等边界情况
- **性能保证**: 避免深度递归导致的栈溢出

### URL处理模块
- **降级策略**: 压缩失败时自动降级到普通模式
- **编码安全**: 确保特殊字符正确处理
- **长度控制**: 监控URL长度，避免超出限制

## 🧪 测试要求

### 覆盖范围
- ✅ **单元测试**: 每个导出函数必须有测试用例
- ✅ **边界测试**: 覆盖空值、异常输入等边界情况
- ✅ **集成测试**: 验证模块间协作正确性

### ES5兼容性测试
- ✅ **语法检查**: 使用ESLint检查ES5语法合规性
- ✅ **功能测试**: 在ES5环境中验证功能正确性
- ✅ **回归测试**: wkhtmltopdf实际生成PDF验证

## 📊 关键决策与权衡

### 设计权衡
| 决策项 | 选项A | 选项B | 选择 | 理由 |
| :--- | :--- | :--- | :--- | :--- |
| **入口设计** | 单一入口 | 多入口点 | 多入口点 | 支持按需导入，减少体积 |
| **语法兼容** | 现代语法 | ES5兼容 | ES5兼容 | 确保wkhtmltopdf兼容 |
| **参数传递** | 直接URL | 压缩后URL | 压缩 | 解决URL长度限制 |

### 技术债务
- **代码重复**: ES5兼容导致的代码重复需要重构时注意
- **测试复杂度**: 需要同时维护现代浏览器和ES5环境的测试
- **维护成本**: 严格兼容性要求增加开发复杂度

---

*此文档详细说明技术约束，开发时需严格遵守。*