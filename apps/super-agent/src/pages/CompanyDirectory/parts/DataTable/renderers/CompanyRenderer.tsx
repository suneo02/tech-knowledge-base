import type { CellRenderer } from '@/components/CellRegistry'
import { CompanyCell } from '../handleCell/CompanyCell'

export const CompanyRenderer: CellRenderer = ({ value, record, column }) => {
  const name = String(value || '')
  let code = ''

  // 优先尝试从 meta 数据中获取 entityId
  if (column?.dataIndex) {
    const metaKey = `${column.dataIndex}&`
    const metaData = record?.[metaKey] as { entityId?: string | number } | undefined
    if (metaData && typeof metaData === 'object' && metaData.entityId) {
      code = String(metaData.entityId)
    }
  }

  // 兜底逻辑：尝试从常见字段获取
  if (!code) {
    code = String(record?.companyCode || record?.company_code || record?.companyId || record?.code || record?.id || '')
  }

  return <CompanyCell name={name} code={code} />
}
