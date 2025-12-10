/**
 * HTML解析器 - 静态函数实现
 *
 * 使用原生 DOM API 进行HTML解析，适合前端环境
 */

export interface ParseOptions {
  /** 是否开启调试模式 */
  debug?: boolean;
}

export interface ParseResult {
  /** 解析后的 Document 对象 */
  document: Document;
  /** 解析警告信息 */
  warnings: string[];
  /** 解析是否成功 */
  success: boolean;
  /** 错误信息 */
  error?: string;
}

/**
 * 解析HTML字符串为Document对象
 *
 * @param html - HTML字符串
 * @param options - 解析选项
 * @returns 解析结果
 *
 * @example
 * ```typescript
 * const result = parseHtml('<div data-section-id="1">content</div>')
 * if (result.success) {
 *   const sections = result.document.querySelectorAll('[data-section-id]')
 *   console.log(sections.length) // 1
 * }
 * ```
 */
export const parseHtml = (html: string, options: ParseOptions = {}): ParseResult => {
  const { debug = false } = options;
  const warnings: string[] = [];

  try {
    // 输入验证
    if (!html || typeof html !== 'string') {
      return {
        document: new Document(),
        warnings,
        success: false,
        error: 'Invalid HTML input: must be a non-empty string',
      };
    }

    // 大文件警告
    if (html.length > 10 * 1024 * 1024) {
      warnings.push('HTML content exceeds 10MB, may impact performance');
    }

    // 使用 DOMParser 解析HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // 检查解析错误
    const parseErrors = doc.querySelectorAll('parsererror');
    if (parseErrors.length > 0) {
      warnings.push(`HTML parsing warnings: ${parseErrors.length} errors detected`);
    }

    // 检查解析后的内容
    if (!doc.body && html.includes('<body')) {
      warnings.push('HTML body tag detected but not properly parsed');
    }

    if (debug) {
      console.log(`HTML parsed successfully: ${doc.documentElement.outerHTML.length} characters`);
    }

    return {
      document: doc,
      warnings,
      success: true,
    };
  } catch (error) {
    const errorMessage = `HTML parsing failed: ${error instanceof Error ? error.message : String(error)}`;
    console.error(errorMessage, error);

    return {
      document: new Document(),
      warnings,
      success: false,
      error: errorMessage,
    };
  }
};
