import React from 'react'
import { t } from 'gel-util/intl'
import Result from '@/components/Result'

const ChartEmpty = () => (
  <Result
    status={'no-data'}
    title={t('421499', '暂无数据')}
    style={{ textAlign: 'center', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
    data-uc-id="kS4SUolcdk"
    data-uc-ct="result"
  />
)

export default ChartEmpty
