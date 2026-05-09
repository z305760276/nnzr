# 项目构建产物（dist）上传到 GitHub 的方法

## 场景
将构建产物（如 `dist` 目录）上传/更新到 GitHub 仓库。

## 前置条件
- 已安装 Git
- Windows 系统已配置 Git Credential Manager（默认安装 Git 时自带）
- Windows 凭据管理器中已存储 GitHub Token（首次推送时会弹窗引导登录）

## 操作步骤

### 1. 检查 Git 仓库状态
```bash
git -C e:\app\dist status
```

### 2. 修改远程仓库地址（如需切换仓库）
```bash
# 修改远程地址
git -C e:\app\dist remote set-url origin https://github.com/<用户名>/<仓库名>.git

# 验证
git -C e:\app\dist remote -v
```

### 3. 添加所有更改并提交
```bash
git -C e:\app\dist add -A
git -C e:\app\dist commit -m "更新 dist 构建文件"
```

### 4. 拉取远程内容并合并（防止推送被拒）
```bash
# --allow-unrelated-histories 用于首次合并两个无关联的仓库历史
git -C e:\app\dist pull origin main --allow-unrelated-histories
```

### 5. 推送到远程仓库
```bash
git -C e:\app\dist push -u origin main
```

> **注意**：如果遇到 `Connection was reset` 错误，通常是网络临时波动，重试即可。

## 认证原理
- 仓库使用 HTTPS 协议
- Git Credential Manager (GCM) 自动从 Windows 凭据管理器中读取已存储的 GitHub Personal Access Token (PAT)
- 无需在命令行中输入密码或配置 API Key
- Token 安全存储在操作系统级别，不会明文泄露

## 常用命令速查

| 操作 | 命令 |
|------|------|
| 查看状态 | `git status` |
| 查看远程地址 | `git remote -v` |
| 修改远程地址 | `git remote set-url origin <新地址>` |
| 查看本地配置 | `git config --local --list` |
| 查看全局配置 | `git config --global --list` |
