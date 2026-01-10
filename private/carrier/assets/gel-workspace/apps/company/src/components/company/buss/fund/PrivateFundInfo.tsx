import React from 'react'
import { Card, Col, Row } from '@wind/wind-ui'
import Table from '@wind/wind-ui-table'
import intl from '../../../../utils/intl'

const { HorizontalTable } = Table

const PrivateFundInfo = ({
  eachTableKey,
  privateFundBase,
  privateFundProduct,
  privateFundProductFormance,
  shouldRenderContent,
  ChartComp,
}: {
  eachTableKey: string
  privateFundBase: any
  privateFundProduct: any
  privateFundProductFormance: any
  shouldRenderContent: boolean
  ChartComp: any
}) => {
  const baseTable = privateFundBase && shouldRenderContent ? (
    <HorizontalTable
      bordered={'default'}
      className=""
      loading={false}
      title={<span>{intl('205468', '基本信息')}</span>}
      rows={privateFundBase.rows}
      dataSource={privateFundBase.list}
      data-uc-id="YGlbBuf429"
      data-uc-ct="horizontaltable"
    ></HorizontalTable>
  ) : null

  const pieStr = privateFundProduct && shouldRenderContent ? (
    <Row gutter={16}>
      <Col span={12}>
        <React.Suspense fallback={<div></div>}>
          {<ChartComp data={privateFundProduct.pie} waterMark={false} style={{ height: 400 }} />}
        </React.Suspense>
      </Col>
      <Col span={12}>
        <Table
          style={{ marginTop: '12px', marginBottom: '32px' }}
          key={'privateFundBasePie'}
          columns={[
            {
              dataIndex: 'strategyType',
              title: intl('228375', '产品策略'),
            },
            {
              dataIndex: 'productNumber',
              title: intl('2491', '产品数量'),
              align: 'right',
            },
          ]}
          pagination={false}
          dataSource={privateFundProduct.list}
          data-uc-id="9NDynugHth"
          data-uc-ct="table"
          data-uc-x={'privateFundBasePie'}
        />
      </Col>
    </Row>
  ) : null

  const performanceTable = shouldRenderContent && privateFundProductFormance ? (
    <Table
      style={{ marginTop: '12px' }}
      key={'privateFundBaseTable'}
      columns={privateFundProductFormance.columns}
      pagination={false}
      dataSource={privateFundProductFormance.list}
      data-uc-id="Y28L-uk00H"
      data-uc-ct="table"
      data-uc-x={'privateFundBaseTable'}
    />
  ) : null

  return (
    <>
      {baseTable}
      <Card
        data-custom-id={eachTableKey}
        key={'privateFundProductFormance'}
        /*@ts-expect-error ttt*/
        multiTabId={eachTableKey}
        className="vtable-container private-fund-card"
        divider={'none'}
        title={intl('37254', '产品结构')}
      >
        {pieStr}
        {performanceTable}
      </Card>
    </>
  )
}

export default PrivateFundInfo

