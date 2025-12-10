import { renderBussChangeInfoAsHtml } from 'report-util/table'
import './index.less'

export function renderBussChangeInfo(value: any, record: any) {
  try {
    const valueParsed = renderBussChangeInfoAsHtml(value, record)
    // 假设 data = "这是前半段文本<span class='highlight'>重点</span>后半段"
    // parseHTML 会生成一个包含三个节点的数组：[TextNode("这是前半段文本"), <span>…, TextNode("后半段")]
    const nodes = $.parseHTML(valueParsed, document, true)
    return $(nodes)
  } catch (e) {
    console.error('renderBussChangeInfo error:', e, value)
    return '--'
  }
}
