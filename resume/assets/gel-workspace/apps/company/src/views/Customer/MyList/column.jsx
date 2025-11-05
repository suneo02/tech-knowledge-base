import { useMemo } from 'react'
import { myWfcAjax } from '../../../api/companyApi'
import intl from '../../../utils/intl'
import { wftCommon } from '../../../utils/utils'
import { getConfig } from './downReport'

const NameRowComp = ({ row }) => {
  const { itemMsg, downLoadFunName } = useMemo(() => getConfig(row), [row])
  return (
    <>
      <p style={{ color: '#333', fontWeight: 'bold' }}>{downLoadFunName}</p>
      <p>{itemMsg}</p>
    </>
  )
}

export const getMyListColumn = (getMyList) => {
  // 重新生成任务
  const resetTask = (id) => {
    myWfcAjax('resetdoctask', { taskId: id }).then((res) => {
      if (res?.ErrorCode === '0') {
        getMyList && getMyList()
      }
    })
  }
  return [
    {
      title: intl('425477', '数据类型'),
      dataIndex: 'displayName',
      width: '360px',
      render: (_data, row) => {
        return <NameRowComp row={row} />
      },
    },
    {
      title: intl('425478', '导出时间'),
      dataIndex: 'created',
      width: '240px',
      render: (data) => {
        return wftCommon.formatUTCDate(data)
      },
    },
    {
      title: intl('32098', '	状态'),
      dataIndex: 'status',
      width: '220px',
      render: (data) => {
        switch (data) {
          case 0:
          case 1:
            return <span className="color-status-creating">{intl('222472', '生成中')}</span>
          case 2: //pdf 能查看、下载
          case 4: // 是能下载
            return <span className="color-status-success">{intl('425472', '生成成功')}</span>
          case 3:
          case 5:
            return <span className="color-status-error">{intl('233326', '生成失败')}</span>
          default:
            return data
        }
      },
    },
    {
      title: intl('36348', '	操作'),
      dataIndex: '',
      width: '200px',
      render: (_data, row) => {
        const { downFileType, href, downloadFileName, openPdf } = getConfig(row)
        return (
          <>
            {row?.status === 0 || row?.status === 1 ? (
              <span>
                {downFileType == 'pdf' ? intl('233330', '报告生成中，请稍后') : intl('233324', '文件生成中，请稍后')}
                &nbsp; &nbsp;
              </span>
            ) : (
              <>
                {(row?.status === 2 || row?.status === 4) && downFileType == 'pdf' && (
                  <span>
                    {' '}
                    <a href={openPdf} target="__blank">
                      {intl('257641', '查看')}
                    </a>{' '}
                    &nbsp; &nbsp;
                  </span>
                )}
                {row?.status === 3 || row?.status === 5 ? (
                  <span>
                    {' '}
                    <a
                      onClick={() => {
                        resetTask(row.id)
                      }}
                    >
                      {intl('233327', '重新生成')}
                    </a>{' '}
                    &nbsp; &nbsp;
                  </span>
                ) : (
                  <span>
                    {' '}
                    <a href={href} download={downloadFileName} onClick={() => {}}>
                      {intl('90846', '下载')}{' '}
                    </a>
                  </span>
                )}
              </>
            )}
          </>
        )
      },
    },
  ]
}
