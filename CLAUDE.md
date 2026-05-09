# 项目源码推送到 GitHub 的方法

## 场景
将项目的源码（包含 `package.json`、`src/` 等完整源码）推送到 GitHub 仓库，触发 GitHub Actions 自动构建并部署到 GitHub Pages。

## 重要原则
- **不要推送 `dist/` 目录** — `dist` 已加入 `.gitignore`，是构建产物，由 CI/CD 自动生成
- **本地构建用 `npm run build`**，生成到 `dist/` 目录
- 源码根目录的 `.github/workflows/deploy.yml` 会在推送时自动触发构建和部署

## 前置条件
- 已安装 Git
- Windows 系统已配置 Git Credential Manager（默认安装 Git 时自带）
- Windows 凭据管理器中已存储 GitHub Token（首次推送时会弹窗引导登录）

## 操作步骤

### 1. 检查 Git 仓库状态
```bash
git -C e:\app status
```

### 2. 添加所有更改并提交
```bash
git -C e:\app add -A
git -C e:\app commit -m "提交说明"
```

### 3. 推送到远程仓库
```bash
git -C e:\app push
```

### 4. 如需强制覆盖远程（慎用）
```bash
git -C e:\app push --force
```

> **注意**：`--force` 会覆盖远程历史，仅在确认需要时使用。

## 认证原理
- 仓库使用 HTTPS 协议
- Git Credential Manager (GCM) 自动从 Windows 凭据管理器中读取已存储的 GitHub Personal Access Token (PAT)
- 无需在命令行中输入密码或配置 API Key
- Token 安全存储在操作系统级别，不会明文泄露

## GitHub Actions 自动部署

推送后，GitHub Actions 会自动执行以下步骤：
1. 检出源码
2. 安装依赖（`npm ci`，带缓存加速）
3. 构建项目（`npm run build`）
4. 配置 GitHub Pages
5. 上传构建产物并部署

**查看部署状态**：在 GitHub 仓库的 `Actions` 选项卡中查看工作流运行状态。

## 常见问题

### Q: 推送时报错 `Connection was reset`
通常是网络临时波动，重试即可。

### Q: 推送被拒绝 `rejected`
```bash
# 先拉取远程内容再推送
git -C e:\app pull origin main
git -C e:\app push
```

### Q: 构建失败，提示找不到 package.json
检查远程仓库是否只包含了构建产物（`dist/`）。推送前确认推送的是源码目录（含 `package.json`），不是 `dist` 目录。

## 常用命令速查

| 操作 | 命令 |
|------|------|
| 查看状态 | `git status` |
| 查看远程地址 | `git remote -v` |
| 添加所有更改 | `git add -A` |
| 提交 | `git commit -m "说明"` |
| 推送 | `git push` |
| 强制推送 | `git push --force` |
| 拉取远程 | `git pull origin main` |
| 查看日志 | `git log --oneline` |
| 查看本地配置 | `git config --local --list` |
