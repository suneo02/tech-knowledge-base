import { Select } from 'antd'
import { i18n } from 'gel-util/intl'

const { Option } = Select

export const LanguageSwitcher = () => {
  const handleChange = (value: string) => {
    i18n.changeLanguage(value)
  }

  return (
    <Select value={i18n.language} style={{ width: 120 }} onChange={handleChange}>
      <Option value="zh-CN">中文</Option>
      <Option value="en-US">English</Option>
    </Select>
  )
}
