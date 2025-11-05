import { pointBuriedByModule } from '@/api/pointBuried/bury'
import { CopyContainer } from '@/components/common/CopyContainer'
import intl from '@/utils/intl'
import { Button } from '@wind/wind-ui'
import dayjs from 'dayjs'
import React, { useRef } from 'react'
import { IndustryRowDisplay } from './components/IndustryRowDisplay'
import styles from './index.module.less'
import { industry } from './industry'
import ModalIndustry, { ModalIndustryHandle } from './ModalIndustry'
import { ColumnRenderProps, IndustryColumnRenderProps } from './type'

const PREFIX = 'industry'

const STRINGS = {
  TIP: intl('31041', '提示'),
  MORE: intl('272167', '更多'),
  RIME_DATA_TOOLTIP: intl('449776', '该数据由合作方 RimeData 来觅数据提供，如需查看详情请前往来觅官网查看'),
  SEEK: intl('257641', '查看'),
}

const IndustryCellRenderer: React.FC<ColumnRenderProps> = ({ list, column, total, id }) => {
  console.log('🚀 ~ content:', list, column)
  const { dataIndex, title } = column || {}
  const modalRef = useRef<ModalIndustryHandle>(null)

  return (
    <div className={styles[`${PREFIX}-container`]} id={`${PREFIX}-container-modal-${dataIndex}`}>
      {list.map((rowInContent, rowIndex) => (
        <IndustryRowDisplay
          key={`${dataIndex}-display-row-${rowIndex}`}
          rowData={rowInContent}
          baseKey={`${dataIndex}-display-row-${rowIndex}`}
          cellOnClick={column.cellOnClick}
        />
      ))}
      {total > 3 && (
        <>
          <Button
            onClick={() => {
              pointBuriedByModule(922602101140, {
                click_time: dayjs().format('YYYY-MM-DD HH:mm'),
                more_industry_name: id,
              })
              modalRef.current?.openModal({ list, total, key: dataIndex })
            }}
            type="link"
            style={{ padding: 0 }}
          >
            {STRINGS.MORE} ({total})
          </Button>
          <ModalIndustry ref={modalRef} title={title} />
        </>
      )}
    </div>
  )
}

const TagListCellRenderer: React.FC<ColumnRenderProps> = ({ list, column }) => {
  console.log('🚀 ~ content:', list, column)
  const { dataIndex } = column || {}
  const flattenedList = list.reduce((acc, curr) => acc.concat(curr.list), [])
  return (
    <CopyContainer copyText={flattenedList.map((cellData) => cellData.name).join('、')} buttonType="link">
      <div className={styles[`${PREFIX}-container`]}>
        {flattenedList.map((cellData, index) => (
          <React.Fragment key={cellData.id || `${dataIndex}-taglist-cell-${index}`}>
            {index > 0 && <span className={styles[`${PREFIX}-container-item-separator`]}>{'、'}</span>}
            <a
              color="color-1"
              className={styles[`${PREFIX}-container-item-tag`]}
              onClick={() => {
                column.cellOnClick?.(cellData)
              }}
            >
              {cellData.name}
            </a>
          </React.Fragment>
        ))}
      </div>
    </CopyContainer>
  )
}

export const getIndustryColumns = () => {
  return industry.map((columnDefinitionGroup) => {
    const tagList = ['laimiTrack', 'windIndustryChain']

    return columnDefinitionGroup.map((res) => {
      res.title = window.en_access_config ? res.enTitle : res.title
      if (res?.onClick) {
        res.title = <a onClick={res.onClick}>{res.title}</a>
      }
      if (tagList.includes(res?.dataIndex)) {
        return {
          ...res,
          render: (info: IndustryColumnRenderProps) => {
            if (!info || !info.list || !Array.isArray(info.list) || info.list.length === 0) {
              return null
            }
            return <TagListCellRenderer list={info.list} column={res} total={info.total} />
          },
        }
      } else {
        return {
          ...res,
          render: (info: IndustryColumnRenderProps) => {
            if (!info || !info.list || !Array.isArray(info.list) || info.list.length === 0) {
              return null
            }
            return <IndustryCellRenderer list={info.list} column={res} total={info.total} id={info.id} />
          },
        }
      }
    })
  })
}
