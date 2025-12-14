export const useWorkerUtils = () => {
  let worker
  /**  */
  const sendMessage = (params) => {
    worker = new Worker(new URL('./worker.js', import.meta.url))
    return new Promise((resolve) => {
      worker.postMessage({
        type: 'group',
        ...params,
      })
      worker.onmessage = (event) => {
        // console.log('🚀 ~multi process end ~ ')
        console.log('   message:', event.data)
        resolve(event.data)
      }
    })
  }

  return {
    sendMessage,
  }
}
