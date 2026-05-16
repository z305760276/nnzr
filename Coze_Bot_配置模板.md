# 扣子 Coze Bot 配置 — 直接复制给 Coze

---

## 第一步：创建智能体

打开 https://www.coze.cn → 创建智能体 → 填写以下信息：

| 字段 | 填写内容 |
|------|----------|
| **名称** | 燃气管家 |
| **功能介绍** | 南宁中燃客户服务部AI检索助手，基于管理制度文件回答组织架构、安检隐患、工单流程、记分标准等问题 |
| **头像** | 上传 `public/mascot.png` |

---

## 第二步：人设与回复逻辑（直接复制）

```
# 角色
你是"燃气管家"，南宁中燃客户服务部的 AI 检索助手。

## 核心能力
1. 回答关于客户服务部**组织架构、岗位职责**的问题
2. 解释**安检隐患分级标准**（三级隐患：立即危险/限期整改/需关注）
3. 说明**CRM 工单流转流程**
4. 查询**财年指标**（抄表率、安检完成率、投诉响应时效、隐患整改率）
5. 检索**国家标准、地方规范、法律法规**内容
6. 查询**HSE 安全记分标准**和**客服质量记分标准**
7. 查看**中燃集团管理规范**和**南宁中燃内部制度**

## 回答要求
1. 优先参考知识库中的文档内容来回答，回答末尾标注参考文档名称
2. 如果知识库中没有相关内容，请说"该问题在已上传的制度文件中未找到精确匹配，建议查阅相关文档或咨询综合管理室"
3. 回答控制在 300 字以内，简洁专业
4. 使用 Markdown 格式组织回答，善用列表、表格、加粗
5. 涉及分级、分值、时限等数据时，必须引用具体数值
6. 语气专业、稳重，符合燃气行业严肃属性

## 回答示例

**用户问：安检隐患分几级？**

安检隐患分为三级：

| 级别 | 名称 | 说明 |
|------|------|------|
| 一级 | 立即危险 | 需立即停气整改 |
| 二级 | 限期整改 | 需在规定期限内完成整改 |
| 三级 | 需关注 | 需持续跟踪观察 |

> 参考：《客户服务部隐患管理制度》

## 限制
- 严禁编造法规条文和标准数值
- 不确定的内容必须注明"请以正式文件为准"
- 不回答与燃气行业无关的问题
- 不提供任何个人建议或法律意见
```

---

## 第三步：知识库配置

### 新建知识库

| 设置项 | 值 |
|--------|-----|
| **知识库名称** | 南宁中燃客户服务部制度文件 |
| **知识库描述** | 包含组织架构、安检制度、隐患制度、管理制度、国家标准、地方规范等 24 份文档 |
| **分段模式** | 自动分段（分段标识：## ，分段最大长度：800  tokens） |

### 上传文档清单

一共 24 份文档，来自 `public/docs/` 目录，以下是完整清单，按类型分组上传：

**批次 1 — 国家标准（7份）：**

| # | 文件名 |
|---|--------|
| 1 | 《南宁市管道燃气工程技术标准》（2019年修编版）.pdf |
| 2 | 《燃气工程项目规范》GB55009-2021.pdf |
| 3 | 《城镇燃气设计规范》(2020年版)GB50028-2006.pdf |
| 4 | 《城镇燃气室内工程施工与质量验收规范》CJJ94-2009.pdf |
| 5 | 《城镇燃气报警控制系统技术规程》CJJT146-2011.pdf |
| 6 | 《家用燃气燃烧器具安装及验收规程》CJJ12-2013.pdf |
| 7 | 《城镇燃气设施运行、维护和抢修安全技术规程》CJJ51-2016.pdf |

**批次 2 — 法律法规（4份）：**

| # | 文件名 |
|---|--------|
| 1 | 中华人民共和国安全生产法（2021年6月修订）.pdf |
| 2 | 法规_城镇燃气管理条例.pdf |
| 3 | 法规_消防法.pdf |
| 4 | 法规_特种设备安全法.pdf |

**批次 3 — 地方规范（4份）：**

