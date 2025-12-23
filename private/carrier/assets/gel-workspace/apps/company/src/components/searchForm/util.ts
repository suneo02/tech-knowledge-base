export const encryptSearchHistory = ({
  nameFirst,
  nameSecond,
  valueFirst,
  valueSecond,
}: {
  nameFirst: string
  nameSecond: string
  valueFirst: string
  valueSecond: string
}) => {
  const name = `${nameFirst}  —>  ${nameSecond}`
  const value = `${valueFirst},${valueSecond}`
  return { name, value }
}

export const decryptSearchHistory = (name: string, value: string) => {
  const [nameFirst, nameSecond] = name.split('  —>  ')
  const [valueFirst, valueSecond] = value.split(',')
  return { nameFirst, nameSecond, valueFirst, valueSecond }
}
