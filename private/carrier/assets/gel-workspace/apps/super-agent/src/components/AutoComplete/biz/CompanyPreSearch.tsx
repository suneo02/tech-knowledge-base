import { requestToWFC } from '@/api'
import { getFullAreaNameByCode } from '@/utils/area'
import { Tag, Tooltip } from '@wind/wind-ui'
import type { wfcCorpPreSearchPayload } from 'gel-api'
import { t } from 'gel-util/intl'
import type { CSSProperties, FC } from 'react'
import { useEffect, useState } from 'react'
import InteractiveAutoComplete from '../index'
import styles from '../index.module.less'

interface CompanyPreSearchProps {
  value?: string
  defaultValue?: string
  companyName?: string
  onChange?: (value?: string) => void
  onCompanySelect?: (data: { corpId: string; corpName: string }) => void
  placeholder?: string
  size?: 'large' | 'middle' | 'small'
  className?: string
  style?: CSSProperties
}

interface PreSearchItem {
  corpId: string
  corpName: string
  areaCode?: string | number
}

const PREFIX = 'auto-complete'

const getGlobalCompanyPreSearch = (data: wfcCorpPreSearchPayload) =>
  requestToWFC('search/company/getGlobalCompanyPreSearch', { queryText: data.queryText, version: 2 })

export const CompanyPreSearch: FC<CompanyPreSearchProps> = (props) => {
  const { onChange, onCompanySelect, placeholder, size = 'large', className, style, value, companyName } = props

  // 内部维护显示文本 (Company Name)
  const [displayValue, setDisplayValue] = useState('')

  // 监听外部 value 变化 (主要是清空操作)
  // 如果外部传入了 ID 但本地没有对应的 displayValue，由于无法根据 ID 反查 Name（除非调接口），
  // 这里暂时假设主要用于 Search 场景。如果 value 被置空，则清空显示。
  useEffect(() => {
    if (!value) {
      setDisplayValue('')
    } else if (companyName && displayValue !== companyName) {
      // 回显场景：如果有 ID (value) 且有 companyName，则同步显示名称
      setDisplayValue(companyName)
    }
  }, [value, companyName])

  const fetchOptions = async (query: string) => {
    const res = await getGlobalCompanyPreSearch({ queryText: query } as wfcCorpPreSearchPayload)
    const list = (res?.Data?.search || []) as PreSearchItem[]
    return list.map((item) => {
      const areaName = getFullAreaNameByCode(item.areaCode ? String(item.areaCode) : undefined)
      const isOverseas = !areaName

      const labelContent = (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className={styles[`${PREFIX}-text`]} dangerouslySetInnerHTML={{ __html: item.corpName }} />
          {/* @ts-expect-error wind-ui 类型定义有问题，这里忽略 */}
          <Tag style={{ marginRight: 0, marginLeft: 8 }} bordered={false}>
            {isOverseas ? t('9379', '境外') : areaName}
          </Tag>
        </div>
      )

      return {
        value: item.corpId, // 使用唯一ID作为value，避免同名问题
        disabled: isOverseas,
        label: isOverseas ? (
          <Tooltip title={t('482214', '暂不支持选择境外企业')} placement="bottomLeft">
            {/* 增加 pointerEvents: 'auto' 确保在 disabled 状态下（父级可能禁用了事件）仍能触发 Tooltip */}
            <div style={{ pointerEvents: 'auto' }}>{labelContent}</div>
          </Tooltip>
        ) : (
          labelContent
        ),
        corpId: item.corpId,
        title: item.corpName.replace(/<[^>]*>/g, ''),
      }
    })
  }

  return (
    <InteractiveAutoComplete
      value={displayValue}
      onChange={(text) => {
        setDisplayValue(text)
        // 如果清空了输入框，则清空外部的 ID
        if (!text) {
          onChange?.(undefined)
        }
      }}
      placeholder={placeholder}
      size={size}
      className={className}
      style={style}
      fetchOptions={fetchOptions}
      onSelect={(selectedValue, option) => {
        console.log('🚀 ~ CompanyPreSearch ~ option:', option)
        const corpId = String(option?.corpId || selectedValue || '')
        const corpName = String(option?.title || '')

        // 选中时，输入框显示名称，Form 记录 ID
        setDisplayValue(corpName)
        onChange?.(corpId)
        onCompanySelect?.({ corpId, corpName })
      }}
    />
  )
}

export default CompanyPreSearch
