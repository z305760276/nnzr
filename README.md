# 南宁中燃客户服务部管理图谱

基于四份真实管理制度文件构建的企业管理体系全景透视系统。

**目标：新人来了也能看懂、会用、能查。**

## 技术栈

- **框架：** React 19.2 + TypeScript 5.9
- **构建：** Vite 7.2
- **样式：** Tailwind CSS 3.4 + shadcn/ui（Radix UI）
- **动画：** Framer Motion 12
- **路由：** React Router 7（HashRouter）
- **可视化：** ECharts 6
- **AI 助手：** Coze API 1.3（豆包大模型）
- **表单校验：** React Hook Form 7 + Zod 4
- **Markdown：** react-markdown 10 + remark-gfm + rehype-raw

## 功能模块

| 模块 | 路径 | 说明 |
|------|------|------|
| 首页 | `/` | Hero 品牌展示 + 数据看板 + 六大模块导航 |
| 业务能力图谱 | `/business-graph` | 6层 83节点交互网络图，支持缩放/平移/责任穿刺 |
| 组织架构 | `/detail/org` | 5级 15岗位树形图，点击查看职责详情 |
| CRM 工单流转 | `/detail/workflow` | 5步闭环流程含责任岗位、时限、系统操作要点 |
| 安检隐患管理 | `/detail/safety` | 三级隐患体系 + 24项检查项 + 锈蚀6级判定 |
| 财年指标 | `/detail/kpi` | 4项核心KPI含目标值/权重/公式 |
| 规范记分标准 | `/detail/standards` | 国标/地方规范/法规/记分标准制度文件库 |

## 特色功能

- **全局搜索** — 跨 Section 搜索 + PDF 文档全文检索
- **AI 助手** — 智能问答，可回答安全规范、岗位职责等问题
- **亮暗主题** — 双主题切换，localStorage 持久化
- **模块导航** — 桌面端顶部横条导航 + 底部上/下翻页
- **锚点目录** — Section 内目录导航，自动高亮当前区域
- **骨架屏** — 模块切换时平滑加载过渡
- **文件预览** — 内嵌 PDF 预览 + Excel 多 sheet 解析

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 本地预览构建产物
npm run preview
```

## 版本

**v4.5_20260608**

详见 `结构.txt`（目录结构）和 `依赖.md`（组件依赖树）。
