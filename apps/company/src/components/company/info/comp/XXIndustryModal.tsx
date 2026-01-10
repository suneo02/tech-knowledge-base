import { IEnterpriseStrategicEmergingIndustry } from '@/api/corp/info/otherInfo'
import { request } from '@/api/request'
import { ModalSafeType } from '@/components/modal/ModalSafeType'
import { useTranslateService } from '@/hook'
import intl from '@/utils/intl'
import { RightO } from '@wind/icons'
import { Button, Pagination } from '@wind/wind-ui'
import React, { useEffect, useState } from 'react'
import { CorpBasicInfoFront } from '../handle'
import { XXIndustryTree } from './XXIndustryTree'
import styles from './style/XXIndustryModal.module.less'

interface StrategicIndustryButtonModalProps {
  companyCode: string
  basicInfo: CorpBasicInfoFront
}

export const StrategicIndustryButtonModal: React.FC<StrategicIndustryButtonModalProps> = ({
  companyCode,
  basicInfo,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [allIndustries, setAllIndustries] = useState<IEnterpriseStrategicEmergingIndustry[]>([])

  const [allIndustriesIntl] = useTranslateService(allIndustries, true, true)
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 10

  const fetchData = async (page: number) => {
    const res = await request('detail/company/getstrategicemergingindustry', {
      params: {
        companyCode,
        pageNo: page - 1,
        pageSize,
      },
    })
    if (res.Data) {
      setAllIndustries(res.Data || [])
      setTotal(res.Page.Records || 0)
    }
  }

  useEffect(() => {
    if (isModalOpen) {
      fetchData(currentPage)
    }
  }, [isModalOpen, companyCode, currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <>
      <Button type="link" onClick={() => setIsModalOpen(true)} data-uc-id="ozjWeV0GD_" data-uc-ct="button">
        <span className={styles['more-link']}>
          {intl('272167', '更多')} ({basicInfo.seIndustriesCount ?? total})
          <RightO
            className={styles['more-icon']}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            data-uc-id="jSlN1yhS1o"
            data-uc-ct="righto"
          />
        </span>
      </Button>
      <ModalSafeType
        title={intl('360593', '战略性新兴产业')}
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
        data-uc-id="zOt0IdsoDK"
        data-uc-ct="modalsafetype"
      >
        <div className={styles['modal-content']}>
          <div className={styles['modal-trees']}>
            {allIndustriesIntl.map((industry, index) => (
              <div key={index} className={styles['tree-item']}>
                <div className={styles['tree-content']}>
                  <XXIndustryTree data={industry.industry} defaultExpandLevel={2} />
                </div>
                <span className={styles['rank-info']}>
                  {intl(420674, '关联度')}：{industry.rank}
                </span>
              </div>
            ))}
          </div>
          {total > pageSize && (
            <div className={styles['pagination-container']}>
              <Pagination
                current={currentPage}
                total={total}
                pageSize={pageSize}
                onChange={handlePageChange}
                showSizeChanger={false}
                data-uc-id="4hxVhUKZul"
                data-uc-ct="pagination"
              />
            </div>
          )}
        </div>
      </ModalSafeType>
    </>
  )
}
