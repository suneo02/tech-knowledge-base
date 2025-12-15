# url - URL处理模块

## 🎯 一句话定位

提供**URL参数解析和状态管理**，支持报告页面间通过URL传递**大量配置数据**。

## 📁 目录结构

```
src/url/
├── hiddenStatus.ts            # 隐藏状态处理
├── misc.ts                    # URL辅助函数
├── urlParams.ts               # URL参数解析核心
└── index.ts                   # 统一导出
```

## 🚀 核心功能

| 函数 | 用途 | 特点 |
| :--- | :--- | :--- |
| **`urlParams`** | URL参数解析 | 支持复杂对象序列化/反序列化 |
| **`hiddenStatus`** | 隐藏状态管理 | 处理节点状态的URL编码 |
| **`compressParams`** | 参数压缩 | 解决URL长度限制问题 |

## 💡 使用示例

```typescript
import { urlParams, compressParams } from 'report-util/url';

// URL参数序列化
const config = {
  reportType: 'credit',
  filters: { industry: 'tech', region: 'beijing' },
  hiddenNodes: ['section1', 'section2']
};

const searchParams = urlParams.stringify(config);
// → "reportType=credit&filters=...&hiddenNodes=..."

// URL参数解析
const parsed = urlParams.parse(searchParams);
// → { reportType: 'credit', filters: {...}, hiddenNodes: [...] }

// 参数压缩（用于超长URL）
const compressed = compressParams(config);
// → 压缩后的字符串，可安全放在URL中
```

## 🎯 应用场景

### 报告页面跳转
- **配置传递**: 报告配置在页面间传递
- **状态保存**: 当前报告状态编码到URL
- **深度链接**: 支持分享特定配置的报告链接

### 参数压缩需求
- **浏览器限制**: 解决URL长度限制问题
- **大数据传递**: 传递复杂的树状结构数据
- **性能优化**: 减少URL体积，提升加载速度

## 🔧 技术实现

### 序列化策略
- **JSON序列化**: 使用标准JSON格式
- **Base64编码**: 安全传输特殊字符
- **URL编码**: 处理特殊字符转义

### 压缩算法
- **LZ压缩**: 使用 `lz-string` 进行高效压缩
- **解压验证**: 压缩失败时自动降级到普通模式
- **兼容性**: 保证前后端压缩解压一致性

## ⚠️ 注意事项

### URL长度限制
- **浏览器差异**: 不同浏览器URL长度限制不同
- **服务器限制**: Web服务器也可能有限制
- **安全边界**: 建议控制在2048字符以内

### 数据安全
- **敏感信息**: 避免在URL中传输敏感数据
- **编码安全**: 所有数据需要适当编码
- **XSS防护**: 确保参数不会被恶意利用

## 🧪 测试覆盖

模块包含完整的单元测试：
- [x] URL参数序列化/反序列化
- [x] 隐藏状态编码处理
- [x] 压缩/解压功能
- [x] 错误处理和边界情况

## 📖 相关文档

- [report-util 主文档](../README.md)
- [测试用例](../__test__/url/urlParams.test.ts)
- [URL编码规范](https://tools.ietf.org/html/rfc3986)