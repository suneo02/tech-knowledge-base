import React, { useEffect, useState } from 'react'
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons'
// import { Avatar, List, Space } from 'antd'
import { Divider, Empty, List } from '@wind/wind-ui'
import { Space } from 'antd'
import { getServerApi } from '@/api/serverApi'
// @ts-ignore
import DefaultCompanyImg from '@/assets/imgs/default_company.png'
import { formatCurrency } from '@/utils/common.ts'
import { wftCommon } from '@/utils/utils.tsx'
import './index.less'

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
)

const PART = 'search/company/getCompanySearchPartMatch' //模糊搜索
const FULL = 'search/company/getCompanySearchFullMatch' //精准搜索

const useResultListData = (api: string, params: any) => {
  console.log('🚀 ~ useResultListData ~ useResultListData:', params)
  const [data, setData] = useState<any[]>()
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState<number>(null)
  const [pagination, setPagination] = useState({
    pageSize: 10,
    pageNo: 1,
  })
  const next = async () => {
    console.log(params)
    setLoading(true)
    const { Page, Data } = await getServerApi({
      api,
      noExtra: true,
      params: {
        ...pagination,
        ...params,
      },
    }).finally(() => setLoading(false))
    setData(Data?.search || [])
    setTotal(Page.Records)
  }
  const refresh = () => {
    setPagination({
      pageSize: 10,
      pageNo: 1,
    })
    console.log(1)
    next()
  }
  // useEffect(() => {

  // })
  return { data, total, loading, next, refresh }
}

const ResultList: React.FC<{ [key: string]: unknown }> = ({ filterParams }) => {
  const {
    data: fullData,
    total: fullTotal,
    loading: fullLoading,
    next: fullNext,
    refresh: fullRefresh,
  } = useResultListData(FULL, filterParams)
  const {
    data: partData,
    total: partTotal,
    loading: partLoading,
    next: partNext,
    refresh: partRefresh,
  } = useResultListData(PART, filterParams)

  const refresh = () => {
    fullRefresh()
  }

  useEffect(() => {
    refresh()
  }, [filterParams])

  const renderText = (row: Record<string, unknown>, key: string, type?: string | number) => {
    if (row?.highlight && row?.highlight?.[key]) {
      return row.highlight[key]
    }
    if (type === 'currency' || type === 6) {
      return formatCurrency(row[key], '')
    }
    if (type === 'date' || type === 7) {
      return wftCommon.formatTime(row[key])
    }
    return row?.[key] || '--'
  }

  if (fullData?.length === 0) {
    return (
      <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'center', height: 400, width: '100%' }}>
        <Empty status="no-data" direction="vertical" />
      </div>
    )
  }

  return (
    <div className="result-list-container">
      {`找到 ${wftCommon.formatMoneyComma(fullTotal)} 家符合条件的企业`}
      <Divider />
      {fullData?.length}
      {fullData?.length && (
        <List
          loading={fullLoading}
          itemLayout="vertical"
          size="large"
          dataSource={fullData}
          footer={
            <div>
              <b>Calvin Design</b> footer container put whatever you want
            </div>
          }
          renderItem={(item) => (
            <List.Item key={item.corp_name}>
              <div className="item-item">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    width="66"
                    // className="div_Card_left_logo"
                    src={item.logo}
                    onError={(e) => {
                      // @ts-ignore
                      e.target.src = DefaultCompanyImg
                    }}
                  />
                  <div>
                    <h4 onClick={() => console.log(1)} dangerouslySetInnerHTML={{ __html: item?.corp_name }}></h4>
                    <div style={{ marginBlockStart: 8 }}>标签</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  <div style={{ marginInlineEnd: 20 }}>
                    <label htmlFor="">法定代表人：</label>
                    {renderText(item, 'artificial_person_name')}
                  </div>
                  <div style={{ marginInlineEnd: 20 }}>
                    <label htmlFor="">行业：</label>
                    {renderText(item, 'industry_name')}
                  </div>
                  <div style={{ marginInlineEnd: 20 }}>
                    <label htmlFor="">注册资本：</label>
                    {item?.registerCapital && item?.registerCapital !== '0'
                      ? renderText(item, 'registerCapital', 'currency') + '万人民币'
                      : '--'}
                  </div>
                  <div style={{ marginInlineEnd: 20 }}>
                    <label htmlFor="">成立日期：</label>
                    {renderText(item, 'establish_date', 7)}
                  </div>
                </div>
                <div style={{ marginInlineEnd: 12, marginBlockStart: 8 }}>
                  <label htmlFor="">地址：</label>
                  {renderText(item, 'register_address')}
                </div>
              </div>
            </List.Item>
          )}
        />
      )}
      <Divider />
      {`以下是为您推荐的包含部分关键词的搜索结果`}
      <List
        loading={partLoading}
        itemLayout="vertical"
        size="large"
        dataSource={partData}
        footer={
          <div>
            <b>Calvin Design</b> footer container put whatever you want
          </div>
        }
        renderItem={(item) => (
          <List.Item
            key={item.title}
            actions={[
              <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
              <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
              <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
            ]}
            extra={
              <img width={272} alt="logo" src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png" />
            }
          >
            <List.Item.Meta
              // avatar={<Avatar src={item.avatar} />}
              title={<a href={item.href}>{item.title}</a>}
              description={item.description}
            />
            {item.content}
          </List.Item>
        )}
      />
    </div>
  )
}

export default ResultList
