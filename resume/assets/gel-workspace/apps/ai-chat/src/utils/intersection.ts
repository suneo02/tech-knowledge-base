/**
 * 监听视图是否在视口内
 * Created by Calvin
 *
 * @format
 */

export const useIntersection = (
  inCallback: (entry: IntersectionObserverEntry) => void,
  outCallback?: () => void,
  options: IntersectionObserverInit = {
    root: null,
    rootMargin: '0px',
    threshold: 1,
  }
) => {
  let status = false

  const handleIntersection = (entries) => {
    const entry = entries[0]
    if (entry.isIntersecting) {
      console.log('🚀 ~ handleIntersection ~ isIntersecting:', entry)
      status = true
      setTimeout(() => {
        if (status) {
          if (inCallback) inCallback(entry)
        }
      }, 200)
    } else {
      status = false
      if (outCallback) outCallback()
    }
  }

  const observable = new IntersectionObserver(handleIntersection, options)

  return {
    observable,
  }
}
