import React, { useState } from 'react'
import { Input, Popover, Tooltip } from '@wind/wind-ui'
import './InputBox.less'
import { t } from 'gel-util/intl'

const { TextArea } = Input

interface InputBoxProps {
  value: string
  onChange: (value: any) => void
  onSubmit: (e: any) => void
  placeholder?: string
  disabled?: boolean
}

/**
 * 聊天输入框组件
 */
const InputBox: React.FC<InputBoxProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = t('455060', '有什么可以帮你？（Shift + Enter 换行）'),
  disabled = false,
}) => {
  const [focus, setFocus] = useState(false)

  return (
    <div className="input-box">
      <div className="input-box-content-wrap">
        <div className="input-mian">
          <TextArea
            className="w-input-chat"
            placeholder={placeholder}
            rows={2}
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                onSubmit(e)
              }
            }}
            style={{ height: '56px' }}
            data-uc-id="zAVM0m7xmF"
            data-uc-ct="textarea"
          />
        </div>
      </div>
      <div className="input-left-action">
        <span></span>
        <div className="alice-deepthink-wrap">
          <div>
            <Tooltip placement="top" title={t('455045', '深度思考模式不可更改')}>
              <a className="alice-deepmode-btn-active">
                <span className="icon" style={{ display: 'flex' }}>
                  <span role="img" aria-label="deep-think" className="wicon-svg wicon-deep-think-o">
                    <svg
                      viewBox="0 0 18 18"
                      focusable="false"
                      className=""
                      data-icon="deep-think"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                      aria-hidden="true"
                      data-uc-id="9wwmq90-xl"
                      data-uc-ct="svg"
                    >
                      <path
                        d="M15.45 2.57c1.23 1.23.69 3.75-1.12 6.44 1.8 2.68 2.35 5.2 1.12 6.43-1.23 1.23-3.75.69-6.43-1.12-2.69 1.8-5.2 2.35-6.44 1.12-1.23-1.23-.69-3.75 1.12-6.43-1.8-2.69-2.35-5.2-1.12-6.44 1.23-1.23 3.75-.69 6.44 1.12 2.68-1.8 5.2-2.35 6.43-1.12zm-1.88 7.48l-.18.22a21.14 21.14 0 01-3.33 3.29c2.02 1.28 3.84 1.74 4.54 1.03.7-.7.25-2.51-1.03-4.54zm-9.1 0l-.09.14c-1.21 1.96-1.64 3.71-.95 4.4.7.7 2.52.25 4.54-1.03a21 21 0 01-3.5-3.5zm4.55-4.87l-.11.08a19.08 19.08 0 00-3.72 3.75 19.02 19.02 0 003.83 3.83A19.02 19.02 0 0012.85 9a19.11 19.11 0 00-3.83-3.83zm.2 2.4l1.23 1.23c.12.12.12.3 0 .41l-1.22 1.23a.29.29 0 01-.41 0L7.59 9.22a.29.29 0 010-.41L8.8 7.58c.12-.11.3-.11.41 0zM3.43 3.42c-.7.7-.24 2.52 1.03 4.54a21 21 0 013.29-3.33l.22-.17C5.95 3.18 4.14 2.7 3.43 3.42zm6.99.82l-.23.13-.13.09a20.92 20.92 0 013.5 3.5c1.29-2.02 1.75-3.83 1.04-4.54-.66-.66-2.3-.3-4.18.82z"
                        fill-rule="nonzero"
                      ></path>
                    </svg>
                  </span>
                </span>
                <span
                  className="name"
                  style={{
                    lineHeight: '13px',
                    fontSize: '13px',
                  }}
                >
                  {t('455046', '深度思考(R1)')}
                </span>
              </a>
            </Tooltip>
          </div>
          <div className="shortcuts"></div>
        </div>
      </div>
      <div className="input-right-action">
        <a
          id="btnSearch"
          className={`btn-search ${focus && value.trim() ? 'btn-search-focus' : 'btn-search-noFocus'}`}
          title={t('455061', '请输入你的问题')}
          onClick={onSubmit}
          data-uc-id="fQyRzDRrra"
          data-uc-ct="a"
        >
          <svg className="send-icon" width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <g id="发送图标" stroke="none" stroke-width="1" fill-rule="evenodd">
              <path
                d="M9.04725812,2.10320803 L8.97687695,2.10066883 L8.90849682,2.11433541 C8.86419061,2.12870648 8.82305902,2.15345565 8.78878324,2.18773142 L3.90148178,7.07287341 L3.85350882,7.13711248 C3.78768628,7.26572296 3.80926233,7.40577674 3.90146615,7.49798057 L4.46880651,8.06532092 L4.53303933,8.11327778 L4.61109434,8.14241226 C4.71573292,8.16763717 4.82010431,8.13909281 4.89387185,8.06535847 L8.298,4.6629156 L8.29956572,15.5518736 L8.30763322,15.6185224 C8.34595106,15.7611756 8.46400707,15.8524429 8.60014436,15.8524429 L9.40249922,15.8524429 L9.47788889,15.8412133 L9.5580022,15.8049857 L9.6211215,15.7527663 C9.67541161,15.696086 9.70309311,15.6267925 9.70307635,15.5518131 L9.702,4.6569156 L13.2165837,8.09696458 L13.2800533,8.14415931 C13.4086547,8.20995864 13.5486835,8.18838826 13.6408857,8.09621024 L14.2082446,7.5288513 L14.256202,7.46462786 C14.3220245,7.33601738 14.3004485,7.19596359 14.2082446,7.10375977 L9.21331362,2.18717468 L9.14965134,2.13977409 L9.0623598,2.10675181 L9.04725812,2.10320803 Z"
                id="路径"
                fillRule="nonzero"
              ></path>
            </g>
          </svg>
        </a>
      </div>
    </div>
  )
}

export default InputBox
