import { renderBussChangeInfoAsHtml } from 'report-util/table'
import './index.less'

export function renderBussChangeInfo(value: any, record: any) {
  const valueParsed = renderBussChangeInfoAsHtml(value, record)
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: valueParsed,
      }}
    ></span>
  )
}
