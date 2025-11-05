import { getServerApiByConfig } from '@/api/serverApi'
import intl from '@/utils/intl'
import { Result, Spin } from '@wind/wind-ui'
import { cloneDeep } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { wftCommon } from '../../../utils/utils'
import BarChart from '../../wind/WindChart/BarChart'
import TwolayerMap from '../TwolayerMap'
import Search from './Search'

export default (props) => {
  const [data, setData] = useState()
  const [loading, setLoading] = useState(true)
  const [selectedArea, setSelectedArea] = useState({ oldCode: '', name: '', code: '' })
  const [options, setOptions] = useState([])

  const memoData = useMemo(() => {
    let _data = {}
    data?.forEach((element, index) => {
      if (index > 9) return
      _data[element.name] = element.value
    })
    return _data
  }, [data])

  const getApi = async () => {
    setLoading(true)
    const { Data } = await getServerApiByConfig({
      api: props.api, params: {
        areaCode: selectedArea?.code || ''
      }, apiExtra: props.apiExtra
    }).finally(() => setTimeout(() => setLoading(false), 100))
    if (Data?.list) {
      const _data = Data?.list?.map((res) => ({
        name: res.key, oldCode: res.standardCode, value: res.doc_count, title: res.key, code: res.areaCode
      }))
      setData(_data)
      if (!selectedArea?.code) {
        setOptions(_data)
      }
      if (window.en_access_config) wftCommon.zh2en(_data, (res) => {
        setData(res)
        if (!selectedArea?.code) {
          setOptions(res)
        }
      })
    }
  }

  useEffect(() => {
    getApi()
  }, [selectedArea])

  return (<div style={{ width: '100%', minHeight: 460, display: 'flex', justifyContent: 'center' }}>
    <div style={{ height: '100%', width: '100%', maxWidth: 1200 }}>
      <div className="search-container" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {data ? <Search value={selectedArea.oldCode} onChange={setSelectedArea} options={options} /> : null}
      </div>
      <div className="content-container"
           style={{ display: 'flex', height: 'calc(100% - 28px)', width: '100%', justifyContent: 'space-between' }}>
        <div style={{ flex: 2, display: 'flex', justifyContent: 'center' }}>
          {/* 二层地图 */}
          <TwolayerMap
            loading={loading}
            selectedArea={selectedArea}
            onChange={setSelectedArea}
            data={cloneDeep(data)?.map((res) => ({ ...res, code: res.oldCode }))}
          ></TwolayerMap>
        </div>

        <div style={{ flex: 3, width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Spin spinning={loading} tip={`${intl('132761', '加载中')}...`} style={{ width: '100%' }}>
            <div style={{ width: 600, height: 400 }}>
              {data?.length === '0' && <Result status={'no-data'} title={intl('132725', '暂无数据')} />}
              {data?.length && (<>
                <p style={{
                  textAlign: 'left', fontSize: 14, fontWeight: 'bolder', marginInlineStart: 22
                }}>{intl(393233, '集团企业数量区域Top10')}</p>
                <BarChart
                  local={window.en_access_config ? 'en' : 'cn'}
                  type="bar"
                  meta={{
                    name: intl('208504', '企业数量'), unit: intl('138901', '家')
                  }}
                  chartData={memoData}
                />
              </>)}
            </div>
          </Spin>
        </div>
      </div>
    </div>
  </div>)
}
