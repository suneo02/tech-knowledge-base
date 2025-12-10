import Markdown from '@/components/markdown'
import { t } from 'gel-util/intl'
import Section from '../Section'
import styles from './index.module.less'

interface PromptSectionProps {
  content?: string
  defaultExpanded?: boolean
}

const STRINGS = {
  TITLE: t('464143', '提示词'),
  NO_DATA_SOURCE: t('464150', '无数据来源'),
}

const PREFIX = 'prompt-section'

const PromptSection = ({ content, defaultExpanded = true }: PromptSectionProps) => {
  return (
    <Section title={STRINGS.TITLE} defaultExpanded={defaultExpanded}>
      <Markdown content={content || STRINGS.NO_DATA_SOURCE} className={styles[`${PREFIX}-markdown`]} />
    </Section>
  )
}

export default PromptSection
