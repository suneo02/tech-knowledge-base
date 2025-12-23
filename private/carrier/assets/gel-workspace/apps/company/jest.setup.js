// 添加 Jest DOM 扩展
require('@testing-library/jest-dom')

// Mock URLSearchParams
global.URLSearchParams = class URLSearchParams {
  constructor() {
    this.params = new Map()
  }

  append(key, value) {
    this.params.set(key, value)
  }

  toString() {
    return Array.from(this.params.entries())
      .map(([key, value]) => `${key}=${value}`)
      .join('&')
  }
}

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://test.com',
  },
  writable: true,
})

// Mock window.en_access_config
window.en_access_config = false
