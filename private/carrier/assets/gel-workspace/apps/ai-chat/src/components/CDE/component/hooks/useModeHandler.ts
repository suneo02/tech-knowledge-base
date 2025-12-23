import { useResetState } from 'ahooks'
import { CDEModalMode } from '../type'

/**
 * 处理显示模式切换的自定义Hook
 */
export const useModeHandler = () => {
  const [mode, setMode, resetMode] = useResetState<CDEModalMode>('filter')

  const handleReturn = () => {
    setMode('filter')
  }

  return {
    mode,
    resetMode,
    handleReturn,
  }
}
