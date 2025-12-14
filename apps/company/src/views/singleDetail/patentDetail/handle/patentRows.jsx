import intl from '../../../../utils/intl'
import { wftCommon } from '../../../../utils/utils'
import CompanyLink from '../../../../components/company/CompanyLink'
import { ImgWithModal } from '../../../../components/common/modal/ImgModal'
import { parseImageBase } from '../../../../utils/resource'
import React from 'react'

export const patentRows = [
  [
    {
      title: intl('138748', '专利名称'),
      dataIndex: 'patentName',
      titleWidth: 100,
      contentWidth: 100,
      titleAlign: 'left',
      render: (txt, record) => {
        return wftCommon.formatCont(txt)
      },
    },
    {
      title: intl('383119', '最新法律状态'),
      dataIndex: 'lawStatus',
      titleWidth: 100,
      contentWidth: 100,
      titleAlign: 'left',
      render: (txt, record) => {
        return wftCommon.formatCont(txt)
      },
    },
  ],
  [
    {
      title: intl('138154', '申请号'),
      dataIndex: 'applicationNumber',
      titleWidth: 100,
      contentWidth: 100,
      titleAlign: 'left',
      render: (txt, record) => {
        return wftCommon.formatCont(txt)
      },
    },
    {
      title: intl('138660', '申请日期'),
      dataIndex: 'applicationDate',
      titleWidth: 100,
      contentWidth: 100,
      titleAlign: 'left',
      render: (txt, record) => {
        return wftCommon.formatTime(txt)
      },
    },
  ],
  [
    {
      title: intl('383120', '申请公告号'),
      dataIndex: 'applicationPublicationNumber',
      titleWidth: 100,
      contentWidth: 100,
      titleAlign: 'left',
      render: (txt, record) => {
        return wftCommon.formatCont(txt)
      },
    },
    {
      title: intl('383121', '申请公告日期'),
      dataIndex: 'applicationPublicationDate',
      titleWidth: 100,
      contentWidth: 100,
      titleAlign: 'left',
      render: (txt, record) => {
        return wftCommon.formatTime(txt)
      },
    },
  ],
  [
    {
      title: intl('265611', '授权号'),
      dataIndex: 'authorizationAnnouncementNumber',
      titleWidth: 100,
      contentWidth: 100,
      titleAlign: 'left',
      render: (txt, record) => {
        return wftCommon.formatCont(txt)
      },
    },
    {
      title: intl('383153', '授权日期'),
      dataIndex: 'authorizationAnnouncementDate',
      titleWidth: 100,
      contentWidth: 100,
      titleAlign: 'left',
      render: (txt, record) => {
        return wftCommon.formatTime(txt)
      },
    },
  ],
  [
    {
      title: intl('138430', '专利类型'),
      dataIndex: 'patentType',
      titleWidth: 100,
      contentWidth: 100,
      titleAlign: 'left',
      render: (txt, record) => {
        return wftCommon.formatCont(txt)
      },
    },
    {
      title: intl('138348', '国际分类'),
      dataIndex: 'internationalClassification',
      titleWidth: 100,
      contentWidth: 100,
      titleAlign: 'left',
      render: (txt, record) => {
        return wftCommon.formatCont(txt)
      },
    },
  ],
  [
    {
      title: intl('383122', '分类号及分类描述'),
      dataIndex: 'classifyDescriptionMap',
      colSpan: '3',
      titleAlign: 'left',
      render: (txt, record) => {
        const lists = record.classifyDescriptionMap
        if (window.en_access_config) {
          return record.classifyDescriptionMapEn
        }
        if (lists && Object.keys(lists).length) {
          return Object.keys(lists).map((t) => {
            return (
              <div>
                {' '}
                {t}:{' '}
                {lists[t].map((tt, idx) => {
                  return idx
                    ? '-' + tt.currentClassifyNum + tt.classifyDescription
                    : tt.currentClassifyNum + tt.classifyDescription
                })}{' '}
              </div>
            )
          })
        } else {
          return '--'
        }
      },
    },
  ],
  [
    {
      title: intl('265617', '发明人'),
      dataIndex: 'inventor',
      colSpan: '3',
      titleAlign: 'left',
      render: (txt, record) => {
        return wftCommon.formatCont(txt)
      },
    },
  ],
  [
    {
      title: intl('58656', '申请人'),
      dataIndex: 'applicantList',
      titleWidth: 100,
      contentWidth: 100,
      titleAlign: 'left',
      render: (txt, record) => {
        if (record.applicantList && record.applicantList.length > 0) {
          return record.applicantList.map((t) => {
            return <CompanyLink name={t.mainBodyName} id={t.mainBodyId} />
          })
        } else {
          return '--'
        }
      },
    },
    {
      title: intl('383123', '专利权人'),
      dataIndex: 'assigneeList',
      titleWidth: 100,
      contentWidth: 100,
      titleAlign: 'left',
      render: (txt, record) => {
        if (record.assigneeList && record.assigneeList.length > 0) {
          return record.assigneeList.map((t) => {
            return <CompanyLink name={t.mainBodyName} id={t.mainBodyId} />
          })
        } else {
          return '--'
        }
      },
    },
  ],
  [
    {
      title: intl('138136', '代理机构'),
      dataIndex: 'agency',
      titleWidth: 100,
      contentWidth: 100,
      titleAlign: 'left',
      render: (txt, record) => {
        return wftCommon.formatCont(txt)
      },
    },
    {
      title: intl('265637', '代理人'),
      dataIndex: 'agent',
      titleWidth: 100,
      contentWidth: 100,
      titleAlign: 'left',
      render: (txt, record) => {
        return wftCommon.formatCont(txt)
      },
    },
  ],
  [
    {
      title: intl('222876', '本国优先权'),
      dataIndex: 'localPriority',
      titleWidth: 100,
      contentWidth: 100,
      titleAlign: 'left',
      render: (txt, record) => {
        return wftCommon.formatCont(txt)
      },
    },
    {
      title: intl('383124', '优先权（国外）'),
      dataIndex: 'priority',
      titleWidth: 100,
      contentWidth: 100,
      titleAlign: 'left',
      render: (txt, record) => {
        return wftCommon.formatCont(txt)
      },
    },
  ],
  [
    {
      title: intl('265645', '摘要/简要说明'),
      dataIndex: 'summary',
      colSpan: '3',
      titleAlign: 'left',
      render: (txt, record) => {
        return wftCommon.formatCont(txt)
      },
    },
  ],
  [
    {
      title: intl('383154', '摘要附图'),
      dataIndex: 'images',
      colSpan: '3',
      titleAlign: 'left',
      render: (txt, record) => {
        if (record.abstractImageURLList && record.abstractImageURLList.length > 0) {
          let images = record.abstractImageURLList
          return images.map((t) => {
            return <ImgWithModal src={parseImageBase('', t)} width={80} />
          })
        }
      },
    },
  ],
  [
    {
      title: intl('383125', '附图'),
      dataIndex: 'images',
      colSpan: '3',
      titleAlign: 'left',
      render: (txt, record) => {
        if (record.imageURLList && record.imageURLList.length > 0) {
          let images = record.imageURLList
          return images.map((t) => {
            return <ImgWithModal src={parseImageBase('', t)} width={80} />
          })
        }
      },
    },
  ],
]
