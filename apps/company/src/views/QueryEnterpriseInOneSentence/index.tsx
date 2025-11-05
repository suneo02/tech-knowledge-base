import React, { useState } from 'react'
import './index.less'
import { useHistory } from 'react-router'
import InputBox from '../QueryDetailEnterpriseInOneSentence/components/InputBox'

const search = (
  <svg
    viewBox="0 0 18 18"
    focusable="false"
    className=""
    data-icon="search"
    width="1em"
    height="1em"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      d="M7.5 14.1a6.6 6.6 0 115.07-2.38l3.78 3.79a.2.2 0 010 .28l-.56.56a.2.2 0 01-.28 0l-3.79-3.78A6.57 6.57 0 017.5 14.1zm0-1.2a5.4 5.4 0 100-10.8 5.4 5.4 0 000 10.8z"
      fill-rule="nonzero"
    ></path>
  </svg>
)
const recommendList = [
  {
    title: '注册资本超过1亿的制造业企业有哪些？',
    content: '注册资本超过1亿的制造业企业有哪些？',
    link: `/queryDetailEnterpriseInOneSentence?question=${encodeURIComponent('注册资本超过1亿的制造业企业有哪些？')}`,
  },
  {
    title: '杭州地区有哪些的电子商务公司？',
    content: '杭州地区有哪些的电子商务公司？',
    link: `/queryDetailEnterpriseInOneSentence?question=${encodeURIComponent('杭州地区有哪些的电子商务公司？')}`,
  },
  {
    title: '有哪些是成长型基金类型的私募股权基金',
    content: '有哪些是成长型基金类型的私募股权基金',
    link: `/queryDetailEnterpriseInOneSentence?question=${encodeURIComponent('有哪些是成长型基金类型的私募股权基金')}`,
  },
  {
    title: '近5年成立的科技公司',
    content: '近5年成立的科技公司',
    link: `/queryDetailEnterpriseInOneSentence?question=${encodeURIComponent('近5年成立的科技公司')}`,
  },
  {
    title: '江苏有发行债券的公司有哪些',
    content: '江苏有发行债券的公司有哪些',
    link: `/queryDetailEnterpriseInOneSentence?question=${encodeURIComponent('江苏有发行债券的公司有哪些')}`,
  },
  {
    title: '华为控股的企业有哪些',
    content: '华为控股的企业有哪些',
    link: `/queryDetailEnterpriseInOneSentence?question=${encodeURIComponent('华为控股的企业有哪些')}`,
  },
]

const QueryEnterpriseInOneSentence = () => {
  const [aiQuery, setAiQuery] = useState('')
  const history = useHistory()

  return (
    <div className="query-enterprise-container">
      {/* Navigation breadcrumb */}
      <div className="breadcrumb">
        <div className="breadcrumb-content">
          <span>首页 / 一句话查企业</span>
        </div>
      </div>

      <div className="main-content">
        <div className="alice-main">
          <div className="alice-guide">
            <div className="alice-banner">
              <div className="banner-avatar spring-theme"></div>
              <div className="banner-text">
                <div className="hi-img spring-theme"></div>
                <div className="text">
                  我是<span className="text-hLight spring-theme">Alice</span>, 你的一句话找企业助手！
                </div>
              </div>
            </div>
            <p
              style={{
                marginLeft: '20px',
                marginTop: '12px',
                fontSize: '18px',
                color: '#333',
              }}
            >
              我可以为您多维度组合查询地域、行业、规模以及时间等企业的客观数据问题，一键返回企业清单
            </p>
            <div className="alice-recommend-list">
              <div className="alice-recommend-title">试试这样问：</div>
              <div className="recommend-container">
                {recommendList.map((i) => (
                  <div className="recommend-item wui-alice-btn">
                    <span role="img" aria-label="fund" className="wicon-svg wicon-fund-o">
                      {search}
                    </span>
                    <div
                      title={i.title}
                      className="item-content"
                      onClick={() => {
                        history.push(i.link)
                      }}
                    >
                      {i.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="chat-list alice-qa empty-chat-list"></div>
          <div id="bottom-line"></div>
        </div>
        <div>
          <InputBox
            value={aiQuery}
            onChange={setAiQuery}
            onSubmit={() => {
              history.push(`/queryDetailEnterpriseInOneSentence?question=${encodeURIComponent(aiQuery)}`)
            }}
          ></InputBox>
        </div>
      </div>
    </div>
  )
}

export default QueryEnterpriseInOneSentence
