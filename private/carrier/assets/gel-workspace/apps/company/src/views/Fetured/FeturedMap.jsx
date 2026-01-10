import React, { memo, useState } from 'react'
import { Map, Polygon } from '@wind/Wind.Map.mini'
import { renderToString } from 'react-dom/server'
import { wftCommon } from '../../utils/utils'
import { Button } from '@wind/wind-ui'
import { UndoO } from '@wind/icons'
import intl from '../../utils/intl'
import { useEffect } from 'react'
import { globalAreaTree } from '../../utils/areaTree'

const DemoMap = memo((props) => {
  const { list = [], code = '156000000', area_code, direction = '2', isDisplayBack, onBack, onClick } = props
  console.log('🚀 ~ DemoMap ~ props:', props)
  let province = globalAreaTree.find((i) => i.code == area_code)?.node || globalAreaTree
  const end = code == '156000000' ? 6 : 8
  const initOption = {
    type: 'polygon',
    style: {
      color: ['#F0F6FA', '#E8F3FA', '#D5EAF7', '#C9E2F2', '#B9D8ED', '#A1CBE6', '#85BCDE', '#62A5CC'],

      outlineColor: '#4f7b7c',
      selectedColor: '#ffe58a',
      tooltipColor: '#ffe58a',
      tooltip: {
        formatter: (e) => {
          console.log('🚀 ~ DemoMap ~ e:', e)
          let str = renderToString(
            <div style={{ lineHeight: '26px' }}>
              <p style={{ borderBottom: '1px solid #ccc' }}>
                {window.en_access_config ? province?.find((i) => i.code == e.area_code.slice(0, end))?.nameEn : e.name}
              </p>

              <p>
                {intl('208504', '企业数量') + (window.en_access_config ? ':' : '：')}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{e.value ? wftCommon.formatMoneyComma(e.value) : 0}
                {window.en_access_config ? '' : '（家）'}
              </p>
            </div>
          )
          return str
        },
      },
    },
    visible: true,
    batch: {
      code: code, //四川
      direction: direction, //省级要改为down
    },
    // layerInfo: {
    //   name: '各省人均可支配收入',
    //   autoFit: true,
    // },
    data: list,
    event: {
      click: (a, b, c) => {
        // console.log("🚀 ~ DemoMap ~ (a, b, c:", a, b, c)
        if (a.geoLevel < 3) {
          //只到省级
          onClick(a, b)
        }
      },
    },
  }
  return (
    <div style={{ width: '500px', height: '300px', display: 'inline-block' }}>
      {isDisplayBack ? (
        <Button
          className="mapBtn"
          icon={<UndoO data-uc-id="ewakMJ2gRy" data-uc-ct="undoo" />}
          onClick={() => {
            onBack()
          }}
          data-uc-id="vDEr_oqaa"
          data-uc-ct="button"
        >
          {intl('464221', '返回')}{' '}
        </Button>
      ) : (
        <></>
      )}
      <Map style={{ width: '100%', height: '100%' }}>
        <Polygon id="PeopleAverageIncome" {...initOption}></Polygon>
      </Map>
    </div>
  )
})
export default DemoMap
