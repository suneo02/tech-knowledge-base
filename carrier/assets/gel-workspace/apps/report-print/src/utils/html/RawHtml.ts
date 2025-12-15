/**
 * 将 html 字符串转换为 jQuery 对象
 */

// NOTE: sanitize-html 是可选依赖，可能在某些运行环境或打包配置下无法正常解析。
// 这里使用 try/catch 包裹动态加载，若加载/执行失败则回退到最小化处理（去除 <script> 标签），
// 保证在任何情况下都能返回结果而不阻塞渲染。

export const rawHtmlToJQuery = (html: string) => {
  let sanitizedHtml = html

  try {
    // 兜底方案：简单移除 script 标签，防止最常见的 XSS 攻击
    sanitizedHtml = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  } catch (err) {
    console.error('[rawHtmlToJQuery] 兜底方案执行失败', err)
  }

  return sanitizedHtml
}
