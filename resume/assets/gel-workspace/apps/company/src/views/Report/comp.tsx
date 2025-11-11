import React from 'react'
import Result from '@/components/Result'

export const ReportDeveloping: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div style={{ height: 'calc(100vh - 100px)', alignItems: 'center', display: 'flex' }}>
      <Result status={'developing'} title={`${title}开发中, 敬请期待!`} data-uc-id="ku2ZAGADeD" data-uc-ct="result" />
    </div>
  )
}

export const ReportUnlyInClient: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div style={{ height: 'calc(100vh - 100px)', alignItems: 'center', display: 'flex' }}>
      <Result
        status={'data-limit'}
        title={<span>{title}仅支持Wind终端使用</span>}
        data-uc-id="V98DJICJ-3"
        data-uc-ct="result"
      />
    </div>
  )
}
