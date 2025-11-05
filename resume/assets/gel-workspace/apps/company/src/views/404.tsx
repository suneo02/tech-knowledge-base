import React from 'react'
import forbidden from '../assets/imgs/forbidden.png'
import { Button } from '@wind/wind-ui'
import { wftCommon } from '../utils/utils'

const warnTips = () => {
  return [
    <div>
      {window.en_access_config
        ? 'The page is missing. Please go to the homepage or refresh and try again'
        : '您浏览的页面失踪了，请刷新重试或者前往首页'}
    </div>,
    <div>
      <Button
        style={{
          marginRight: '12px',
        }}
        onClick={() => wftCommon.jumpJqueryPage('SearchHome.html', true)}
      >
        {window.en_access_config ? 'Home' : '前往首页'}
      </Button>
      <Button onClick={() => window.location.reload()}>{window.en_access_config ? 'Reload' : '刷新重试'}</Button>
    </div>,
  ]
}

export const ErrorPage = () => {
  return (
    <div
      style={{
        color: '#999',
        lineHeight: '80px',
        height: '480px',
        textAlign: 'center',
        paddingTop: '50px',
        margin: '12px',
      }}
    >
      <div>
        <svg width="560px" height="350px" viewBox="0 0 560 350" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <g id="页面-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <image id="web数据超限-白" x="0" y="0" width="560" height="350" href={forbidden}></image>
          </g>
        </svg>
      </div>

      {warnTips()}
    </div>
  )
}

