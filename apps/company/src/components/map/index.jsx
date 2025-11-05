import React, { useEffect, useState } from 'react'
import { Map, Polygon } from '@wind/Wind.Map.mini'
import { renderToString } from 'react-dom/server'
import { Card, Spin } from '@wind/wind-ui'
import intl from '../../utils/intl'
import { wftCommon } from '../../utils/utils'

/**
 * @param area: {oldCode: string, name: string, code: string}
 */
export default (props) => {
  // const [data, setData] = useState()
  const [batch, setBatch] = useState({
    code: '156000000',
    direction: '2',
  })
  const initOption = {
    type: 'polygon',
    style: {
      color: ['#F0F6FA', '#E8F3FA', '#D5EAF7', '#C9E2F2', '#B9D8ED', '#A1CBE6', '#85BCDE', '#62A5CC'],
      outlineColor: '#4f7b7c',
      selectedColor: '#ffe58a',
      tooltipColor: '#ffe58a',
      tooltip: {
        formatter: (e) => {
          return renderToString(
            <Card size="small" title={e.name}>
              <div>
                <span style={{ color: '#333' }}>{intl('208504', '企业数量')}</span>
                <span style={{ fontWeight: 'bold', marginInlineStart: 10 }}>{wftCommon.formatMoneyComma(e.value)}</span>
              </div>
            </Card>
          )
        },
      },
    },
    visible: true,
    layerInfo: {
      autoFit: true,
    },

    event: {
      click: (e) => {
        if (e.geoLevel > 2) return
        props.onChange({ oldCode: e.adcode, name: e.name, code: e.area_code })
      },
    },
  }

  useEffect(() => {
    const direction = props.area?.oldCode ? 'down' : '2'
    const params = { code: props.area?.oldCode || '156000000', direction }
    setBatch(params)
  }, [props.area])

  return (
    <Spin spinning={props.loading} tip={`${intl('132761', '加载中')}...`}>
      <Map style={{ width: '100%', height: '100%' }} lang={window.en_access_config ? 'en' : 'cn'}>
        <Polygon id="da" {...initOption} data={props.data} batch={batch}></Polygon>
      </Map>
    </Spin>
  )
}
