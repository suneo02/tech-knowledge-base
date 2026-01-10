import type { CellRenderer } from '@/components/CellRegistry'

export const PhoneRenderer: CellRenderer = ({ value, mode }) => {
  const str = String(value || '')
  if (!str) return '-'
  const phones = str.split(',').filter(Boolean)

  if (mode === 'expanded') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {phones.map((phone, idx) => (
          <a
            key={idx}
            href={`tel:${phone}`}
            style={{ color: 'inherit', textDecoration: 'none' }}
            onClick={(e) => e.stopPropagation()}
          >
            {phone}
          </a>
        ))}
      </div>
    )
  }

  const maxDisplay = 3
  const displayPhones = phones.slice(0, maxDisplay)
  const remainingCount = phones.length - maxDisplay

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {displayPhones.map((phone, idx) => (
        <div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
          <span>{phone}</span>
          {idx === maxDisplay - 1 && remainingCount > 0 && (
            <span
              style={{
                marginLeft: 4,
                backgroundColor: 'var(--bg-3)',
                padding: '0 4px',
                borderRadius: 2,
                fontSize: 12,
                color: 'var(--text-3)',
              }}
            >
              +{remainingCount}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
