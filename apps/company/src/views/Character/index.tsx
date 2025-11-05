/**
 * page 人物详情页
 * Created by Calvin
 *
 * @format
 */
import { TreeModuleName } from '@/store/group'
import React, { useEffect } from 'react'
import { useUserInfoStore } from '../../store/userInfo'
import LayoutNavAndScrollContent from '@/components/layout/LayoutNavAndScrollContent.tsx'

const CharacterPage = () => {
  const getUserInfo = useUserInfoStore((state) => state.getUserInfo)

  // @ts-expect-error ttt
  useEffect(async () => {
    getUserInfo()
  }, [])

  return <LayoutNavAndScrollContent moduleName={TreeModuleName.Character}></LayoutNavAndScrollContent>
}

export default CharacterPage
