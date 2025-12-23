import { numberFormat, toTransPercent, isMail, getCompanyUrl, aesDecrypt } from '../../lib/utils'

export const columsMap = {
  getnewshareholdert: [],
}

const showHighLight = (sentence, keyword) => {
  if (!sentence || !keyword) {
    return sentence
  }
  const start = sentence.indexOf(keyword)
  if (start < 0) {
    return sentence
  }
  return (
    <>
      {sentence.substring(0, start)}
      <span style={{ color: '#35f' }}>{keyword}</span>
      {sentence.substring(start + keyword.length, sentence.length)}
    </>
  )
}

export function columsMapFunc(cmd, funcInfo, translation, pagination, keyword, total, reFresh) {
  switch (cmd) {
    case 'getnewshareholdert': // 股东信息
      return [
        {
          title: '',
          dataIndex: 'index',
          render: (text, record, index) => (pagination.pageNum - 1) * pagination.pageSize + index + 1,
          align: 'center',
          width: 60,
        },
        {
          title: translation(138506),
          dataIndex: 'shareholderName',
          align: 'left',
          width: 600,
          // 不是shareholderId
          render: (text, record) => {
            const { corp_id } = record
            return corp_id ? (
              <a
                onClick={() => {
                  window.open(getCompanyUrl(corp_id))
                }}
                rel="noreferrer"
                data-uc-id="gl50WE4iXX2"
                data-uc-ct="a"
              >
                {text}
              </a>
            ) : (
              text
            )
          },
        },
        {
          title: translation(257679),
          dataIndex: 'percentage',
          align: 'right',
          width: 120,
          render: (text, record) => toTransPercent(text, true) || '--',
        },
        {
          title: translation(451204),
          dataIndex: 'promiseMoneyAmount',
          align: 'right',
          width: 256,
          render: (text, record) => numberFormat(text, true, 2, true) || '--',
        },
      ]
    case 'gettel': // 联系电话
      return [
        {
          title: '',
          dataIndex: 'index',
          render: (text, record, index) => (pagination.pageNum - 1) * pagination.pageSize + index + 1,
          align: 'left',
          width: 60,
        },
        {
          title: translation(4946),
          dataIndex: 'contactValue',
          align: 'left',
          width: 336,
          render: (text, record) => (
            <a
              onClick={() => {
                const { encryptValue } = record
                if (encryptValue) {
                  record.contactValue = aesDecrypt(encryptValue)
                  reFresh()
                }
              }}
              data-uc-id="OPd6Z0fF_0W"
              data-uc-ct="a"
            >
              {text}
            </a>
          ),
        },
        // {
        //   title: translation(69149),
        //   dataIndex: 'contactPerson',
        //   align: 'left',
        //   width: 320,
        // },
        {
          title: translation(9754),
          dataIndex: 'contactFrom',
          align: 'left',
          width: 320 + 320,
        },
      ]
    case 'getmail': // 电子邮箱
      return [
        {
          title: '',
          dataIndex: 'index',
          render: (text, record, index) => (pagination.pageNum - 1) * pagination.pageSize + index + 1,
          align: 'left',
          width: 60,
        },
        {
          title: translation(91283),
          dataIndex: 'contactValue',
          align: 'left',
          width: 336,
          render: (text, record) =>
            text && isMail(text) ? (
              <a href={`mailto:${text}`} data-uc-id="x0zATYlymKi" data-uc-ct="a">
                {text}
              </a>
            ) : (
              text || '--'
            ),
        },
        // {
        //   title: translation(69149),
        //   dataIndex: 'contactPerson',
        //   align: 'left',
        //   width: 320,
        // },
        {
          title: translation(9754),
          dataIndex: 'contactFrom',
          align: 'left',
          width: 320 + 320,
        },
      ]
    case 'getsubcorp': // 分支机构
      return [
        {
          title: '',
          dataIndex: 'index',
          render: (text, record, index) => (pagination.pageNum - 1) * pagination.pageSize + index + 1,
          align: 'left',
          width: 60,
        },
        {
          title: translation(32914),
          dataIndex: 'branchName',
          align: 'left',
          width: 336,
          render: (text, record) => {
            const { branchId } = record
            return branchId ? (
              <a
                onClick={() => {
                  window.open(getCompanyUrl(branchId))
                }}
                rel="noreferrer"
                data-uc-id="mJD8qTSOg97"
                data-uc-ct="a"
              >
                {text}
              </a>
            ) : (
              text
            )
          },
        },
        {
          title: translation(19414),
          dataIndex: 'officeAddress',
          align: 'left',
          width: 440,
          render: (text, record) => text || record.registerAddress,
        },
        {
          title: translation(257648),
          dataIndex: 'tel',
          align: 'left',
          width: 200,
          render: (text, record) =>
            text && isMail(text) ? (
              <a href={`mailto:${text}`} data-uc-id="kLwmpI_M5Ei" data-uc-ct="a">
                {text}
              </a>
            ) : (
              text || '--'
            ),
        },
      ]
    case 'getofficcorp': // 门店办事处
      return [
        {
          title: '',
          dataIndex: 'index',
          render: (text, record, index) => (pagination.pageNum - 1) * pagination.pageSize + index + 1,
          align: 'left',
          width: 60,
        },
        {
          title: '门店/办事处名称',
          dataIndex: 'shareholder_name',
          align: 'left',
          width: 336,
          render: (text, record) => {
            const { corp_id } = record
            return corp_id ? (
              <a
                onClick={() => {
                  window.open(getCompanyUrl(corp_id))
                }}
                rel="noreferrer"
                data-uc-id="gNiD47MiK_3"
                data-uc-ct="a"
              >
                {text}
              </a>
            ) : (
              text
            )
          },
        },
        {
          title: translation(19414),
          dataIndex: 'area',
          align: 'left',
          width: 440,
        },
        {
          title: translation(257648),
          dataIndex: 'contact',
          align: 'left',
          width: 200,
          render: (text, record) =>
            text && isMail(text) ? (
              <a href={`mailto:${text}`} data-uc-id="b4PGfijg0wF" data-uc-ct="a">
                {text}
              </a>
            ) : (
              text || '--'
            ),
        },
      ]
    case 'getTendering': // 招标信息
      return [
        {
          title: '公告日期',
          dataIndex: 'latest_announcement_time',
          align: 'left',
          width: 336,
          render: (text, record) => (text ? text.split(' ')[0] : ''),
          sorter: total > 0 ? true : false,
          sortDirections: ['descend', 'ascend'],
        },
        {
          title: '公告标题',
          dataIndex: 'title',
          align: 'left',
          width: 440,
          render: (text, record) =>
            record.detail_id ? (
              <a
                onClick={() => {
                  sessionStorage.setItem(
                    'prevTenderingInfo',
                    JSON.stringify({
                      detailId: record.detail_id,
                      title: record.title,
                    })
                  )
                  window.open(`/superlist/tenderingDetail`)
                }}
                data-uc-id="tyLSXV9hBXO"
                data-uc-ct="a"
              >
                {showHighLight(text, keyword)}
              </a>
            ) : (
              <span>{text}</span>
            ),
        },
        {
          title: '公告类型',
          dataIndex: 'bidding_type_name',
          align: 'left',
          width: 440,
        },
        {
          title: '中标单位',
          dataIndex: 'bid_winner',
          align: 'left',
          width: 440,
          render: (text, record) => {
            const purchasingArr = text ? text.split(',') : []
            return (
              <>
                {purchasingArr.map((item) => {
                  const purchasing = item ? item.trim().split('|') : []
                  return purchasing[1] ? (
                    <a
                      onClick={() => {
                        window.open(getCompanyUrl(purchasing[1]))
                        return false
                      }}
                      data-uc-id="cfJbjOjyt_H"
                      data-uc-ct="a"
                    >
                      {purchasing[0]}
                    </a>
                  ) : (
                    <span>{purchasing[0]}</span>
                  )
                })}
              </>
            )
          },
        },
        {
          title: '预算金额',
          dataIndex: 'project_budget_money',
          align: 'right',
          width: 200,
          render: (text, record) => numberFormat(text, true, 2, true),
          sorter: total > 0 ? true : false,
          sortDirections: ['descend', 'ascend'],
        },
      ]
    case 'getBidding': // 投标信息
      return [
        {
          title: '公告日期',
          dataIndex: 'latest_announcement_time',
          align: 'left',
          width: 336,
          render: (text, record) => (text ? text.split(' ')[0] : ''),
          sorter: total > 0 ? true : false,
          sortDirections: ['descend', 'ascend'],
        },
        {
          title: '公告标题',
          dataIndex: 'title',
          align: 'left',
          width: 440,
          render: (text, record) =>
            record.detail_id ? (
              <a
                onClick={() => {
                  sessionStorage.setItem(
                    'prevTenderingInfo',
                    JSON.stringify({
                      detailId: record.detail_id,
                      title: record.title,
                    })
                  )
                  window.open(`/superlist/tenderingDetail`)
                }}
                data-uc-id="-pYagcW6keu"
                data-uc-ct="a"
              >
                {showHighLight(text, keyword)}
              </a>
            ) : (
              <span>{text}</span>
            ),
        },
        {
          title: '公告类型',
          dataIndex: 'bidding_type_name',
          align: 'left',
          width: 440,
        },
        {
          title: '采购单位',
          dataIndex: 'purchasing_unit',
          align: 'left',
          width: 440,
          render: (text, record) => {
            const purchasingArr = text ? text.split(',') : []
            return (
              <>
                {purchasingArr.map((item) => {
                  const purchasing = item ? item.trim().split('|') : []
                  return purchasing[1] ? (
                    <a
                      onClick={() => {
                        window.open(getCompanyUrl(purchasing[1]))
                        return false
                      }}
                      data-uc-id="gwMGRqeJalF"
                      data-uc-ct="a"
                    >
                      {purchasing[0]}
                    </a>
                  ) : (
                    <span>{purchasing[0]}</span>
                  )
                })}
              </>
            )
          },
        },
        {
          title: '金额',
          dataIndex: 'bid_winning_money',
          align: 'right',
          width: 200,
          render: (text, record) => numberFormat(text, true, 2, true),
          sorter: total > 0 ? true : false,
          sortDirections: ['descend', 'ascend'],
        },
      ]
    default:
      return []
  }
}
