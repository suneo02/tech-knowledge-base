import { ReactNode } from 'react'
import { DeepThinkO } from '@wind/icons'
import styles from './index.module.less'
import Section from '../Section'
import { t } from 'gel-util/intl'

interface ResearchStepsProps {
  steps: string[]
}

const PREFIX = 'research-steps'
const STRINGS = {
  TITLE: t('464191', '研究步骤')
}

export const ResearchSteps = ({ steps }: ResearchStepsProps): ReactNode => {
  if (!steps || steps.length === 0) {
    return null
  }

  return (
    <Section
      title={
        <>
          {/* @ts-expect-error wind-icon */}
          <DeepThinkO style={{ marginInlineEnd: 4 }} />
          {STRINGS.TITLE}
        </>
      }
      defaultExpanded
    >
      <div className={styles[`${PREFIX}-content-item`]}>
        {steps.map((step, index) => (
          <div className={styles[`${PREFIX}-content-item-text`]} key={index}>
            {step}
          </div>
        ))}
      </div>
    </Section>
  )
}
