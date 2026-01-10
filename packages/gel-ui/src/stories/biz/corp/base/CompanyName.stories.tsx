import { CompanyNameMain } from '@/biz'
import { Meta, StoryObj } from '@storybook/react'
import { SupportedLocale } from 'gel-util/intl'
import { DEFAULT_DISPLAY_MODE } from 'gel-util/misc'

const meta: Meta = {
  title: 'Biz/Corp/CompanyName',
}

export default meta

const mockAiTranslate = async (text: string, locale: SupportedLocale) => {
  await new Promise((r) => setTimeout(r, 300))
  return `${text} (AI:${locale})`
}

// ===== Main (主要位置) =====
export const Main_OriginalOnly: StoryObj = {
  render: () => (
    <CompanyNameMain record={{ name: '中国平安保险（集团）股份有限公司' }} field="name" mode={DEFAULT_DISPLAY_MODE} />
  ),
}

export const Main_WithTranslated: StoryObj = {
  render: () => (
    <CompanyNameMain
      record={{ name: 'Apple Inc.', nameTrans: '苹果公司', nameAITransFlag: false }}
      field="name"
      mode="only-data"
    />
  ),
}

export const Main_WithAI: StoryObj = {
  render: () => (
    <CompanyNameMain
      record={{ name: 'Apple Inc.' }}
      field="name"
      mode="only-data"
      aiTranslate={mockAiTranslate}
    />
  ),
}
