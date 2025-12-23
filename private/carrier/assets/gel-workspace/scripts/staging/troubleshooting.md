# 故障排查

预发布环境部署的常见问题和解决方案。

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| 502 Bad Gateway | Nginx 配置错误或服务未启动 | `sudo nginx -t && sudo systemctl reload nginx` |
| 依赖安装失败 | 网络问题或缓存损坏 | `pnpm store prune && pnpm i` |
| 构建失败 | TypeScript 错误或依赖冲突 | `npm run tsc` 检查并修复错误 |
| 权限被拒绝 | 文件权限问题 | `sudo chown -R deploy:deploy /var/www/Wind.WFC.Enterprise.Web` |
| 配置测试失败 | Nginx 语法错误 | 查看错误信息并修复配置文件 |

## 日志查看

```bash
# Nginx 错误日志
sudo tail -f /var/log/nginx/error.log

# 部署脚本输出
node scripts/staging/deployNginxConfig.js --verbose
```

## 紧急回滚

```bash
# Nginx 配置回滚
sudo cp /etc/nginx/sites-enabled/frontend.backup.* /etc/nginx/sites-enabled/frontend
sudo nginx -t && sudo systemctl reload nginx
```