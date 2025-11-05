#!/bin/bash

# 设置变量
CURRENT_BRANCH=$(git symbolic-ref --short HEAD)
REPO_URL=$(git remote get-url origin)
REPO_NAME=$(echo $REPO_URL | sed -E 's/.*[\/:]([^\/]+)\/([^\/]+)\.git/\2/')
OWNER=$(echo $REPO_URL | sed -E 's/.*[\/:]([^\/]+)\/([^\/]+)\.git/\1/')
TITLE="提交PR：从${CURRENT_BRANCH}合并到master"
DESCRIPTION="自动创建的PR，将${CURRENT_BRANCH}分支合并到master分支"

# 确保所有更改已提交
echo "检查是否有未提交的更改..."
if [[ -n $(git status -s) ]]; then
  echo "存在未提交的更改，请先提交或暂存您的更改。"
  exit 1
fi

# 推送当前分支
echo "推送当前分支 ${CURRENT_BRANCH} 到远程..."
git push origin $CURRENT_BRANCH

# 检查是否安装了gitee命令行工具
if ! command -v gitee &> /dev/null; then
  echo "未找到gitee命令行工具，请先安装。"
  echo "可以参考 https://gitee.com/oschina/gitee-cli 安装指南。"
  echo "或者您可以直接在Gitee网页上创建PR：https://gitee.com/$OWNER/$REPO_NAME/pulls/new"
  exit 1
fi

# 使用gitee CLI创建PR
echo "创建PR从 ${CURRENT_BRANCH} 到 master..."
gitee pull-request create \
  --repo $REPO_NAME \
  --owner $OWNER \
  --head $CURRENT_BRANCH \
  --base master \
  --title "$TITLE" \
  --body "$DESCRIPTION"

echo "PR创建完成！请在Gitee网页上查看并处理PR。"
echo "PR链接：https://gitee.com/$OWNER/$REPO_NAME/pulls" 