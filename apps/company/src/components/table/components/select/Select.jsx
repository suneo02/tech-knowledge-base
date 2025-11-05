/**
 * 下拉选择框
 * @format
 * */

import { DownloadO } from '@wind/icons'
import { Button } from '@wind/wind-ui'
import { useEffect } from 'react'
import { intlNoIndex } from '../../../../utils/intl'
import { downLoadCorpExcel } from '../../../../handle/corp/download'

const Select = (props) => {
  useEffect(() => {}, [])

  return (
    <Button
      onClick={() => {
        downLoadCorpExcel(downDocType, title, companyName)
      }}
      icon={<DownloadO />}
    >
      {intlNoIndex('4698', '导出数据')}
    </Button>
  )
}

export default Download
