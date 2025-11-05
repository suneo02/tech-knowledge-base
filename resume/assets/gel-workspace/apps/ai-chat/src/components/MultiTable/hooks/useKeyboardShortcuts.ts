interface KeyboardShortcutsProps {
  onUndo: () => void
  onRedo: () => void
  canUndo: boolean
  canRedo: boolean
  throttleDelay?: number
}

export const useKeyboardShortcuts = ({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  throttleDelay = 100,
}: KeyboardShortcutsProps) => {
  // 创建节流状态
  const lastUndoTime = useRef(0)
  const lastRedoTime = useRef(0)

  // 使用 useCallback 创建稳定的节流函数
  const throttledUndo = useCallback(() => {
    const now = Date.now()
    if (now - lastUndoTime.current >= throttleDelay) {
      onUndo()
      lastUndoTime.current = now
    }
  }, [onUndo, throttleDelay])

  const throttledRedo = useCallback(() => {
    const now = Date.now()
    if (now - lastRedoTime.current >= throttleDelay) {
      onRedo()
      lastRedoTime.current = now
    }
  }, [onRedo, throttleDelay])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 检查是否按下了 Ctrl 键 (Windows) 或 Command 键 (Mac)
      const isCtrlOrCmd = event.ctrlKey || event.metaKey

      if (isCtrlOrCmd) {
        if (event.key === 'z') {
          event.preventDefault() // 阻止默认行为
          if (event.shiftKey) {
            // Ctrl+Shift+Z 重做
            if (canRedo) throttledRedo()
          } else {
            // Ctrl+Z 撤销
            if (canUndo) throttledUndo()
          }
        } else if (event.key === 'y') {
          // Ctrl+Y 重做
          event.preventDefault()
          if (canRedo) throttledRedo()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [canUndo, canRedo, throttledUndo, throttledRedo])

  return {
    throttledUndo,
    throttledRedo,
  }
}
