import { InnerHtml } from 'gel-ui'

/**
 * 引用外部HTML，必须使用此方法
 * @author Calvin <yxlu.calvin@wind.com.cn>
 * @type {string} html
 * @example
 *  <InnerHtml html={'<html>...</html>'} />
 * @description
 * @update bcheng<bcheng@wind.com.cn> - 使用 gel-ui 中的 InnerHtml 组件，确保项目内实现一致性, 使用 DOMPurify 替代 sanitizeHtml，减少75%的bundle大小
 * 底层实现统一使用 gel-ui 中的 InnerHtml 组件，确保项目内实现一致性
 */
export default InnerHtml