export const NotFound = () => {
  return (
    <div
      style={{
        color: '#999',
        lineHeight: '80px',
        height: '480px',
        textAlign: 'center',
        paddingTop: '50px',
        margin: '12px',
      }}
    >
      <div>
        <svg width="560px" height="350px" viewBox="0 0 560 350" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient
              x1="50%"
              y1="36.4106662%"
              x2="50.9695387%"
              y2="55.3212341%"
              id="lightnodata_linearGradient-1"
            >
              <stop stopColor="#E0E5EF" offset="0%"></stop>
              <stop stopColor="#E0E5EF" stopOpacity="0" offset="100%"></stop>
            </linearGradient>
            <linearGradient
              x1="42.237335%"
              y1="100%"
              x2="42.237335%"
              y2="-44.1478976%"
              id="lightnodata_linearGradient-2"
            >
              <stop stopColor="#F7F8F9" offset="0%"></stop>
              <stop stopColor="#D5E4F8" offset="100%"></stop>
            </linearGradient>
            <linearGradient
              x1="42.237335%"
              y1="100%"
              x2="42.237335%"
              y2="-44.1478976%"
              id="lightnodata_linearGradient-3"
            >
              <stop stopColor="#F7F8F9" offset="0%"></stop>
              <stop stopColor="#D5E4F8" offset="100%"></stop>
            </linearGradient>
            <radialGradient
              cx="47.3692375%"
              cy="0%"
              fx="47.3692375%"
              fy="0%"
              r="91.8239621%"
              gradientTransform="translate(0.473692,0.000000),scale(0.247315,1.000000),rotate(90.000000),scale(1.000000,4.461368),translate(-0.473692,-0.000000)"
              id="lightnodata_radialGradient-4"
            >
              <stop stopColor="#E5EBF7" offset="0%"></stop>
              <stop stopColor="#F4F6F9" stopOpacity="0.0511363636" offset="100%"></stop>
            </radialGradient>
            <linearGradient
              x1="53.3791479%"
              y1="50%"
              x2="4.00975919%"
              y2="43.8090367%"
              id="lightnodata_linearGradient-5"
            >
              <stop stopColor="#E8EBF1" stopOpacity="0" offset="0%"></stop>
              <stop stopColor="#A2ABB9" offset="100%"></stop>
            </linearGradient>
            <linearGradient x1="50%" y1="49.9672345%" x2="0%" y2="50.0327655%" id="lightnodata_linearGradient-6">
              <stop stopColor="#B5BBC2" offset="0%"></stop>
              <stop stopColor="#E3E3E3" offset="100%"></stop>
            </linearGradient>
            <linearGradient
              x1="92.7631993%"
              y1="51.0938026%"
              x2="-2.24983461%"
              y2="48.9061974%"
              id="lightnodata_linearGradient-7"
            >
              <stop stopColor="#F0F2F7" offset="0%"></stop>
              <stop stopColor="#DBE1EB" offset="100%"></stop>
              <stop stopColor="#D3D8E4" offset="100%"></stop>
            </linearGradient>
            <linearGradient
              x1="68.2260772%"
              y1="50%"
              x2="2.26224423%"
              y2="43.6003636%"
              id="lightnodata_linearGradient-8"
            >
              <stop stopColor="#E8EBF1" stopOpacity="0" offset="0%"></stop>
              <stop stopColor="#A2ABB9" offset="100%"></stop>
            </linearGradient>
            <linearGradient x1="50%" y1="49.9656204%" x2="0%" y2="50.0343796%" id="lightnodata_linearGradient-9">
              <stop stopColor="#B5BBC2" offset="0%"></stop>
              <stop stopColor="#E3E3E3" offset="100%"></stop>
            </linearGradient>
            <linearGradient
              x1="5.54364149%"
              y1="50.2774778%"
              x2="97.7980616%"
              y2="49.2375116%"
              id="lightnodata_linearGradient-10"
            >
              <stop stopColor="#F0F2F7" offset="0%"></stop>
              <stop stopColor="#DBE1EB" offset="100%"></stop>
              <stop stopColor="#D3D8E4" offset="100%"></stop>
            </linearGradient>
            <linearGradient
              x1="72.5547476%"
              y1="51.6937376%"
              x2="2.0406898%"
              y2="40.5780027%"
              id="lightnodata_linearGradient-11"
            >
              <stop stopColor="#E8EBF1" stopOpacity="0.0077305507" offset="0%"></stop>
              <stop stopColor="#A2ABB9" offset="100%"></stop>
            </linearGradient>
            <linearGradient x1="50%" y1="0%" x2="44.6456669%" y2="100%" id="lightnodata_linearGradient-12">
              <stop stopColor="#E3E3E3" offset="0%"></stop>
              <stop stopColor="#B5BBC2" offset="100%"></stop>
            </linearGradient>
            <linearGradient
              x1="5.54364149%"
              y1="51.9825055%"
              x2="97.7980616%"
              y2="44.5522209%"
              id="lightnodata_linearGradient-13"
            >
              <stop stopColor="#F0F2F7" offset="0%"></stop>
              <stop stopColor="#DBE1EB" offset="100%"></stop>
              <stop stopColor="#D3D8E4" offset="100%"></stop>
            </linearGradient>
            <linearGradient x1="50%" y1="0%" x2="49.8966713%" y2="100%" id="lightnodata_linearGradient-14">
              <stop stopColor="#E3E3E3" offset="0%"></stop>
              <stop stopColor="#B5BBC2" offset="100%"></stop>
            </linearGradient>
            <linearGradient
              x1="51.8721416%"
              y1="11.1293248%"
              x2="46.0302192%"
              y2="98.4776088%"
              id="lightnodata_linearGradient-15"
            >
              <stop stopColor="#F0F2F7" offset="0%"></stop>
              <stop stopColor="#D3D8E4" offset="100%"></stop>
            </linearGradient>
          </defs>
          <g id="lightnodata_00、" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g id="lightnodata_web无数据-定稿" transform="translate(-680.000000, -267.000000)">
              <g id="lightnodata_无数据" transform="translate(680.000000, 267.000000)">
                <g id="lightnodata_编组-5" transform="translate(11.112463, 7.000000)">
                  <path
                    d="M78.1153667,254.698276 C96.4576873,203.97474 119.692547,187.515913 147.819945,205.321796 C190.011042,232.030619 169.41787,141.305131 189.52845,138.353828 C209.63903,135.402525 192.755492,179.429121 209.63903,172.236848 C226.522568,165.044575 211.650088,96.4906192 246.582911,104.687966 C281.515734,112.885314 266.414553,207.690923 281.515734,207.301101 C296.616914,206.911279 283.448817,112.982356 310.564349,135.501368 C337.679882,158.02038 328.914494,183.408178 348.476517,174.226377 C368.038541,165.044575 358.673177,104.236478 379.536191,108.819778 C400.399205,113.403078 411.464544,204.385745 432.477149,214.216147 C446.485553,220.769749 446.485553,233.600851 432.477149,252.709452 L78.1153667,254.698276 Z"
                    id="lightnodata_路径-7"
                    fill="url(#lightnodata_linearGradient-1)"
                    fillRule="nonzero"
                    opacity="0.619413154"
                  ></path>
                  <ellipse
                    id="lightnodata_椭圆形"
                    fill="#C8D0DC"
                    cx="242.117324"
                    cy="106.982759"
                    rx="3.96595745"
                    ry="3.96551724"
                  ></ellipse>
                  <ellipse
                    id="lightnodata_椭圆形备份-2"
                    fill="#C8D0DC"
                    cx="121.155622"
                    cy="200.172414"
                    rx="3.96595745"
                    ry="3.96551724"
                  ></ellipse>
                  <ellipse
                    id="lightnodata_椭圆形备份"
                    fill="#C8D0DC"
                    cx="378.942856"
                    cy="110.948276"
                    rx="3.96595745"
                    ry="3.96551724"
                  ></ellipse>
                  <polygon
                    id="lightnodata_路径"
                    fill="url(#lightnodata_linearGradient-2)"
                    fillRule="nonzero"
                    opacity="0.801630632"
                    points="133.615481 58.4913793 133.615481 58.3952643 132.150448 54.9062913 130.31 51.7921666 128.103293 49.0048327 125.557797 46.5346782 122.765077 44.4105376 119.70682 42.6131878 116.483747 41.1618519 113.150796 40.0661414 109.698811 39.3164447 106.201043 38.9223734 102.749058 38.9031504 99.3428558 39.2395527 101.94329 37.7209363 104.763479 36.4233844 107.830893 35.3468968 110.962402 34.5587541 114.130537 34.0781793 117.326141 33.9051724 120.503432 34.0781793 123.525064 34.6356461 126.400192 35.5679612 129.092191 36.9135707 131.482026 38.7109204 133.615481 40.9792335 133.615481 41.065737 135.748936 38.8166469 138.147928 37.0385201 140.849084 35.6929107 143.724212 34.7605956 146.745843 34.2031288 149.941447 34.0301219 153.137051 34.1935173 156.305186 34.6644806 159.436695 35.4526233 162.494952 36.5194993 165.305985 37.8170513 167.897263 39.3260562 164.49106 39.0088768 161.039075 39.0473228 157.541308 39.4510056 154.089323 40.2103138 150.756372 41.3156359 147.533299 42.7669718 144.475041 44.5643215 141.682321 46.6884622 139.136826 49.1490051 136.920963 51.917116 135.080515 55.0216292 133.615481 58.4817678"
                  ></polygon>
                  <polygon
                    id="lightnodata_路径"
                    fill="url(#lightnodata_linearGradient-3)"
                    fillRule="nonzero"
                    opacity="0.801630632"
                    points="185.744072 15.3663793 185.744072 15.3057111 184.658537 13.1216572 183.323233 11.1716091 181.73816 9.43823298 179.884105 7.89552823 177.107825 6.17081899 174.110596 4.81878562 170.853992 3.84809499 167.472503 3.27608087 164.139046 3.10274326 160.815196 3.33674903 163.71636 1.9673819 166.982571 0.901355583 170.412093 0.234005776 173.889647 0 176.204814 0.112669448 178.404703 0.459344672 180.489314 1.04002567 182.449041 1.88071309 184.187818 3.00740757 185.744072 4.42010911 185.744072 4.48077727 187.290719 3.07674261 189.039102 1.95871502 190.998829 1.1180276 193.093046 0.537346597 195.292936 0.190671373 197.617709 0.0780019254 201.095263 0.303340821 204.524785 0.962023747 207.790996 2.01938318 210.672947 3.38875032 207.349097 3.1720783 204.006034 3.35408279 200.634151 3.94343067 197.377547 4.9141213 194.380318 6.26615468 191.604038 7.99086392 189.192806 10.0795821 187.242686 12.5236425"
                  ></polygon>
                  <path
                    d="M268.887537,208 C414.825102,208 533.61948,267.186953 537.775074,340.999905 L4.06064071e-14,340.999905 C4.15559429,267.186953 122.949972,208 268.887537,208 Z"
                    id="lightnodata_形状结合"
                    fill="url(#lightnodata_radialGradient-4)"
                    fillRule="nonzero"
                  ></path>
                  <polygon
                    id="lightnodata_Path-10"
                    fill="url(#lightnodata_linearGradient-5)"
                    fillRule="nonzero"
                    opacity="0.5"
                    points="135.4549 256.482759 289.547832 335 380.925835 292.449879 199.80165 256.482759"
                  ></polygon>
                  <line
                    x1="122.220462"
                    y1="245.775862"
                    x2="212.909321"
                    y2="245.775862"
                    id="lightnodata_直线"
                    stroke="url(#lightnodata_linearGradient-6)"
                    strokeWidth="4.5144"
                    strokeLinecap="round"
                  ></line>
                  <rect
                    id="lightnodata_矩形"
                    fill="#CBD2DA"
                    x="135.4549"
                    y="237.448276"
                    width="64.34675"
                    height="19.0344828"
                  ></rect>
                  <polygon
                    id="lightnodata_矩形备份-6"
                    fill="url(#lightnodata_linearGradient-7)"
                    fillRule="nonzero"
                    points="139.892204 227.931034 195.260978 227.931034 199.80165 237.448276 135.4549 237.448276"
                  ></polygon>
                  <polygon
                    id="lightnodata_路径-5"
                    fill="#B8C5D5"
                    points="130.688474 258.862069 149.118793 254.983753 163.802566 258.862069 176.968679 256.922911 214.100928 258.862069 176.968679 251.724138 163.802566 254.983753 149.118793 251.724138"
                  ></polygon>
                  <polygon
                    id="lightnodata_Path-10备份-2"
                    fill="url(#lightnodata_linearGradient-8)"
                    fillRule="nonzero"
                    opacity="0.5"
                    points="304.415906 230.394664 475.112359 287.413793 488.006686 241.38388 363.362069 230.394664"
                  ></polygon>
                  <line
                    x1="288.917983"
                    y1="219.703578"
                    x2="377.136929"
                    y2="219.703578"
                    id="lightnodata_直线备份"
                    stroke="url(#lightnodata_linearGradient-9)"
                    strokeWidth="4.5144"
                    strokeLinecap="round"
                  ></line>
                  <rect
                    id="lightnodata_矩形"
                    fill="#CCD0D4"
                    x="304.415906"
                    y="211.388288"
                    width="59.6073961"
                    height="19.0063762"
                  ></rect>
                  <polygon
                    id="lightnodata_矩形备份-6"
                    fill="url(#lightnodata_linearGradient-10)"
                    fillRule="nonzero"
                    points="308.934193 204.137931 358.054413 204.137931 363.128027 211.388288 304.415906 211.388288"
                  ></polygon>
                  <polygon
                    id="lightnodata_Path-10备份"
                    fill="url(#lightnodata_linearGradient-11)"
                    fillRule="nonzero"
                    opacity="0.5"
                    transform="translate(300.737312, 267.405240) rotate(8.000000) translate(-300.737312, -267.405240) "
                    points="214.47826 231.00569 385.771875 304.85001 386.996364 275.035676 241.363378 229.96047"
                  ></polygon>
                  <line
                    x1="269.615713"
                    y1="139.681436"
                    x2="242.845396"
                    y2="221.487563"
                    id="lightnodata_直线-2"
                    stroke="url(#lightnodata_linearGradient-12)"
                    strokeWidth="4.5144"
                    strokeLinecap="round"
                    transform="translate(256.230554, 180.584499) rotate(8.000000) translate(-256.230554, -180.584499) "
                  ></line>
                  <polygon
                    id="lightnodata_矩形"
                    fill="url(#lightnodata_linearGradient-13)"
                    fillRule="nonzero"
                    transform="translate(251.830549, 178.527213) rotate(114.000000) translate(-251.830549, -178.527213) "
                    points="222.054098 169.167253 281.607001 168.698476 281.558299 188.355949 223.616979 187.486063"
                  ></polygon>
                  <polygon
                    id="lightnodata_矩形备份-6"
                    fill="#C0C7D0"
                    transform="translate(262.820176, 183.446784) rotate(114.000000) translate(-262.820176, -183.446784) "
                    points="237.526004 180.766251 290.955891 181.363392 292.620995 185.828491 233.019356 186.127316"
                  ></polygon>
                  <line
                    x1="286.734346"
                    y1="84.3685927"
                    x2="286.805166"
                    y2="168.182828"
                    id="lightnodata_直线-2"
                    stroke="url(#lightnodata_linearGradient-14)"
                    strokeWidth="4.5144"
                    strokeLinecap="round"
                  ></line>
                  <rect
                    id="lightnodata_矩形"
                    fill="url(#lightnodata_linearGradient-15)"
                    fillRule="nonzero"
                    x="275.827963"
                    y="93.1034483"
                    width="21.812766"
                    height="67.4137931"
                  ></rect>
                </g>
                <rect id="lightnodata_矩形" x="0" y="0" width="560" height="350"></rect>
              </g>
            </g>
          </g>
        </svg>
      </div>

      {warnTips()}
    </div>
  )
}
