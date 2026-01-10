import React from 'react'
import { Card, Col, Row } from '@wind/wind-ui'
import Table from '@wind/wind-ui-table'
import intl from '../../../../utils/intl'

const PublicFundSize = ({
  eachTableKey,
  fundSizeDataPie,
  fundSizeData,
  shouldRenderContent,
  ChartComp,
}: {
  eachTableKey: string
  fundSizeDataPie: any
  fundSizeData: any
  shouldRenderContent: boolean
  ChartComp: any
}) => {
  const pieStr = fundSizeDataPie ? (
    <Row gutter={16}>
      <Col span={12}>
        {shouldRenderContent ? (
          <React.Suspense fallback={<div></div>}>
            {<ChartComp data={fundSizeDataPie.pie} waterMark={false} style={{ height: 400 }} />}
          </React.Suspense>
        ) : (
          ''
        )}
      </Col>
      <Col span={12}>
        <Table
          style={{ marginTop: '32px' }}
          key={'fundSizeDataPie'}
          columns={[
            {
              dataIndex: 'fundTypeName',
              title: intl('66063', '基金类型'),
            },
            {
              dataIndex: 'assets',
              title: intl('18827', '资产净值合计(亿元)'),
              align: 'right',
            },
            {
              dataIndex: 'assetsPercentage',
              title: intl('105862', '占比'),
              align: 'right',
            },
          ]}
          pagination={false}
          dataSource={fundSizeDataPie.list}
          data-uc-id="SMNosOT1Fu"
          data-uc-ct="table"
          data-uc-x={'fundSizeDataPie'}
        />
      </Col>
    </Row>
  ) : (
    ''
  )

  return (
    <Card
      data-custom-id={eachTableKey}
      key={eachTableKey}
      className="vtable-container card-fundsize"
      /*@ts-expect-error ttt*/
      multiTabId={eachTableKey}
      divider={'none'}
      title={intl('37109', '基金规模')}
    >
      {fundSizeDataPie && shouldRenderContent ? pieStr : ''}
      {fundSizeData && shouldRenderContent ? (
        <React.Suspense fallback={<div></div>}>
          {<ChartComp data={fundSizeData} waterMark={false} style={{ height: 400 }} />}
        </React.Suspense>
      ) : (
        ''
      )}
    </Card>
  )
}

export default PublicFundSize

