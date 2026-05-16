# 南宁中燃客户服务部管理图谱 — 项目评估与优化 PLAN

> 评估日期：2026-05-16 | 部署方式：GitHub Pages 纯静态站点

---

## 一、项目现状总览

### 1.1 架构概况

| 维度 | 现状 |
|------|------|
| **前端框架** | React 19 + TypeScript 5.9 + Vite 7 |
| **样式方案** | Tailwind CSS 3 + 自定义 CSS 变量主题系统 |
| **路由** | HashRouter（2 个路由：`/` 首页, `/detail/:moduleId` 详情页） |
| **构建输出** | `dist/`（~1.2MB，含 JS/CSS/文档/图片） |
| **部署** | GitHub Actions → GitHub Pages（纯静态） |
| **AI 助手** | 前端组件 + Cloudflare Worker 代理 DeepSeek API |
| **搜索** | 内存搜索索引 + PDF 全文搜索（客户端 JSON） |
| **数据** | 全部硬编码于 `src/data/`（no backend, no API） |

### 1.2 组件依赖拓扑

```
main.tsx
 └─ App.tsx (HashRouter + SearchContext)
     ├─ TopNav ← 共享组件，DetailPage 也复用
     ├─ Routes
     │   ├─ / → HomePage.tsx
     │   │   ├─ HeroSection.tsx
     │   │   ├─ DataDashboard.tsx ← iframe 嵌入钉钉数据看板
     │   │   ├─ 导航卡片 × 6
     │   │   └─ Footer.tsx
     │   └─ /detail/:moduleId → DetailPage.tsx
     │       ├─ TopNav (复用)
     │       ├─ OrgHierarchySection
     │       ├─ WorkFlowSection
     │       ├─ SafetyCheckSection
     │       ├─ KpiDashboardSection
     │       └─ StandardsCombined (合并路由)
     │           ├─ GBStandardsSection
     │           ├─ GroupStandardsSection
     │           ├─ NNZRStandardsSection
     │           ├─ LocalStandardsSection
     │           ├─ LawsSection
     │           ├─ SafetyScoreSection
     │           └─ ServiceScoreSection
     ├─ GlobalSearchPanel → PdfSearchResults
     └─ AIAssistant (浮动按钮 + 侧边栏)
```

---

## 二、代码质量评估

### 2.1 ✅ 优点

| 方面 | 评价 |
|------|------|
| **视觉设计** | 暗色/亮色主题细腻，NVIDIA 风格卡片，CSS 变量体系完整 |
| **组件解耦** | Section 组件独立，DetailPage 按模块 ID 动态映射 |
| **构建配置** | Vite 相对路径 base、ES2015 目标兼容性好 |
| **部署流水线** | GitHub Actions 完整 CI/CD |
| **类型安全** | TypeScript strict 模式 + path alias |

### 2.2 ⚠️ 问题与风险

| # | 问题 | 严重度 | 说明 |
|---|------|--------|------|
| 1 | **死代码** | 中 | `src/pages/Home.tsx`（Vite 脚手架残留）、`src/placeholder.ts`（空文件）、`src/components/ThemeToggle.tsx`（未引用）、`Navigation.tsx` 组件主体未使用（仅 `sectionLabels` 导出被 Breadcrumb 引用） |
| 2 | **AI 后端已失效** | 高 | `AIAssistant.tsx:147-149` 的 API URL 在 Prod 模式指向 Cloudflare Worker，该 Worker 已被清理；Dev 模式指向本地 Express（已被删除） |
| 3 | **Bundle 体积** | 中 | `xlsx` 库 430KB 独立分包，但实际文件预览功能只用了基础读取；main JS 685KB |
| 4 | **未使用依赖** | 低 | `next-themes` 在 dependencies 中但实际用了自定义 CSS 变量主题系统 |
| 5 | **主题系统重复** | 低 | `TopNav.tsx` 内嵌了主题切换逻辑 + `ThemeToggle.tsx` 又有一份，职责重复 |
| 6 | **搜索组件耦合** | 低 | `Navigation.tsx` 有独立的搜索条（`onSearch` prop 与 `searchQuery` state），但与 `TopNav` 的搜索功能重复 |
| 7 | **AI 组件过于臃肿** | 中 | `AIAssistant.tsx` 约 900 行，内联了主题颜色 token（`tc` 对象 130+ 行）、UI 渲染、API 调用、历史管理、复制/重试等功能，职责过重 |
| 8 | **无错误监控** | 低 | 无 Sentry 等错误跟踪，用户白屏无告警 |
| 9 | **无测试** | 低 | 无单元测试、无 E2E 测试 |

