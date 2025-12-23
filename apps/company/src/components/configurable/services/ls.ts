export const getLocalStorage = (key: string) => {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : null
}

export const setLocalStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data))
}
