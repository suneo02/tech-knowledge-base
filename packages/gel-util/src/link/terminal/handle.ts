/**
 * 判断是否是终端命令
 * @param url
 * @returns {boolean} 返回是否为终端命令
 */
export const getIfTerminalCmd = (url: string) => {
  // 终端命令格式：!CommandParam[8514,CompanyCode=${id},SubjectID=4778,grid=${target}]
  // !Page[Minute,1810,HK]
  // regex !开始 [ ] 结束, 或者 !CommandParam 开始 或者 !Page 开始
  // 或者 !开始 ( ) 结束
  if (!url) return false;

  const commandParamRegex = /^!CommandParam\[(.*?)\]$/;
  const pageRegex = /^!Page\[(.*?)\]$/;
  const simpleCommandRegex = /^!.*?(?:\[(.*?)\]|\((.*?)\))$/;

  // 按优先级尝试匹配不同格式
  if (commandParamRegex.test(url)) {
    return true;
  }

  if (pageRegex.test(url)) {
    return true;
  }

  // 最后尝试简单的![]格式
  return simpleCommandRegex.test(url);
};
