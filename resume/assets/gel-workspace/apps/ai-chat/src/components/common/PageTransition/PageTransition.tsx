import { forwardRef, ReactNode, useCallback, useImperativeHandle, useState } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import './PageTransition.less'

interface RouteConfig {
  path: string
  element: ReactNode
}

interface PageTransitionProps {
  /**
   * 路由配置
   */
  routes: RouteConfig[]
  /**
   * 初始路径
   */
  initialPath?: string
  /**
   * 路径变化回调
   */
  onPathChange?: (path: string) => void
  /**
   * 动画持续时间（毫秒）
   */
  transitionDuration?: number
  /**
   * 自定义样式
   */
  style?: React.CSSProperties
  /**
   * 自定义类名
   */
  className?: string
}

// 导出页面过渡引用类型
export interface PageTransitionRef {
  /**
   * 前进到指定路径
   */
  next: (path: string) => void
  /**
   * 回退到指定路径
   */
  back: (path: string) => void
  /**
   * 获取当前路径
   */
  getCurrentPath: () => string
}

/**
 * 页面过渡组件
 * 提供页面间平滑过渡动画效果，支持前进和后退两种动画方向
 * 使用自定义路由逻辑，避免与应用程序的路由器冲突
 *
 * @example
 * ```tsx
 * const transitionRef = useRef<PageTransitionRef>(null);
 *
 * const routes = [
 *   { path: '/', element: <HomePage /> },
 *   { path: '/detail', element: <DetailPage /> }
 * ];
 *
 * // 前进到详情页
 * const goToDetail = () => transitionRef.current?.next('/detail');
 *
 * // 返回首页
 * const goBack = () => transitionRef.current?.back('/');
 *
 * return (
 *   <PageTransition
 *     ref={transitionRef}
 *     routes={routes}
 *     initialPath="/"
 *     onPathChange={(path) => console.log('当前路径:', path)}
 *   />
 * );
 * ```
 */
export const PageTransition = forwardRef<PageTransitionRef, PageTransitionProps>(
  ({ routes, initialPath = '/', onPathChange, transitionDuration = 300, style, className }, ref) => {
    // 当前路径
    const [currentPath, setCurrentPath] = useState<string>(initialPath)
    // 动画方向
    const [direction, setDirection] = useState<'forward' | 'backward'>('forward')

    // 前进到指定路径
    const next = useCallback(
      (path: string) => {
        if (path === currentPath) return

        console.log('PageTransition - 前进到:', path)
        // 设置动画方向为前进
        setDirection('forward')
        // 更新当前路径
        setTimeout(() => {
          setCurrentPath(path)
          onPathChange?.(path)
        }, 0)
      },
      [currentPath, onPathChange]
    )

    // 回退到指定路径
    const back = useCallback(
      (path: string) => {
        if (path === currentPath) return

        console.log('PageTransition - 回退到:', path)
        // 设置动画方向为后退
        setDirection('backward')
        // 更新当前路径
        setTimeout(() => {
          setCurrentPath(path)
          onPathChange?.(path)
        }, 0)
      },
      [currentPath, onPathChange]
    )

    // 获取当前路径
    const getCurrentPath = useCallback(() => currentPath, [currentPath])

    // 暴露方法给父组件
    useImperativeHandle(
      ref,
      () => ({
        next,
        back,
        getCurrentPath,
      }),
      [next, back, getCurrentPath]
    )

    // 查找当前路径对应的路由配置
    const currentRoute = routes.find((route) => route.path === currentPath) || routes[0]

    // 合并样式
    const containerStyle: React.CSSProperties = {
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      ...style,
    }

    return (
      <div className={`page-transition ${className || ''}`} style={containerStyle}>
        <div className="page-transition-container">
          <TransitionGroup>
            <CSSTransition
              key={currentPath}
              timeout={transitionDuration}
              classNames={{
                enter: direction === 'backward' ? 'page-enter is-back' : 'page-enter',
                enterActive: direction === 'backward' ? 'page-enter-active is-back' : 'page-enter-active',
                exit: direction === 'backward' ? 'page-exit is-back' : 'page-exit',
                exitActive: direction === 'backward' ? 'page-exit-active is-back' : 'page-exit-active',
              }}
              unmountOnExit
            >
              <div className="page-transition-content">{currentRoute?.element}</div>
            </CSSTransition>
          </TransitionGroup>
        </div>
      </div>
    )
  }
)
