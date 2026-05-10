# CLAUDE.md - 项目须知

## 部署方式

- 本项目通过 **GitHub Actions** 自动部署到 **GitHub Pages**
- 仓库：`z305760276/nnzr`
- 部署 URL：https://z305760276.github.io/nnzr
- 流程：`本地修改 → git push → 自动部署`

## 本地推送流程

```bash
git add .
git commit -m "修改说明"
git push
```

## GitHub Actions 注意事项

- Workflow 文件：`.github/workflows/deploy.yml`
- 使用 `npm install --legacy-peer-deps` 而非 `npm ci`（原因见下方"踩坑记录"）
- 构建命令：`tsc -b && vite build`（不含 `node inline.js`，因为 inline.js 只本地开发用）

## 踩坑记录

### 1. 源码未推送到 GitHub
- **现象**：GitHub Actions 报 `ENOENT: Could not read package.json`
- **原因**：仓库只推了 workflow 文件，源码（package.json、src/等）没推上去
- **解决**：TRAE 工具推送源码后解决

### 2. npm ci 依赖冲突
- **现象**：`npm ci` 报 `ERESOLVE` 错误，`@vitejs/plugin-legacy@8.0.1` 要求 `vite@^8.0.0` 但项目用 `vite@7.3.0`
- **原因**：`npm ci` 严格按 lock 文件安装，遇到 peer 依赖冲突直接罢工
- **解决**：将 workflow 中 `npm ci` 改为 `npm install --legacy-peer-deps`，跳过 peer 依赖冲突检查

### 3. TRAE 多次修改 workflow
- TRAE 推送时会自动修改 workflow 配置，可能把 `npm install` 改回 `npm ci`
- 注意在 workflow 中使用的是 `npm install --legacy-peer-deps`

### 4. GitHub Pages 限制
- 免费，无访问有效期
- 容量上限 1GB（本项目足够）
- 流量 100GB/月
- 如遇国内访问问题可考虑转 Gitee Pages
