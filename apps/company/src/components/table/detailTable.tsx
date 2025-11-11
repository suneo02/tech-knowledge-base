import React from 'react'
import intl from '../../utils/intl'

function DetailTable(props: any) {
  const { columns, dataSource } = props
  const empty = (
    <div className="wind-ui-table-empty">
      <span>
        <span role="img" aria-label="frown" className="wicon-svg wicon-frown-o">
          <svg
            viewBox="0 0 18 18"
            focusable="false"
            className=""
            data-icon="frown"
            width="1em"
            height="1em"
            fill="currentColor"
            aria-hidden="true"
            data-uc-id="vzcGWQ3UT-"
            data-uc-ct="svg"
          >
            <path
              d="M9 .9a8.1 8.1 0 110 16.2A8.1 8.1 0 019 .9zm0 1.2a6.9 6.9 0 100 13.8A6.9 6.9 0 009 2.1zm0 7.8a3.1 3.1 0 013.09 2.86v.17c.01.1-.06.17-.15.17h-.87c-.07 0-.13-.04-.16-.12l-.01-.05a1.9 1.9 0 00-3.79-.14v.14c-.01.1-.09.17-.18.17h-.86a.17.17 0 01-.17-.17l.01-.18A3.1 3.1 0 019 9.9zm-3-4a1.1 1.1 0 110 2.2 1.1 1.1 0 010-2.2zm6 0a1.1 1.1 0 110 2.2 1.1 1.1 0 010-2.2z"
              fillRule="nonzero"
            ></path>
          </svg>
        </span>
        {intl('132725', '暂无数据')}
      </span>
    </div>
  )
  return (
    <table className="wind-ui-table">
      <thead className="wind-ui-table-thead wind-ui-table-expanded">
        <tr className="wind-ui-table-row">
          {columns.map((item) => (
            <th
              className="wind-ui-table-row-head wind-ui-table-align-center"
              key={item.key}
              style={{ textAlign: 'center', paddingLeft: 8 }}
            >
              {item.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="wind-ui-table-tbody">
        {dataSource
          ? dataSource.map((item, index) => (
              // eslint-disable-next-line react/jsx-key
              <tr
                className={
                  index % 2
                    ? 'wind-ui-table-row wind-ui-table-row-expanded wind-ui-table-row-even'
                    : 'wind-ui-table-row'
                }
              >
                {columns.map((ele) => (
                  // eslint-disable-next-line react/jsx-key
                  <td className="wind-ui-table-row-cell" style={{ textAlign: 'center' }}>
                    {ele.render ? ele.render(item[ele.dataIndex], item) : item[ele.dataIndex]}
                  </td>
                ))}
              </tr>
            ))
          : empty}
      </tbody>
    </table>
  )
}

export default DetailTable
