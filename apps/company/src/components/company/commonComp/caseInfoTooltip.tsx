import { myWfcAjax } from '@/api/common.ts'
import { InfoCircleButton } from '@/components/icons/InfoCircle'
import { useAsync } from '@/utils/api'
import { Spin, Tooltip } from '@wind/wind-ui'
import React, { FC, useMemo, useRef } from 'react'

export const apiGetRiskCaseInfo = (caseId: string) =>
  myWfcAjax<{
    code: string
    interpretation: string
  }>(`detail/risk/getCaseReasonInfo/${caseId}`)

export const useGetRiskCaseInfo = () => {
  const [apiExecute, data, loading] = useAsync(apiGetRiskCaseInfo)
  return { apiExecute, data, loading }
}
export const CorpCaseInfoTooltip: FC<{ caseId: string; defaultValue?: string }> = ({ caseId, defaultValue }) => {
  const { apiExecute, data, loading } = useGetRiskCaseInfo()

  const hasFetched = useRef(false)
  const info = useMemo(() => {
    try {
      if (loading) {
        return <Spin tip="loading" size={'small'} />
      }
      if (!hasFetched.current || !data.Data.interpretation) {
        return defaultValue
      }
      return data.Data.interpretation
    } catch (e) {
      console.error(e)
      return null
    }
  }, [data, loading, defaultValue])

  return (
    <div
      className={'display-inline-block'}
      onMouseEnter={() => {
        if (!hasFetched.current) {
          apiExecute(caseId)
          hasFetched.current = true
        }
      }}
      data-uc-id="LTjkykQFK2U"
      data-uc-ct="div"
    >
      <Tooltip overlayClassName="corp-tooltip" title={info}>
        <InfoCircleButton />
      </Tooltip>
    </div>
  )
}
