/**
 * 监听视图是否在视口内
 * Created by Calvin
 *
 * @format
 */

export const useIntersection = (inCallback, outCallback) => {
  let status = false

  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5,
  }

  const handleIntersection = (entries) => {
    const entry = entries[0]
    if (entry.isIntersecting) {
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
