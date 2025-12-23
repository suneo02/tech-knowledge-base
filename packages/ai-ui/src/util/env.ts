export const getNewWorkflow = () => {
  return localStorage.getItem('newWorkflow') !== null ? localStorage.getItem('newWorkflow') : true
}

export const setNewWorkflow = (newWorkflow: boolean) => {
  localStorage.setItem('newWorkflow', newWorkflow.toString())
}

// 是否是新的异步流程，测试用，整体切换完去掉
export const NEW_WORKFLOW = getNewWorkflow()
