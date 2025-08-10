# 🚀 DMARC Worker Enhanced - 部署指南

## 📋 部署前准备

### 1. GitHub 仓库设置
1. 创建新的 GitHub 仓库
2. 将 `dmarc-worker-enhanced` 文件夹中的所有文件上传到仓库

### 2. Cloudflare 配置
1. 登录 Cloudflare Dashboard
2. 获取以下信息：
   - Account ID
   - API Token (需要 Workers 编辑权限)

### 3. GitHub Secrets 配置
在 GitHub 仓库设置中添加以下 Secrets：
- `CLOUDFLARE_API_TOKEN`: 你的 Cloudflare API Token
- `CLOUDFLARE_ACCOUNT_ID`: 你的 Cloudflare Account ID

## 🔧 配置文件修改

### 1. 更新 wrangler.toml
```toml
name = "your-worker-name"  # 修改为你的 Worker 名称
```

### 2. 更新 UniCloud 函数 URL
在 `src/index.ts` 中找到并更新：
```typescript
const cloudFunctionUrl = 'https://your-unicloud-function-url'
```

## 🚀 部署步骤

### 方法1: GitHub Actions 自动部署 (推荐)

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **自动部署**
   - GitHub Actions 会自动触发部署
   - 在 Actions 标签页查看部署状态

### 方法2: 本地手动部署

1. **安装依赖**
   ```bash
   cd dmarc-worker-enhanced
   npm install
   ```

2. **登录 Cloudflare**
   ```bash
   npx wrangler login
   ```

3. **部署**
   ```bash
   npm run deploy
   ```

## 📧 邮件路由配置

### 1. 在 Cloudflare Dashboard 中配置

1. 进入你的域名设置
2. 找到 "Email Routing" 选项
3. 启用 Email Routing
4. 添加路由规则：
   - **地址**: `dmarc@yourdomain.com`
   - **目标**: 选择 "Send to Worker"
   - **Worker**: 选择你刚部署的 Worker

### 2. DNS 记录配置

确保你的域名有正确的 MX 记录：
```
MX    @    route1.mx.cloudflare.net    10
MX    @    route2.mx.cloudflare.net    20
MX    @    route3.mx.cloudflare.net    30
```

## 🔍 测试部署

### 1. HTTP 测试
访问你的 Worker URL，应该看到：
```
DMARC Email Worker Enhanced is running! This worker processes emails, not HTTP requests.
```

### 2. 邮件测试
1. 发送测试邮件到配置的地址
2. 查看 Worker 日志：
   ```bash
   npx wrangler tail
   ```

### 3. 日志监控
```bash
# 实时查看日志
npx wrangler tail

# 查看特定时间段的日志
npx wrangler tail --since 1h
```

## 📊 预期日志输出

成功处理邮件时，你会看到：

```
🚀 ===== DMARC Email Worker Enhanced Started =====
📧 Received email message at: 2024-01-10T...
📨 Message from: sender@example.com
📬 Message to: dmarc@yourdomain.com
📝 Message subject: Test Email
📧 Email details:
 - From: sender@example.com
 - Subject: Test Email
 - Has HTML: true
 - Has Text: true
 - HTML length: 1234 characters
 - Text length: 567 characters
☁️ Calling UniCloud Function
✅ UniCloud function executed successfully!
🎉 Data processing completed successfully!
✅ ===== Email Processing Completed =====
```

## 🛠️ 故障排除

### 常见问题

1. **部署失败**
   - 检查 GitHub Secrets 是否正确配置
   - 确认 Cloudflare API Token 有足够权限

2. **邮件未处理**
   - 检查邮件路由配置
   - 确认 MX 记录正确
   - 查看 Worker 日志

3. **UniCloud 调用失败**
   - 检查函数 URL 是否正确
   - 确认网络连接正常
   - 查看 UniCloud 函数日志

### 调试步骤

1. **检查 Worker 状态**
   ```bash
   npx wrangler status
   ```

2. **查看详细日志**
   ```bash
   npx wrangler tail --debug
   ```

3. **本地测试**
   ```bash
   npx wrangler dev --local
   ```

## 🔄 更新部署

### 自动更新
推送代码到 GitHub 主分支会自动触发重新部署：
```bash
git add .
git commit -m "Update worker"
git push origin main
```

### 手动更新
```bash
npm run deploy
```

## 📈 性能监控

### 1. Cloudflare Analytics
- 在 Cloudflare Dashboard 查看 Worker 性能
- 监控请求数量和响应时间

### 2. 自定义监控
- 设置告警规则
- 监控错误率
- 跟踪处理时间

## 🔐 安全建议

1. **API Token 安全**
   - 使用最小权限原则
   - 定期轮换 API Token
   - 不要在代码中硬编码敏感信息

2. **Worker 安全**
   - 定期更新依赖
   - 监控异常活动
   - 设置适当的速率限制

## 📞 获取帮助

如果遇到问题：

1. **查看日志**
   ```bash
   npx wrangler tail
   ```

2. **检查 GitHub Actions**
   - 查看部署日志
   - 确认构建状态

3. **联系支持**
   - 提供详细的错误信息
   - 包含相关的日志输出
   - 说明复现步骤

## 🎉 部署完成

部署成功后，你的 DMARC Email Worker Enhanced 将能够：

- ✅ 接收和解析所有类型的邮件
- ✅ 提取完整的邮件内容（HTML、文本、附件）
- ✅ 处理 DMARC 报告并解析数据
- ✅ 将数据保存到 UniCloud 数据库
- ✅ 提供详细的处理日志和错误报告

现在你可以开始接收和处理邮件了！🚀