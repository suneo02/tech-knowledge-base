#!/bin/bash

# 设置变量
CURRENT_BRANCH=$(git symbolic-ref --short HEAD)
REPO_URL=$(git remote get-url origin)
REPO_NAME=$(echo $REPO_URL | sed -E 's/.*[\/:]([^\/]+)\/([^\/]+)\.git/\2/')
OWNER=$(echo $REPO_URL | sed -E 's/.*[\/:]([^\/]+)\/([^\/]+)\.git/\1/')
TITLE="提交PR：从${CURRENT_BRANCH}合并到master"
DESCRIPTION=$(cat <<EOL
## 问题描述

// 请在这里填写问题描述

## 更新内容

// 请列举更新内容

## 测试情况

- 自测：// 如何测试
- 集成测试：在 staging 环境部署后，通过 API 测试工具发送 100 次请求，无异常报错。
- 覆盖率：相关代码单元测试覆盖率提升至 95%。

## 文档更新
- [ ] 更新《说明文档》
- [ ] 更新《API 接口文档》

## 其他说明
- 依赖变更：// 列举新增的第三方库
- 兼容性：是否支持 Chrome 83 以下版本 是/否
- 截图/演示：最少提供2张截图，用于展示新功能
EOL
)

# URL编码函数
urlencode() {
  local string="${1}"
  local data=$(echo -n "$string" | xxd -p | tr -d '\n' | sed 's/../%&/g')
  echo "$data"
}

# 确保所有更改已提交
echo "检查是否有未提交的更改..."
if [[ -n $(git status -s) ]]; then
  echo "存在未提交的更改，请先提交或暂存您的更改。"
  exit 1
fi

# 推送当前分支
echo "推送当前分支 ${CURRENT_BRANCH} 到远程..."
git push origin $CURRENT_BRANCH

# 编码描述用于URL
ENCODED_DESCRIPTION=$(urlencode "$DESCRIPTION")
ENCODED_TITLE=$(urlencode "$TITLE")

echo "========================================"
echo "当前分支已推送到远程仓库: ${CURRENT_BRANCH}"
echo "========================================"
echo "【创建PR选项1】："
echo "如果目标分支(master)设置了'评审模式'的保护分支，可以直接推送创建PR："
echo "git push origin ${CURRENT_BRANCH}:master"
echo ""
echo "【创建PR选项2】："
echo "通过浏览器手动创建PR，点击下方链接："
# 使用Gitee官方文档推荐的URL格式
PR_URL="https://gitee.com/$OWNER/$REPO_NAME/pulls/new?source_branch=$CURRENT_BRANCH&target_branch=master"
echo $PR_URL
echo "========================================"

# 询问用户选择哪种方式创建PR
echo "您想使用哪种方式创建PR？"
echo "1. 直接尝试推送到master分支（如已设置评审模式，将自动创建PR）"
echo "2. 打开浏览器手动创建PR"
read -p "请输入选项 (1/2): " choice

case $choice in
  1)
    echo "正在尝试推送到master分支..."
    git push origin ${CURRENT_BRANCH}:master
    ;;
  2)
    echo "正在打开浏览器..."
    # 尝试自动打开浏览器
    if command -v open &> /dev/null; then
      open "$PR_URL"
    elif command -v xdg-open &> /dev/null; then
      xdg-open "$PR_URL"
    elif command -v start &> /dev/null; then
      start "$PR_URL"
    else
      echo "无法自动打开浏览器，请手动复制链接访问。"
    fi
    ;;
  *)
    echo "选项无效，请手动创建PR。"
    ;;
esac 