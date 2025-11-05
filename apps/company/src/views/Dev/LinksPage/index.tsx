import { Card, Col, Divider, Pagination, Row } from '@wind/wind-ui'
import React, { useEffect, useState } from 'react'
import { LinkGroupsData } from './data'
import './index.less'
import { LinksTable } from './table'
import { Links } from '@/components/common/links'
import { LinksTableDataSource } from '@/views/Dev/LinksPage/mock.ts'
import { LinksTableColumns } from '@/views/Dev/LinksPage/cfg.ts'
import { printLinks } from './handle/generateLinks'

/**
 * 跳转table组件，旨在测试Links组件在table里面的适用性
 * @author Calvin <yxlu.calvin@wind.com.cn>
 * @returns React.FC
 * @example
 */

const StylePrefix = 'links-table'

const LinkGroup = ({ data, title, useLinks }) => {
  const renderText = (item) => (useLinks ? <Links {...item} /> : item.title)

  return (
    <div>
      <h4>{title}</h4>
      <div className={`${StylePrefix}--link-group`}>
        {data.map((item, index) => (
          <span key={index}>{<span>{renderText(item)}</span>}</span>
        ))}
      </div>
    </div>
  )
}

const LinksPage = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    total: 8000,
    pageSize: 10,
  })

  useEffect(() => {
    printLinks()
  }, [])

  return (
    <div className="links-table-container">
      <Card>
        <Divider />
        <Card>
          {LinkGroupsData.map((item) => (
            <>
              <LinkGroup title={item.title} data={item.data} useLinks={true} />
              <Divider />
            </>
          ))}
        </Card>
      </Card>
      <Divider />
      <Row gutter={12}>
        <Col span={4}>
          <h4>外部单方面更改table内部页码：</h4>
        </Col>
        <Col>
          <Pagination
            {...pagination}
            onChange={(current) => {
              setPagination({ ...pagination, current })
            }}
            onShowSizeChange={(current, pageSize) => {
              setPagination((pagination) => {
                pagination.current = current
                pagination.pageSize = pageSize
                return { ...pagination }
              })
            }}
          />
        </Col>
      </Row>

      <Divider />
      <LinksTable
        columns={LinksTableColumns || []}
        dataSource={LinksTableDataSource || []}
        pagination={{ ...pagination }}
        useLinks={true}
      />
    </div>
  )
}

export default LinksPage
