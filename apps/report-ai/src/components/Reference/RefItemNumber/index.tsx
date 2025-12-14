import { ReportReferenceOrdinalMap } from '@/domain/reportReference';
import { FC } from 'react';
import styles from './index.module.less';

export interface RefItemNumberProps {
  refId: string;
  ordinalMap?: ReportReferenceOrdinalMap;
}

export const RefItemNumber: FC<RefItemNumberProps> = ({ refId, ordinalMap }) => {
  const number = ordinalMap?.get(refId);
  if (number === undefined) return null;
  return <div className={styles['ref-item-number']}>{`${number}. `}</div>;
};
