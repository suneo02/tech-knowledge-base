import classNames from 'classnames'
import React from 'react'
import { AgreementSection as AgreementSectionType } from '../types'
import styles from './styles.module.less'

interface Props {
  section: AgreementSectionType
}

export const AgreementSection: React.FC<Props> = ({ section }) => {
  return (
    <div className={styles.section}>
      <h3 className={classNames({ [styles.bold]: section.bold, [styles.underline]: section.underline }, styles.title)}>
        {section.title}
      </h3>
      <div className={styles.content}>
        {section.content.map((item) => (
          <div key={item.id} className={styles.item}>
            <p className={styles.itemMain}>
              <span
                className={classNames({
                  [styles.bold]: item.bold,
                  [styles.underline]: item.underline,
                })}
              >
                {`${item.id}  `}
                {item.text}
              </span>
            </p>
            {item.list && (
              <ul>
                {item.list.map((listItem, index) => (
                  <li key={listItem.text}>{`${index + 1}). ${listItem.text}`}</li>
                ))}
              </ul>
            )}
            {item.textAfterList && <p className={styles.textAfterList}>{item.textAfterList}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
