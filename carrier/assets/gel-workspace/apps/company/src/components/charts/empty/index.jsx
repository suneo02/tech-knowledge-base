import intl from '../../../utils/intl'
import './empty.less'

/**
 * chart empty，暂无数据展示
 * @param {*} txt
 * @returns
 */
const Empty = ({ txt }) => {
  return (
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
            data-uc-id="cXwaPTXYH"
            data-uc-ct="svg"
          >
            <path
              d="M9 .9a8.1 8.1 0 110 16.2A8.1 8.1 0 019 .9zm0 1.2a6.9 6.9 0 100 13.8A6.9 6.9 0 009 2.1zm0 7.8a3.1 3.1 0 013.09 2.86v.17c.01.1-.06.17-.15.17h-.87c-.07 0-.13-.04-.16-.12l-.01-.05a1.9 1.9 0 00-3.79-.14v.14c-.01.1-.09.17-.18.17h-.86a.17.17 0 01-.17-.17l.01-.18A3.1 3.1 0 019 9.9zm-3-4a1.1 1.1 0 110 2.2 1.1 1.1 0 010-2.2zm6 0a1.1 1.1 0 110 2.2 1.1 1.1 0 010-2.2z"
              fillRule="nonzero"
            ></path>
          </svg>
        </span>
        {txt ? txt : intl('132725', '暂无数据')}
      </span>
    </div>
  )
}

export default Empty
