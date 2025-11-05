import { Card } from '@wind/wind-ui'
import Table from '@wind/wind-ui-table'
import { isNil } from 'lodash'
import React from 'react'

const { HorizontalTable } = Table

function Tables(props) {
  const { info, isLoading, rows, title } = props

  if (isNil(info)) return null

  return (
    <Card title={title}>
      {Object.keys(rows).map((i) => {
        return rows[i].horizontal ? (
          <HorizontalTable
            loading={isLoading}
            title={rows[i].name}
            bordered={'dotted'}
            size={'default'}
            rows={rows[i].columns}
            dataSource={info[i]}
            // @ts-expect-error ttt
            pagination={false}
            style={{
              marginBottom: 10,
            }}
          />
        ) : (
          <Table
            loading={isLoading}
            title={rows[i].name}
            size={'default'}
            columns={rows[i].columns}
            dataSource={info[i]}
            pagination={false}
            style={{
              marginBottom: 10,
            }}
          />
        )
      })}
    </Card>
  )
}

export default Tables
