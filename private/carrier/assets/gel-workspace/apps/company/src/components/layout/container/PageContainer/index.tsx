import React, { useRef } from 'react'
import styles from './index.module.less'
import { FloatButton } from 'antd'
import { Spin } from '@wind/wind-ui'
import BreadCrumb, { BreadCrumbProps } from '@/components/breadCrumb'
import Result, { LazyResultProps } from '@/components/Result'

const PREFIX = 'page-container'

type CustomError = Error & {
  response?: { data?: { errorCode?: string | number; message?: string } }
  code?: string
}

const generateResultProps = (error: CustomError | null): LazyResultProps | null => {
  if (!error) return null

  const errorCode = error.response?.data?.errorCode
  const errorMsg = error.response?.data?.message || error.message

  if (errorCode === 10011) {
    return {
      status: '404', // Using '404' as per user's latest change for consistency
      title: '登录状态已过期',
      subTitle: '为保障账户安全，请重新登录。',
    }
  }

  // Default error
  return {
    status: '404', // Using '404' for generic errors
    title: '请求失败',
    subTitle: errorMsg,
  }
}

interface PageContainerProps {
  children: React.ReactNode
  loading?: boolean
  error?: CustomError | null
  isEmpty?: boolean
  breadCrumb?: BreadCrumbProps
}

const PageContainer = ({ children, loading, error, isEmpty, breadCrumb }: PageContainerProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  if (isEmpty) {
    return (
      <Result
        status="no-data"
        title="暂无数据"
        subTitle="请确认数据是否正确"
        data-uc-id="_hAaalCcpT"
        data-uc-ct="result"
      />
    )
  }
  const resultProps = generateResultProps(error || null)

  const renderContent = () => {
    if (resultProps) {
      return <Result {...resultProps} data-uc-id="OxOdlFFt0u" data-uc-ct="result" />
    }
    return children
  }

  return (
    <div className={styles[`${PREFIX}`]}>
      {breadCrumb && <BreadCrumb {...breadCrumb} />}
      {/* @ts-expect-error wind-ui antd spin antd antd Button*/}
      <Spin spinning={!!loading}>
        <div className={styles[`${PREFIX}-wrapper`]} ref={wrapperRef}>
          <div className={styles[`${PREFIX}-content`]}>{renderContent()}</div>
          <FloatButton.BackTop target={() => wrapperRef.current} />
        </div>
      </Spin>
    </div>
  )
}

PageContainer.displayName = 'PageContainer'

export default PageContainer
