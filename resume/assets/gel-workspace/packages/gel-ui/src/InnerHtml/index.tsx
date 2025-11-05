import sanitizeHtml from 'sanitize-html'

/**
 * 引用外部HTML，必须使用此方法
 * @author Calvin <yxlu.calvin@wind.com.cn>
 * @type {string} html
 * @example
 *  <InnerHtml html={'<html>...</html>'} />
 */
export const InnerHtml = ({ html, ...rest }: { html: string; [key: string]: any }) => {
  const sanitizeOptions = {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['p']),
    allowedAttributes: {},
    transformTags: {
      a: () => ({ tagName: 'p' }),
    },
  }
  const sanitizedHtml = sanitizeHtml(html, sanitizeOptions)
  return <span {...rest} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
}