---

## 三、优化 PLAN（按优先级排序）

### Phase 1：紧急修复 — 清理死代码 + 保持构建通过（1-2 天）

| # | 任务 | 操作 | 影响 |
|---|------|------|------|
| P1-1 | 删除 `src/pages/Home.tsx` | 确认无 import 后删除 | 减少 20 行死代码 |
| P1-2 | 删除 `src/placeholder.ts` | 空文件，直接删除 | 无 |
| P1-3 | 删除 `src/components/ThemeToggle.tsx` | TopNav 已有内联主题切换，此组件无 import | 减少 30 行死代码 |
| P1-4 | 重构 `Navigation.tsx` | 提取 `sectionLabels` 到独立文件（如 `src/data/sectionLabels.ts`），删除 Navigation 组件主体或被精简为复用 TopNav | 消除 150+ 行死代码 |
| P1-5 | 清理未使用依赖 | `npm uninstall next-themes` | 减少 node_modules 体积 |
| P1-6 | `npm run build` 验证 | 确保 tsc + vite 通过 | 验证清理安全 |

### Phase 2：核心改造 — AI 助手迁移至 Coze（3-5 天）

这是用户最关心的部分，也是最大收益的改造。

#### 方案：用 Coze Web SDK 替换现有 AIAssistant

**迁移步骤：**

| # | 步骤 | 操作 |
|---|------|------|
| P2-1 | 在扣子平台创建 Bot | 选择"知识库"类型，设置角色为"燃气行业智能助手" |
| P2-2 | 上传知识库 | 导入 `public/docs/` 下全部 24 份文档（PDF + XLSX + DOC） |
| P2-3 | 配置 Prompt | 复用现有 system prompt，设定回答风格限制（300 字内、Markdown 格式等） |
| P2-4 | 获取 Bot ID & Token | 在 Coze 开发者页面获取 Web SDK 凭据 |
| P2-5 | 替换 `AIAssistant.tsx` | 用 Coze Web SDK 的 `WebChat` 组件替换（详见下方对比） |

**改造前后对比：**

| 维度 | 改造前 | 改造后 |
|------|--------|--------|
| 代码量 | `AIAssistant.tsx` ~900 行 | Coze SDK 约 30 行 |
| 后端依赖 | Cloudflare Worker + DeepSeek API Key | 零后端，Bot 托管在扣子 |
| 知识检索 | 本地 `searchIndex.ts` 关键词匹配 | Coze RAG 精准语义检索 |
| 维护成本 | 需要维护 API Key、Worker 代码、搜索索引 | 仅维护 Coze 知识库文档 |
| 对话体验 | 简单文本生成 | 支持引用溯源、多轮对话 |
| 费用 | DeepSeek API 按量计费（较便宜） | Coze 免费额度 + 按量计费 |

**Coze 嵌入代码示例（替换后的 AIAssistant.tsx）：**

```tsx
// 改造后 — 约 50 行
import { useEffect } from 'react';

export default function AIAssistant() {
  useEffect(() => {
    // 动态加载 Coze SDK
    const script = document.createElement('script');
    script.src = 'https://sf-cdn.coze.com/obj/unpkg-va/coze-assets/sdk/v0.0.3/cn/coze-web-sdk.js';
    script.async = true;
    script.onload = () => {
      new (window as any).CozeWebSDK.WebChat({
        bot_id: '你的 Bot ID',
        lang: 'zh-CN',
        auth: {
          type: 'token',
          token: '你的 Token',
        },
        ui: {
          base: {
            icon: './mascot.png', // 沿用现有吉祥物
          },
        },
      });
    };
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  return null; // Coze SDK 自动渲染浮动按钮
}
```

