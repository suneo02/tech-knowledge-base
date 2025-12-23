import React, { useEffect, useImperativeHandle, useState } from 'react'
import { Modal, Spin } from '@wind/wind-ui'
import Table, { ColumnProps } from '@wind/wind-ui-table'
import { useRequest } from 'ahooks'
import { IndustryRowDisplay } from './components/IndustryRowDisplay'
import styles from './index.module.less'
import { IndustryColumnRenderProps, IndustryRow } from './type'
import { createRequest } from '@/api/request'
import { useTranslateService } from '@/hook'
import intl from '@/utils/intl'

const PREFIX = 'modal-industry'

const STRINGS = {
  DESCRIBE: intl('449754', '置信度等级'),
  HIGH: intl('449775', '1：基于官方文件直接分类，具有高关联性'),
  MEDIUM: intl('449723', '2：结合企业主营特征等公开数据分类，具有较高关联性'),
  LOW: intl('449774', '3：结合企业主营特征等公开数据分类，具有较低关联性'),
}

export interface ModalIndustryHandle {
  openModal: (industryInfo: IndustryColumnRenderProps) => void
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
const ModalIndustry: React.ForwardRefRenderFunction<ModalIndustryHandle, any> = (
  { title }, // props 参数，即使未使用也应声明
  ref
) => {
  const [visible, setVisible] = useState(false)
  const [modalDataSource, setModalDataSource] = useState<IndustryRow[]>([])
  const [dataIntl] = useTranslateService(modalDataSource, true, true)

  const fetchCorpIndustry = async (industryInfo: IndustryColumnRenderProps) => {
    if (!industryInfo) {
      return []
    }
    const api = createRequest()
    const { Data } = await api('detail/company/getcorpindustry', { params: { type: industryInfo.key } })
    if (Data?.length > 0) {
      // NOTE: This will not work as expected, setTimeout does not return a promise

      return Data[0].list

      // It should be:
      // return new Promise(resolve => setTimeout(() => resolve(Data[0].list), 10000))
    }
    return []
  }

  const { loading, run } = useRequest(fetchCorpIndustry, {
    manual: true,
    onSuccess: (result) => {
      setModalDataSource(result || []) // handle undefined result
    },
  })

  useImperativeHandle(ref, () => ({
    openModal: (industryInfo: IndustryColumnRenderProps) => {
      setVisible(true)
      run(industryInfo)
    },
  }))

  const modalColumns: ColumnProps<IndustryRow>[] = [
    {
      title: '详细信息',
      dataIndex: 'content',
      render: (_text: any, record: IndustryRow, index: number) => (
        <IndustryRowDisplay rowData={record} baseKey={`modal-${index}`} />
      ),
    },
  ]

  useEffect(() => {
    // only update if dataIntl is not the same as modalDataSource
    if (JSON.stringify(dataIntl) !== JSON.stringify(modalDataSource)) {
      setModalDataSource(dataIntl)
    }
  }, [dataIntl, modalDataSource])

  return (
    <Modal
      title={
        <span>
          {title}
          <span className={styles[`${PREFIX}-container-num`]}>（{modalDataSource.length}）</span>
        </span>
      }
      visible={visible}
      onOk={() => setVisible(false)}
      onCancel={() => setVisible(false)}
      footer={false}
      destroyOnClose
      data-uc-id="ZGbMgGhaRm"
      data-uc-ct="modal"
    >
      {/* @ts-expect-error wind-ui 类型定义错误 */}
      <Spin spinning={loading}>
        <Table
          className={styles[`${PREFIX}-container`]}
          size="large"
          columns={modalColumns}
          dataSource={modalDataSource}
          pagination={modalDataSource.length > 10 ? { pageSize: 10, showSizeChanger: false } : false}
          rowKey="_internal_key"
          // Hide header as the content is self-descriptive
          showHeader={false}
          data-uc-id="7v8ce30dkK"
          data-uc-ct="table"
        />
        <div className={styles[`${PREFIX}-container-hint`]}>
          {STRINGS.DESCRIBE}
          <br />
          {STRINGS.HIGH}
          <br />
          {STRINGS.MEDIUM}
          <br />
          {STRINGS.LOW}
        </div>
      </Spin>
    </Modal>
  )
}
export default React.forwardRef(ModalIndustry)
