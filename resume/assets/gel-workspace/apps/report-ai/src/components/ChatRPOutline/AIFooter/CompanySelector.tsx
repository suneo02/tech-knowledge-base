import { Button } from '@wind/wind-ui';
import { ReportOutlineCorpCandidates } from 'gel-api';
import { FC, useMemo } from 'react';
import styles from './CompanySelector.module.less';

export interface CompanySelectorProps {
  candidates?: ReportOutlineCorpCandidates;
  onSelect?: (params: { entityCode: string; entityName: string }) => void;
  /** 是否禁用选择功能 */
  disabled?: boolean;
}

export const CompanySelector: FC<CompanySelectorProps> = ({ candidates, onSelect, disabled = false }) => {
  const options = useMemo(() => candidates || [], [candidates]);

  if (!options || options.length === 0) return null;

  return (
    <div className={styles.container}>
      {options.map((c) => {
        if (!c.companyCode || !c.companyName) return null;
        return (
          <span key={c.companyCode} className={styles.item}>
            <Button
              size="small"
              disabled={disabled}
              onClick={() => !disabled && onSelect?.({ entityCode: c.companyCode, entityName: c.companyName })}
            >
              {c.companyName}
            </Button>
          </span>
        );
      })}
    </div>
  );
};
