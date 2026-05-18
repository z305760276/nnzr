# SOLO Agent 工作指南

## Git 操作

### 推送 GITHUB（触发词：`推送GITHUB`）

当用户要求"推送GITHUB"时，请按以下步骤执行：

1. **检查状态**
   ```bash
   git status
   ```
   确认有哪些文件被修改或新增。

2. **暂存所有变更**
   ```bash
   git add -A
   ```

3. **提交变更**（使用中文描述，格式：`类型: 变更内容`）
   ```bash
   git commit -m "类型: 变更内容描述"
   ```
   - 类型前缀参考：`feat`（新功能）、`fix`（修复）、`refactor`（重构）、`style`（样式）、`docs`（文档）
   - 描述使用中文，简洁明了

4. **推送到 GitHub**
   ```bash
   git push origin main
   ```

### 注意事项
- **GitHub 远程仓库**：`origin` → `git@github.com:z305760276/nnzr.git`
- 默认推送分支为 `main`
- 如果提交信息包含特殊字符（如 `feat:` 后的中文），确保用引号包裹
- 使用 PowerShell 时，`&&` 连接符不被支持，需要分步执行命令

### 推送 Gitee（触发词：`推送Gitee`）

如用户要求推送到 Gitee：
```bash
git push gitee main
```
- **Gitee 远程仓库**：`gitee` → `https://gitee.com/zhang-kunpeng26/nnzr.git`
