// 两层地图，带返回按钮
import { LeftO, LoadingO } from '@wind/icons'
import React from 'react'
import Map from '..'
import intl from '../../../utils/intl'

/**
 * 两层地图组件，带有返回按钮。
 *
 * @param {Object} props - 组件的属性。
 * @param {boolean} props.loading - 是否正在加载数据。
 * @param {Array} props.data - 地图数据。
 * @param {Function} props.onChange - 当选择区域变化时的回调函数。
 * @param {SelectedArea} props.selectedArea - 当前选中的区域信息，包括旧代码和老名称。
 * @returns {React.Component} 返回两层地图组件。
 */

/**
 * @typedef {Object} SelectedArea
 * @property {string|null} oldCode - 选中的区域的旧代码。如果该区域没有旧代码，则为null。
 * @property {string} name - 选中的区域的名称。
 */
const TwolayerMap = (props) => {
  const {
    loading,
    data,
    onChange,
    selectedArea = {
      oldCode: null,
      name: '',
    },
  } = props
  return (
    <div style={{ width: 400, height: 300 }}>
      <div style={{ marginBlockEnd: 20 }}>
        {selectedArea.oldCode ? (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {loading ? <LoadingO size="small" /> : <LeftO onClick={() => !loading && onChange({ oldCode: '', name: '', code: '' })} fontSize={12} />}
            <p style={{ paddingInlineStart: 4, fontSize: 14, fontWeight: 'bolder' }}>{selectedArea.name}</p>
          </div>
        ) : (
          <p style={{ paddingInlineStart: 4, fontSize: 14, fontWeight: 'bolder' }}>{intl('51886', '全国')}</p>
        )}
      </div>
      {data?.length ? <Map area={selectedArea} data={data} loading={loading} onChange={onChange}></Map> : ''}
    </div>
  )
}

export default TwolayerMap