**替代方案对比：**

| 方案 | 优点 | 缺点 | 推荐度 |
|------|------|------|--------|
| **A. Coze Web SDK** | 零后端、RAG 效果好、维护简单 | 依赖第三方平台、定制灵活度受限 | ⭐⭐⭐⭐ |
| **B. DeepSeek API 直调** | 无需额外平台 | 需后端代理、无内置 RAG | ⭐⭐ |
| **C. 保留 Cloudflare Worker** | 已有代码 | Worker 已清理需重建、仍需维护 | ⭐ |
| **D. Dify 自托管** | 完全可控 | 需服务器、运维成本高 | ⭐⭐⭐ |

### Phase 3：性能优化（2-3 天）

| # | 任务 | 预期收益 |
|---|------|----------|
| P3-1 | 代码分割 | 按路由动态加载 Section 组件（`React.lazy` + `Suspense`），减少首屏 JS 体积约 60% |
| P3-2 | 优化 xlsx 导入 | 将 xlsx 改为动态 import（只在用户点击预览时加载），消除 430KB 独立分包 |
| P3-3 | 图片优化 | banner-bg 已用 webp + jpeg 双格式，检查 mascot.png/logo.png 是否可转 webp |
| P3-4 | CSS 优化 | Tailwind CSS 生产构建自动 tree-shaking，当前 123KB CSS 正常 |

### Phase 4：可维护性提升（1-2 天）

| # | 任务 | 操作 |
|---|------|------|
| P4-1 | 主题逻辑统一 | 将 TopNav 内联主题切换提取为 `useTheme()` hook，移除 ThemeToggle 死代码 |
| P4-2 | 搜索逻辑统一 | 将 TopNav 和 Navigation 中的搜索条合并为单一组件 |
| P4-3 | 常量抽取 | 将 DetailPage 的 `MODULE_META`、`COMPONENT_MAP` 移至 `src/data/` |
| P4-4 | SectionShell 统一 | 检查各 Section 是否复用 `SectionShell` 容器，减少重复布局代码 |

---

## 四、推荐执行路线

```
Week 1: Phase 1（清理死代码）→ Phase 2（Coze AI 迁移）
         └── Phase 1 快速完成，为 Phase 2 铺路
         └── Phase 2 是核心价值提升，优先投入

Week 2: Phase 3（性能优化）→ Phase 4（可维护性）
         └── 代码分割、xlsx 懒加载等性能优化
         └── 重构主题/搜索逻辑，提升代码可维护性

持续: Coze 知识库维护
         └── 文档更新时同步上传到 Coze 知识库
```

---

## 五、总结

| 项目 | 评分（1-5） | 说明 |
|------|------------|------|
| **UI/UX 设计** | ⭐⭐⭐⭐⭐ | 暗色主题细腻、卡片质感高端、品牌色统一 |
| **代码组织** | ⭐⭐⭐½ | 组件按目录分层清晰，但存在死代码和职责重复 |
| **类型安全** | ⭐⭐⭐⭐ | strict 模式 + path alias，整体良好 |
| **性能** | ⭐⭐⭐ | Bundle 偏大，缺少代码分割 |
| **安全性** | ⭐⭐⭐⭐ | 纯静态站点，攻击面小 |
| **可维护性** | ⭐⭐⭐ | AI 组件过于臃肿，主题/搜索逻辑分散 |
| **AI 能力** | ⭐⭐⭐ | 当前 AI 后端被断网，需迁移至 Coze 恢复 |

**核心建议：** 优先完成 **Phase 1（死代码清理）** 和 **Phase 2（Coze AI 迁移）**，前者消除技术债务，后者恢复并升级 AI 助手能力。这两个阶段完成后，项目将真正成为一个"零后端、零运维"的纯静态智能管理图谱。
