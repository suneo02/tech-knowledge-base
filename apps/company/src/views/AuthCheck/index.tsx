// @ts-nocheck
import React from 'react'
import Result from '@/components/Result'
import { useAuth } from './useAuth'

/**
 * @description 南京政务平台自动登录检查组件
 */
const AuthCheck: React.FC = () => {
  const { title, handleDebugClick } = useAuth()

  return (
    <div
      style={{
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
      onClick={handleDebugClick}
      data-uc-id="byIyDptI4C_"
      data-uc-ct="div"
    >
      <Result status="developing" title={title} data-uc-id="EGbONOFWgSG" data-uc-ct="result" />
    </div>
  )
}

export default AuthCheck
