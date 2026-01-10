import { ProvidedByAI } from '@/biz/common'
import { useRequest } from 'ahooks'
import {
  DEFAULT_DISPLAY_MODE,
  NameDisplayResult,
  deriveCorpNameInputFromRecord,
  formatEnterpriseNameMainFromRecordWithAI,
} from 'gel-util/misc'
import { CompanyNameBaseProps } from './type'

export const CompanyNameMain: React.FC<CompanyNameBaseProps> = ({
  record,
  field,
  mode = DEFAULT_DISPLAY_MODE,
  aiTranslate,
  className,
}) => {
  const { data, loading } = useRequest<NameDisplayResult, []>(
    () => formatEnterpriseNameMainFromRecordWithAI(record, field, { mode }, aiTranslate),
    { refreshDeps: [record, field, mode, aiTranslate] }
  )

  const original = deriveCorpNameInputFromRecord(record, field)?.name ?? ''

  if (loading || !data) {
    return (
      <div className={className}>
        <div className="company-name-main-text">{original}</div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="company-name-main-text">{data.primaryText}</div>
      {data.secondaryText ? (
        <div className="company-name-main-text">
          {data.secondaryText} <ProvidedByAI visible={data.showAiBadge} />
        </div>
      ) : null}
    </div>
  )
}
