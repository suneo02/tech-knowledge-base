# 国际化 (i18n) 使用指南

本项目实现了一个简单的国际化工具，支持中文和英文切换。

## 功能特性

- ✅ 支持中文 (zh-CN) 和英文 (en-US)
- ✅ 自动检测浏览器语言
- ✅ 本地存储语言偏好
- ✅ 参数化翻译
- ✅ 语言切换器组件
- ✅ TypeScript 类型支持

## 基本使用

### 1. 导入翻译函数

```typescript
import { t, setLocale, getLocale } from '../utils/intl'
```

### 2. 基本翻译

```typescript
// 简单翻译
const message = t('common.loading') // 输出：加载中... 或 Loading...

// 带参数的翻译
const validationMessage = t('validation.minLength', { min: 6 }) 
// 输出：最少需要 6 个字符 或 Minimum 6 characters required
```

### 3. 在 HTML 中使用

```html
<!-- 使用 data 属性 -->
<button data-intl-button="common.save">保存</button>
<span data-intl="home.welcome">欢迎</span>
<label data-intl-label="contact.form.name">姓名</label>

<!-- 在 JavaScript 中更新 -->
<script>
  // 更新所有带有 data-intl 属性的元素
  updatePageContent()
</script>
```

### 4. 语言切换

```typescript
// 切换到英文
setLocale('en-US')

// 切换到中文
setLocale('zh-CN')

// 获取当前语言
const currentLang = getLocale() // 返回 'zh-CN' 或 'en-US'
```

### 5. 全局函数调用

```javascript
// 在 HTML 中直接调用
<button onclick="switchLanguage('en-US')">English</button>
<button onclick="switchLanguage('zh-CN')">中文</button>

// 翻译函数
<span id="welcome"></span>
<script>
  document.getElementById('welcome').textContent = t('home.welcome')
</script>
```

## 添加新词条

### 1. 在 `src/utils/intl.ts` 中添加词条

```typescript
const messages: Record<Locale, IntlMessages> = {
  'zh-CN': {
    // 添加新的中文词条
    'new.feature.title': '新功能标题',
    'new.feature.description': '新功能描述',
  },
  'en-US': {
    // 添加对应的英文词条
    'new.feature.title': 'New Feature Title',
    'new.feature.description': 'New Feature Description',
  }
}
```

### 2. 使用新词条

```typescript
const title = t('new.feature.title')
const description = t('new.feature.description')
```

## 参数化翻译

支持在翻译文本中使用参数：

```typescript
// 词条定义
'user.welcome': '欢迎 {name}，您有 {count} 条消息'

// 使用
const message = t('user.welcome', { 
  name: '张三', 
  count: 5 
})
// 输出：欢迎 张三，您有 5 条消息
```

## 语言切换器

### 自动创建切换器

```typescript
import { createLanguageSwitcher } from '../utils/intl'

// 创建语言切换器
const switcher = createLanguageSwitcher()
document.querySelector('header').appendChild(switcher)
```

### 自定义切换器

```html
<select onchange="switchLanguage(this.value)">
  <option value="zh-CN">中文</option>
  <option value="en-US">English</option>
</select>
```

## 页面内容更新

### 自动更新

```typescript
import { updatePageContent } from '../utils/intlExample'

// 更新所有带有国际化属性的元素
updatePageContent()
```

### 手动更新特定元素

```typescript
// 更新特定元素
const element = document.querySelector('.welcome-text')
if (element) {
  element.textContent = t('home.welcome')
}
```

## 错误处理和通知

```typescript
import { showNotification } from '../utils/intlExample'

// 显示成功消息
showNotification(t('success.saved'), 'success')

// 显示错误消息
showNotification(t('error.network'), 'error')
```

## 表单验证

```typescript
// 验证函数示例
function validateField(value: string, minLength: number) {
  if (!value) {
    return t('validation.required')
  }
  
  if (value.length < minLength) {
    return t('validation.minLength', { min: minLength })
  }
  
  return ''
}
```

## 最佳实践

### 1. 词条命名规范

- 使用点分隔的层级结构
- 按功能模块分组
- 使用描述性的键名

```typescript
// 好的命名
'nav.home': '首页'
'page.title.contact': '联系我们'
'form.validation.email': '请输入有效的邮箱地址'

// 避免的命名
'home': '首页'
'contact_title': '联系我们'
'email_error': '邮箱错误'
```

### 2. 参数使用

- 使用大括号 `{}` 包围参数名
- 参数名使用驼峰命名
- 提供默认值处理

```typescript
// 词条定义
'user.profile': '{name} 的个人资料'

// 使用
t('user.profile', { name: '张三' })
```

### 3. 错误处理

```typescript
// 安全的翻译函数
function safeTranslate(key: string, params?: Record<string, string | number>) {
  try {
    return t(key, params)
  } catch (error) {
    console.warn(`Translation key not found: ${key}`)
    return key // 返回键名作为后备
  }
}
```

## 扩展功能

### 添加新语言

1. 在 `Locale` 类型中添加新语言代码
2. 在 `messages` 对象中添加对应语言的数据
3. 在 `getLocaleDisplayName` 函数中添加显示名称

```typescript
export type Locale = 'zh-CN' | 'en-US' | 'ja-JP' // 添加日语

const messages: Record<Locale, IntlMessages> = {
  'zh-CN': { /* 中文词条 */ },
  'en-US': { /* 英文词条 */ },
  'ja-JP': { /* 日语词条 */ }
}
```

### 异步加载词条

```typescript
// 异步加载词条
async function loadMessages(locale: Locale) {
  const response = await fetch(`/locales/${locale}.json`)
  const messages = await response.json()
  return messages
}
```

## 注意事项

1. **词条完整性**: 确保所有语言都有对应的词条
2. **参数一致性**: 确保所有语言的参数占位符一致
3. **性能考虑**: 大量词条时考虑按需加载
4. **测试覆盖**: 为翻译功能编写测试用例

## 故障排除

### 常见问题

1. **词条未找到**: 检查词条键名是否正确
2. **参数未替换**: 检查参数对象格式是否正确
3. **语言切换不生效**: 检查 `setLocale` 是否正确调用
4. **样式问题**: 确保 `intl.css` 已正确导入

### 调试技巧

```typescript
// 开启调试模式
const DEBUG = true

function t(key: string, params?: Record<string, string | number>) {
  const result = messages[currentLocale]?.[key] || key
  
  if (DEBUG && !messages[currentLocale]?.[key]) {
    console.warn(`Missing translation: ${key} for locale: ${currentLocale}`)
  }
  
  return result
}
```
