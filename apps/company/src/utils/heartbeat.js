import axios from '@/api/index'

class Heartbeat {
  timeId = undefined
  status = 'off' // on : 开启心跳测试 off：关闭心跳测试
  pollingTime = 10 * 60 //促活接口间隔时间
  id = Math.ceil(Math.random() * 10000)

  async pollFetch() {
    while (true) {
      try {
        await this.promiseTimeout(this.heart, this.pollingTime)
      } catch (err) {
        await this.promiseTimeout(this.heart, this.pollingTime)
      }
    }
  }

  heart() {
    return axios.request({ url: `${window.location.origin}/wind.ent.web/open/verify/refreshTime` })
  }

  promiseTimeout(func, delayTime) {
    // 响应时间处理逻辑
    return new Promise((resolve) => {
      this.timeId = setTimeout(() => {
        func()
        resolve()
      }, delayTime * 1000)
    })
  }

  start() {
    if (this.status === 'on') return
    this.status = 'on'
    this.heart()
    this.pollFetch()
  }

  stop() {
    this.status = 'off'
    clearTimeout(this.timeId)
  }

  logout() {
    if ((this.id = localStorage.getItem('heartbeatId'))) {
      //关闭的是正在心跳检测的页面
      localStorage.setItem('heartbeatId', '')
    }
  }

  init() {
    localStorage.setItem('heartbeatId', this.id)
    this.start()
    window.addEventListener('storage', (e) => {
      let { key, newValue } = e
      if (key !== 'heartbeatId') return
      if (newValue) {
        //如果新增页面，暂停心跳
        this.stop()
      } else {
        //有其他tab页关闭
        setTimeout(
          () => {
            this.start()
            localStorage.setItem('heartbeatId', this.id)
          },
          Math.floor(Math.random() * 120 * 1000)
        )
      }
    })
    window.addEventListener('beforeunload', this.logout)
  }
}

const heartbeat = new Heartbeat()

export { heartbeat }
export default heartbeat
