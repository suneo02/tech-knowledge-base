import { useEffect, useRef } from 'react'
import { useIntersection } from '../../utils/intersection'
import { Button, Spin } from '@wind/wind-ui'
import { Nodata } from '../../utils/utils'
import intl from '../../utils/intl'
import './CardList.less'

/**
 * CardList组件用于显示搜索结果列表,包含滚动加载、错误处理、超限处理等功能，卡片自定义。
 *
 * @param {Object} props - 组件的props对象。
 * @param {String} props.errorCode - 错误代码，用于判断显示哪种错误信息。
 * @param {Boolean} props.loading - 是否正在加载数据。
 * @param {Boolean} props.loadingMore - 是否正在加载更多数据。
 * @param {Array} props.data - 数据列表。
 * @param {Function} props.refetch - 重新获取数据的函数。
 * @param {Function} props.render - 渲染每个数据项的函数。
 *
 * @returns {React.ReactElement} 返回一个React元素，用于显示搜索结果列表。
 */
export const CardList = ({ errorCode, loading, loadingMore, data, refetch, render = () => {}, onLoadMore }) => {
  const ref = useRef(null)
  const { observable } = useIntersection(() => {
    onLoadMore()
  })

  useEffect(() => {
    if (ref.current) {
      observable.observe(ref.current)
    }
    return () => {
      if (ref.current) observable.unobserve(ref.current)
    }
  }, [loading])

  let showResult = ''
  switch (errorCode) {
    case '-2':
      showResult = (
        <div className="loading-failed">
          <p>{intl('313373', '加载失败，请重试')}</p>
          <p>
            <Button size="default" type="primary" onClick={refetch}>
              {intl('138836', '确定')}
            </Button>
          </p>
        </div>
      )
      break
    case '-9':
      showResult = <div className="no-data">{intl('247063', '系统繁忙，请稍后再试')}</div>
      break
    case '-13':
      showResult = (
        <div className="no-data">{intl('317013', '您的查询数量已超限，请明日再试。若有疑问，请联系客户经理。')}</div>
      )
      break
    default:
      // 如果没有错误代码，则显示数据列表或无数据提示
      showResult =
        data && data.length ? (
          data.map((item, index) => {
            return <div key={index}>{render(item, index)}</div>
          })
        ) : loading ? (
          <div style={{ height: '100px' }}> </div>
        ) : (
          <Nodata />
        )
  }
  // 返回一个包含数据列表或错误信息的Spin组件
  return (
    <div className="div_List">
      <Spin spinning={loading && !loadingMore}>{showResult}</Spin>
      <div ref={ref}>{loadingMore ? <Spin spinning={true} /> : <div style={{ height: '12px' }}> </div>}</div>
    </div>
  )
}
