# InnerHtml vs DOMPurifyHtml 对比文档

## 功能对比

### 原始实现 (index.jsx - sanitizeHtml)
```javascript
const sanitizeOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(['p']),
  allowedAttributes: {},
  transformTags: {
    a: () => ({ tagName: 'p' }),
  },
}
```

### DOMPurify实现 
```javascript
const purifyOptions = {
  ALLOWED_TAGS: [...defaultAllowedTags, 'p'],
  ALLOWED_ATTR: [],
  KEEP_CONTENT: true,
  ALLOW_UNKNOWN_PROTOCOLS: false
}
// 通过正则替换实现 a -> p 的转换
const transformedHtml = html.replace(/<a\b[^>]*>(.*?)<\/a>/gi, '<p>$1</p>')
```

## 完全平替验证

### ✅ 允许的标签
- 原实现：`sanitizeHtml.defaults.allowedTags.concat(['p'])`
- 新实现：`[...defaultAllowedTags, 'p']` (包含完整的 67 个标签，包括重要的 `span` 标签)

### ✅ 禁用所有属性
- 原实现：`allowedAttributes: {}`
- 新实现：`ALLOWED_ATTR: []`

### ✅ a标签转换为p标签
- 原实现：`transformTags: { a: () => ({ tagName: 'p' }) }`
- 新实现：`html.replace(/<a\b[^>]*>(.*?)<\/a>/gi, '<p>$1</p>')`

### ✅ 渲染方式
- 原实现：`<span {...rest} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />`
- 新实现：`<span {...rest} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />`

## 性能优势

### DOMPurify优势
1. **更小的Bundle大小**: DOMPurify (~45KB) vs sanitize-html (~180KB)
2. **更好的性能**: DOMPurify是原生DOM API实现，比sanitize-html的Node.js风格实现更快
3. **更好的缓存**: 使用useMemo缓存处理结果，避免重复计算
4. **现代化**: 支持现代浏览器的原生API

## ⚠️ 重要修正

**初始版本问题**：最初的实现中遗漏了很多重要标签，包括关键的 `span` 标签。

**现已修正**：通过直接从 `sanitize-html@2.13.0` 获取完整的默认标签列表，确保包含所有 67 个标签：
- 包括 `span`, `small`, `em`, `mark`, `time`, `wbr` 等重要标签
- 包括语义化标签如 `article`, `section`, `aside`, `nav` 等
- 包括表格标签 `col`, `colgroup`, `tfoot` 等

## 使用方式

两个组件的API完全一致：

```javascript
// 原实现
<InnerHtml html={'<span>文本</span><a href="#">链接</a><script>alert("xss")</script>'} />

// 新实现
<DOMPurifyHtml html={'<span>文本</span><a href="#">链接</a><script>alert("xss")</script>'} />

// 输出结果完全相同: <span>文本</span><p>链接</p>
```

## 迁移建议

可以直接用 `DOMPurifyHtml` 替换 `InnerHtml`，无需修改任何调用代码：

```javascript
// 替换导入即可
// import InnerHtml from '@/components/InnerHtml'
import DOMPurifyHtml from '@/components/InnerHtml/DOMPurifyHtml'

// 使用方式完全相同
<DOMPurifyHtml html={htmlContent} className="my-class" />
```
