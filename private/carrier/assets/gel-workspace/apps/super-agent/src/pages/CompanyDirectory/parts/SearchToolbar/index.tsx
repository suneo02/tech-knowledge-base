import { FolderO } from '@wind/icons'
import { Button } from '@wind/wind-ui'
import React from 'react'
import styles from './index.module.less'
import { t } from 'gel-util/intl'
import { SkeletonTitle } from '@/components/SkeletonTitle'

export interface SearchToolbarProps {
  value: string
  onChange: (val: string) => void
  onSearch?: (val: string) => void
  filteredCount?: number
  totalCount?: number
  onExpandAll?: () => void
  onAddColumn?: () => void
  onAIGenerateColumn?: () => void
  expandButtonText?: string
  totalCandidateCount?: number
  loading?: boolean
}

export const SearchToolbar: React.FC<SearchToolbarProps> = ({
  onExpandAll,
  expandButtonText,
  totalCount,
  totalCandidateCount,
  loading,
}) => {
  return (
    <div className={styles.toolbar}>
      <div className={styles.left}>
        <SkeletonTitle loading={loading}>
          {typeof totalCount === 'number' && (
            <div className={styles.stat}>
              {typeof totalCandidateCount === 'number' && totalCandidateCount > totalCount ? (
                <span>
                  {t('482535', '本次共挖掘{{count}}家企业，仅展示前{{num}}家', {
                    count: <strong>{totalCandidateCount}</strong>,
                    num: <strong>{totalCount}</strong>,
                  })}
                </span>
              ) : (
                <span>
                  {t('482225', '本次共挖掘{{count}}家企业，已全部展示', {
                    count: <strong>{totalCandidateCount ?? totalCount}</strong>,
                  })}
                </span>
              )}
            </div>
          )}
        </SkeletonTitle>
      </div>
      <div className={styles.right}>
        <Button type="text" icon={<FolderO />} onClick={onExpandAll}>
          {expandButtonText ?? t('464227', '全部展开')}
        </Button>
      </div>
    </div>
  )
}