| # | 文件名 |
|---|--------|
| 1 | 南宁市燃气管理条例（2021-08-06发布实施）.doc |
| 2 | 广西燃气管理条例（公告+文本）2023-3-30.pdf |
| 3 | 关于明确燃气设施保护范围及有关要求的通知 (南宁住建).pdf |
| 4 | 南住建函〔2025〕671号关于征求《南宁市燃气管理条例（修订草案）》意见的函.pdf |
| 5 | 南宁市发展和改革委员会关于南宁市市区管道燃气价格联动有关事项通知.pdf |

**批次 4 — 集团管理规范（3份）：**

| # | 文件名 |
|---|--------|
| 1 | 附件1.《中燃集团客服业务红黄线及负面清单记分管理规定》.pdf |
| 2 | 附件2.《中燃集团客服条口红黄线考核细则》.xlsx |
| 3 | 附件3.《客户服务部负面清单记分标准》.xlsx |

**批次 5 — 内部制度（4份）：**

| # | 文件名 |
|---|--------|
| 1 | 附件：1.南宁中燃客户服务部管理组织架构及岗位职责.pdf |
| 2 | 附件：2.南宁中燃客户服务部管理制度.docx |
| 3 | 附件：3.南宁中燃客户服务部安检管理制度.pdf |
| 4 | 附件：4.南宁中燃客户服务部隐患管理制度.pdf |

---

## 第四步：发布 → Web SDK

### 发布设置

在 Bot 编辑页面点击 **"发布"** → 选择 **"Web 端"** → **"Chat SDK"**

### 复制出来的代码类似这样

```html
<script src="https://lf-cdn.coze.cn/obj/unpkg/flow-platform/chat-app-sdk/1.2.0-beta.10/libs/cn/index.js"></script>
<script>
  new CozeWebSDK.WebChat({
    bot_id: '这里填 Bot ID',
    lang: 'zh-CN',
    auth: {
      type: 'token',
      token: '这里填 Token'
    },
    ui: {
      base: {
        icon: 'https://z305760276.github.io/nnzr-management-map/mascot.png',
        iconActive: 'https://z305760276.github.io/nnzr-management-map/mascot.png'
      }
    }
  });
</script>
```

> ⚠️ Bot ID 和 Token 在发布页面会自动生成，替换即可。
> 图标 URL 替换成你 GitHub Pages 部署后的实际链接。

---

## 第五步：替换前端代码

把上述 SDK 代码放入 `src/components/AIAssistant.tsx`，替换现有全部内容（最终文件约 50 行）：

```tsx
import { useEffect } from 'react';

export default function AIAssistant() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://lf-cdn.coze.cn/obj/unpkg/flow-platform/chat-app-sdk/1.2.0-beta.10/libs/cn/index.js';
    script.async = true;
    script.onload = () => {
      new (window as any).CozeWebSDK.WebChat({
        bot_id: '你的 Bot ID',
        lang: 'zh-CN',
        auth: { type: 'token', token: '你的 Token' },
        ui: {
          base: {
            icon: './mascot.png',
            iconActive: './mascot.png',
          },
        },
      });
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
}
```

---

## 配置完成后的效果

- 网页右下角出现红色浮动气泡（品牌色 #C8102E）
- 点击打开对话窗口，用户无需登录直接提问
- Bot 基于上传的 24 份文档进行 RAG 检索回答
- 回答格式为 Markdown，带引用来源
- 与现有 UI 风格统一，吉祥物沿用 mascot.png

---

## 如果需要修改 UI 配色

Coze WebChat 支持自定义颜色，在 `ui` 字段中添加：

```js
ui: {
  base: {
    icon: './mascot.png',
  },
  chat: {
    primaryColor: '#C8102E',
    secondaryColor: '#E31837',
    bubbleColor: '#C8102E',
    backgroundColor: '#050A14',
    textColor: '#F8FAFC',
    borderColor: 'rgba(200,16,46,0.2)',
  },
  floatingIcon: {
    backgroundColor: '#C8102E',
  }
}
```
