import { useEffect } from 'react'
import { fetchUserInfo, selectUserInfoFetched, useAppDispatch, useAppSelector } from '@/store'

export const useInitUserInfo = () => {
  const dispatch = useAppDispatch()
  const isFetched = useAppSelector(selectUserInfoFetched)

  useEffect(() => {
    if (!isFetched) dispatch(fetchUserInfo())
  }, [isFetched, dispatch])
}
