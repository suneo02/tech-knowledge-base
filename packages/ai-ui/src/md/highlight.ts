import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'

interface HighlightOptions {
  showLanguage?: boolean
  showCopyButton?: boolean
}

/**
 * 代码高亮处理
 * @param code 要高亮的代码
 * @param language 代码语言
 * @param options 配置选项
 */
export const highlightCode = (code: string, language: string, options: HighlightOptions = {}) => {
  const { showLanguage = true, showCopyButton = true } = options

  let highlighted: string
  if (language && hljs.getLanguage(language)) {
    try {
      highlighted = hljs.highlight(code, { language }).value
    } catch {
      highlighted = hljs.highlightAuto(code).value
    }
  } else {
    highlighted = hljs.highlightAuto(code).value
  }

  const header: string[] = []
  if (showLanguage) {
    header.push('<small>' + (language || 'text') + '</small>')
  }
  if (showCopyButton) {
    header.push('<button class="copy" data-code="' + encodeURIComponent(code) + '">复制</button>')
  }

  const headerHtml = header.length ? '<div class="xcontainer-header">' + header.join('') + '</div>' : ''

  return (
    '<pre class="hljs xcontainer" data-lang="' +
    (language || 'text') +
    '">' +
    headerHtml +
    '<code>' +
    highlighted +
    '</code></pre>'
  )
}
